# Melodia

## What This Is

Melodia is a mobile Spanish learning app that teaches through real music. Users work through a structured 60-module curriculum (A1–B2) where each module is tied to a real song — they learn grammar and vocabulary concepts, deep-link to the song on their streaming platform, take a quiz on Spanish concepts (never lyrics), and read original cultural context passages about the artist. Think "Spotify meets Duolingo."

Built with React Native + Expo by Reine, a first-time developer building in public on TikTok.

## Core Value

The 6-screen lesson loop: a complete, satisfying learning cycle tied to a real song that users actually want to listen to.

## Requirements

### Validated

- ✓ Expo + React Native project with TypeScript, New Architecture enabled — Phase 1
- ✓ Design system constants (colors, typography, spacing) — Phase 1
- ✓ Reusable components (Button, Card, ProgressBar, LevelBadge, QuizOption, MascotIcon) — Phase 1
- ✓ Bottom tab navigation (Home / Modules / Playlist / Profile) — Phase 1
- ✓ 9-screen onboarding flow with AsyncStorage persistence — Phase 2
- ✓ Zustand state: onboardingStore (level, genres, platform, dailyGoal, isComplete) — Phase 2
- ✓ Home dashboard with streak, XP, module progress, hero card — Phase 3
- ✓ Modules screen with CEFR tabs, lock states, 60-module list — Phase 3
- ✓ Module detail screen (song info, grammar, vocab, XP preview) — Phase 3
- ✓ Zustand state: progressStore (currentModuleId, completedModuleIds, totalXP, streak) — Phase 3
- ✓ Static 60-module curriculum data (src/data/modules.ts) — Phase 3

### Active

- [ ] 6-screen lesson loop (PreListen → Listen → Quiz → Results → Reading → Complete)
- [ ] Deep links to Spotify / Apple Music / YouTube from Listen screen
- [ ] Countdown timer on Listen screen tied to song duration
- [ ] Quiz system: 3–5 multiple choice questions on Spanish concepts, not lyrics
- [ ] Quiz scoring: correct/incorrect visual states, XP calculation
- [ ] Reading comprehension screen with tappable Spanish words
- [ ] Lesson complete celebration with XP summary and next module preview
- [ ] Progress store updates on lesson completion (currentModuleId advance, XP award)
- [ ] Modules 1, 2, and 3 with real vocab, quiz questions, and reading passages
- [ ] LessonNavigator wired into ModulesNavigator

### Out of Scope

- Supabase backend — Phase 5 (keeping data local for now)
- RevenueCat paywall — Phase 6
- Spotify playlist creation — Phase 7 ("Add to playlist" is a stub in Phase 4)
- Push notifications / spaced repetition — Phase 8
- Achievements, full profile screen — Phase 9
- PostHog analytics / A/B testing — Phase 10
- Embedded music playback — prohibited by Spotify TOS and Melodia's own design
- Song lyrics display — copyright violation, non-negotiable

## Context

- **Where we are:** Phases 1–3 complete. Phase 4 (lesson flow) is the next build. This is the core product — everything before it was scaffolding.
- **Font change:** App uses Plus Jakarta Sans (Bold/ExtraBold) + Be Vietnam Pro (400/500/600). Not Inter as originally planned. `Button.tsx` still references Inter — will need cleanup.
- **Data approach:** All 60 modules live as a static TypeScript array (`MODULES[]` in `src/data/modules.ts`). No API calls until Phase 5 (Supabase).
- **Free tier:** `FREE_MODULE_LIMIT = 8` — modules 1–8 are free, 9–60 require subscription.
- **Genre awareness:** `getSongForGenre(module, genre)` selects the right song based on onboarding choice with fallback logic.

## Constraints

- **Copyright:** Never display song lyrics or large excerpts. Quiz questions must test Spanish concepts, not song content. Reading passages must be 100% original.
- **Legal:** No embedded music playback. Deep links only ("Listen on Spotify").
- **Platform:** Apple In-App Purchase required for all subscription revenue — RevenueCat in Phase 6.
- **Privacy:** Must include privacy policy, restore purchase button, and account deletion option for App Store.
- **Stack:** React Native + Expo only. No ejecting. EAS for builds and submission.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Plus Jakarta Sans + Be Vietnam Pro (not Inter) | Better visual hierarchy; Inter wasn't loading correctly in Phase 1 | ✓ Good |
| Zustand over React Context | Simpler persistence pattern with AsyncStorage middleware | ✓ Good |
| Static TypeScript module data (no API) | Fastest path to working app; Supabase added in Phase 5 | — Pending |
| Genre-aware song selection with fallback | Users pick genre in onboarding; lesson experience should match | ✓ Good |
| Modules 1–3 get real content in Phase 4 | Better than just Module 1 — gives enough to evaluate the loop | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-11 after initialization*
