# STRUCTURE.md — Directory Layout
Last mapped: 2026-05-12

## Root

```
melodia-app/
├── App.tsx                    # Entry component: font loading, NavigationContainer, RootNavigator
├── index.ts                   # registerRootComponent(App)
├── app.json                   # Expo config (name, slug, orientation, plugins)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── CLAUDE.md                  # Project instructions for Claude Code (62-phase build plan)
├── PROGRESS.md                # Session-by-session build log
├── assets/                    # Static assets (images, icons, splash)
├── src/
│   ├── components/            # Shared UI components
│   ├── constants/             # Design system tokens
│   ├── data/                  # Static curriculum data
│   ├── navigation/            # Navigator definitions
│   ├── screens/               # Screen components organized by feature
│   └── store/                 # Zustand state stores
└── .planning/                 # GSD project management (this directory)
```

## `src/components/`

```
components/
├── Button.tsx       # Primary/outline/ghost button
├── Card.tsx         # Base card container
├── LevelBadge.tsx   # A1/A2/B1/B2 badge with level color
├── MascotIcon.tsx   # Animated coral mascot (default export)
├── ProgressBar.tsx  # Coral fill progress bar
├── QuizOption.tsx   # Quiz answer option (4 states)
└── index.ts         # Barrel export
```

## `src/constants/`

```
constants/
├── colors.ts        # All colors (Colors object)
├── typography.ts    # Pre-typed TextStyle presets (Typography object)
├── spacing.ts       # Spacing + Radius tokens
└── index.ts         # Re-exports Colors, Typography, Spacing, Radius
```

## `src/data/`

```
data/
└── modules.ts       # 1953 lines — all 60 curriculum modules as MODULES[]
                     # Types: CEFRLevel, DisplayLevel, GenreTrack, Module, Song, VocabWord
                     # Functions: getDisplayLevel(), getSongForGenre()
                     # Constants: LEVEL_SECTIONS, FREE_MODULE_LIMIT
```

## `src/navigation/`

```
navigation/
├── RootNavigator.tsx       # Root stack — routes between Onboarding and MainTabs
├── OnboardingNavigator.tsx # 9-screen onboarding stack
├── TabNavigator.tsx        # 4-tab bottom navigator (Home/Modules/Playlist/Profile)
└── ModulesNavigator.tsx    # Modules stack (ModulesList → ModuleDetail)
```

**Type exports:**
- `RootStackParamList` from RootNavigator
- `OnboardingStackParamList` from OnboardingNavigator
- `TabParamList` from TabNavigator
- `ModulesStackParamList` from ModulesNavigator

## `src/screens/`

```
screens/
├── Home/
│   └── HomeScreen.tsx              # Dashboard: greeting, stats, hero card, XP progress, Up Next
├── Modules/
│   ├── ModulesScreen.tsx           # CEFR tabs + module list with lock states
│   └── ModuleDetailScreen.tsx      # Module detail: hero, song, grammar, vocab, reading, XP
├── Onboarding/
│   ├── SplashScreen.tsx            # Fade/scale animation, auto-advances after 2.2s
│   ├── WelcomeScreen.tsx           # Mascot hero + "Get Started"
│   ├── LevelScreen.tsx             # 3-option level selection
│   ├── GenreScreen.tsx             # 4-genre multi-select
│   ├── PlatformScreen.tsx          # Streaming platform radio select
│   ├── GoalScreen.tsx              # Daily goal 2×2 grid
│   ├── ScienceScreen.tsx           # Research cards explaining music+language science
│   ├── CommitmentScreen.tsx        # Hold-to-lock-in button + ripple rings
│   ├── CreateAccountScreen.tsx     # Social auth + email (placeholder)
│   └── components/
│       └── ProgressDots.tsx        # Animated progress pill indicator
├── Playlist/
│   └── PlaylistScreen.tsx          # PLACEHOLDER — "Your learning playlist lives here"
└── Profile/
    └── ProfileScreen.tsx           # PLACEHOLDER + dev "Reset Onboarding" button
```

## `src/store/`

```
store/
├── onboardingStore.ts    # Zustand store for onboarding state + AsyncStorage persistence
└── progressStore.ts      # Zustand store for learning progress + AsyncStorage persistence
```

## Planned Additions (Phase 4)

```
screens/
└── Lesson/
    ├── PreListenScreen.tsx
    ├── ListenScreen.tsx
    ├── QuizScreen.tsx
    ├── QuizResultsScreen.tsx
    ├── ReadingScreen.tsx
    └── LessonCompleteScreen.tsx
```

`ModulesNavigator.tsx` will be extended to add all 6 lesson screens.

## Naming Conventions

- **Screens:** PascalCase + `Screen` suffix, named exports: `export function HomeScreen()`
- **Navigators:** PascalCase + `Navigator` suffix
- **Components:** PascalCase, mostly named exports; `MascotIcon` is default export
- **Stores:** camelCase + `Store` suffix, exported as `useXxxStore`
- **Types/Param lists:** PascalCase + `ParamList` suffix
- **Constants:** SCREAMING_SNAKE for top-level (MODULES, FREE_MODULE_LIMIT, LEVEL_SECTIONS)
- **Style objects:** `styles` (via StyleSheet.create at bottom of each file)
