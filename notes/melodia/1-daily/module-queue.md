# Melodia Module Production Queue

This file is read by `/melodia` to pick today's target. The orchestrator updates statuses at the end of each run.

## Status legend
- `pending` — not yet built, ready for production
- `in-progress` — currently being built
- `app-ready` — all quality gates passed, lesson is live in the app
- `needs-review` — built but needs Reine to review before marking app-ready
- `blocked` — blocked by a missing dependency (credential, decision, etc.)
- `done` — already shipped before this queue existed (Modules 1-3)

## Queue

| Module | Concept | CEFR | Status | Date completed | Notes |
|---|---|---|---|---|---|
| 1 | Spanish Alphabet | A1 | app-ready | 2026-05-16 | Enriched: 4 genreSongs added, culturalNote added, 16 audio MP3s generated. tsc pass. |
| 2 | Greetings & Personal Pronouns | A1 | done | — | Pre-existing |
| 3 | Numbers & Time | A1 | done | — | Pre-existing — KNOWN BUG: "no quiz available" dead-end |
| 4 | Prepositions, Conjunctions & Adverbs | A1 | app-ready | 2026-05-15 | Content + code pass; audio wired via expo-av. |
| 5 | Subject Pronouns | A1 | needs-review | 2026-05-17 | tsc pass; content + 11 ttsTriggers + 4/3/3 quiz variants wired; audio MP3s NOT yet generated (run `/melodia-audio 5`); sim walkthrough pending Reine (Expo Go input control unavailable in cloud). |
| 6 | Ser vs Estar | A1 | pending | — | |
| 7 | Articles & Gender | A1 | pending | — | |
| 8 | Demonstratives & Possessives | A1 | pending | — | Last module before paywall |
| 9 | Common Adjectives | A1-A2 | pending | — | |
| 10 | Negation & Question Words | A1-A2 | pending | — | |

## Notes for the orchestrator

- Modules 1-3 are `done` but Module 3 has the "no quiz available" bug — QA scribe should flag this during every run until fixed.
- The orchestrator always picks the first `pending` module. `app-ready` and `done` are both skipped.
- The full 60-module curriculum is in `melodia-curriculum.docx`. Add rows here as we approach them — don't pre-fill 60 rows.

## Daily ramp
- Week 1 (first 7 runs): target 1 module/day
- Week 2: 2 modules/day only if Week 1 QA pass rate ≥ 90%
- Week 3+: 3 modules/day only if all stability criteria met
