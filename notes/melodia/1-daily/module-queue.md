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
| 1 | Spanish Alphabet | A1 | done | — | Pre-existing — Bésame Mucho |
| 2 | Greetings & Personal Pronouns | A1 | done | — | Pre-existing |
| 3 | Numbers & Time | A1 | done | — | Pre-existing — KNOWN BUG: "no quiz available" dead-end |
| 4 | Prepositions, Conjunctions & Adverbs | A1 | pending | — | **First target for /melodia** |
| 5 | Present Tense Regular Verbs | A1 | pending | — | |
| 6 | Ser vs Estar | A1 | pending | — | |
| 7 | Articles & Gender | A1 | pending | — | |
| 8 | Demonstratives & Possessives | A1 | pending | — | Last module before paywall |
| 9 | Common Adjectives | A1-A2 | pending | — | |
| 10 | Negation & Question Words | A1-A2 | pending | — | |

## Notes for the orchestrator

- Modules 1-3 are `done` but Module 3 has the "no quiz available" bug — QA scribe should flag this during every run until fixed.
- Module 4 is the **first production target**. Do not retarget without Reine's approval.
- The full 60-module curriculum is in `melodia-curriculum.docx`. Add rows here as we approach them — don't pre-fill 60 rows.

## Daily ramp
- Week 1 (first 7 runs): target 1 module/day
- Week 2: 2 modules/day only if Week 1 QA pass rate ≥ 90%
- Week 3+: 3 modules/day only if all stability criteria met
