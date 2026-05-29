# Melodia Module Production Tracker

> Managed by the QA, Scribe + Notification Agent at the end of each run.
> A lesson cannot be marked App Ready unless all quality gates pass.

| Module | Concept | Status | Song | Genre Alternatives | Cultural Note | Audio Cues | Quiz Variants | Recycling Targets | QA | Reine Review | App Ready |
|--------|---------|--------|------|--------------------|---------------|------------|---------------|-------------------|----|--------------|-----------|
| 1 | The Spanish Alphabet — Pronunciation | ⚠️ needs-review | Bésame Mucho (Consuelo Velázquez) | ✅ | ✅ | ✅ 16 ttsTriggers, 1:1 match w/ disk | ✅ easy/standard/hard | ❌ deferred | ✅ tsc / ⚠️ sim walk-through pending (Reine) | ⚠️ pending (4 items) | ❌ |
| 4 | Prepositions, Conjunctions & Adverbs | ⚠️ needs-review | A Dios Le Pido (Juanes) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ tsc / ⚠️ sim (Expo Go not installed) | ⚠️ pending | ❌ |
| 5 | Subject Pronouns | ⚠️ needs-review | Soy Yo (Bomba Estéreo) | ✅ pop/reggaeton/rnb/regional-mexican | ✅ Bomba Estéreo backstory | ✅ 11 ttsTriggers (audio MP3s NOT yet generated) | ✅ easy 3 / standard 4 / hard 3 | ✅ via curriculum-enrichment.ts | ✅ tsc / ⚠️ sim walkthrough deferred to Reine (no programmatic tap control) | ⚠️ pending (sim + audio) | ❌ |
| 6 | Ser vs Estar | ⚠️ needs-review | Estoy Aquí (Shakira) | ✅ | ✅ | ✅ 15 ttsTriggers (9 narration + 6 reading-token, audio MP3s pending /melodia-audio 6) | ✅ easy/standard/hard | ✅ via curriculum-enrichment.ts | ✅ tsc / verify-audio-lookups / audit-reading-tokens all pass | ⚠️ pending (sim walkthrough + /melodia-audio 6) | ❌ |
| 7 | Articles & Gender | ⚠️ needs-review | La Vida Es Un Carnaval (Celia Cruz) | ✅ | ✅ Celia Cruz / salsa cubana | ✅ ttsTriggers defined (audio MP3s pending /melodia-audio 7) | ✅ easy/standard/hard | ✅ via curriculum-enrichment.ts | ✅ tsc / verify-audio-lookups / audit-reading-tokens all pass | ⚠️ pending (sim walkthrough + /melodia-audio 7) | ❌ |
| 8 | Demonstratives & Possessives | ⚠️ needs-review | Mi Gente (J Balvin & Willy William) | ✅ | ✅ J Balvin / reggaeton global | ✅ ttsTriggers defined (audio MP3s pending /melodia-audio 8) | ✅ easy/standard/hard | ✅ via curriculum-enrichment.ts | ✅ tsc / verify-audio-lookups / audit-reading-tokens all pass | ⚠️ pending (sim walkthrough + /melodia-audio 8) | ❌ |

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete and approved |
| ❌ | Not yet done |
| ⚠️ | Done but needs Reine review |
| 🔄 | In progress |
| 🚫 | Blocked |

## Quality Gate Checklist (per module)

A lesson cannot be marked **App Ready** unless ALL of these are ✅:

- [ ] Curriculum Architect approved concept + vocabulary theme
- [ ] Functional speaking goal defined
- [ ] Cultural note written and connected to module concept
- [ ] recyclingTargets defined
- [ ] Song/concept fit approved by Song Validator
- [ ] Genre-aware alternatives provided (or marked for Reine review)
- [ ] Lesson Content Builder output complete
- [ ] Easy + Standard + Hard quiz variants exist
- [ ] Voice Agent defined ttsTriggers
- [ ] UX Builder wired lesson into app
- [ ] QA: TypeScript check passes
- [ ] QA: No full lyrics stored or displayed
- [ ] QA: Reading passage is original content
- [ ] QA: Navigation end-to-end works
- [ ] Documented in daily build log
