#!/usr/bin/env node
// One-shot Module 1 v2 narration audio generator.
// Reads notes/melodia/5-lessons/module-001-tts-v2.json
// Skips files that already exist (cache hit)
// Appends to notes/melodia/2-tracking/audio-cost-log.csv

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ROOT = path.resolve(import.meta.dirname, '..');
const MANIFEST = path.join(ROOT, 'notes/melodia/5-lessons/module-001-tts-v2.json');
const COST_LOG = path.join(ROOT, 'notes/melodia/2-tracking/audio-cost-log.csv');

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    if (line.startsWith('OPENAI_API_KEY=')) return line.slice('OPENAI_API_KEY='.length).trim();
  }
  throw new Error('OPENAI_API_KEY not in .env');
}

const KEY = loadEnv();

function generate(trigger) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(ROOT, trigger.outputFile);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1024) {
      resolve({ skipped: true, path: trigger.outputFile });
      return;
    }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const speed = trigger.slowVersion ? 0.85 : (trigger.speed ?? 1.0);
    const voice = trigger.voice ?? 'nova';
    const body = JSON.stringify({
      model: 'tts-1-hd',
      voice,
      input: trigger.text,
      speed,
      response_format: 'mp3',
    });
    const req = https.request(
      {
        hostname: 'api.openai.com',
        path: '/v1/audio/speech',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let err = '';
          res.on('data', (c) => (err += c.toString()));
          res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err.slice(0, 200)}`)));
          return;
        }
        const out = fs.createWriteStream(outPath);
        res.pipe(out);
        out.on('finish', () => {
          out.close();
          const size = fs.statSync(outPath).size;
          if (size < 1024) {
            reject(new Error(`Generated file too small: ${size} bytes`));
            return;
          }
          const chars = trigger.text.length;
          const cost = (chars / 1_000_000) * 30;
          resolve({ skipped: false, path: trigger.outputFile, chars, cost });
        });
        out.on('error', reject);
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const triggers = manifest.ttsTriggers;
  console.log(`Module ${manifest.module} — ${triggers.length} triggers`);
  let generated = 0, skipped = 0, failed = 0;
  let totalChars = 0, totalCost = 0;
  const failures = [];
  const today = new Date().toISOString().slice(0, 10);
  const logLines = [];
  for (const t of triggers) {
    try {
      const result = await generate(t);
      if (result.skipped) {
        console.log(`  cache: ${result.path}`);
        skipped++;
      } else {
        console.log(`  done:  ${result.path} (${result.chars} chars, $${result.cost.toFixed(4)})`);
        generated++;
        totalChars += result.chars;
        totalCost += result.cost;
        logLines.push(`${today},${manifest.module},openai,${result.chars},${result.cost.toFixed(4)},${result.path}`);
      }
    } catch (err) {
      console.error(`  FAIL:  ${t.id} — ${err.message}`);
      failed++;
      failures.push(`${t.id}: ${err.message}`);
    }
  }
  if (logLines.length > 0) {
    fs.appendFileSync(COST_LOG, logLines.join('\n') + '\n');
  }
  console.log(`\nResults:`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Cached:    ${skipped}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Chars:     ${totalChars}`);
  console.log(`  Cost:      $${totalCost.toFixed(4)}`);
  if (failures.length > 0) {
    console.log(`\nFailures:`);
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
})();
