# Module Lock Bypass Summary

## Completed
- Confirmed locks were being computed in `src/screens/Modules/ModulesScreen.tsx`, not from missing module data.
- Added builder-mode constants:
  - `MODULE_SEQUENCE_LOCKS_ENABLED = false`
  - `PRO_UPSELL_ENABLED = false`
- Updated module status resolution so incomplete modules remain tappable as `unlocked` during production/testing.
- Hid the provisional Pro upsell banner while random module access is needed.

## Validation
- `npx tsc --noEmit` passed.

## Why It Happened
App resets clear the persisted Zustand/AsyncStorage progress back to defaults (`currentModuleId: 2`, `completedModuleIds: [1]`). The Modules screen then used that default progress to re-lock anything beyond the next available free module. This was correct for a learner progression model, but bad for building and testing the 60-module curriculum.
