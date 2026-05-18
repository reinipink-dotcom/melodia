import { Module, TtsTrigger } from '../data/modules';

const VOWEL_CHAIN = ['a', 'e', 'i', 'o', 'u'];
const SAFE_SINGLE_CHARACTER_TOKENS = new Set(['h', 'y']);

function normalizeAudioText(text: string): string {
  if (text.trim().toLowerCase() === 'ñ') return 'enye';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getRawTokens(text: string): string[] {
  return normalizeAudioText(text)
    .replace(/_/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function hasVowelChain(text: string): boolean {
  const tokens = getRawTokens(text);
  return VOWEL_CHAIN.every((token) => tokens.includes(token));
}

function getLookupTokens(text: string): string[] {
  const keepVowels = hasVowelChain(text);
  return getRawTokens(text).filter(
    (token) =>
      token.length > 1 ||
      SAFE_SINGLE_CHARACTER_TOKENS.has(token) ||
      (keepVowels && VOWEL_CHAIN.includes(token)),
  );
}

function getLookupAliases(text: string): string[] {
  const aliases = new Set<string>();
  const tokens = getLookupTokens(text);
  if (tokens.length > 0) aliases.add(tokens.join('-'));
  if (hasVowelChain(text)) aliases.add('vowels');
  return [...aliases];
}

function getIdentifierTokens(trigger: TtsTrigger): string[] {
  return getRawTokens(`${trigger.id} ${trigger.outputFile}`);
}

function getTriggerTokens(trigger: TtsTrigger): string[] {
  return getLookupTokens(`${trigger.id} ${trigger.outputFile} ${trigger.text}`);
}

function containsTokenSequence(haystack: string[], needle: string[]): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false;
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    const matches = needle.every((token, offset) => haystack[start + offset] === token);
    if (matches) return true;
  }
  return false;
}

function includesAllTokens(trigger: TtsTrigger, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  if (!tokens.some((token) => token.length > 1)) return false;
  const haystack = new Set(getTriggerTokens(trigger));
  return tokens.every((token) => haystack.has(token));
}

function isPreListenKind(trigger: TtsTrigger, kind: string): boolean {
  return trigger.screen === 'preListen' && normalizeAudioText(trigger.id).includes(kind);
}

function isExactTextMatch(trigger: TtsTrigger, text: string): boolean {
  return normalizeAudioText(trigger.text).trim() === normalizeAudioText(text).trim();
}

function matchesIdentifier(trigger: TtsTrigger, text: string): boolean {
  const identifierTokens = getIdentifierTokens(trigger);
  return getLookupAliases(text).some((alias) => {
    const aliasTokens = alias.split('-').filter(Boolean);
    if (aliasTokens.length === 1) return identifierTokens.includes(aliasTokens[0]);
    return containsTokenSequence(identifierTokens, aliasTokens);
  });
}

function matchesTrigger(trigger: TtsTrigger, text: string): boolean {
  const tokens = getLookupTokens(text);
  return matchesIdentifier(trigger, text) || includesAllTokens(trigger, tokens);
}

export function hasGeneratedAudio(module: Module | undefined): boolean {
  return (module?.ttsTriggers?.length ?? 0) > 0;
}

export function findVocabTrigger(module: Module, vocabText: string): TtsTrigger | undefined {
  const triggers = module.ttsTriggers ?? [];
  const vocabTriggers = triggers.filter((trigger) => isPreListenKind(trigger, 'vocab'));
  return (
    vocabTriggers.find((trigger) => isExactTextMatch(trigger, vocabText) && trigger.slowVersion) ??
    vocabTriggers.find((trigger) => isExactTextMatch(trigger, vocabText) && trigger.normalVersion) ??
    vocabTriggers.find((trigger) => isExactTextMatch(trigger, vocabText)) ??
    vocabTriggers.find((trigger) => matchesIdentifier(trigger, vocabText)) ??
    vocabTriggers.find((trigger) => matchesTrigger(trigger, vocabText))
  );
}

export function findPhraseTrigger(module: Module, phraseText: string): TtsTrigger | undefined {
  const triggers = module.ttsTriggers ?? [];
  const phraseTriggers = triggers.filter((trigger) => isPreListenKind(trigger, 'phrase'));
  return (
    phraseTriggers.find((trigger) => isExactTextMatch(trigger, phraseText)) ??
    phraseTriggers.find((trigger) => matchesIdentifier(trigger, phraseText)) ??
    phraseTriggers.find((trigger) => matchesTrigger(trigger, phraseText))
  );
}

export function findReadingTrigger(module: Module | undefined, tokenText: string): TtsTrigger | undefined {
  const triggers = module?.ttsTriggers ?? [];
  const readingTriggers = triggers.filter((trigger) => trigger.screen === 'reading');
  const reusablePreListenTriggers = triggers.filter(
    (trigger) => isPreListenKind(trigger, 'vocab') || isPreListenKind(trigger, 'phrase'),
  );
  return (
    readingTriggers.find((trigger) => isExactTextMatch(trigger, tokenText) && trigger.slowVersion) ??
    readingTriggers.find((trigger) => isExactTextMatch(trigger, tokenText) && trigger.normalVersion) ??
    readingTriggers.find((trigger) => isExactTextMatch(trigger, tokenText)) ??
    reusablePreListenTriggers.find((trigger) => matchesIdentifier(trigger, tokenText)) ??
    reusablePreListenTriggers.find((trigger) => matchesTrigger(trigger, tokenText)) ??
    readingTriggers.find((trigger) => matchesTrigger(trigger, tokenText))
  );
}
