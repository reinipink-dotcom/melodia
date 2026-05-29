# Module Lock Bypass

## Problem
Resetting the app clears persisted progress and returns the module list to early learner defaults. `ModulesScreen` then computes lock state from `currentModuleId`, so later modules become greyed out and inaccessible during lesson production/testing.

## Plan
- Keep existing completion/active visual states.
- Disable sequence locks while Melodia is in builder mode.
- Hide the provisional Pro upsell banner while module production needs free navigation.
- Preserve the old lock/paywall logic behind constants so it can be restored in Phase 6.

## Validation
- Run TypeScript check.
- Inspect the diff for unintended changes.
