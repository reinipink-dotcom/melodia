// Retry only the 4 failed Module 5 TTS triggers.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/reinebadejoko/Desktop/app/melodia-app';
const MANIFEST = path.join(ROOT, 'notes/melodia/5-lessons/module-005-tts.json');
const COST_LOG = path.join(ROOT, 'notes/melodia/2-tracking/audio-cost-log.csv');
const ENV_FILE = path.join(ROOT, '.env');
const PRICE_PER_MILLION = 30;
const RETRY_IDS = [
  'module-005-vocab-yo',
];

function loadEnv() {
  const txt = fs.readFileSync(ENV_FILE, 'utf8');
  for (const line of txt.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

async function generateOne(trigger, apiKey) {
  const body = {
    model: 'tts-1-hd',
    voice: trigger.voice || 'nova',
    input: trigger.text,
    speed: trigger.speed ?? 1.0,
    response_format: 'mp3',
  };
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status} for ${trigger.id}: ${errText.slice(0, 300)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const outAbs = path.join(ROOT, trigger.outputFile);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, buf);
  const chars = [...trigger.text].length;
  const cost = (chars / 1_000_000) * PRICE_PER_MILLION;
  return { chars, cost, bytes: buf.length };
}

async function main() {
  loadEnv();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { console.error('NO_API_KEY'); process.exit(2); }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const triggers = manifest.ttsTriggers.filter((t) => RETRY_IDS.includes(t.id));
  const today = new Date().toISOString().slice(0, 10);

  let totalChars = 0;
  let totalCost = 0;
  let failures = 0;

  for (const t of triggers) {
    try {
      const r = await generateOne(t, apiKey);
      totalChars += r.chars;
      totalCost += r.cost;
      fs.appendFileSync(COST_LOG, `${today},5,openai-tts-1-hd,${r.chars},${r.cost.toFixed(6)},${t.outputFile}\n`);
      console.log(`ok  ${t.id} chars=${r.chars} bytes=${r.bytes}`);
    } catch (e) {
      failures++;
      console.error(`ERR ${t.id} :: ${e.message}`);
    }
  }

  console.log(`\nSUMMARY attempted=${triggers.length} succeeded=${triggers.length - failures} failed=${failures} chars=${totalChars} cost=$${totalCost.toFixed(6)}`);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
