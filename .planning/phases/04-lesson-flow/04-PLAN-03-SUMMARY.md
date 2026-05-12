---
phase: "04"
plan: "03"
subsystem: screens-prelisten-listen
tags: [screens, timer, notifications, deep-link, animations]
key-files:
  created: []
  modified:
    - src/screens/Lesson/PreListenScreen.tsx
    - src/screens/Lesson/ListenScreen.tsx
    - src/constants/colors.ts
    - src/constants/typography.ts
    - src/store/onboardingStore.ts
    - src/store/progressStore.ts
key-decisions:
  - Added missing design tokens (surfaceContainer/surfaceHigh/surfaceHighest/outlineVariant, bodyMedium/label) to constants before building screens — these were referenced in ModuleDetailScreen (from Plan 01) but absent from the branch
  - Copied onboardingStore.ts and progressStore.ts from main workspace (untracked files) — needed by ProfileScreen and ListenScreen
  - platformIconName() return type cast with React.ComponentProps<typeof Ionicons>['name'] to satisfy strict Ionicons prop typing
  - Task 3 (sanity check) confirmed no-op: App.tsx line 43 already calls useLessonStore.getState().loadLessonState() on mount
requirements-completed: [PRE-01, PRE-02, PRE-03, LISTEN-01, LISTEN-02, LISTEN-03, LISTEN-04, LISTEN-05, NAV-03]
duration: "~20 min"
completed: "2026-05-12"
---

# Phase 4 Plan 03: PreListenScreen + ListenScreen Summary

Both lesson screens fully implemented, replacing placeholders. TypeScript passes with zero errors.

## What Was Built

### PreListenScreen (`src/screens/Lesson/PreListenScreen.tsx`)
- LinearGradient hero card displaying `module.title` and `module.conceptDescription`
- Level badge with accent color (teal A1, coral A2, amber B1, lavender B2)
- Vocabulary list — each word rendered in a surfaceContainer card with colored dot, Spanish word, and English translation
- Android BackHandler + confirm exit Alert dialog (completes lesson and pops to top)
- Coral gradient CTA "I'm ready to listen" navigates to ListenScreen
- Step indicator "1 of 6" in nav bar

### ListenScreen (`src/screens/Lesson/ListenScreen.tsx`)
- Song card with album art placeholder, title, artist, and "Listen on [Platform]" deep-link button
- Platform label and icon driven by `onboardingStore.platform` via `platformLabel()` / `platformIconName()`
- Animated countdown progress bar (`Animated.timing` + `useNativeDriver: false`)
- `formatTime()` MM:SS display that ticks down via `setInterval`
- Three-phase UI: **idle** (shows "I'm listening" CTA) → **running** (shows "I'm done listening" + "I need more time") → **done** (shows "Continue to Quiz")
- "I'm listening" tap: requests notification permission, schedules `expo-notifications` local notification at `song.durationSeconds` delay, stores notification ID and `timerStartedAt` in lessonStore
- "I'm done listening": cancels pending notification, fires success haptic, transitions to done phase
- "I need more time (+2 min)": cancels notification, reschedules +120s, reopens streaming app via deep link
- AppState 'active' listener recalculates remaining time from `timerStartedAt` when user returns from Spotify/Apple Music
- Vocab reminder chips (first 3 vocab words) shown below timer
- BackHandler + confirm exit dialog (same pattern as PreListenScreen)

### Prerequisite Fix (committed separately)
- `src/constants/colors.ts` — added `surfaceContainer`, `surfaceHigh`, `surfaceHighest`, `outlineVariant`; corrected `midnight` to `#111125`
- `src/constants/typography.ts` — added `bodyMedium` (BeVietnamPro_500Medium) and `label` (BeVietnamPro_600SemiBold, uppercase, letter-spacing); replaced Inter_ font families with BeVietnamPro equivalents throughout
- `src/store/onboardingStore.ts` — copied from main workspace (was untracked)
- `src/store/progressStore.ts` — copied from main workspace (was untracked)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| prereq | 7e577dc | fix(04-03): add missing design tokens and store files |
| 1 | 5385a21 | feat(04-03): build PreListenScreen |
| 2 | becdb2f | feat(04-03): build ListenScreen with timer + notifications |

## Deviations from Plan

**[Prerequisite - Added] Missing design tokens** — Found during: pre-task verification | Issue: `Colors.surfaceContainer/surfaceHigh/surfaceHighest/outlineVariant` and `Typography.bodyMedium/label` referenced by plan code and ModuleDetailScreen but not defined in constants | Fix: added all tokens to colors.ts and typography.ts, also updated font families from Inter to BeVietnamPro across typography.ts | Commit: 7e577dc

**[Rule 1 - Bug Fix] Ionicons type cast** — Found during: Task 2 TypeScript check | Issue: `platformIconName()` returns `'logo-spotify' | 'musical-note' | 'logo-youtube'` but Ionicons `name` prop has a very large union that doesn't include these strings directly | Fix: cast via `React.ComponentProps<typeof Ionicons>['name']` | Files: ListenScreen.tsx

**Total deviations:** 1 prerequisite + 1 type fix. Both positive — no regressions.

## Self-Check

- [x] `npx tsc --noEmit` → 0 errors
- [x] PreListenScreen renders module title, conceptDescription, and vocabulary list
- [x] PreListenScreen CTA navigates to ListenScreen with moduleId
- [x] ListenScreen shows song title, artist, platform button
- [x] ListenScreen timer starts on "I'm listening" tap
- [x] ListenScreen schedules expo-notifications on timer start
- [x] ListenScreen "I need more time" reschedules +120s + reopens streaming
- [x] ListenScreen AppState sync recalculates time on foreground return
- [x] Both screens have BackHandler + confirm exit dialog
- [x] Task 3 no-op confirmed: App.tsx loadLessonState() already on mount (line 43)

## Self-Check: PASSED
