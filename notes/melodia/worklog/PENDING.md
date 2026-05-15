# Off-Plan Pending Work

> Items here are unfinished off-plan changes that need to be completed.
> Remove an item ONLY when it is fully done and working in the app.
> This file persists across sessions — it is never wiped.

---

## ~~DONE — Curriculum Enrichment Wired~~ ✓ (2026-05-13)

`getEnrichment()` now imported and called in PreListenScreen + LessonCompleteScreen.
- PreListenScreen shows: `speakingGoal` in hero card, `listeningSkill` tip box, `phraseChunk/speakingPattern` key phrase block, `survivalPhrases` (modules 1–12)
- LessonCompleteScreen shows: `miniChallenge` speaking challenge card (coral left-border card between XP and Next Module)
- `curriculum-enrichment.ts` still needs to be committed (untracked in git)

---

## OPEN — TTS Voice Quality

**What happened:** Reine tested the TTS (expo-speech) on PreListenScreen and ReadingScreen and found the robotic voice unacceptable. Wants a human-sounding AI voice instead.

**What was discussed:** Looking into ElevenLabs or similar TTS API to replace expo-speech. Needs API key integration. Decision not made — flagged as a larger project.

**What needs to happen:**
- [ ] Research options: ElevenLabs, OpenAI TTS, Google Cloud TTS — compare voice quality, cost, latency, React Native compatibility
- [ ] Decision: replace expo-speech with API-based TTS OR keep expo-speech for now and revisit in Phase 11 polish
- [ ] If replacing: implement in Phase 4 polish or create a Phase 4.5 task

---

## OPEN — Song URL / Timer Accuracy

**What happened:** Reine asked whether the countdown timer matches the actual song length for the embedded YouTube/streaming links.

**What needs to happen:**
- [ ] Audit: are song durations in modules.ts accurate to the actual song?
- [ ] Fix any mismatches (at minimum Modules 1–3 which are in active use)

---

## OPEN — Bug: Preposition Module Quiz Navigation Loop

**What happened:** Reine found a bug — when navigating to a module that has no quiz yet, the "no quiz available" screen doesn't allow going back to the Modules list. Gets stuck.

**What needs to happen:**
- [ ] Reproduce: go to the Prepositions module, hit "Start Lesson", see "no quiz available"
- [ ] Fix: add a working back/exit button on that fallback screen
- [ ] Verify: can navigate back to Modules tab cleanly

---

## OPEN — Wrong Song URL (Dónde Jugarán los Niños)

**What happened:** Reine found the YouTube Music link for "Dónde Jugarán los Niños" by Maná was wrong/missing.

**What needs to happen:**
- [ ] Find correct YouTube ID for "Dónde Jugarán los Niños" by Maná
- [ ] Update `youtubeId` in the relevant module entry in `modules.ts`

---
