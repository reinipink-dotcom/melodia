import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/reinebadejoko/Desktop/app/melodia-app';
const moduleArg = process.argv[2];

if (!moduleArg) {
  console.error('Usage: node scripts/capture-module-screenshots.mjs <moduleId>');
  process.exit(1);
}

const moduleId = Number(moduleArg);
if (!Number.isInteger(moduleId) || moduleId < 1) {
  console.error(`Invalid moduleId: ${moduleArg}`);
  process.exit(1);
}

const moduleSlug = `module-${String(moduleId).padStart(3, '0')}`;
const today = new Date().toISOString().slice(0, 10);
const outputDir = process.env.MELODIA_QA_SCREENSHOT_DIR ??
  path.join(ROOT, 'notes/melodia/1-daily/build-logs/screenshots', today, moduleSlug);
const baseUrl = process.env.EXPO_QA_BASE_URL ?? 'exp://127.0.0.1:8081/--';
const delayMs = Number(process.env.MELODIA_QA_SCREENSHOT_DELAY_MS ?? 1800);
const score = Number(process.env.MELODIA_QA_SCORE ?? 3);
const total = Number(process.env.MELODIA_QA_TOTAL ?? 4);
const xp = Number(process.env.MELODIA_QA_XP ?? 75);

const routes = [
  ['00-module-detail', `modules/module/${moduleId}`],
  ['01-prelisten', `modules/module/${moduleId}/prelisten`],
  ['02-listen', `modules/module/${moduleId}/listen`],
  ['03-quiz', `modules/module/${moduleId}/quiz`],
  ['04-quiz-results', `modules/module/${moduleId}/results/${score}/${total}/${xp}`],
  ['05-reading', `modules/module/${moduleId}/reading/${xp}`],
  ['06-lesson-complete', `modules/module/${moduleId}/complete/${xp}`],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeUrl(routePath) {
  return `${baseUrl.replace(/\/$/, '')}/${routePath}`;
}

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

fs.mkdirSync(outputDir, { recursive: true });

for (const [name, routePath] of routes) {
  const url = makeUrl(routePath);
  const outfile = path.join(outputDir, `${name}.png`);
  console.log(`Opening ${url}`);
  run('xcrun', ['simctl', 'openurl', 'booted', url]);
  await sleep(delayMs);
  run('xcrun', ['simctl', 'io', 'booted', 'screenshot', outfile]);
}

console.log(`Saved ${routes.length} screenshots to ${outputDir}`);
