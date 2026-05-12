# REQUIREMENTS.md — Melodia v1

## v1 Requirements (Phase 4: Lesson Flow)

### Pre-Listening Screen

- [ ] **PRE-01**: User sees the module's core grammar concept explained in 2–3 plain sentences
- [ ] **PRE-02**: User sees 3–5 vocabulary words to listen for, each with English translation
- [ ] **PRE-03**: User can tap "I'm ready to listen" to advance to the Listen screen

### Listen Screen

- [ ] **LISTEN-01**: User sees the song title and artist name
- [ ] **LISTEN-02**: User can tap "Listen on [Platform]" to deep-link to their chosen streaming app (Spotify / Apple Music / YouTube Music / YouTube)
- [ ] **LISTEN-03**: A countdown timer starts after user taps a "I'm listening" or equivalent CTA
- [ ] **LISTEN-04**: Timer duration is based on the song's approximate length (from module data)
- [ ] **LISTEN-05**: User can tap "I'm done listening" to end timer early and advance to quiz

### Quiz Screen

- [ ] **QUIZ-01**: User is presented with 3–5 multiple choice questions on Spanish grammar or vocabulary
- [ ] **QUIZ-02**: Questions test Spanish concepts only — never reference specific lyrics (copyright compliance)
- [ ] **QUIZ-03**: Selected answer shows visual selection state (coral border via QuizOption component)
- [ ] **QUIZ-04**: After answer confirmed, correct answer shows teal state and incorrect shows coral incorrect state
- [ ] **QUIZ-05**: User advances through all questions sequentially before seeing results
- [ ] **QUIZ-06**: User cannot change answer after confirming

### Quiz Results Screen

- [ ] **RESULTS-01**: User sees score as fraction (e.g., "4 out of 5 correct")
- [ ] **RESULTS-02**: User sees XP earned for this lesson (based on score multiplier)
- [ ] **RESULTS-03**: MascotIcon shows animated reaction
- [ ] **RESULTS-04**: User can tap "Continue" to advance to Reading screen

### Reading Comprehension Screen

- [ ] **READ-01**: User sees an original passage (100–200 words) about the artist or cultural context
- [ ] **READ-02**: Spanish words are tappable — tapping shows an English translation tooltip/modal
- [ ] **READ-03**: English/Spanish ratio is level-appropriate (A1 = mostly English, B2 = mostly Spanish)
- [ ] **READ-04**: User can tap "Continue" to advance to Lesson Complete

### Lesson Complete Screen

- [ ] **COMPLETE-01**: User sees celebration screen with XP earned this lesson
- [ ] **COMPLETE-02**: User sees a preview of the next module
- [ ] **COMPLETE-03**: Progress store updates: currentModuleId advances, completedModuleIds includes this module, totalXP increases
- [ ] **COMPLETE-04**: "Add to playlist" button visible (stub — full implementation Phase 7)
- [ ] **COMPLETE-05**: User can navigate to Home or Modules

### Navigation & Wiring

- [ ] **NAV-01**: LessonNavigator (or inline in ModulesNavigator) connects all 6 lesson screens in sequence
- [ ] **NAV-02**: Lesson flow is entered from ModuleDetailScreen "Start lesson" button
- [ ] **NAV-03**: Back navigation is disabled or handled gracefully during active lesson (no accidental exits)

### Content

- [ ] **CONTENT-01**: Module 1 has real vocabulary list, 5 quiz questions, and an original reading passage
- [ ] **CONTENT-02**: Module 2 has real vocabulary list, 5 quiz questions, and an original reading passage
- [ ] **CONTENT-03**: Module 3 has real vocabulary list, 5 quiz questions, and an original reading passage
- [ ] **CONTENT-04**: All quiz questions test Spanish concepts (grammar/vocab), never song lyrics
- [ ] **CONTENT-05**: All reading passages are 100% original — not copied from any external source

---

## v2 Requirements (Deferred)

- Progress sync to Supabase — Phase 5
- Paywall gate at module 9 — Phase 6
- Real Spotify playlist creation from "Add to playlist" — Phase 7
- Push notification triggered by lesson completion — Phase 8
- Spaced repetition review quiz (different song, same concepts) — Phase 8
- Streak freeze / recovery mechanics — Phase 8
- Shareable lesson complete card — Phase 9
- Achievements system — Phase 9

---

## Out of Scope

- Displaying song lyrics (any length) — copyright violation, non-negotiable
- Quiz questions that reference specific words sung in the song — copyright risk
- Embedded audio playback — Spotify TOS prohibits this; app design uses deep links only
- Multiple quiz formats (fill-in-blank, translation typing) in Phase 4 — multiple choice only for v1, other types Phase 4+
- Offline lesson caching — not needed until user base established

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| PRE-01 to PRE-03 | 4 | Planned |
| LISTEN-01 to LISTEN-05 | 4 | Planned |
| QUIZ-01 to QUIZ-06 | 4 | Planned |
| RESULTS-01 to RESULTS-04 | 4 | Planned |
| READ-01 to READ-04 | 4 | Planned |
| COMPLETE-01 to COMPLETE-05 | 4 | Planned |
| NAV-01 to NAV-03 | 4 | Planned |
| CONTENT-01 to CONTENT-05 | 4 | Planned |
