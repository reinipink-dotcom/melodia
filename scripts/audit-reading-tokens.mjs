#!/usr/bin/env node
// Audit: for every Spanish-tappable token in every module's readingPassage,
// does findReadingTrigger resolve to a NARROW pronunciation file
// (id contains 'reading-token' or 'reading-snippet'), or does it fall through
// to a vocab/phrase narration cue (long English narration)?

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');

function loadTs(relativePath) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
}

const modulesData = loadTs('src/data/modules.ts');
const triggersCode = loadTs('src/utils/ttsTriggers.ts');

const modulesCtx = { require, console, exports: {}, module: { exports: {} } };
vm.createContext(modulesCtx);
vm.runInContext(modulesData, modulesCtx);
const MODULES = modulesCtx.exports.MODULES;

const triggersCtx = {
  require: (p) => (p === '../data/modules' ? modulesCtx.exports : require(p)),
  console, exports: {}, module: { exports: {} },
};
vm.createContext(triggersCtx);
vm.runInContext(triggersCode, triggersCtx);
const { findReadingTrigger } = triggersCtx.exports;

let problems = 0;
for (const moduleId of [1, 2, 3, 4, 5, 6, 7]) {
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module?.readingPassage) continue;
  console.log(`\nModule ${moduleId} — ${module.title}`);
  const seen = new Set();
  for (const token of module.readingPassage) {
    if (!token.isSpanish) continue;
    const key = token.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const t = findReadingTrigger(module, token.text);
    const file = t ? t.outputFile.split('/').pop() : null;
    const isNarrow = t && (t.id.includes('reading-token') || t.id.includes('reading-snippet') || t.id === `m${moduleId}-reading-intro` && false);
    const narrationFallback = t && (t.id.includes('vocab') || t.id.includes('phrase'));
    let mark;
    if (!t) mark = 'EXPO-SPEECH FALLBACK';
    else if (narrationFallback) mark = 'NARRATION (wrong!)';
    else mark = 'OK';
    if (mark !== 'OK') problems++;
    console.log(`  ${mark.padEnd(22)} "${token.text}" -> ${file ?? '(none)'}`);
  }
}
if (problems > 0) {
  console.log(`\n${problems} reading-token issues found`);
  process.exit(1);
} else {
  console.log('\nAll Spanish reading tokens resolve to dedicated pronunciation files');
}
