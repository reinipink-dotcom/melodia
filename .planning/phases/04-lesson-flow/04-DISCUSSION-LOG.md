# Phase 4: Lesson Flow — Discussion Log

**Date:** 2026-05-12
**Areas discussed:** Real content (Modules 1–3), Timer & Listen flow

---

## Area: Real Content for Modules 1–3

| Question | Options | Selected |
|----------|---------|----------|
| Who writes quiz questions? | Claude generates / Placeholder now / I'll write them | Claude generates |
| Who writes reading passages? | Claude generates / Placeholder now / I'll write them | Claude generates |
| Where does content live? | Inline in modules.ts / Separate files per module / You decide | Inline in modules.ts |

**Notes:** Content pre-tokenized in modules.ts. Claude authors quizQuestions[] and readingPassage[] for Modules 1–3 during execution.

---

## Area: Timer & Listen Flow

**User described the intended experience:**
> User deep-links to Spotify/Apple Music. A persistent bar (like a Dynamic Island notification) shows while they're in the other app with a countdown. When timer ends, a notification prompts "Ready to quiz?" User taps back to Melodia. If they need more time, it deep-links back and resets.

| Question | Options | Selected |
|----------|---------|----------|
| Timer approach | Local notification now, Live Activity later / Live Activity in Phase 4 | Local notification now |
| Notification tap destination | Straight to quiz / Back to ListenScreen with prompt | ListenScreen with prompt |
| If app reopened manually | Resume from ListenScreen / Restart from beginning / You decide | Resume from ListenScreen |

**Deferred:** Live Activity / Dynamic Island → Phase 8 (retention features).

---

## Areas Not Discussed (Claude's Discretion)

- Navigator structure — Claude nests LessonNavigator in ModulesNavigator stack
- Reading passage rendering — Pre-tokenized array in modules.ts
- Animation library — Animated API (not Reanimated) for Phase 4
