---
status: complete
---
# Quick Task 260518-audio-lookup-guardrails — Summary

## What Was Fixed

Module 1 audio mismatches came from fuzzy trigger lookup. The old helper stripped accents, reduced `ñ` to a plain `n`, and used substring matching across full narration text. Short UI labels like `ñ`, `h`, and `ll` could therefore match the first unrelated narration cue.

The lookup now uses safer token and filename/id matching. Module 1 vocab cards resolve as:

- `a, e, i, o, u` -> `m1-vocab-vowels`
- `ñ` -> `m1-vocab-enye`
- `ll` -> `m1-vocab-ll`
- `h` -> `m1-vocab-h`
- `rr` -> `m1-vocab-rr`
- `Bésame mucho.` -> `m1-phrase-besame-mucho`

## Guardrails Added

- Missing bundled MP3s now fall back to speech instead of silently doing nothing.
- `src/utils/audioAssets.ts` is generated from the MP3s actually on disk, so the app's static Metro audio map no longer has to be hand-maintained.
- `scripts/generate-module-audio.mjs` is now the safer generic generator:
  - validates the manifest module number and output paths
  - confirms required manifest triggers are wired in `src/data/modules.ts`
  - confirms UI vocab rows match generated triggers
  - uses cache skips for healthy existing files
  - writes MP3s atomically to reduce truncated-file risk
  - refreshes the bundled audio asset map after generation
- Module 2 manifest/data was aligned before generation: `se vs sé`, `mas vs más`, and the phrase chunk now have matching triggers.
- Module 3 gained a missing phrase trigger so its phrase speaker has a generated target.

## Verification

- `npx tsc --noEmit` passed.
- `node scripts/generate-module-audio.mjs 1 --dry-run` passed and found all Module 1 narration files cached.
- `node scripts/generate-module-audio.mjs 2 --dry-run` passed and reports 9 files needed.
- Targeted lookup check passed for vocab + phrase triggers across Modules 1-5.
- Touched files passed `git diff --check`; unrelated trailing whitespace remains in `notes/melodia/1-daily/reine-feedback.md`.
