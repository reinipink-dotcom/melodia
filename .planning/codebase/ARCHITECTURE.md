# ARCHITECTURE.md — System Design & Patterns
Last mapped: 2026-05-12

## Pattern

React Native single-page app with conditional stack-based routing. No server-side rendering, no API routes. All state is client-side, persisted locally. Backend integration is planned (Phase 5) but not yet present.

## Navigation Tree

```
App.tsx
└── NavigationContainer
    └── RootNavigator (Stack)
        ├── Onboarding (OnboardingNavigator — Stack)
        │   ├── Splash
        │   ├── Welcome
        │   ├── Level
        │   ├── Genre
        │   ├── Platform
        │   ├── Goal
        │   ├── Science            ← new in Session 2
        │   ├── Commitment
        │   └── CreateAccount
        └── MainTabs (TabNavigator — Bottom Tabs)
            ├── Home (HomeScreen)
            ├── Modules (ModulesNavigator — Stack)
            │   ├── ModulesList (ModulesScreen)
            │   └── ModuleDetail (ModuleDetailScreen)
            ├── Playlist (PlaylistScreen)       ← placeholder
            └── Profile (ProfileScreen)         ← placeholder + dev reset button
```

**Routing logic:** `RootNavigator` checks `useOnboardingStore().isComplete` on mount. If complete → MainTabs, else → Onboarding. State loaded from AsyncStorage before first render (`loadOnboardingState()`).

## State Architecture

Two Zustand stores, both persisted to AsyncStorage:

### `onboardingStore.ts`
- Tracks user's choices during onboarding flow
- Key: `@melodia_onboarding`
- Fields: `level`, `genres[]`, `platform`, `dailyGoal`, `isComplete`
- `isComplete = true` after CreateAccount screen → triggers route to MainTabs

### `progressStore.ts`
- Tracks learning progress in main app
- Key: `@melodia_progress`
- Fields: `currentModuleId` (default: 2), `completedModuleIds` (default: [1]), `totalXP` (default: 100), `streak` (default: 3), `lastActivityDate`
- `completeModule(id, xp)` → updates all fields + persists

## Data Layer

### `src/data/modules.ts` (1953 lines)
The entire 60-module curriculum lives as a static TypeScript constant `MODULES: Module[]`. No API call. Key types:
- `CEFRLevel` — `'A1' | 'A1-A2' | 'A2' | 'A2-B1' | 'B1' | 'B1-B2' | 'B2'`
- `DisplayLevel` — `'A1' | 'A2' | 'B1' | 'B2'` (what tabs show)
- `GenreTrack` — `'pop' | 'reggaeton' | 'rnb' | 'regional-mexican'`
- `Module` — id, title, level, song, genreSongs, vocabulary, grammarPoints, quizTypes, readingTopic, readingRatio, xpReward
- `getDisplayLevel(level)` — maps transition levels to display tab
- `getSongForGenre(module, genre)` — genre-aware song selection with fallback

`FREE_MODULE_LIMIT = 8` — modules 1-8 free, 9-60 require subscription.

## Component Architecture

### Design System Constants (`src/constants/`)
- `colors.ts` — Single source of truth for all colors (tonal hierarchy pattern)
- `typography.ts` — Pre-typed TextStyle objects (display, h1, h2, label, body, bodyMedium, caption)
- `spacing.ts` — Spacing + Radius token sets
- `index.ts` — Re-exports all three

### Reusable Components (`src/components/`)
- `Button` — primary/outline/ghost variants, disabled/loading states
- `Card` — base card wrapper
- `ProgressBar` — coral fill on surface track
- `LevelBadge` — A1/A2/B1/B2 with level-appropriate color
- `QuizOption` — default/selected/correct/incorrect states
- `MascotIcon` — animated coral circle with music note (bounce + 3 pulse rings)

### Screen Pattern
Every screen uses:
- `SafeAreaView` from `react-native-safe-area-context` with `edges={['top']}`
- `StatusBar barStyle="light-content"`
- Styles via `StyleSheet.create()` at bottom of file
- Direct color/typography references (no theme context)

## Lesson Flow (Phase 4 — Not Yet Built)

The core product loop, 6 screens planned:
1. **PreListenScreen** — concept explanation + vocab preview
2. **ListenScreen** — song card + "Open in [platform]" deep link + countdown timer
3. **QuizScreen** — 5 multiple choice questions on Spanish concepts
4. **QuizResultsScreen** — score, XP earned with multipliers
5. **ReadingScreen** — original passage, tappable Spanish words
6. **LessonCompleteScreen** — confetti + XP summary + next module preview

These will live under `src/screens/Lesson/` and be added to `ModulesNavigator`.

## Font Loading

All fonts loaded synchronously in `App.tsx` via `useFonts()`. App renders a coral `ActivityIndicator` on midnight background until fonts are ready. No font fallback — app won't render until all 5 font variants load.
