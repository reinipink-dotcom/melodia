#!/usr/bin/env node
// Verify that vocab/phrase tap UI text resolves to the CORRECT trigger
// for each module. Simulates the same lookup the app does.

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const ROOT = path.resolve(import.meta.dirname, '..');

function loadTs(relativePath) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  return outputText;
}

const triggers = loadTs('src/utils/ttsTriggers.ts');
const modulesData = loadTs('src/data/modules.ts');
const enrichmentData = loadTs('src/data/curriculum-enrichment.ts');

const ctx = { require, console, exports: {}, module: { exports: {} } };
vm.createContext(ctx);

const modulesCtx = { ...ctx, exports: {}, module: { exports: {} } };
vm.createContext(modulesCtx);
vm.runInContext(modulesData, modulesCtx);
const MODULES = modulesCtx.exports.MODULES;

const enrichmentCtx = { ...ctx, exports: {}, module: { exports: {} }, require: (p) => {
  if (p === './modules') return modulesCtx.exports;
  return require(p);
}};
vm.createContext(enrichmentCtx);
vm.runInContext(enrichmentData, enrichmentCtx);
const getEnrichment = enrichmentCtx.exports.getEnrichment;

const triggersCtx = { ...ctx, exports: {}, module: { exports: {} }, require: (p) => {
  if (p === '../data/modules') return modulesCtx.exports;
  return require(p);
}};
vm.createContext(triggersCtx);
vm.runInContext(triggers, triggersCtx);
const { findVocabTrigger, findPhraseTrigger } = triggersCtx.exports;

let failures = 0;
for (const moduleId of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module || !module.ttsTriggers || module.ttsTriggers.length === 0) {
    console.log(`Module ${moduleId}: no ttsTriggers, skipping`);
    continue;
  }
  console.log(`\nModule ${moduleId} — ${module.title}`);
  for (const word of module.vocabulary) {
    const t = findVocabTrigger(module, word.spanish);
    const hit = t ? t.outputFile.replace('assets/audio/', '') : 'NO MATCH';
    const ok = !!t;
    console.log(`  ${ok ? 'OK ' : 'FAIL'}  vocab "${word.spanish}" -> ${hit}`);
    if (!ok) failures++;
  }
  const enrichment = getEnrichment(moduleId);
  const phraseChunk = enrichment?.vocabPack?.phraseChunk;
  if (phraseChunk) {
    const t = findPhraseTrigger(module, phraseChunk);
    const hit = t ? t.outputFile.replace('assets/audio/', '') : 'NO MATCH';
    const ok = !!t;
    console.log(`  ${ok ? 'OK ' : 'FAIL'}  phrase "${phraseChunk}" -> ${hit}`);
    if (!ok) failures++;
  }
}

if (failures > 0) {
  console.log(`\n${failures} lookup(s) failed`);
  process.exit(1);
} else {
  console.log('\nAll lookups resolved correctly');
}
