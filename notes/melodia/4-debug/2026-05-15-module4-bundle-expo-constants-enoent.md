# 2026-05-15 — Metro bundler ENOENT: expo-constants (Module 4 verification blocker)

## Status
Module 4 content wiring complete and TypeScript-clean. Simulator launch blocked by a pre-existing node_modules issue unrelated to Module 4.

## What works
- `npx tsc --noEmit` exits 0 (clean).
- Runtime data shape verified by transpiling src/data/modules.ts → /tmp and `require`-ing it:
  - id 4, status `unlocked`, all 4 genres in genreSongs, 4 standard + 3 easy + 3 hard quiz questions (all 4-option), 13 reading tokens, 769-char culturalNote, 17 ttsTriggers, 3 recyclingTargets with intervalDays arrays.
- iOS Simulator booted: iPhone 17 (A7076912-670B-4FD9-A436-DDA5553E3D05).
- Expo dev server on :8081 responds 200 on `/status`.

## What fails
`curl -s 'http://localhost:8081/index.bundle?platform=ios&dev=true&hot=false'` returns HTTP 500:

```
Metro has encountered an error: ENOENT: no such file or directory,
open '/Users/reinebadejoko/Desktop/app/melodia-app/node_modules/expo/node_modules/expo-constants/package.json'
```

## Root cause (likely)
Stale npm install state. `node_modules/expo/node_modules/` contains `expo-asset`, `expo-file-system`, `expo-keep-awake` etc. but is **missing** `expo-constants`. The top-level `node_modules/expo-constants/package.json` does exist — Metro just isn't finding it through Expo's nested resolution path.

Predates Module 4 work — no edits made to package.json, node_modules, or expo config in this session.

## Recommended fix (needs approval — touches node_modules)
One of:
1. `rm -rf node_modules package-lock.json && npm install` — full clean reinstall.
2. `npm install` (no clean) — may repair the nested resolution.
3. `npx expo install --check` — Expo's own dependency repair.

## Two-attempt rule
Not retrying. Stopping per role spec — reporting to team-lead before touching dependencies.

## Update — authorized repair attempts (2026-05-15 ~18:05)
Team-lead authorized two attempts.

**Attempt 1:** `npx expo install --check` → only reports outdated version mismatches (`expo@54.0.33` → `~54.0.34`, `expo-linking@8.0.11` → `~8.0.12`); does not repair node_modules. Bundle still 500s with same error.

**Attempt 2:** `npm install` → "up to date, audited 786 packages". No-op. `node_modules/expo/node_modules/expo-constants` still does NOT exist. Bundle still 500s.

## Deeper diagnosis after the two attempts
- `node_modules/expo/package.json` declares `expo-constants: ~18.0.13` as a direct dependency.
- `node_modules/expo/node_modules/` contains REAL nested copies of expo-asset, expo-file-system, expo-keep-awake — but NOT expo-constants. The nesting is selective/inconsistent.
- `node_modules/expo-constants/` exists at top-level and is valid.
- The running Metro process (PID 67560, started May 6 with `--clear --port 8081`) has been alive 9+ days. Its in-memory resolver expects the nested path.
- Likely root cause: a partial npm install ran at some point while the dev server held handles, leaving an inconsistent on-disk hoist state for one package. `npm install` won't fix it because the lockfile considers the state correct.

## Blocked next steps (require Reine approval)
- `rm -rf node_modules && npm install` — full reinstall. Will fix the hoist state but is the explicitly-forbidden action.
- Kill the long-running Metro (PID 67560) and `expo start --clear` — Reine's dev server, user-visible kill.
- Symlink workaround: `ln -s ../../expo-constants node_modules/expo/node_modules/expo-constants` — surgical, reversible, but still a node_modules write.

Escalating to team-lead.

## Files modified this session
- /Users/reinebadejoko/Desktop/app/melodia-app/src/data/modules.ts (Wave 2 type extensions + Wave 3 Module 4 content)
