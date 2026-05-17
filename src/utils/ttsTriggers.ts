import { Module, TtsTrigger } from '../data/modules';

function normalizeAudioText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getSearchTokens(text: string): string[] {
  return normalizeAudioText(text)
    .replace(/_/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function triggerSearchText(trigger: TtsTrigger): string {
  return normalizeAudioText(`${trigger.id} ${trigger.text} ${trigger.outputFile}`);
}

function includesAllTokens(trigger: TtsTrigger, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  const haystack = triggerSearchText(trigger);
  return tokens.every((token) => haystack.includes(token));
}

function isPreListenKind(trigger: TtsTrigger, kind: string): boolean {
  return trigger.screen === 'preListen' && normalizeAudioText(trigger.id).includes(kind);
}

export function hasGeneratedAudio(module: Module | undefined): boolean {
  return (module?.ttsTriggers?.length ?? 0) > 0;
}

export function findVocabTrigger(module: Module, vocabText: string): TtsTrigger | undefined {
  const triggers = module.ttsTriggers ?? [];
  const tokens = getSearchTokens(vocabText);
  return (
    triggers.find((trigger) => trigger.screen === 'preListen' && trigger.text === vocabText && trigger.slowVersion) ??
    triggers.find((trigger) => trigger.screen === 'preListen' && trigger.text === vocabText && trigger.normalVersion) ??
    triggers.find((trigger) => trigger.screen === 'preListen' && trigger.text === vocabText) ??
    triggers.find((trigger) => isPreListenKind(trigger, 'vocab') && includesAllTokens(trigger, tokens))
  );
}

export function findPhraseTrigger(module: Module, phraseText: string): TtsTrigger | undefined {
  const triggers = module.ttsTriggers ?? [];
  const tokens = getSearchTokens(phraseText);
  return (
    triggers.find((trigger) => trigger.screen === 'preListen' && trigger.text === phraseText) ??
    triggers.find((trigger) => isPreListenKind(trigger, 'phrase') && includesAllTokens(trigger, tokens)) ??
    triggers.find((trigger) => isPreListenKind(trigger, 'phrase'))
  );
}

export function findReadingTrigger(module: Module | undefined, tokenText: string): TtsTrigger | undefined {
  const triggers = module?.ttsTriggers ?? [];
  const tokens = getSearchTokens(tokenText);
  return (
    triggers.find((trigger) => trigger.text === tokenText && trigger.slowVersion) ??
    triggers.find((trigger) => trigger.screen === 'reading' && trigger.text === tokenText) ??
    triggers.find((trigger) => trigger.text === tokenText && trigger.normalVersion) ??
    triggers.find((trigger) => isPreListenKind(trigger, 'vocab') && includesAllTokens(trigger, tokens)) ??
    triggers.find((trigger) => isPreListenKind(trigger, 'phrase') && includesAllTokens(trigger, tokens)) ??
    triggers.find((trigger) => trigger.text === tokenText)
  );
}
