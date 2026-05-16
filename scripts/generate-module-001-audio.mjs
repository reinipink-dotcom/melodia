#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/reinebadejoko/Desktop/app/melodia-app';
const MANIFEST = path.join(ROOT, 'notes/melodia/5-lessons/module-001-tts.json');
const CSV = path.join(ROOT, 'notes/melodia/2-tracking/audio-cost-log.csv');
const MODULE_ID = 1;
const PROVIDER = 'openai-tts-1-hd';
const RATE_PER_M_CHARS = 30.0;
const TODAY = '2026-05-16';

function loadEnv() {
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();
if (!process.env.OPENAI_API_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const triggers = manifest.ttsTriggers;

async function generateOne(trigger) {
  const outPath = path.join(ROOT, trigger.outputFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1024) {
    return { trigger, status: 'skipped', size: fs.statSync(outPath).size, chars: 0, cost: 0 };
  }

  const input = trigger.ttsInputText || trigger.text;
  const speed = trigger.slowVersion ? 0.85 : 1.0;

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      voice: 'nova',
      input,
      speed,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errBody}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  const size = fs.statSync(outPath).size;
  if (size <= 1024) throw new Error(`Output file ${trigger.outputFile} is ${size}B — too small`);

  const chars = input.length;
  const cost = (chars / 1_000_000) * RATE_PER_M_CHARS;
  return { trigger, status: 'generated', size, chars, cost };
}

const results = [];
for (const t of triggers) {
  process.stdout.write(`[${t.id}] text="${(t.ttsInputText || t.text).slice(0, 40)}"  speed=${t.slowVersion ? 0.85 : 1.0}  ... `);
  try {
    const r = await generateOne(t);
    results.push(r);
    console.log(`${r.status} (${r.size}B, ${r.chars}c, $${r.cost.toFixed(6)})`);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
    results.push({ trigger: t, status: 'failed', error: e.message, chars: 0, cost: 0 });
  }
}

const generated = results.filter(r => r.status === 'generated');
const skipped = results.filter(r => r.status === 'skipped');
const failed = results.filter(r => r.status === 'failed');

if (generated.length) {
  const rows = generated.map(r =>
    `${TODAY},${MODULE_ID},${PROVIDER},${r.chars},${r.cost.toFixed(6)},${r.trigger.outputFile}`
  ).join('\n') + '\n';
  fs.appendFileSync(CSV, rows);
}

const totalChars = generated.reduce((s, r) => s + r.chars, 0);
const totalCost = generated.reduce((s, r) => s + r.cost, 0);
console.log(`\n=== SUMMARY ===`);
console.log(`Generated: ${generated.length}`);
console.log(`Skipped:   ${skipped.length}`);
console.log(`Failed:    ${failed.length}`);
console.log(`Total chars: ${totalChars}`);
console.log(`Total cost:  $${totalCost.toFixed(6)}`);
if (failed.length) {
  console.log(`\nFailures:`);
  for (const f of failed) console.log(`  ${f.trigger.id}: ${f.error}`);
  process.exit(1);
}
