# Off-Plan Pending Work

> Items here are unfinished off-plan changes that need to be completed.
> Remove an item ONLY when it is fully done and working in the app.
> This file persists across sessions — it is never wiped.

---

## ~~DONE — Curriculum Enrichment Wired~~ ✓ (2026-05-13)

`getEnrichment()` now imported and called in PreListenScreen + LessonCompleteScreen.

---

## ~~DONE — TTS Voice Quality~~ ✓ (2026-05-15)

Replaced expo-speech with OpenAI TTS tts-1-hd (voice: nova) for all pre-recorded vocab/phrase/reading audio.
- Module 4: 17 MP3s generated ($0.0069)
- Module 1: 16 MP3s generated ($0.0071)
- audioPlayer.ts: expo-av plays MP3s, falls back to expo-speech only when no file exists
- setAudioModeAsync fix applied so audio plays on iOS silent mode
- slow-first lookup so learners hear clear pronunciation by default

---

## ~~DONE — Quiz Navigation Dead-End (Modules 1-3)~~ ✓ (2026-05-17)

QuizScreen.tsx:78-99 fallback now renders centered text + "Back to Modules" pill button → `navigation.popToTop()`. Retroactively unblocks Modules 2 and 3 (which still lack quizQuestions). Verified: tsc clean. Sim walk-through still pending Reine.

---

## OPEN — Wrong Song URL (Dónde Jugarán los Niños)

**What happened:** Reine found the YouTube Music link for "Dónde Jugarán los Niños" by Maná was wrong.

**What needs to happen:**
- [ ] Find correct YouTube ID for "Dónde Jugarán los Niños" by Maná
- [ ] Update `youtubeId` in the relevant module entry in `modules.ts`

---

## OPEN — Song Timer Accuracy

**What happened:** Reine asked whether the countdown timer matches actual song length for embedded links.

**What needs to happen:**
- [ ] Audit song durations in modules.ts vs actual song lengths for Modules 1–4 (active modules)
- [ ] Fix any mismatches

---

## OPEN — Push Notification on Timer End

**What happened:** Reine was in YouTube Music when the lesson timer ended and received no banner notification to come back to Melodia.

**What needs to happen:**
- [ ] Verify expo-notifications is actually wired to fire when the timer hits 0 in ListenScreen
- [ ] Test on physical device — simulator may not show banners the same way
- [ ] If not implemented: add a local notification trigger in ListenScreen's timer completion handler

---

## OPEN — Interactive Letter Card Narration (Module 1 UX)

**What Reine wants:** Each vocab card in the alphabet module should have a richer narrated breakdown — not just playing the letter sound, but a voice that says (in English first, then Spanish): what the letter sounds like, example words, pronunciation tip. E.g. for ñ: "The letter eñe sounds like 'ny' in canyon. Example words: niño, mañana, año."

**Current state:** Vocab cards play a single MP3 (e.g. `vocab-enye-slow.mp3` = "Eñe. Mañana."). Functional but not as rich as Reine wants.

**Scope:** This is a larger UI feature — requires multi-part audio or a longer generated narration per letter, plus possibly animated word highlighting as audio plays.

**What needs to happen:**
- [ ] Design decision: single longer MP3 per letter (pre-generated) vs. streamed narration vs. sequenced clips
- [ ] If pre-generated: regenerate each letter trigger with fuller narration text (English intro + Spanish examples)
- [ ] UI: consider word highlighting as audio plays (more complex — requires timing data)
- [ ] Plan in a future session before implementing

---

## OPEN — Survival Phrases Speaker Button

**What Reine wants:** The survival phrases section in PreListenScreen should also have a speaker/play button, just like vocab words have.

**Current state:** Vocab words have speaker buttons. Survival phrases section (`survivalPhrases` from enrichment) does not.

**What needs to happen:**
- [ ] Add speaker tap to each survival phrase row in PreListenScreen
- [ ] Add corresponding ttsTriggers to modules with survival phrases
- [ ] Wire into AUDIO_MAP

---

## OPEN — Visual/Image Association for Vocab Words

**What Reine wants:** Add a small visual/image next to each vocab word so users make the visual connection (e.g. a picture of a coffee cup next to "café con leche").

**Current state:** Vocab rows are text-only (Spanish word + English translation).

**What needs to happen:**
- [ ] Decide on image source: emoji, icon set, or small illustration assets
- [ ] Add optional `image` field to vocabulary entries in Module type
- [ ] Update PreListenScreen vocab row to show image when present
- [ ] Add images to Modules 1–4 vocab entries first

---

## OPEN — First-Lesson Onboarding Tooltip for Tappable Words

**What Reine wants:** On a user's very first lesson, show a small tooltip/arrow pointing to the orange-highlighted tappable words in ReadingScreen so users know to tap them. One-time only, with an "×" / "don't show again" dismiss.

**Current state:** No tooltip exists. Users may not discover the tappable word feature.

**What needs to happen:**
- [ ] Add a one-time tooltip overlay on ReadingScreen for first-lesson users
- [ ] Store "has seen reading tooltip" flag in onboardingStore or AsyncStorage
- [ ] Dismissable with "×" or "Got it" — never shows again after dismiss

---

## OPEN — Placement Test / DELE Research

**What Reine wants:** A thorough placement test aligned to DELE official guidelines so users are placed at the right CEFR level.

**What needs to happen:**
- [ ] Research DELE A1/A2/B1/B2 assessment criteria and published sample tests
- [ ] Design a placement test flow (how many questions, what types, how scoring maps to levels)
- [ ] Plan where it fits in the onboarding flow (after level selection screen, or replace it)
- [ ] This is a significant feature — plan in a dedicated session before building

---

## ~~DONE — Quiz Difficulty Should Match Onboarding Selection~~ ✓ (2026-05-17)

Fixed in QuizScreen.tsx (commit 639a5c4). Simulator path testing is pending Reine's manual walkthrough.

---

## OPEN — Retroactive Bug Propagation (from feedback 2026-05-16)
**Source:** reine-feedback.md, Module 1 entry
**What:** When a bug is fixed in a later module, the same fix must be applied to all prior modules that share the same pattern.
**What needs to happen:**
- [ ] At the end of each run, qa-scribe checks: was any bug fixed this run that also exists in Modules 1–(N-1)?
- [ ] If yes, apply the fix to prior modules in the same commit
- [ ] Add this to qa-scribe spawn prompt as a standing instruction

---

## OPEN — QA Scribe Screenshot Coverage (from feedback 2026-05-16)
**Source:** reine-feedback.md, Module 1 entry
**What:** QA scribe is only taking 1 screenshot and for the wrong module. It needs to walk through every screen in the built module's lesson flow and capture organized screenshots.
**What needs to happen:**
- [ ] qa-scribe must capture screenshots for: PreListen, Listen, Quiz (each difficulty variant), QuizResults, Reading, LessonComplete
- [ ] Screenshots saved to `notes/melodia/1-daily/build-logs/screenshots/YYYY-MM-DD/module-NNN/` organized by screen name
- [ ] qa-scribe spawn prompt updated to explicitly list each screen to walk through

---

## OPEN — Module type missing culturalNoteVariants for genre-specific notes (from Module 5 build 2026-05-17)
**Source:** ux-builder Wave 3 finding
**What:** Module interface only supports `culturalNote?: string`. Content-builder wrote a reggaeton-variant cultural note (Ivy Queen) for Module 5 that had to be dropped because the schema doesn't support per-genre variants.
**What needs to happen:**
- [ ] Add `culturalNoteVariants?: Partial<Record<GenreTrack, string>>` to Module interface in src/data/modules.ts
- [ ] Wire PreListenScreen to show `culturalNoteVariants[userGenre]` if present, else fall back to `culturalNote`
- [ ] Backfill Module 5 with the Ivy Queen reggaeton variant (text is in module-005-content.ts.draft)

---

## OPEN — Module 5 Song Duration Mismatch (from 2026-05-17 QA) | sim-required

**What:** Module 5's `durationSeconds: 159` (2:39) for "Soy Yo" by Bomba Estéreo. The actual track on streaming is ~3:21 (201 seconds). Off by ~42 seconds.

**Source:** Wave 3 QA scan, modules.ts:674.

**What needs to happen:**
- [ ] Reine verify actual length on Spotify (spotifyId: 4Egb5xP6cniUx0kgZd5zLB) or YouTube (bxWxXncl53U)
- [ ] Update `durationSeconds` in modules.ts:674 if mismatch confirmed
- [ ] Audit Modules 1, 4 durations same way

---

## ~~DONE — Module 5 Audio MP3s Generated~~ ✓ (2026-05-17)

10 MP3s generated via OpenAI TTS tts-1-hd nova (~$0.091). AUDIO_MAP wired in audioPlayer.ts. Committed in 609f957. Conditional reggaeton cue deferred (not mvpRequired).

---

## ~~DONE — Quiz Difficulty Variant Routing~~ ✓ (2026-05-17)

QuizScreen.tsx now reads `onboardingStore.level` and routes: beginner→easyQuizQuestions, intermediate→hardQuizQuestions, some-basics→quizQuestions (default). Fallback to quizQuestions if variant is empty. Committed in 639a5c4. Affects M1, M4, M5.

---

## OPEN — Screenshot Coverage Blocked by Missing Sim Input Tool | infra

**What:** QA scribe cannot tap-navigate the simulator. No `idb`, no XcodeBuildMCP, no AppleScript accessibility access. Bundle builds and home screen renders, but the 8-screen lesson-flow screenshot pass requires manual tap input.

**Source:** Wave 3 QA attempt, 2026-05-17.

**What needs to happen:**
- [ ] Install `idb` (`brew tap facebook/fb && brew install idb-companion && pip install fb-idb`) OR
- [ ] Install XcodeBuildMCP server in Claude's MCP config OR
- [ ] Grant osascript accessibility access in System Settings → Privacy & Security → Accessibility
- [ ] Until then, sim walkthrough is always Reine's job at morning review

---

## OPEN — M14 Song Conflict: Estoy Aquí Now Used by M6 | sim-required

**Source:** M6 build 2026-05-18 — song-validator originally had "Estoy Aquí" (Shakira) booked for M14 (Estar — To Be (Temporary)). M6 (Ser vs Estar) ended up taking it after a mid-flight song churn (Vivir Mi Vida → Estoy Aquí → Vivir Mi Vida → Estoy Aquí). Songs JSON has been restored to reflect M6 = Estoy Aquí.

**What needs to happen:**
- [ ] When M14 enters the build queue, pick a replacement song that exemplifies Estar (temporary states). Candidates: song-validator to propose; do not pre-book here.
- [ ] Update modules.ts id:14 song field accordingly.

---

## OPEN — modules.ts id:9 "La La La" (Shakira) Needs Repurposing | cloud-fixable

**Source:** M7 song validation 2026-05-19. Artist variety conflict surfaced — M6 already uses Shakira ("Estoy Aquí"). M9 currently has "La La La" (Shakira) as a placeholder.

**What needs to happen:**
- [ ] Replace M9's song with a non-Shakira A1-A2 song aligned to "Common Adjectives" (the M9 concept). song-validator to propose options when M9 enters the build queue.
- [ ] Update modules.ts id:9 song field accordingly.

---

## POST-MVP (future, not blocking launch)

- **AI speaking challenge:** Speaking challenge card connects to an AI the user can have a short back-and-forth conversation with in Spanish
- **Social layer:** TikTok/social sharing of lesson completions, streaks, achievements
