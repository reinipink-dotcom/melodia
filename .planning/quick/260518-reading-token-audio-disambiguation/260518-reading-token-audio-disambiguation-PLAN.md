---
goal: Fix reading-screen audio so a highlighted short word never resolves to a longer phrase's reading-token MP3.
quick_id: 260518-reading-token-audio-disambiguation
slug: reading-token-audio-disambiguation
created: 2026-05-18

must_haves:
  - `¿Dónde` in Module 3 resolves to the short `m3-reading-token-donde.mp3`, not the full-title token.
  - `¿Dónde jugarán los niños?` resolves to its own full-title reading token.
  - Reading taps do not fall back to pre-listening narration cues.
  - Missing reading-token audio falls back to speaking the highlighted token text only.
  - TypeScript remains clean.
---

## Context

Module 3 already has both a full-title reading token and a short `¿Dónde?` reading token. The bug is in lookup disambiguation: a partial filename/id match lets the short highlighted word `¿Dónde` select the first matching identifier, `m3-reading-token-donde-jugaran`, before the shorter exact token can win.

Reading-screen taps need a stricter contract than vocab taps. A highlighted reading token should only use audio whose spoken text matches that token exactly after punctuation/accent normalization. It should never reuse a longer phrase token or a pre-listening narration.
