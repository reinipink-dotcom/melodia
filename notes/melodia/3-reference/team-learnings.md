# Melodia Team Learnings

> This file is the team's persistent memory. The qa-scribe appends new entries at the end of every successful `/melodia` run. The orchestrator and content-builder read this at Wave 0 before planning.
>
> **Format:** one entry per learning, newest at the top. Keep entries short and actionable.

## Format

```markdown
### YYYY-MM-DD — Module N — [Topic]
**What happened:** ...
**What we learned:** ...
**Apply next time:** ...
```

---

## Learnings

### 2026-05-15 — Module 4 — First Production Run
**What happened:** All 7 agents executed the pipeline end-to-end for Module 4 (Prepositions/Conjunctions/Adverbs, A Dios Le Pido — Juanes). Content wiring, TypeScript, bundle, and audio file generation all passed. Simulator visual walk-through was blocked because Expo Go was not pre-installed on the iPhone 17 sim — ux-builder also discovered a 9-day-old stale Metro server (PID killed, fresh server started). Module landed in `needs-review` not `app-ready`. QA agent had no way to play audio files for the pronunciation spot-checks (perro/pero trilled R contrast, también final-é stress) — those were flagged for Reine.
**What we learned:** (1) Pre-flight checks must include Expo Go install state on target sim — without it, no E2E screenshots are possible regardless of code quality. (2) Stale Metro processes can mask bundle corruption; always check `lsof -i :8081` age before trusting a hot reload. (3) Audio QA cannot be fully automated by a text-only agent — every audio-bearing module needs a human listening pass or an automated transcription/forced-alignment check. (4) Dual fields for the same concept (recyclingTargets in Module vs ModuleEnrichment) silently allow divergence — flag during architecture review, not after content wiring.
**Apply next time:** (a) Add a Wave 0 pre-flight: `xcrun simctl listapps booted | grep -i expo` and auto-install Expo Go if missing. (b) Add a Metro age check: if PID is >24h old, kill and restart before bundling. (c) For audio modules, voice-engineer should generate a transcript or phoneme-level alignment file alongside the MP3s so qa-scribe can verify expected stress/sound without listening. (d) When the Module interface and an enrichment file both define the same field name, consolidate into one source-of-truth before content runs continue.
