#!/usr/bin/env node
// Generic Melodia module audio generator.
// Usage: node scripts/generate-module-audio.mjs 2 [--dry-run] [--force]

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const LESSON_DIR = path.join(ROOT, 'notes/melodia/5-lessons');
const COST_LOG = path.join(ROOT, 'notes/melodia/2-tracking/audio-cost-log.csv');
const ENV_FILE = path.join(ROOT, '.env');
const PRICE_PER_MILLION = 30;
const MIN_AUDIO_BYTES = 4096;

function usage() {
  console.error('Usage: node scripts/generate-module-audio.mjs <module-number> [--dry-run] [--force]');
  process.exit(2);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const moduleArg = args.find((arg) => /^\d+$/.test(arg));
  if (!moduleArg) usage();
  return {
    moduleId: Number(moduleArg),
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
  };
}

function padModuleId(moduleId) {
  return String(moduleId).padStart(3, '0');
}

function resolveManifestPath(moduleId) {
  const padded = padModuleId(moduleId);
  const candidates = [
    path.join(LESSON_DIR, `module-${padded}-tts-v2.json`),
    path.join(LESSON_DIR, `module-${padded}-tts.json`),
  ];
  const manifestPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!manifestPath) {
    throw new Error(`No TTS manifest found for module ${moduleId}. Checked ${candidates.map((p) => path.relative(ROOT, p)).join(', ')}`);
  }
  return manifestPath;
}

function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  const text = fs.readFileSync(ENV_FILE, 'utf8');
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

function validateManifest(manifest, moduleId, manifestPath) {
  if (Number(manifest.module) !== moduleId) {
    throw new Error(`Manifest ${path.relative(ROOT, manifestPath)} declares module ${manifest.module}, expected ${moduleId}`);
  }
  if (!Array.isArray(manifest.ttsTriggers) || manifest.ttsTriggers.length === 0) {
    throw new Error(`Manifest ${path.relative(ROOT, manifestPath)} has no ttsTriggers`);
  }

  const expectedPrefix = `assets/audio/module-${padModuleId(moduleId)}/`;
  const ids = new Set();
  const outputFiles = new Set();

  for (const trigger of manifest.ttsTriggers) {
    if (!trigger.id || typeof trigger.id !== 'string') throw new Error('Every trigger needs a string id');
    if (!trigger.text || typeof trigger.text !== 'string') throw new Error(`Trigger ${trigger.id} needs text`);
    if (!trigger.outputFile || typeof trigger.outputFile !== 'string') throw new Error(`Trigger ${trigger.id} needs outputFile`);
    if (!trigger.outputFile.startsWith(expectedPrefix)) {
      throw new Error(`Trigger ${trigger.id} outputFile must start with ${expectedPrefix}: ${trigger.outputFile}`);
    }
    if (!trigger.outputFile.endsWith('.mp3')) {
      throw new Error(`Trigger ${trigger.id} outputFile must be an mp3: ${trigger.outputFile}`);
    }
    if (ids.has(trigger.id)) throw new Error(`Duplicate trigger id: ${trigger.id}`);
    if (outputFiles.has(trigger.outputFile)) throw new Error(`Duplicate outputFile: ${trigger.outputFile}`);
    ids.add(trigger.id);
    outputFiles.add(trigger.outputFile);
  }
}

function loadTsModule(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const exports = {};
  const context = {
    exports,
    console,
    require: () => ({}),
  };
  vm.runInNewContext(code, context, { filename: absolutePath });
  return exports;
}

function validateUiWiring(manifest, moduleId) {
  const { MODULES } = loadTsModule('src/data/modules.ts');
  const { getEnrichment } = loadTsModule('src/data/curriculum-enrichment.ts');
  const { findPhraseTrigger, findVocabTrigger } = loadTsModule('src/utils/ttsTriggers.ts');
  const module = MODULES.find((candidate) => candidate.id === moduleId);
  if (!module) throw new Error(`Module ${moduleId} is missing from src/data/modules.ts`);

  const moduleTriggerKeys = new Set((module.ttsTriggers ?? []).map((trigger) => `${trigger.id}|${trigger.outputFile}`));
  const requiredManifestTriggers = manifest.ttsTriggers.filter((trigger) => trigger.mvpRequired !== false);
  const missingFromModuleData = requiredManifestTriggers.filter(
    (trigger) => !moduleTriggerKeys.has(`${trigger.id}|${trigger.outputFile}`),
  );
  if (missingFromModuleData.length > 0) {
    throw new Error(
      `Manifest triggers are not wired in src/data/modules.ts: ${missingFromModuleData.map((trigger) => trigger.id).join(', ')}`,
    );
  }

  const requiredKeys = new Set(requiredManifestTriggers.map((trigger) => `${trigger.id}|${trigger.outputFile}`));
  const wiredRequiredTriggers = (module.ttsTriggers ?? []).filter((trigger) =>
    requiredKeys.has(`${trigger.id}|${trigger.outputFile}`),
  );
  const moduleWithWiredTriggers = { ...module, ttsTriggers: wiredRequiredTriggers };
  const missingVocab = module.vocabulary.filter((word) => !findVocabTrigger(moduleWithWiredTriggers, word.spanish));
  if (missingVocab.length > 0) {
    throw new Error(
      `No manifest vocab trigger matches UI vocab rows: ${missingVocab.map((word) => word.spanish).join(', ')}`,
    );
  }

  const enrichment = getEnrichment(moduleId);
  const phraseChunk = enrichment?.vocabPack?.phraseChunk;
  const hasPhraseTrigger = wiredRequiredTriggers.some(
    (trigger) => trigger.screen === 'preListen' && trigger.id.includes('phrase'),
  );
  if (phraseChunk && hasPhraseTrigger && !findPhraseTrigger(moduleWithWiredTriggers, phraseChunk)) {
    throw new Error(`No manifest phrase trigger matches UI phrase chunk: ${phraseChunk}`);
  }
  if (phraseChunk && !hasPhraseTrigger) {
    console.warn(`[audio] Module ${moduleId} has a UI phrase chunk but no preListen phrase trigger: ${phraseChunk}`);
  }
}

function ensureCostLog() {
  if (fs.existsSync(COST_LOG)) return;
  fs.mkdirSync(path.dirname(COST_LOG), { recursive: true });
  fs.writeFileSync(COST_LOG, 'date,moduleId,provider,textChars,estimatedCost,outputFile\n');
}

async function generateOne(trigger, manifest, apiKey, force) {
  const outputPath = path.join(ROOT, trigger.outputFile);
  if (!force && fs.existsSync(outputPath)) {
    const bytes = fs.statSync(outputPath).size;
    if (bytes >= MIN_AUDIO_BYTES) {
      return { status: 'cached', bytes, chars: 0, cost: 0 };
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const input = trigger.ttsInputText || trigger.text;
  const model = manifest.model || 'tts-1-hd';
  const voice = trigger.voice || manifest.defaultVoice || 'nova';
  const speed = trigger.speed ?? (trigger.slowVersion ? 0.85 : 1.0);
  const body = JSON.stringify({
    model,
    voice,
    input,
    speed,
    response_format: 'mp3',
  });

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < MIN_AUDIO_BYTES) {
    throw new Error(`Generated file is too small (${bytes.length} bytes): ${trigger.outputFile}`);
  }

  const tmpPath = `${outputPath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, bytes);
  fs.renameSync(tmpPath, outputPath);

  const chars = [...input].length;
  const cost = (chars / 1_000_000) * PRICE_PER_MILLION;
  return { status: 'generated', bytes: bytes.length, chars, cost };
}

function syncAudioAssets() {
  const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/sync-audio-assets.mjs')], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`audio asset sync failed: ${result.stderr || result.stdout}`);
  }
  process.stdout.write(result.stdout);
}

async function main() {
  const { moduleId, dryRun, force } = parseArgs();
  const manifestPath = resolveManifestPath(moduleId);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  validateManifest(manifest, moduleId, manifestPath);
  validateUiWiring(manifest, moduleId);

  const triggers = manifest.ttsTriggers.filter((trigger) => trigger.mvpRequired !== false);
  console.log(`Module ${moduleId} audio manifest: ${path.relative(ROOT, manifestPath)}`);
  console.log(`Triggers: ${triggers.length}${dryRun ? ' (dry run)' : ''}`);

  if (dryRun) {
    for (const trigger of triggers) {
      const exists = fs.existsSync(path.join(ROOT, trigger.outputFile));
      console.log(`${exists ? 'cache' : 'need '} ${trigger.id} -> ${trigger.outputFile}`);
    }
    return;
  }

  loadEnv();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing from .env or environment');

  ensureCostLog();
  const today = new Date().toISOString().slice(0, 10);
  let generated = 0;
  let cached = 0;
  let failed = 0;
  let totalChars = 0;
  let totalCost = 0;
  const costRows = [];

  for (const trigger of triggers) {
    try {
      const result = await generateOne(trigger, manifest, apiKey, force);
      if (result.status === 'cached') {
        cached += 1;
        console.log(`cache ${trigger.id} bytes=${result.bytes}`);
      } else {
        generated += 1;
        totalChars += result.chars;
        totalCost += result.cost;
        costRows.push(`${today},${moduleId},openai-tts-1-hd,${result.chars},${result.cost.toFixed(6)},${trigger.outputFile}`);
        console.log(`ok    ${trigger.id} chars=${result.chars} bytes=${result.bytes}`);
      }
    } catch (error) {
      failed += 1;
      console.error(`ERR   ${trigger.id}: ${error.message}`);
    }
  }

  if (costRows.length > 0) {
    fs.appendFileSync(COST_LOG, `${costRows.join('\n')}\n`);
  }
  syncAudioAssets();

  console.log(`SUMMARY generated=${generated} cached=${cached} failed=${failed} chars=${totalChars} cost=$${totalCost.toFixed(6)}`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`FATAL ${error.message}`);
  process.exit(1);
});
