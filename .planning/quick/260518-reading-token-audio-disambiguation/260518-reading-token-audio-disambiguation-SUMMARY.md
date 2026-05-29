---
status: complete
---
# Quick Task 260518-reading-token-audio-disambiguation — Summary

## Root Cause

Module 3 already had both:

- `m3-reading-token-donde-jugaran.mp3` for `¿Dónde jugarán los niños?`
- `m3-reading-token-donde.mp3` for `¿Dónde?`

The bug was lookup order. The highlighted text in the passage is `¿Dónde` without the closing question mark. The old reading lookup did not treat that as an exact match for `¿Dónde?`, so it fell through to fuzzy filename/id matching. Since `m3-reading-token-donde-jugaran` appears first and also contains `donde`, the short word picked the full-title audio.

## Fix

Reading tap lookup now compares the spoken token text exactly after punctuation/accent normalization. That means:

- `¿Dónde jugarán los niños?` resolves only to `m3-reading-token-donde-jugaran`
- `¿Dónde` resolves only to `m3-reading-token-donde`
- `¿Cómo` resolves only to `m3-reading-token-como`
- `¿Por qué` resolves only to `m3-reading-token-por-que`

Reading taps no longer fall back to pre-listening vocab/phrase narrations. If no exact reading-token MP3 exists, the app speaks only the highlighted token text with native speech.

## Verification

- Targeted Module 3 reading lookup check passed.
- Cross-module reading lookup check confirms Modules without exact reading tokens fall back instead of selecting long narrations.
- `node scripts/generate-module-audio.mjs 3 --dry-run --only m3-reading-token-donde-jugaran` passed, so the full-title audio can be regenerated alone if its pronunciation take is bad.
- `npx tsc --noEmit` passed.
