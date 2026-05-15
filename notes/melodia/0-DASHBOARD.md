# Melodia Dashboard

> **Your daily home page.** Open this first when you sit down with Melodia.

---

## 🎯 Today

| Question | File |
|---|---|
| What's the next module to build? | [Module Queue](1-daily/module-queue.md) |
| What did the agents build last night? | [Build Logs](1-daily/build-logs/) (look for today's date) |
| What needs my review? | Check the latest build log → "Pending Reine review" section |
| What did I think about yesterday's lesson? | [Reine's Feedback Journal](1-daily/reine-feedback.md) |
| Random thought I need to capture? | [Inbox](1-daily/inbox.md) |

---

## 📂 The Vault — what each file is for and who owns it

This vault has 6 top-level areas. **You actively write to 2 files** (`reine-feedback.md` and `inbox.md`). Everything else is either agent-written (you read it) or rarely changes (reference docs).

### `0-DASHBOARD.md` (this file)
- **Owner:** Shared — you read it; `melodia-qa-scribe` agent updates the "Today" pointers after each run.
- **You touch it:** rarely — only if you want to add custom quick links.
- **What it is:** Your home page. Daily quick links, file index, ownership map.

---

### `1-daily/` — what you touch every day

| File | Owner | Description | You write here? |
|---|---|---|---|
| `module-queue.md` | `melodia-orchestrator` + `melodia-qa-scribe` (agents) | The list of upcoming modules with status (`pending` → `in-progress` → `app-ready` → `done`). Agents flip status as runs complete. | Only to reorder priorities |
| `reine-feedback.md` | **YOU** | STRUCTURED notes about lessons you've reviewed. Per-module entries with what you liked, didn't like, and what to do differently. Agents read this at Wave 0 of the next run to improve. | ✅ YES — daily |
| `inbox.md` | **YOU** | UNSTRUCTURED quick captures. Free-form thoughts, bugs, ideas, reminders. Dump fast, triage later. | ✅ YES — anytime |
| `build-logs/{YYYY-MM-DD}.md` | `melodia-qa-scribe` | Daily build report — what was built, QA results, what needs your review, blockers, tomorrow's target. | ❌ READ ONLY |
| `build-logs/screenshots/` | `melodia-qa-scribe` | Simulator screenshots captured during QA. | ❌ READ ONLY |

**How to use `reine-feedback.md` vs `inbox.md`:**

> **`reine-feedback.md`** answers *"How did the agents do on the lesson I just reviewed?"* — bounded scope, per-module, written each morning after your simulator walk-through.
>
> **`inbox.md`** answers *"What's on my mind about Melodia right now?"* — unbounded, anything, anywhere, anytime. Triage later.

---

### `2-tracking/` — auto-updated, mostly read-only for you

| File | Owner | Description | You write here? |
|---|---|---|---|
| `module-tracker.md` | `melodia-qa-scribe` | 60-module progress matrix. ✅ / ❌ / ⏳ per quality gate per module. | ❌ READ ONLY (unless you want to flag something manually) |
| `audio-cost-log.csv` | `melodia-voice-engineer` | Every audio file generated, with char count + cost. Helps you watch OpenAI spend. | ❌ READ ONLY |
| `worklog/PENDING.md` | **YOU** (initially) + agents flag | Open bugs / off-plan items not yet in the queue. Move items out when resolved. | ✅ Occasionally |
| `worklog/SESSION.md` | `melodia-orchestrator` | Per-session activity log. | ❌ READ ONLY |

---

### `3-reference/` — rarely changes, agents read for context

| File | Owner | Description | You write here? |
|---|---|---|---|
| `agent-team-launch-prompt.md` | Locked spec (Reine ✕ Claude) | The canonical Melodia agent team brief. Source of truth for how the team operates. | Only when reshaping the team itself |
| `style-guide.md` | `melodia-qa-scribe` (appends approved patterns) + **YOU** can edit | Accumulating list of approved lesson copy patterns, tone rules, banned mistakes. Content-builder reads before writing. | ✅ Occasionally |
| `team-learnings.md` | `melodia-qa-scribe` | Auto-appended each run with what worked / didn't work. Orchestrator reads at Wave 0. | ❌ READ ONLY |
| `curriculum-full.md` | **YOU** (extracted from `melodia-curriculum.docx`) | Plain-text dump of the 60-module curriculum. Curriculum-architect reads for context. | Rarely |
| `codex-scope.md` | Shared (you + Claude) | Documents which files Codex CLI (GPT-5.5) is allowed to touch vs which Claude owns. | Rarely |

---

### `4-debug/` — Codex handoff workspace

| File | Owner | Description | You write here? |
|---|---|---|---|
| `README.md` | Static doc | Describes the Claude → Codex → Claude debug handoff workflow. | Rarely |
| `{date}-{bug-slug}.md` | `Claude → Codex → Claude` (sequential) | Bug report files. Claude writes the report; Codex appends the fix; Claude verifies. | ❌ Usually agent-only |
| `resolved/` | Claude (after verifying) | Archived resolved bug reports. | ❌ READ ONLY |

---

### `5-lessons/` — auto-populated lesson content drafts

| File | Owner | Description | You write here? |
|---|---|---|---|
| `module-{NNN}-content.ts.draft` | `melodia-content-builder` | Lesson content draft — vocab, quiz, reading passage, etc. | ❌ READ ONLY |
| `module-{NNN}-tts.json` | `melodia-voice-engineer` | Narration manifest — text scripts for OpenAI TTS. | ❌ READ ONLY |
| `curriculum/module-{NNN}-spec.md` | `melodia-curriculum-architect` | Curriculum direction spec per module. | ❌ READ ONLY |
| `songs/module-{NNN}-songs.json` | `melodia-song-validator` | Song validation outputs (primary + genre alternatives). | ❌ READ ONLY |

---

## 🤖 Agent owner glossary

When a file says its owner is one of these, here's who that is:

- **`melodia-orchestrator`** — Team lead. Coordinates the 6 specialists during `/melodia` and `/melodia-cloud` runs.
- **`melodia-curriculum-architect`** — Validates CEFR fit, vocab progression, cultural notes, spaced repetition.
- **`melodia-song-validator`** — Picks songs, validates copyright safety, produces genre-aware alternatives.
- **`melodia-content-builder`** — Writes lesson content (concept, vocab, quiz variants, reading passage, narration scripts).
- **`melodia-ux-builder`** — Writes the actual React Native code that wires lesson data into the app.
- **`melodia-voice-engineer`** — Defines TTS narration manifests; generates .mp3 files when API key is available.
- **`melodia-qa-scribe`** — Runs all QA checks, simulator walk-through, writes daily build logs, updates trackers.

---

## ⚡ Slash commands

Run these from any Claude Code session in this project:

| Command | What it does | When to use |
|---|---|---|
| `/melodia` | Local full pipeline — content + code + audio + simulator. ~20-40 min. | When you're at your Mac and want a complete lesson built end-to-end. |
| `/melodia-cloud` | Cloud variant — skips simulator + audio (deferred to Mac). Commits dated branch, pushes, emails recap. Runs auto at 11pm WAT. | Scheduled — usually not invoked manually. |
| `/melodia-audio` | Generates .mp3 files from a narration manifest using local OpenAI key. ~30 sec. | In the morning after the cloud agent ran, to fill in the audio. |
| `/handoff-codex` | Writes a structured bug report and tells you to switch to Codex CLI to fix. | When Claude has been stuck on a bug after 2 attempts. |

---

## 🌙 Scheduled overnight build

- Runs at **11pm WAT (22:00 UTC)** every day (weekdays + weekends).
- Routine ID: `trig_01Ve3N9XiczEEFpoWfRp5Z14`
- Manage at: https://claude.ai/code/routines/trig_01Ve3N9XiczEEFpoWfRp5Z14
- Output: a branch `melodia/daily-{YYYY-MM-DD}` on GitHub + a Gmail recap to you.

Your morning ritual:
1. Check Gmail for the build recap
2. Open this dashboard → check today's build log
3. Run `/melodia-audio` to fill in audio
4. `git checkout melodia/daily-{date}` → simulator walk-through
5. Write feedback in `1-daily/reine-feedback.md`
6. Merge to main + push
7. Done. Day's lesson is App Ready.
