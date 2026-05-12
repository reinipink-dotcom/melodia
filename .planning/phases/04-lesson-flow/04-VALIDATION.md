---
phase: 4
slug: lesson-flow
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-12
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (tsc) — primary correctness gate |
| **Config file** | `tsconfig.json` (strict mode enabled) |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npx expo export --platform ios 2>/dev/null \|\| true` |
| **Estimated runtime** | ~10 seconds |

No automated test suite for Phase 4 — validation is manual device testing via `npx expo start` + Expo Go on physical iPhone.

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` — catches type errors in Module type extensions and nav param types
- **After every screen built:** Hot reload in Expo Go on device — visual check against UI-SPEC.md
- **After lesson flow wired:** Full end-to-end walkthrough: tap "Start Lesson" on Module 1 → complete all 6 screens

---

## Wave 0 — Infrastructure Tasks (must pass before feature tasks)

- [ ] `expo-notifications` installed and `app.json` plugin configured
- [ ] `Module` type extended: `quizQuestions?: QuizQuestion[]`, `readingPassage?: ReadingPassageToken[]`
- [ ] `Song` type extended: `spotifyId?: string`
- [ ] `lessonStore.ts` created with `{ moduleId, phase, notificationId, startedAt }` shape
- [ ] `Button.tsx` and `QuizOption.tsx` font references updated from Inter to BeVietnamPro
- [ ] `LessonNavigator` added to `ModulesNavigator` with correct param types

---

## Per-Screen Validation Checkpoints

### PreListenScreen
- [ ] Module title and CEFR badge display correctly for Modules 1, 2, 3
- [ ] Vocabulary list shows all words with Spanish + English
- [ ] "I'm ready to listen" CTA navigates to ListenScreen

### ListenScreen
- [ ] "Listen on [Platform]" opens correct app (Spotify/Apple Music/YouTube)
- [ ] "I'm listening" starts local notification scheduling
- [ ] Countdown timer starts and shows MM:SS
- [ ] "I'm done listening" navigates to QuizScreen
- [ ] Notification fires after duration and brings user back
- [ ] "I need more time" reschedules notification and re-opens streaming app

### QuizScreen
- [ ] 5 questions display for Module 1
- [ ] Selecting answer shows coral border (selected state)
- [ ] "Check Answer" reveals correct (teal) / incorrect (coral) states
- [ ] Cannot change answer after checking
- [ ] Progress bar advances with each question
- [ ] Final question shows "See My Results" CTA

### QuizResultsScreen
- [ ] Score displays correctly (e.g., "4 out of 5")
- [ ] XP earned matches score multiplier
- [ ] MascotIcon shows bounce animation
- [ ] Reaction message matches score tier

### ReadingScreen
- [ ] Passage renders for Module 1
- [ ] Spanish words appear with coral tint
- [ ] Tapping Spanish word shows tooltip with English translation
- [ ] Tapping outside tooltip dismisses it

### LessonCompleteScreen
- [ ] XP summary matches what was earned
- [ ] Next module preview shows Module 2
- [ ] `progressStore.completeModule()` called on mount — Module 1 marked complete, XP added
- [ ] "Continue to Modules" returns to Modules tab
- [ ] "Add to playlist" shows "coming soon" snackbar

### Navigation
- [ ] Back gesture disabled on screens 2–6
- [ ] "Exit lesson?" confirm dialog appears on back attempt
- [ ] Tab bar hidden during all lesson screens

---

## Lesson Resume Validation
- [ ] Force-quit Melodia mid-lesson
- [ ] Reopen — ListenScreen shows "Ready when you are"
- [ ] Lesson state cleared after LessonComplete

---

## Content Validation (Copyright compliance)
- [ ] No quiz question references specific lyrics
- [ ] All quiz questions test Spanish grammar/vocabulary concepts only
- [ ] All reading passages are original text — no copied content
- [ ] No song audio plays within the app
