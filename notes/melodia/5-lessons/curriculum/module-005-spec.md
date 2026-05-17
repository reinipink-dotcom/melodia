# Module 005 — Curriculum Spec

**Status:** approved (with one flag for orchestrator/song validator — see Validation notes)
**Author:** Curriculum + Vocabulary Architect
**Date:** 2026-05-17

---

## CEFR Level
**A1** — confirmed correct placement.

## Concept
**Subject Pronouns** — yo, tú, él, ella, nosotros/as, ellos/as, plus the formal usted / ustedes contrast.

## Builds on
- **Module 1 — The Spanish Alphabet:** pronunciation foundation (silent H in *hablo*, pure vowels, the ñ in *español*, the rolled rr in *perro*). Pronoun pronunciation depends on these.
- **Module 2 — Accents & Stress:** the *él* vs *el* and *tú* vs *tu* contrast was introduced as a spelling/stress rule. Module 5 is where those accented pronouns finally do their *job* — pointing at a person.
- **Module 3 — Question Words:** ¿Quién? was learned in isolation. Module 5 lets the learner *answer* ¿Quién? — "Yo." / "Ella." / "Nosotros."
- **Module 4 — Prepositions, Conjunctions & Adverbs:** *de*, *con*, *pero*, *también*, *y* let pronouns combine into real sentences: "Yo soy de México." / "Tú y yo." / "Yo también."

## Functional speaking goal
**By the end of this lesson, the learner can:**
1. Point at themselves or someone else and name the correct pronoun ("yo," "tú," "él/ella," "nosotros," "ellos/ellas").
2. Choose between **tú** (friend, peer, same age) and **usted** (elder, stranger, boss, customer service) — and know *why* it matters.
3. Understand why a Spanish speaker can say *Soy de México* without ever saying *yo* (**pro-drop**) — and recognize when the pronoun *is* used for emphasis or contrast.
4. Combine a pronoun with one verb they already know (*soy*, *hablo*) to form a complete sentence: **"Yo soy de [country]."** / **"Tú hablas español."**

This is the first lesson where the learner can produce a *complete original sentence* with a chosen subject.

## Core vocabulary (5 words)
Skeleton vocab validated — **keep as-is**. All five words are essential and load-bearing.

| # | Spanish | English | Notes |
|---|---------|---------|-------|
| 1 | **yo** | I | Lowercase in Spanish (unlike English "I") |
| 2 | **tú** | you (informal, singular) | Accented — contrasts with *tu* (your) from Module 2 |
| 3 | **él / ella** | he / she | Counts as one paired item; *él* (accented) contrasts with *el* (the) from Module 2 |
| 4 | **nosotros** | we | Default masc./mixed-group form; note *nosotras* (all-female) as bonus |
| 5 | **ellos / ellas** | they (masc. / fem.) | Paired item — mirrors nosotros/nosotras logic |

**Bonus / stretch words** (introduce only if tappable with inline translation):
- **usted** — you (formal) — *load-bearing for the formal/informal grammar point, so likely needed*
- **ustedes** — you all (Latin America) — *bonus; mention in grammar, not required in quiz*
- **vosotros** — you all (Spain only) — *mention once, don't quiz; Melodia targets Latin America by default*

## Phrase chunk
**"Yo soy de [country]."** — *I am from [country].*

This is the single most useful sentence pattern a beginner can leave with. It:
- Uses the pronoun **yo** naturally (and demonstrates that Spanish speakers often *drop* it — "Soy de México" works too).
- Recycles **de** from Module 4 (preposition).
- Introduces *soy* (1st person singular of *ser*) as a single fixed chunk — the learner doesn't need to conjugate yet; they just memorize **soy = I am**.
- Works in every real-world context: introductions, travel, meeting someone new.

**Secondary phrase chunk (for variety in quizzes):**
**"Tú y yo."** — *You and me.* (recycles *y* from Module 4, song-title-tier romantic chunk)

## Speaking prompt
**"Look in the mirror or point at three different people (or photos). Out loud, name each one with the correct subject pronoun. Then say one full sentence: *Yo soy de ___.* Fill in your country or city."**

Why this works:
- **Physical anchor** (pointing) — pronouns are *deictic*, they only make sense when grounded to a real referent.
- **Production, not recognition** — the learner has to *say* the words, not just identify them.
- **Personalizable** — "Yo soy de [their country]" is a sentence they will reuse for the rest of their Spanish-speaking life.

## Cultural note
> **Bad Bunny and the Power of "Yo"**
>
> When Benito Antonio Martínez Ocasio started releasing songs from his bedroom in Vega Baja, Puerto Rico, he insisted on three things: he would record only in Spanish, he would never translate his lyrics for an English market, and he would put *yo* — *I* — at the center of his songs. That last choice is bigger than it sounds. Spanish usually drops subject pronouns because the verb endings already tell you who is speaking. When a Spanish-speaking artist says *yo* out loud, it lands like a fist on the table — it means *me, specifically, no one else.* Listen to how often Bad Bunny opens a line with *yo* and you'll hear a whole generation refusing to disappear inside the verb. His pronouns are political. They are also a perfect first lesson — every time he says *yo*, you get to hear exactly what it sounds like when a Spanish speaker chooses *not* to drop the pronoun.

*(Original writing. Connects pronoun grammar to the artist's choices. 5 sentences — slightly long; can trim to 3-4 if content-builder needs space.)*

## recyclingTargets

```ts
recyclingTargets: [
  {
    moduleId: 1,
    concept: 'Pronunciation of pronouns — silent H carries no weight, but the pure vowels in yo, tú, ella, ellos must stay open and unreduced',
    intervalDays: [1, 7],
    reviewFormat: ['listening-recognition'],
  },
  {
    moduleId: 2,
    concept: 'Accent marks distinguish pronouns from look-alikes: tú (you) vs tu (your), él (he) vs el (the)',
    intervalDays: [1, 3, 14],
    reviewFormat: ['mini-quiz', 'translation'],
  },
  {
    moduleId: 3,
    concept: '¿Quién? from Module 3 now gets an answer — pronouns are the natural response to "who?"',
    intervalDays: [3, 7],
    reviewFormat: ['speaking-prompt'],
  },
  {
    moduleId: 4,
    concept: 'Connectors plus pronouns: "Tú y yo" (you and me), "Yo también" (me too), "Yo soy de..." (I am from...)',
    intervalDays: [1, 7, 30],
    reviewFormat: ['translation', 'speaking-prompt', 'mini-quiz'],
  },
],
```

**Review timing rationale:**
- **1 day** — phonetic and accent contrasts (Modules 1-2) need overnight consolidation while the trace is fresh.
- **3 days** — accent-pair confusion (*tú/tu*, *él/el*) peaks around day 3 as new vocabulary crowds the working memory.
- **7 days** — pronoun production in real sentences ("Yo soy de...") needs a week of spacing to become automatic.
- **14 days** — accent rules from Module 2 fade fastest; one reinforcement at two weeks locks them in.
- **30 days** — the Module 4 connector + pronoun combo is the deepest review; it's the gateway to Module 9 (verb conjugation), where these patterns become the scaffolding for *ser/estar*.

## Quiz concept coverage
The content-builder should produce easy / standard / hard variants covering:
1. **Pronoun → English match** (foundational recognition).
2. **English → pronoun match** (production direction — harder than recognition).
3. **Formal vs informal selection in context** ("You meet your friend's grandmother. Do you say *tú* or *usted*?") — this is the highest real-world stakes question in the module.
4. **Pro-drop awareness** ("In Spanish, why can you say *Soy de México* without using *yo*?") — concept question, not a translation.
5. **Pronoun + connector combo** (hard tier): translate "You and I are from Mexico" → "Tú y yo somos de México" (with *somos* tappable as it's brand new — see Validation notes).

**Reading comprehension level:** 90% English / 10% Spanish. The 10% Spanish should be **only the 5 pronouns + 2-3 phrase chunks the learner already knows** (*Yo soy de...*, *Tú y yo*, *él*, *ella*). No new Spanish vocabulary in the reading unless tappable.

## Spaced repetition triggers
For the SRS system, this module should write the following items into the review queue:
- 5 core pronouns (yo, tú, él/ella, nosotros, ellos/ellas) — flashcard pair format.
- 1 phrase chunk: **Yo soy de ___** — fill-in / speaking format.
- 1 contrast pair: **tú (you) vs usted (you, formal)** — context-selection format.
- 1 concept card: **pro-drop** — "Why do Spanish speakers often skip the pronoun?" — explanation-recall format.

## Validation notes

### CEFR placement: APPROVED
A1 is correct. Subject pronouns are foundation-level — CEFR A1 explicitly lists "can introduce themselves and others" as a milestone, which is impossible without pronouns. Placement at module 5 (after pronunciation, accents, question words, connectors) is pedagogically clean: every prior module feeds directly into the speaking goal.

### Overlap with prior modules: NO CONFLICT
The team-lead briefing referenced "Module 2: Greetings & Personal Pronouns," but the current `src/data/modules.ts` has Module 2 as **Accents & Stress** (not greetings). The actual module order is:
- M1: Alphabet
- M2: Accents & Stress
- M3: Question Words
- M4: Prepositions, Conjunctions & Adverbs
- M5: **Subject Pronouns** ← this module
- M6: Days/Months/Time
- M8: Greetings & Polite Phrases (the "greetings" module — comes *after* pronouns)

**Implication:** Module 5 is the *first* systematic introduction to subject pronouns. No overlap with M2; instead, M2's accent rules pay off here (the learner now sees *why* the accent on *tú* and *él* matters — it's how Spanish distinguishes pronouns from articles/possessives). This is actually a cleaner pedagogical arc than the briefing assumed.

### Brand-new vocab flag (per Reine's feedback)
The skeleton's vocabulary itself is all-new (pronouns are introduced for the first time here, so that's expected and unavoidable — they ARE the concept). However, the quiz concepts above reference these brand-new items that must be **tappable with inline translation** when they appear in non-vocab contexts:

| New word | Where it appears | Mitigation |
|----------|------------------|------------|
| **soy** | Phrase chunk *Yo soy de...*, hard quiz | Tappable inline translation: "soy = I am (form of *ser*, full verb in Module 9)" |
| **somos** | Hard quiz only: "Tú y yo somos de México" | Tappable inline translation: "somos = we are" — or drop *somos* from the hard quiz and use a simpler structure |
| **usted / ustedes** | Grammar point + formal/informal quiz | Tappable inline translation on every appearance — these are functionally required for the formal/informal point |

**Recommendation to content-builder:** treat *soy*, *somos*, *usted*, *ustedes* as "tappable preview vocab" — they show up but are never *quizzed in isolation* as vocab. They're scaffolding for the pronouns to do real work.

### Song selection flag — ESCALATE TO REINE / SONG VALIDATOR
The skeleton's primary song is **"Yo Perreo Sola"** by Bad Bunny. This song contains explicit lyrics and an adult sexual theme (perrear = grinding/twerking; the title means "I dance/grind alone"). Concerns:
1. **A1 audience:** beginners include kids, teens, and learners who may not want explicit-content songs as their first real exposure.
2. **App Store rating:** explicit-content songs may push the app toward a higher age rating.
3. **Brand fit:** the cultural note about Bad Bunny's *yo* still lands without this specific song.

**Suggested alternative primary songs (still Bad Bunny, still pronoun-heavy, but cleaner):**
- **"Yo Visto Así"** — title literally means "I dress like this" — *yo* is in the title.
- **"Tú No Vive Así"** (older track) — *tú* in the title.
- **"Ella Perrea"** — *ella* in the title (still has *perrea* — check lyrics).
- **"DTMF (DeBí TiRAR MáS FOToS)"** from the 2025 album — Reine should know if this fits; reflective, less explicit.

The pop / rnb / regional-mexican alternatives already in the skeleton (Camila Cabello's "Tú", Don Omar's "Ella y Yo", La Arrolladora's "Yo Ya No Vuelvo Contigo") are cleaner and pronoun-perfect — these can stand on their own if a Bad Bunny swap is preferred.

**This is the only blocker preventing full approval — flagging for human/song-validator review.**

### Genre alternatives in skeleton: ALREADY EXCELLENT
- pop: "Tú" (Camila Cabello) — pronoun in title ✓
- rnb: "Ella y Yo" (Don Omar ft. Romeo Santos) — TWO pronouns in title ✓
- regional-mexican: "Yo Ya No Vuelvo Contigo" — pronoun in title ✓
- reggaeton: needs filling — see primary-song alternatives above.

### Cultural note: APPROVED (original writing)
The cultural note above is 100% original. No copying from external sources. Connects directly to the grammar concept (pro-drop and pronoun emphasis). Facts about Bad Bunny (Puerto Rican, Vega Baja, recorded in Spanish only, refused English translation) are widely public-domain biographical facts — but if the content-builder has any doubt, flag to Reine.

---

## Approval status
**approved — with one escalation to Reine:** swap "Yo Perreo Sola" for a cleaner Bad Bunny track (or another reggaeton/Latin pop song with a subject pronoun in the title). All other curriculum decisions are locked and ready for content-builder.

## Files for downstream agents
- This spec: `/Users/reinebadejoko/Desktop/app/melodia-app/notes/melodia/5-lessons/curriculum/module-005-spec.md`
- Skeleton data: `/Users/reinebadejoko/Desktop/app/melodia-app/src/data/modules.ts` (id: 5, lines 667-700)
