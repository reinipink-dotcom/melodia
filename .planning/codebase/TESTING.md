# TESTING.md — Test Structure & Practices
Last mapped: 2026-05-12

## Current State

**No tests exist.** Zero test files in the codebase. No test framework installed. No CI configuration.

This is expected at this stage — the project is being built as an MVP by a solo developer prioritizing speed to ship.

## What's Missing

- No unit tests for utility functions (`getDisplayLevel`, `getSongForGenre`, `levelColor`)
- No component tests for shared components
- No store tests for Zustand store actions
- No integration tests for navigation flows
- No E2E tests

## Manual Testing Approach (Current)

Testing is done manually via Expo Go on a physical iPhone:
- `npx expo start --clear --port 8081` → scan QR code
- TypeScript is used as the primary correctness check: `npx tsc --noEmit`
- Visual inspection on device

## Recommended Future Testing Stack

When testing is introduced (Phase 11: Polish & Testing):

| Layer | Tool | Why |
|-------|------|-----|
| Unit | Jest + ts-jest | Standard React Native setup |
| Components | @testing-library/react-native | Screen rendering tests |
| E2E | Maestro or Detox | Flow testing on device/simulator |
| TypeScript | `tsc --noEmit` | Already in use, catches type errors |

## High-Value Test Targets (When Added)

1. `getDisplayLevel()` — maps transition levels correctly
2. `getSongForGenre()` — falls back to primary song when genre has no override
3. `resolveStatus()` in ModulesScreen — locked/unlocked/active/completed logic
4. `RootNavigator` routing — onboarding complete → MainTabs, incomplete → Onboarding
5. `completeModule()` in progressStore — XP addition, currentModuleId advance, AsyncStorage write
6. Quiz scoring logic (Phase 4) — accuracy %, XP multiplier calculation

## TypeScript as Safety Net

TypeScript strict mode catches most logic errors during development:
- Navigation param type mismatches
- Missing required module fields
- Wrong color references
- Store action signature mismatches

Run before every commit: `npx tsc --noEmit`
