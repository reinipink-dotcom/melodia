---
goal: Fix Module 1 audio trigger mismatches and add guardrails so future /melodia-audio runs do not silently wire the wrong cue or produce silent taps.
quick_id: 260518-audio-lookup-guardrails
slug: audio-lookup-guardrails
created: 2026-05-18

must_haves:
  - Module 1 vocab taps resolve to their matching m1-vocab-* narration MP3s.
  - Short tokens such as ñ, h, ll, rr do not match arbitrary letters inside unrelated narration text.
  - Missing bundled audio falls back to speech instead of doing nothing.
  - Audio asset map can be regenerated from disk so new MP3s do not require hand-editing every require() entry.
  - Future audio generation uses cache and atomic writes to reduce duplicate/truncated-file risk.
  - TypeScript remains clean.
---

## Context

Module 1 was upgraded from short single-word audio to richer m1-* narration files. The runtime lookup still used a loose token search that stripped accents and checked substring containment across trigger id, text, and output path. That made tiny UI labels unsafe: `ñ` became `n`, `h` matched letters inside English words, and `ll` could match words like "swallowed."

The player also returned early when a trigger's `outputFile` was not present in the static Metro asset map, which made missing generated or unbundled files sound like a dead button.

## Tasks

1. Replace substring matching with safer token/slug matching in `src/utils/ttsTriggers.ts`.
2. Make PreListen and Reading fall back to native speech whenever a specific trigger is unavailable.
3. Move static audio requires into a generated `src/utils/audioAssets.ts` file and have `audioPlayer.ts` consume it.
4. Add a sync script that rebuilds the static audio asset map from `assets/audio/**/*.mp3`.
5. Add a generic module audio generator with validation, cache-skipping, atomic writes, and asset-map sync.
6. Verify with TypeScript and targeted audio lookup checks.
