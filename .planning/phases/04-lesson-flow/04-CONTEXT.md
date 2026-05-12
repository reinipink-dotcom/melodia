# Phase 4: Lesson Flow - Context

**Gathered:** 2026-05-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete 6-screen lesson loop: PreListen → Listen → Quiz → QuizResults → Reading → LessonComplete. Must be playable end-to-end for Modules 1, 2, and 3 with real content. This is the core product loop — the thing that makes Melodia worth using.

</domain>

<decisions>
## Implementation Decisions

### Content Authoring (Modules 1–3)
- **D-01:** Claude generates real quiz questions for Modules 1, 2, and 3 — actual Spanish grammar/vocabulary questions tied to each module's concept (e.g., ser/estar, present tense, gender agreement). NOT placeholders. NOT testing lyrics.
- **D-02:** Claude generates original reading passages for Modules 1, 2, and 3 — 100–200 words each, about the artist or cultural context. 100% original, never copied from external sources.
- **D-03:** Content lives inline in `src/data/modules.ts` — add `quizQuestions[]` and `readingPassage` fields to the existing `Module` type. Consistent with how `vocabulary[]` already works. No separate content files.
- **D-04:** Reading passages are pre-tokenized — stored as an array of `{ text: string, isSpanish: boolean, english?: string }` tokens in modules.ts, not parsed at runtime. Claude authors them in tokenized form.

### Timer & Listen Flow
- **D-05:** Timer uses `expo-notifications` (local notification scheduled at the moment user taps "I'm listening"). Live Activity / Dynamic Island persistent bar is deferred to Phase 8 (retention features).
- **D-06:** Timer duration = song's `durationSeconds` from module data. Default to 210 seconds (3.5 min) if field is missing.
- **D-07:** When notification fires → user lands on **ListenScreen** showing "Time's up! Ready to quiz?" with a prominent quiz CTA. Not directly on QuizScreen — the explicit prompt is intentional.
- **D-08:** "I need more time" on that prompt → reschedule notification for +2 more minutes AND deep-link back to the streaming platform they used.
- **D-09:** If user never taps notification and opens Melodia manually → **resume from ListenScreen** showing "Ready when you are" with quiz CTA prominent. Lesson state must persist across app restarts (store active lesson in progressStore or a dedicated lessonStore).
- **D-10:** Lesson state to persist: `{ moduleId, phase: 'listening' | 'quiz' | 'reading' | 'complete', notificationId?, startedAt }`. Cleared on LessonComplete.

### Claude's Discretion
- **Navigator structure:** Claude decides how LessonNavigator connects to existing ModulesNavigator. Likely: extend ModulesNavigator stack with lesson screens (no separate navigator root needed for Phase 4). Pass `moduleId` as route param through the stack.
- **In-app countdown display:** The visual countdown shown inside Melodia's ListenScreen while user is still in-app (before they switch to Spotify). Claude designs this using Animated API.
- **Animation library:** React Native `Animated` API for Phase 4. `react-native-reanimated` is installed but defer its introduction to a later phase to avoid complexity.
- **XP scoring formula:** Claude decides the score → XP multiplier (suggested: 100%/80%/60%/40% of module.xpReward based on 5/4/3/0-2 correct).

### Deferred to Phase 8
- Live Activity / Dynamic Island persistent countdown bar while in external app
- Streak tracking and daily reminder notifications

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` — All Phase 4 requirement IDs (PRE-01–03, LISTEN-01–05, QUIZ-01–06, RESULTS-01–04, READ-01–04, COMPLETE-01–05, NAV-01–03, CONTENT-01–05)
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria (7 success criteria)

### UI Design Contract
- `.planning/phases/04-lesson-flow/04-UI-SPEC.md` — All 6 screen layouts, copywriting contract, animation contracts, interaction contracts. MUST read before planning any screen task.

### Codebase — State & Navigation
- `src/store/progressStore.ts` — `completeModule(id, xp)` already implemented. Phase 4 adds lesson resume state.
- `src/store/onboardingStore.ts` — `platform` field determines which streaming app to deep-link to.
- `src/navigation/ModulesNavigator.tsx` — Entry point for lesson flow (LessonNavigator attaches here).

### Codebase — Data
- `src/data/modules.ts` — `Module` type, `MODULES[]`, `vocabulary[]`, `grammarPoints[]`. Phase 4 adds `quizQuestions[]` and `readingPassage[]` fields to `Module` type and populates them for Modules 1–3.

### Codebase — Existing Components
- `src/components/QuizOption.tsx` — 4-state quiz answer component (default/selected/correct/incorrect). Use as-is.
- `src/components/MascotIcon.tsx` — Animated mascot for QuizResultsScreen and LessonCompleteScreen.
- `src/components/Button.tsx`, `Card.tsx`, `ProgressBar.tsx` — All usable in Phase 4 screens.

### Legal Constraints (non-negotiable)
- `CLAUDE.md` §"Critical Legal & Copyright Rules" — Never display lyrics, quiz must test Spanish concepts not song content, all reading passages must be 100% original, no embedded music playback.

</canonical_refs>

<specifics>
## Specific Implementation Notes

- `expo-notifications` needs to be installed (`npx expo install expo-notifications`) — not yet in package.json.
- Deep link format for Spotify: `spotify:track:{trackId}` — the `song` object in modules.ts should have or add a `spotifyId` field, or fall back to `https://open.spotify.com/search/{title}`.
- `expo-linking` is already installed for deep links.
- Back gesture must be disabled on ListenScreen, QuizScreen, QuizResultsScreen, ReadingScreen, LessonCompleteScreen. Exit only via confirm dialog ("Exit lesson? Progress won't be saved.").

</specifics>

<deferred>
## Deferred Ideas

- Live Activity / Dynamic Island persistent countdown bar — Phase 8
- Streak freeze mechanic — Phase 8
- Shareable lesson complete card — Phase 9
- Multiple quiz formats (fill-in-blank, translation typing) — post-Phase 4
- Confetti cannon on LessonComplete — Phase 11 Polish

</deferred>

---

*Phase: 04-lesson-flow*
*Context gathered: 2026-05-12 via /gsd-discuss-phase*
