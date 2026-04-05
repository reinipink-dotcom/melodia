# Melodia — Build Progress Log

---

## Session 1 — 2026-04-05

### What was built
- Initialized Expo project with TypeScript (`blank-typescript` template)
- Installed all Phase 1 dependencies: React Navigation (bottom tabs + stack), Zustand, AsyncStorage, Inter font, expo-font, expo-splash-screen
- Created full folder structure: `src/screens`, `src/components`, `src/navigation`, `src/constants`, `src/assets`, `src/store`, `src/hooks`
- Design system constants: `colors.ts`, `typography.ts`, `spacing.ts`
- Reusable components: `Button` (primary/outline/ghost), `Card`, `ProgressBar`, `LevelBadge` (A1/A2/B1/B2), `QuizOption` (default/selected/correct/incorrect)
- Navigation: `RootNavigator` (stack) + `TabNavigator` (bottom tabs: Home, Modules, Playlist, Profile)
- Placeholder screens for all 4 tabs
- Mascot images copied to `src/assets/images/`
- Replaced emoji tab icons with clean Ionicons vector icons

### What went wrong / issues hit
- Node.js was not in shell PATH — found it installed via Raycast + nvm; needed `source ~/.nvm/nvm.sh && nvm use 22` prefix for every command
- `create-expo-app` couldn't run in the existing `/melodia` folder (had existing files) — created project in `/melodia-app` subfolder instead
- Expo warned about package version mismatches on first start — fixed with `npx expo install` to pin correct SDK-compatible versions
- A second Expo server was already running on port 8081 — used port 8082

### What's next (Phase 2)
- [ ] Splash screen (Screen 1) — logo + mascot animation
- [ ] Welcome screen (Screen 2)
- [ ] Level selection (Screen 3)
- [ ] Genre selection (Screen 4)
- [ ] Listening platform (Screen 5)
- [ ] Daily goal (Screen 6)
- [ ] Commitment screen (Screen 7) — "Lock in" button
- [ ] Create account screen (Screen 8) — placed after onboarding for conversion
- [ ] Store onboarding choices in AsyncStorage

---
