---
description: Cloud variant of /melodia for scheduled remote agent runs (no Mac, no XcodeBuildMCP). Builds today's lesson, runs TypeScript check, commits to a dated branch, pushes to GitHub, sends Reine a Gmail recap. Reine validates on her Mac in the morning.
argument-hint: "[module-id or 'next']"
---

# /melodia-cloud — overnight cloud autopilot

You are running as a SCHEDULED CLOUD AGENT. No Mac, no XcodeBuildMCP, no iOS Simulator. Reine is asleep. Your job is to build today's lesson, commit it to a dated branch, push, and email Reine a recap. She validates on her Mac in the morning.

**MAXIMUM AUTONOMY — never prompt.** You and your teammates run with no human in the loop. AskUserQuestion will silently fail or stall the run. NEVER use it. Every "should I…?" question = YES, do it; document the choice in the build log. The only escalation path is the end-of-run Gmail recap.

**Audio generation:** Check for `OPENAI_API_KEY` in the environment via `printenv OPENAI_API_KEY | head -c 10`. If it's set (starts with `sk-`), the voice-engineer generates real .mp3 files using OpenAI tts-1-hd / nova as defined in `.claude/agents/melodia-voice-engineer.md`. If it's NOT set, the voice-engineer writes the narration manifest to `notes/melodia/5-lessons/module-{NNN}-tts.json` only — no .mp3 generation. Either path is acceptable; the email recap reports which happened.

## Differences from `/melodia` (local)

| Stage | Local `/melodia` | Cloud `/melodia-cloud` |
|---|---|---|
| Wave 1-2 | Same | Same |
| TypeScript check | Required | Required |
| Simulator E2E (XcodeBuildMCP) | Required | **SKIPPED** — not available in cloud |
| Final commit | To current branch | To a fresh dated branch `melodia/daily-{YYYY-MM-DD}` |
| Push to GitHub | Optional | **Required** |
| End-of-run notification | Terminal + Mac notification | **Gmail recap to Reine** |
| Quality gate "App Ready" | Yes | **No** — status is "Awaiting Reine simulator check" |

## Workflow

### Step 1 — Identify today's target

User argument: `$ARGUMENTS`

- If `$ARGUMENTS` is a number, target that module.
- Otherwise, read `notes/melodia/1-daily/module-queue.md` and pick the first `pending` row.

### Step 2 — Read context

Same files as `/melodia`. Critically:
- `notes/melodia/3-reference/team-learnings.md`
- `notes/melodia/1-daily/reine-feedback.md`
- `notes/melodia/3-reference/style-guide.md`
- `notes/melodia/3-reference/agent-team-launch-prompt.md`
- `.claude/agents/melodia-orchestrator.md`

### Step 3 — Create a fresh branch BEFORE the team starts

```bash
git checkout main
git pull --rebase origin main
git checkout -b melodia/daily-$(date +%Y-%m-%d)
```

All teammate edits land on this branch.

### Step 4 — Spawn the team and run Wave 0 → 2

Use `TeamCreate` exactly as in `/melodia` (Path A model). Run Wave 0, Wave 1, Gate 1, Wave 2, Gate 2 normally.

### Step 5 — Modified Wave 3 (no simulator)

In Wave 3:
- **ux-builder** wires content into app and runs `npx tsc --noEmit` (must pass)
- **voice-engineer** generates audio only if API keys are configured in the cloud-agent environment; otherwise outputs manifest only and notes "blocked: missing API key in cloud env"
- **qa-scribe** runs ALL QA checks EXCEPT the XcodeBuildMCP simulator walk-through:
  - TypeScript clean
  - Imports resolve
  - No full lyrics anywhere
  - Required additions present (genre alts, cultural note, ttsTriggers, quiz variants, recyclingTargets)
  - No credentials committed (`grep` for known key patterns before commit)
  - Daily build log written
- **Two-attempt rule applies** — if a bug blocks Wave 3 after 2 fix attempts, write a `/handoff-codex` bug report and mark the lesson "Blocked, awaiting Codex" in the recap

### Step 6 — Commit and push

```bash
git add .
git commit -m "feat(module-N): cloud build $(date +%Y-%m-%d)

- Content from melodia-content-builder
- App wiring from melodia-ux-builder  
- QA: TypeScript pass, simulator check pending Reine's Mac
- Awaiting morning simulator validation + merge

Built by /melodia-cloud scheduled agent."
git push -u origin melodia/daily-$(date +%Y-%m-%d)
```

### Step 7 — Send Gmail recap to Reine

Use the Gmail MCP tool (`mcp__claude_ai_Gmail__create_draft` or equivalent send tool) to send Reine an email:

**Subject:** `Melodia daily build — Module N built — {YYYY-MM-DD}`

**Body:**

```
Good morning! Your Melodia lesson for today is built and pushed.

WHAT WAS BUILT
Module N — {concept}
Song: {song title} — {artist}

BRANCH
melodia/daily-{YYYY-MM-DD}

WHAT YOU NEED TO DO (~15 min)
1. cd into the project
2. git checkout melodia/daily-{YYYY-MM-DD}
3. git pull
4. npx expo run:ios   (or your usual local launch)
5. Walk through Module N: PreListen → Listen → Quiz → QuizResults → Reading → LessonComplete
6. If it looks good: git checkout main && git merge melodia/daily-{YYYY-MM-DD} && git push
7. Mark Module N done in notes/melodia/1-daily/module-queue.md (or run /melodia mark-done)

CLOUD QA PASSED
- TypeScript: pass
- No full lyrics: pass
- Required additions: {list which ones passed}
- No credentials committed: pass

PENDING YOUR MAC
- Simulator E2E walk-through
- Final merge

BLOCKERS (if any)
{empty if none; else explain each}

LEARNINGS APPENDED
{summary of any new entries added to team-learnings.md}

TOMORROW'S TARGET (queued)
Module N+1 — {concept}

Full build log: notes/melodia/1-daily/build-logs/{YYYY-MM-DD}.md

Have a great morning!
— Melodia cloud team
```

### Step 8 — Clean up the team

`TeamDelete` per the operating manual. Always via the lead.

## Failure modes

- **No API key for audio in cloud env:** voice-engineer outputs manifest only, recap notes "audio pending — set ELEVENLABS_API_KEY / OPENAI_API_KEY in cloud agent env"
- **TypeScript fails after 2 Claude attempts:** write Codex handoff, recap notes "ts-blocked — Codex handoff at notes/melodia/4-debug/{file}.md"
- **Module already built:** check `module-queue.md` status; if `app-ready` or `in-progress`, send recap "already built — no work done; tomorrow's target is N+1"
- **Git push fails (auth, conflict):** save work to branch, recap notes "push failed — see {error}; please run `git push` from Mac manually"

## Important — cloud-mode constraints

- No XcodeBuildMCP — do not attempt
- No interactive prompts to Reine — she is asleep
- Conservative — if uncertain, surface in the recap rather than guess
- Do NOT escalate to Reine via SendMessage — she is not connected; use the email recap for all communication
