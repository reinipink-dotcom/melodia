# STACK.md — Technology Stack
Last mapped: 2026-05-12

## Runtime & Language

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ~5.9.2 |
| Framework | React Native | 0.81.5 |
| Platform | Expo SDK | ~54.0.33 |
| Runtime | Node.js | 22 (via nvm) |
| Architecture | New Architecture | Enabled (`newArchEnabled: true` in app.json) |

## Navigation

- `@react-navigation/native` ^7.2.2 — NavigationContainer, useNavigation, RouteProp
- `@react-navigation/stack` ^7.8.9 — Stack navigators (Onboarding, Modules)
- `@react-navigation/bottom-tabs` ^7.15.9 — Main tab bar
- `react-native-screens` ~4.16.0 — Native screen optimization
- `react-native-gesture-handler` ~2.28.0 — Required peer for navigation

## State Management

- `zustand` ^5.0.12 — Two stores, both persisted via AsyncStorage:
  - `src/store/onboardingStore.ts` — onboarding choices (level, genres, platform, dailyGoal, isComplete)
  - `src/store/progressStore.ts` — learning progress (currentModuleId, completedModuleIds, totalXP, streak)
- `@react-native-async-storage/async-storage` 2.2.0 — persistence layer

## UI & Animations

- `@expo/vector-icons` ^15.1.1 — Ionicons exclusively (no emoji icons)
- `expo-linear-gradient` ~15.0.8 — Hero cards, gradients
- `expo-haptics` ~15.0.8 — Impact and notification feedback throughout
- `react-native-safe-area-context` ~5.6.0 — SafeAreaView on all screens
- `react-native-reanimated` ~4.1.1 — **Installed but not yet used** (reserved for Phase 4+)
- React Native `Animated` API — Used for all current animations (MascotIcon bounce/pulse, CommitmentScreen hold progress, ripple rings)

## Fonts

Loaded at app root via `useFonts()` in `App.tsx`:
- `@expo-google-fonts/plus-jakarta-sans` — PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold
- `@expo-google-fonts/be-vietnam-pro` — BeVietnamPro_400Regular, BeVietnamPro_500Medium, BeVietnamPro_600SemiBold
- `@expo-google-fonts/inter` ^0.4.2 — **Installed but fonts not loaded in App.tsx** (legacy from Phase 1, Button.tsx still references Inter)
- `expo-font` ~14.0.11 — Font loading infrastructure

## Utilities

- `expo-linking` ~8.0.12 — Deep linking to Spotify/Apple Music/YouTube (planned for Phase 4)
- `expo-splash-screen` ~31.0.13 — Splash screen management
- `expo-status-bar` ~3.0.9 — Status bar control

## Build & Config

- `app.json` — Expo config, slug: `melodia-app`, portrait orientation, iOS + Android + Web
- `tsconfig.json` — Strict TypeScript
- `index.ts` — Entry point via `registerRootComponent(App)`
- `package.json` main: `index.ts`

## Planned (Not Yet Installed)

| Package | Purpose | Phase |
|---------|---------|-------|
| `expo-notifications` | Timer + push notifications | Phase 4 |
| `expo-av` | Lesson complete sound effect | Phase 4 |
| `react-native-confetti-cannon` | Lesson complete celebration | Phase 4 |
| Supabase client | Auth + database | Phase 5 |
| RevenueCat | In-app subscriptions | Phase 6 |
| Spotify Web API client | Playlist creation | Phase 7 |
| PostHog | Analytics + A/B testing | Phase 10 |
