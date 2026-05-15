---
status: complete
---
# Quick Task 260516-0nw — Summary

## What was implemented

expo-av (~16.0.8, SDK 54 compatible) was installed and wired into the Module 4 lesson flow. A new `src/utils/audioPlayer.ts` module wraps expo-av Sound with expo-speech fallback. Three lesson screens were updated to use pre-recorded MP3s when a matching ttsTrigger exists, and fall back to expo-speech for all other cases.

## Files changed

| File | Change |
|------|--------|
| `src/utils/audioPlayer.ts` | **Created** — `playTrigger(trigger)` + `stopAudio()`, static AUDIO_MAP for all 17 Module 4 MP3s, expo-speech fallback on missing key or load error |
| `src/screens/Lesson/PreListenScreen.tsx` | Import audioPlayer; vocab speaker taps use matching normal-version ttsTrigger; KEY PHRASE row gets speaker button; stopAudio() added to cleanup |
| `src/screens/Lesson/QuizScreen.tsx` | Import audioPlayer; "Hear pero vs perro" pill on question 1 (module 4 only) plays contrast-perro-slow then vocab-pero-slow with 1400ms gap via setTimeout; stopAudio() + clearTimeout in cleanup |
| `src/screens/Lesson/ReadingScreen.tsx` | Import audioPlayer; `handleTokenTap()` helper checks reading ttsTriggers first; token taps and tooltip speaker both use it; stopAudio() in BackHandler cleanup and modal overlay dismiss |
| `package.json` / `package-lock.json` | expo-av ~16.0.8 added to dependencies |

## TypeScript status

`npx tsc --noEmit` — **clean, zero errors** after every edit and in final check.

## Deviations from plan

- **expo-av version:** Plan specified ~15.0.x; `npx expo install` resolved to ~16.0.8 (the Expo SDK 54 compatible version at install time). No impact — API surface used (`Audio.Sound.createAsync`, `unloadAsync`) is identical.
- **ReadingScreen BackHandler cleanup:** Plan said add `stopAudio()` to "the BackHandler useEffect return (line 53)". The actual line was 53 in the original but shifted to 54 after inserting `handleTokenTap`. Applied to the correct location regardless.
- **Modal overlay stopSpeech:** Plan mentioned calling `stopAudio()` "instead of / in addition to `stopSpeech()`" — both are called (stopSpeech for expo-speech, stopAudio for expo-av), which is the safer choice.

## Commit

`6e79f36` — feat(audio): wire Module 4 expo-av playback with expo-speech fallback
