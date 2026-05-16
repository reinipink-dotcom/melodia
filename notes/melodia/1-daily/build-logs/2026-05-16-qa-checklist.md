# Module 1 QA Checklist — 2026-05-16

> Wave 1 artifact. Owned by QA, Scribe + Notification Agent.
> Wave 3 will execute this checklist and write the final build log.

## Pre-flight status

| Check | Result |
|---|---|
| Booted simulator | iPhone 17 (iOS 26.5, `A7076912-670B-4FD9-A436-DDA5553E3D05`) — Booted |
| Expo Go installed | YES — host.exp.Exponent, Expo-Go-54.0.7 |
| Metro running on 8081 | YES — node PID 44836, started Fri 15 May 18:08:07 2026 (~7h old, fresh today) |
| Screenshot dir | Created — `notes/melodia/1-daily/build-logs/screenshots/2026-05-16/` |

**Pre-flight verdict:** GREEN. No infrastructure blockers. Sim is ready, Expo Go is installed, Metro is alive.

---

## Module 1 target (from app, source of truth = `src/data/modules.ts`)

| Field | Value |
|---|---|
| ID | 1 |
| Title | The Spanish Alphabet |
| Level | A1 |
| Concept | Pronunciation & the 27-letter alphabet |
| Song | Bésame Mucho — Consuelo Velázquez (210s) |
| YouTube ID | `MY0fuEfBmD4` |
| Spotify ID | `6jXSjt2gZkLQ9yEAGOC7CR` |
| Quiz questions | 5 |
| Reading topic | Consuelo Velázquez: The Woman Who Wrote Bésame Mucho at 16 |
| XP reward | 100 |
| Status flag | `'completed'` |

### Discrepancy flagged for build log
- `module-tracker.md` row 8 currently lists Module 1 as song "La Bicicleta" with status "🔄 In Progress". This is **stale/wrong** — the app's Module 1 is "Bésame Mucho" and is marked `'completed'` in code. `module-queue.md` correctly lists Module 1 as `done` (pre-existing).
- **Action in Wave 3:** correct the module-tracker.md Module 1 row to match reality.

---

## QA checklist (run in Wave 3)

### 1. TypeScript / build health
- [ ] `npx tsc --noEmit` exits 0
- [ ] No new TS errors vs. baseline
- [ ] All imports in any Module-1-touched files resolve

### 2. Navigation
- [ ] Modules tab → Module 1 detail loads
- [ ] Module 1 → PreListen renders
- [ ] PreListen → Listen renders, timer starts
- [ ] Listen → Quiz renders (5 questions present)
- [ ] Quiz → QuizResults renders with score + XP
- [ ] QuizResults → Reading renders, passage displays
- [ ] Reading → LessonComplete renders, celebration shows
- [ ] LessonComplete → back to Modules or Home is clean
- [ ] Every screen has a working back/exit path (no dead-ends)

### 3. Quiz states (Module 1 has 5 questions, multiple-choice only)
- [ ] Default option state renders (surface bg)
- [ ] Selected state (coral border)
- [ ] Correct state (teal)
- [ ] Incorrect state (coral)
- [ ] Explanation text shows after submit

### 4. Loading / empty / error
- [ ] No console errors loading Module 1
- [ ] Missing/optional fields handled (Module 1 has only 2 genreSongs: reggaeton + regional-mexican — pop and rnb should fall back to default song)

### 5. Design consistency
- [ ] Uses tokens from `src/constants/` (colors, typography, spacing)
- [ ] No emoji icons (Ionicons only)
- [ ] Typography matches Plus Jakarta Sans / Be Vietnam Pro

### 6. Copyright + legal
- [ ] No full lyrics of Bésame Mucho anywhere in the lesson
- [ ] No large lyric excerpts
- [ ] Reading passage is original (verify against passage text in modules.ts:223-235)
- [ ] No credentials in repo touched today

### 7. Required module additions — Module 1 audit
- [ ] Genre-aware song alternatives — PARTIAL (only reggaeton + regional-mexican; pop and rnb fall back). **Flag for Reine review.**
- [ ] Cultural note — NOT a dedicated field in Module 1; cultural content is embedded in `readingPassage` only. **Flag: missing standalone culturalNote field.**
- [ ] Pronunciation audio cues (`ttsTriggers`) — **NOT PRESENT in Module 1 entry.** Newer Module 4 has this. **Flag: missing for Module 1.**
- [ ] Easy / Standard / Hard quiz variants — **NOT PRESENT** (only flat `quizQuestions` array). **Flag: missing difficulty variants.**
- [ ] `recyclingTargets` — **NOT PRESENT in Module 1 entry.** **Flag: missing.**

### 8. Open bugs from PENDING.md — relevant to Module 1
- [ ] **Module 3 "no quiz available" dead-end** — OPEN. Module 1 has full `quizQuestions`, so it should NOT hit that fallback screen. Verify during walk-through that Module 1 → Quiz does NOT show the fallback. (If it does, that's a P0.)
- [ ] **Timer notification doesn't fire in YouTube Music** — relevant if Listen screen sends a local notification. Cannot fully validate in sim without backgrounding into another app; sim does not have YouTube Music. Note as "not tested in sim."
- [ ] **"¿Dónde jugarán los niños?" wrong YouTube link** — not relevant to Module 1 (Module 1's song is Bésame Mucho). Skip.
- [ ] **TTS voice quality** — relevant if PreListen/Reading screens auto-play TTS. Reine has flagged the robotic voice as unacceptable. Note in build log if encountered, do not block on it.
- [ ] **Song URL / Timer accuracy** — verify the YouTube ID `MY0fuEfBmD4` resolves to a Bésame Mucho recording and that 210s is in the right ballpark. (Cannot verify YT remotely without a fetch; visual check at minimum.)

### 9. Simulator E2E via XcodeBuildMCP
- [ ] Boot iOS Simulator (already booted)
- [ ] Launch Melodia in Expo Go
- [ ] Navigate Modules → Module 1
- [ ] Walk PreListen → Listen → Quiz → QuizResults → Reading → LessonComplete
- [ ] Capture one screenshot per screen to `screenshots/2026-05-16/module-001-{screen}.png`
- [ ] If any screen fails, mark Module 1 "needs revision" and stop

### 10. Mandatory build-log notes (every run, until resolved)
- [ ] Note Module 3 "no quiz available" bug is OPEN per PENDING.md
- [ ] Note module-tracker.md Module 1 row was incorrect (song name) and was corrected this run

---

## Wave 3 deliverables
1. `notes/melodia/1-daily/build-logs/2026-05-16.md` — full daily build log
2. `notes/melodia/1-daily/build-logs/screenshots/2026-05-16/*.png` — sim walk-through evidence
3. `notes/melodia/2-tracking/module-tracker.md` — Module 1 row corrected and gate columns filled
4. `notes/melodia/1-daily/module-queue.md` — Module 1 status confirmed (likely stays `done` or moves to `app-ready` depending on QA result)
5. Message to `team-lead@melodia-module-1` with final summary
