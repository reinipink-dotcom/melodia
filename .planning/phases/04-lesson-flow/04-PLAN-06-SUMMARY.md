---
plan: "04-06"
phase: "04-lesson-flow"
status: complete
completed: "2026-05-13"
self_check: PASSED
---

# Plan 06 Summary: Lesson Flow — Polish & Fixes

All 11 tasks complete across 4 waves. Wave 1 (BUG-01, BUG-02) was committed in the prior session. Waves 2–4 executed in this session.

## What Was Built

### Wave 1 (prior session)
- **BUG-01**: Fixed QuizScreen score double-count (removed redundant +1 in advance())
- **BUG-02**: Fixed LessonCompleteScreen navigation via navigation.popToTop()

### Wave 2 — UX Polish
- **UX-01**: Added "Your song is done!" message + "I need more time" option when timer expires (phase='done')
- **UX-02**: "Listen on [Platform]" now auto-starts the timer — no separate "I'm listening" tap needed; demoted to ghost "I'm already listening" link
- **UX-03**: QuizOption animates on reveal: correct answer pops (spring scale 1→1.06→1), incorrect shakes (horizontal X translation sequence); "Correcto ✓" / "Incorrecto ✗" toast fades in/holds/fades out below the question
- **UX-04**: Notification permission denial tracked in notifDenied state; subtle Mist-colored hint appears below timer linking to iOS Settings

### Wave 3 — Content Quality
- **CONTENT-01**: Module 1 quiz questions fully rewritten to tie to "Bésame Mucho" — B/V blend, accent on é, syllable count of bésame, U=oo in mucho, meaning of mucho
- **CONTENT-02**: Module 1 reading passage single-letter tokens (b, v, h) replaced with full Spanish words: bésame, llorar, hablar — each with English translation and phonetic guide
- **CONTENT-03**: Added `youtubeId` to Song type; populated for Modules 1–3 (MY0fuEfBmD4, rDGgUGBD-90, 3H9dN5Na8JI); streaming.ts builds direct watch URLs instead of search queries

### Wave 4 — TTS Audio
- **ARCH-01**: Installed expo-speech. Created `src/utils/speech.ts` (speakSpanish + stopSpeech). Speaker button on each PreListenScreen vocab row speaks the Spanish word at 0.85 rate, es locale. Cleanup on unmount.
- **ARCH-02**: Tapping a Spanish word in ReadingScreen now auto-plays pronunciation. Tooltip shows replay speaker icon. Dismissing tooltip stops speech.

## Key Files Changed

- `src/screens/Lesson/ListenScreen.tsx` — UX-01/02/04
- `src/screens/Lesson/QuizScreen.tsx` — UX-03 toast
- `src/components/QuizOption.tsx` — UX-03 animations
- `src/screens/Lesson/PreListenScreen.tsx` — ARCH-01 speaker buttons
- `src/screens/Lesson/ReadingScreen.tsx` — ARCH-02 TTS tooltip
- `src/data/modules.ts` — CONTENT-01/02/03, youtubeId
- `src/utils/streaming.ts` — youtubeId direct URL support
- `src/utils/speech.ts` — new TTS utility

## Self-Check

- [x] npx tsc --noEmit → 0 errors
- [x] Quiz score correct (Wave 1 fix)
- [x] "Continue to Modules" navigates correctly (Wave 1 fix)
- [x] Timer expiry shows "Your song is done!" + Continue to Quiz CTA
- [x] Tapping "Listen on Platform" auto-starts timer
- [x] Quiz animations: pop on correct, shake on incorrect, toast appears/fades
- [x] Module 1 quiz questions all reference Bésame Mucho
- [x] No single-letter isSpanish tokens in Module 1 reading passage
- [x] YouTube opens direct video for Modules 1–3
- [x] Speaker on PreListenScreen vocab cards speaks Spanish
- [x] Tapping word in ReadingScreen plays pronunciation
