# CONCERNS.md — Technical Debt & Issues
Last mapped: 2026-05-12

## High Priority

### 1. Start Lesson CTA Is a No-Op
**File:** `src/screens/Modules/ModuleDetailScreen.tsx:157`
**Issue:** "Start Lesson" button has no `onPress` — it navigates nowhere. This is the core product loop.
**Planned fix:** Phase 4 — wire to `PreListenScreen` via `ModulesNavigator`.

### 2. Placeholder Screens
**Files:** `src/screens/Playlist/PlaylistScreen.tsx`, `src/screens/Profile/ProfileScreen.tsx`
**Issue:** Both screens show placeholder text only. Profile has a dev-only reset button.
**Planned fix:** Phase 7 (Playlist), Phase 9 (Profile).

### 3. Inter Font Loaded but Never Used in App.tsx
**File:** `App.tsx`, `src/components/Button.tsx:74`
**Issue:** `@expo-google-fonts/inter` is installed, but no Inter variants are loaded in `App.tsx`. `Button.tsx` references `fontFamily: 'Inter_500Medium'` which will silently fall back to system font.
**Fix:** Either add `Inter_500Medium` to `useFonts()` in App.tsx, or update Button.tsx to use BeVietnamPro.

### 4. No Streaming Links in Module Data
**File:** `src/data/modules.ts`
**Issue:** Modules have `song.title` and `song.artist` but no Spotify track IDs, Apple Music URLs, or YouTube URLs. The listen screen (Phase 4) needs these for deep links.
**Planned fix:** Add `streamingLinks: { spotify?: string; appleMusic?: string; youtube?: string }` to each module's song before Phase 4 build.

### 5. `levelColor()` Duplicated in 3 Files
**Files:** `HomeScreen.tsx:31`, `ModulesScreen.tsx:23`, `ModuleDetailScreen.tsx:26`
**Issue:** Identical `levelColor()` helper copied across files. Transition levels (A1-A2, A2-B1, B1-B2) fall through to `default: Colors.coral` which may show wrong color.
**Fix:** Extract to `src/utils/levelColor.ts` and import.

## Medium Priority

### 6. No Error Boundaries
**Issue:** Any runtime crash in a screen will crash the whole app with a red screen. No `<ErrorBoundary>` wrappers anywhere.
**Recommended:** Add at RootNavigator level before launch.

### 7. Large Static Data File
**File:** `src/data/modules.ts` (1953 lines)
**Issue:** Entire 60-module curriculum is a single static TS file. Fine for now, but queries scan all 60 entries. No lazy loading.
**Future concern:** When Supabase is added (Phase 5), modules should move to the database. The static file becomes the seed data.

### 8. Onboarding `isComplete` Gate Is Fragile
**File:** `src/navigation/RootNavigator.tsx:16`
**Issue:** `isComplete` is set to `true` by `completeOnboarding()` in `CreateAccountScreen`. But CreateAccountScreen is a placeholder — it doesn't actually create an account yet. Users can tap "Skip" and bypass auth entirely. This is intentional for now but needs gating before launch.

### 9. No Input Validation on CreateAccount
**File:** `src/screens/Onboarding/CreateAccountScreen.tsx`
**Issue:** Placeholder screen — no actual auth flow, no email validation, no error handling.

### 10. Dev-Only Reset Button Exposed
**File:** `src/screens/Profile/ProfileScreen.tsx:27`
**Issue:** `🔄 Reset Onboarding (Dev)` button is visible in production builds. Must be removed or gated behind `__DEV__` before App Store submission.

## Low Priority

### 11. `ProgressDots` Component Not Type-Safe
**File:** `src/screens/Onboarding/components/ProgressDots.tsx`
**Issue:** `current` prop is not validated against `total`. No compile-time check that current ≤ total.

### 12. `genreSongs` Sparsely Populated
**File:** `src/data/modules.ts`
**Issue:** Most modules only have 1-2 genre overrides. The `getSongForGenre()` fallback always returns the primary song for missing genres. Genre personalization is partially implemented but not fully populated for all 60 modules.

### 13. Expo SDK Version Mismatch Warnings
**Issue:** `expo@54.0.33` (installed) vs `~54.0.34` (expected). `expo-linking@8.0.11` vs `~8.0.12`. Minor patch versions behind — no functional impact but worth updating before TestFlight.

### 14. `worktrees/` Directories in `.claude/`
**Files:** `.claude/worktrees/blissful-tesla/`, `.claude/worktrees/loving-lichterman-6e4fb7/`, etc.
**Issue:** Multiple git worktree artifacts from previous Claude Code sessions. These contain old versions of the codebase and consume disk space. Safe to clean up.

## Security

### 15. Spotify Credentials in CLAUDE.md
**File:** `CLAUDE.md` (committed)
**Issue:** CLAUDE.md has placeholder fields for Spotify Client ID and Secret. The actual credentials must go in `.env` (gitignored), not in any committed file.

### 16. AsyncStorage Not Encrypted
**Issue:** Onboarding choices and progress data stored in plain AsyncStorage. Acceptable for non-sensitive data (preferences, XP, streak), but note that when Supabase auth tokens are added (Phase 5), they should use a secure store.
