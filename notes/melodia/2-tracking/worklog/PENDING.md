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

## OPEN — Quiz Navigation Dead-End (Modules 1-3)

**What happened:** When navigating to a module with no quiz yet, "no quiz available" screen has no back button — user gets stuck.

**Location:** `src/screens/Lesson/QuizScreen.tsx:78-86` — bare Text with no exit route.

**What needs to happen:**
- [ ] Add a "Back to Modules" button on the no-quiz fallback screen
- [ ] Verify: can navigate back to Modules tab cleanly after hitting this state
- [ ] Check Modules 1, 2, 3 all trigger this — Module 1 now has quizQuestions so may not hit it anymore

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

## POST-MVP (future, not blocking launch)

- **AI speaking challenge:** Speaking challenge card connects to an AI the user can have a short back-and-forth conversation with in Spanish
- **Social layer:** TikTok/social sharing of lesson completions, streaks, achievements
