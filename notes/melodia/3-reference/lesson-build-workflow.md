# Melodia Lesson Production — Workflow Reference

> **One-line version:** `main` is always the source of truth. Both paths read from it and write back to it. Never let a feature branch sit unmerged past 11pm WAT.

---

## The Two Paths

| | Path A: You build it | Path B: Cloud builds it |
|---|---|---|
| **Trigger** | You type `/melodia 5` | Nightly at 11pm WAT (auto) |
| **Who runs it** | Your Mac, local session | Anthropic cloud, clones `main` |
| **Simulator** | Yes — QA agent uses XcodeBuildMCP | No — skipped in cloud |
| **Audio MP3s** | You run `/melodia-audio` after | You run `/melodia-audio` next morning |
| **Result** | Branch on your working branch | Branch `melodia/daily-YYYY-MM-DD` |
| **Notification** | You see it in terminal | ntfy push to iPhone + Gmail draft |
| **Your action after** | Verify in simulator → merge to main | Morning checklist (see below) |

Both paths use the same 6-agent team structure and the same quality gates. The difference is timing, environment, and who does the simulator step.

---

## Module Status Lifecycle

Every module moves through these statuses in order. **Only you can advance a module past `needs-review`.**

```
pending → building → needs-review → app-ready
              ↑                         ↑
         (auto, during run)        (you, after sim walkthrough)
```

| Status | Meaning | Who sets it |
|---|---|---|
| `pending` | Not yet built, ready to pick up | You (initial) or orchestrator clears blockers |
| `building` | Actively being worked on by agents | Orchestrator (start of run) |
| `needs-review` | Build complete, needs your sim walkthrough | Orchestrator or QA agent (end of run) |
| `app-ready` | You verified it works, lesson is live | **You only** |
| `done` | Shipped before this queue existed (Modules 1–3) | Legacy |
| `blocked` | Missing something — credentials, decision, etc. | You or orchestrator |

> **Rule:** Never manually set a module to `pending` to force a rebuild. Fix the real issue first, then reset status.

---

## Path A: You Build It (`/melodia`)

### Before you type anything
- [ ] Your working branch is merged to `main` and pushed (if you built anything in a prior session)
- [ ] `module-queue.md` on `main` reflects accurate statuses
- [ ] `inbox.md` is ready for the session (can be empty)

### What happens automatically
1. **Session Start Protocol** — reads `inbox.md` + `PENDING.md`
2. **Wave 0** — orchestrator triages feedback, writes un-addressable items to `PENDING.md`, picks target module
3. **Wave 1** — curriculum, song validation, data model discovery (parallel)
4. **Gate 1** — curriculum + song approved before content is written
5. **Wave 2** — lesson content + data structures (parallel)
6. **Gate 2** — content complete, copyright safe, no full lyrics
7. **Wave 3** — app code wired, TypeScript checked, simulator walk-through via XcodeBuildMCP
8. QA agent updates `PROGRESS.md`, build log, module tracker
9. Module status → `needs-review` in queue
10. Commit to current working branch

### What you do after
- [ ] **Run `/melodia-audio`** — generates MP3s from the TTS manifest (~30 sec)
- [ ] **Boot simulator, walk through** `PreListen → Listen → Quiz → Results → Reading → LessonComplete`
- [ ] If it passes: update module status to `app-ready` in `module-queue.md`
- [ ] **Merge your working branch to `main` and push**
- [ ] Check PENDING.md — if any newly-unblocked items exist, fix them now under normal permissions

> **Critical:** Do not go to sleep or close the session without merging to `main`. The cloud routine runs at 11pm WAT and clones fresh from `main`. If your work isn't on `main`, the cloud agent won't see it.

---

## Path B: Cloud Builds It (Nightly, 11pm WAT)

### Pre-conditions (your responsibility before 11pm)
- [ ] All today's local work is merged to `main` and pushed
- [ ] Module queue on `main` is accurate — completed modules are `app-ready`, not `needs-review`
- [ ] `inbox.md` is cleared (or contains only items you want the cloud agent to see)
- [ ] Repo is public (temporary limitation — cloud can't access private repos yet)

### What happens automatically
1. **Pre-flight phase** — reads `PENDING.md`, fixes `cloud-fixable` items (data fixes, content fixes, no sim needed, no API keys), commits to `main`
2. **Module pick** — reads `module-queue.md`, picks first `pending` module
3. **Wave 0** — orchestrator reads `reine-feedback.md`, triages feedback to PENDING.md, builds plan
4. **Wave 1** — curriculum, song validation, data model discovery (parallel)
5. **Gate 1** — curriculum + song approved
6. **Wave 2** — lesson content + data structures (parallel)
7. **Gate 2** — content complete, copyright safe
8. **Wave 3** — app code wired, TypeScript checked (NO simulator — skipped in cloud)
9. Voice engineer writes TTS manifest to `notes/melodia/5-lessons/module-NNN-tts.json` — no MP3s generated (no API keys in cloud)
10. Module status → `needs-review` in queue
11. Commit + push to `melodia/daily-YYYY-MM-DD` branch
12. **ntfy push** to your iPhone
13. **Gmail draft** with full recap in your Drafts folder

### Your morning checklist (after the notification)
- [ ] Read the Gmail draft — check what was built, what failed, any blockers
- [ ] **Run `/melodia-audio`** — reads the TTS manifest, generates MP3s (~30 sec)
- [ ] **Pull the branch** — `git fetch && git checkout melodia/daily-YYYY-MM-DD`
- [ ] **Boot simulator, walk through** the new module end-to-end
- [ ] If it passes: update module status to `app-ready` in `module-queue.md`
- [ ] **Merge branch to `main` and push** before tonight's run
- [ ] Check if any PENDING.md items were fixed by the pre-flight — mark them `~~DONE~~`

---

## The Golden Rules

These are the non-negotiables. Today's mess happened because all of them were broken at once.

### 1. Main is always the source of truth
The cloud agent clones `main`. If your work isn't on `main`, it doesn't exist as far as the cloud is concerned. Merge before you sleep.

### 2. Merge before 11pm WAT — every day
This is the hard deadline. If you're mid-feature, commit what you have, merge it, push it. Incomplete but committed is better than complete but local.

### 3. Module queue reflects reality at all times
If a module is done, mark it `app-ready`. If it's blocked, mark it `blocked`. Never let `needs-review` sit for more than 24 hours — it will cause the next run to re-pick the wrong module.

### 4. Never hardcode a module target in the queue file
The orchestrator always picks the **first `pending` module**. Notes like "Module 4 is the first production target" are landmines — the cloud agent reads them literally.

### 5. Pre-flight before building
Both paths triage PENDING.md before touching lesson content. The cloud routine's pre-flight phase handles cloud-fixable bugs. Local runs handle everything (including sim-required fixes).

### 6. Audio is always a two-step process
The cloud can't generate MP3s (no API keys). Voice engineer always writes the TTS manifest only. You always run `/melodia-audio` on your Mac to materialize the audio files. This is by design and will not change until audio is moved to a separate cloud step.

---

## Pre-flight Fix Protocol

### What "cloud-fixable" means
A PENDING item is `cloud-fixable` if it requires NO simulator, NO API keys, and NO destructive git operations. Examples:
- Fix a TypeScript error in a data file
- Correct a wrong `spotifyId` or `youtubeId`
- Add a missing quiz question
- Fix a navigation dead-end in code (if it's a data issue, not a screen issue)
- Update module queue statuses

### What is NOT cloud-fixable
- Anything that requires the iOS simulator to verify
- Anything that requires an API key (OpenAI, ElevenLabs, Spotify)
- Any PR merge or destructive git operation
- Screen layout or visual bugs

### How to mark items in PENDING.md
Add a tag in the item header so the cloud agent knows what to attempt:
```
## OPEN — [short title] | cloud-fixable
## OPEN — [short title] | sim-required
## OPEN — [short title] | blocked:api-key
```

The cloud routine pre-flight phase reads `cloud-fixable` items only. Everything else is left for your next local session.

---

## Branch Protocol

### For local builds
- Work on a named feature branch (e.g. `melodia-agent-team-phase4`)
- At end of session: merge to `main`, push `main`, push your branch
- Tomorrow: continue on same branch or create a new one — doesn't matter, as long as `main` is always current

### For cloud builds
- Cloud always creates `melodia/daily-YYYY-MM-DD`
- You pull it in the morning, verify, merge to `main`
- Old daily branches can be deleted after merging — they're just daily snapshots

### The merge-to-main checklist (both paths)
- [ ] TypeScript passes (`npx tsc --noEmit`)
- [ ] Module status updated in `module-queue.md`
- [ ] Audio files committed (either from local or `/melodia-audio` run)
- [ ] Build log committed to `notes/melodia/1-daily/build-logs/`
- [ ] No secrets or API keys in the diff

---

## What Needs to Change (Action Items)

These are gaps in the current system that caused today's problems. They are not yet fixed.

| Item | What | How | Priority |
|---|---|---|---|
| Cloud routine pre-flight | Add PENDING.md pre-flight phase to the cloud routine prompt | Update routine via `RemoteTrigger` | **High — do before next nightly run** |
| Cloud routine module pick logic | Currently picks first non-`done` module — should pick first `pending`, skipping `needs-review` and `app-ready` | Update routine prompt | **High** |
| PENDING.md tags | Add `cloud-fixable` / `sim-required` / `blocked:reason` tags to all open items | Edit `PENDING.md` | Medium |
| Private repo access | Cloud can't access private repos — temporary workaround is keeping repo public | Anthropic platform limitation — monitor for fix | Low (workaround in place) |
| Auto-queue update after cloud build | Cloud routine should mark module `needs-review` in queue and commit that change before pushing branch | Already in routine prompt — verify it's working after next run | Medium |

---

## Quick Reference: Who Does What

| Action | You | Cloud routine | Agent team (local) |
|---|---|---|---|
| Pick next module | — | ✓ auto | ✓ auto |
| Triage inbox + feedback | — | ✓ auto (Wave 0) | ✓ auto (Wave 0) |
| Fix `cloud-fixable` PENDING items | — | ✓ auto (pre-flight) | ✓ auto |
| Fix `sim-required` PENDING items | ✓ manual | — | ✓ auto |
| Build lesson content | — | ✓ auto | ✓ auto |
| Wire lesson into app code | — | ✓ auto | ✓ auto |
| Run TypeScript check | — | ✓ auto | ✓ auto |
| Simulator walk-through | — | ✗ not available | ✓ auto (XcodeBuildMCP) |
| Generate TTS manifest | — | ✓ auto | ✓ auto |
| Generate audio MP3s | ✓ `/melodia-audio` | ✗ no API keys | ✓ if OPENAI_API_KEY set |
| Mark module `app-ready` | ✓ manual | ✗ never | ✗ never |
| Merge branch to `main` | ✓ manual | ✗ never | ✗ never |
| Push `main` to GitHub | ✓ manual | ✗ never | ✗ never |
| Update build log | — | ✓ auto | ✓ auto |
| Send notification | — | ✓ ntfy + Gmail draft | Terminal output only |
