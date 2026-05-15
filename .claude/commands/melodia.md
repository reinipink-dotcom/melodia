---
description: Run the Melodia daily lesson production pipeline as a true agent team. The main session becomes the team lead and spawns 6 specialist teammates via TeamCreate (Path A, Sections 4-5 of docs/agent-teams-reference.md).
argument-hint: "[module-id or 'next' or 'queue']"
---

# /melodia — daily lesson production

You (the main session) are about to BECOME the team lead for Melodia lesson production. This is a **true agent team** pipeline (Path A) — you will use `TeamCreate` to spawn 6 teammates, `SendMessage` for mailbox coordination, and a shared task list. You do NOT spawn `melodia-orchestrator` as a subagent — instead, you READ `.claude/agents/melodia-orchestrator.md` as your operating manual and act as the lead yourself.

## Step 1 — Identify today's target

User argument: `$ARGUMENTS`

Resolve the target as follows:
- If `$ARGUMENTS` is a number (e.g., `4`, `15`), target that specific module.
- If `$ARGUMENTS` is `next` or empty, read `notes/melodia/1-daily/module-queue.md` and pick the first module with status `pending`.
- If `$ARGUMENTS` is `queue`, print the current queue and exit without producing a lesson.

If the queue file doesn't exist yet, fall back to **Module 4** (the canonical first target per the launch prompt and project memory).

## Step 2 — Read context (parallel reads, your context only)

Read these in parallel before creating the team:
- `.claude/agents/melodia-orchestrator.md` — your operating manual as team lead
- `notes/melodia/3-reference/agent-team-launch-prompt.md` — canonical project brief
- `docs/agent-teams-reference.md` — agent-teams reference (skim Sections 4-7 for lead behavior)
- `notes/melodia/1-daily/module-queue.md` — today's target
- `CLAUDE.md` — project guardrails
- `PROGRESS.md` — current phase state
- `notes/melodia/2-tracking/worklog/PENDING.md` — known bugs to flag during QA
- `notes/melodia/2-tracking/module-tracker.md` — what's already produced

After reading, do NOT post these documents to teammates verbatim — teammates already auto-load CLAUDE.md from working directory and each subagent definition body is appended to their system prompt at spawn. Pass only the *delta* per teammate (file paths, module ID, current targets).

## Step 3 — Wave 0 plan (you only, no teammates yet)

Following the operating manual:
1. Decide today's ramp (Week 1 = 1 module/day; Week 2 = 2; Week 3+ = 3 — read project memory for week count).
2. Build the task dependency map. Use `TaskCreate` to materialize each unit of work, with `addBlockedBy` to encode Wave 0 → Gate 1 → Wave 2 → Gate 2 → Wave 3 → Final Gate sequencing.
3. Define file ownership — no two teammates edit the same file simultaneously. Document the ownership map in the plan.
4. Print the plan to the user before creating the team: target module(s), ramp choice, dependency map, file ownership map, gate criteria.

## Step 4 — Create the team

Use `TeamCreate` with the 6 specialist roles. The lead must give each teammate a self-contained spawn prompt because teammates don't inherit your conversation history.

Per Section 11 of the reference, spawn each teammate using its subagent type so the role definition is auto-appended to its system prompt:

- **melodia-curriculum-architect** — spawn prompt: "You are validating curriculum direction for Module {N} ({concept}). Read `melodia-curriculum.docx` and the existing `src/data/modules.ts` for modules {N-2} through {N+2}. Produce the curriculum spec at `notes/melodia/5-lessons/curriculum/module-{NNN}-spec.md`. Coordinate with melodia-song-validator on cultural-note direction. Message me (lead) when your spec is ready for Gate 1 review."

- **melodia-song-validator** — spawn prompt: "You are validating songs for Module {N} ({concept}). Find primary song + genre alternatives. Verify spotifyId and youtubeId resolve. Save your output to `notes/melodia/5-lessons/songs/module-{NNN}-songs.json`. Coordinate with melodia-curriculum-architect on whether the song's lyric concept actually fits the grammar target. Message me (lead) when your spec is ready for Gate 1 review."

- **melodia-content-builder** — spawn prompt: "You will write the lesson content for Module {N} ({concept}) AFTER Gate 1 passes. Wait for SendMessage from the lead unblocking Wave 2. When unblocked: read `notes/melodia/5-lessons/curriculum/module-{NNN}-spec.md` and `notes/melodia/5-lessons/songs/module-{NNN}-songs.json`, then produce `notes/melodia/5-lessons/module-{NNN}-content.ts.draft` and the audio text manifest. Message me when ready for Gate 2."

- **melodia-ux-builder** — spawn prompt: "Wave 1: review `src/data/modules.ts`, `src/screens/`, and `src/constants/` and report which data-model extensions are needed to support genreAlternatives, culturalNotes, ttsTriggers, easyQuizQuestions/hardQuizQuestions, and recyclingTargets for Module {N}. Wave 2: create/update reusable structures. Wave 3: wire the approved lesson content into the app and run XcodeBuildMCP to boot the simulator. Message me at each wave boundary."

- **melodia-voice-engineer** — spawn prompt: "Define ttsTriggers for Module {N} ({concept}). Wave 1: review what audio is needed. Wave 2: finalize the ttsTriggers spec at `notes/melodia/5-lessons/module-{NNN}-tts.json` and audio manifest. Wave 3: generate audio ONLY if API keys are configured in `.env` — otherwise output the manifest only and message me (the lead) to escalate to Reine for key setup. Append to `notes/melodia/2-tracking/audio-cost-log.csv` for any generated audio."

- **melodia-qa-scribe** — spawn prompt: "Wave 1: prep QA checklist and module-tracker row. Wave 3: run `npx tsc --noEmit`, execute XcodeBuildMCP simulator walk-through, capture screenshots to `notes/melodia/1-daily/build-logs/screenshots/{YYYY-MM-DD}/`, validate all required additions, then write `notes/melodia/1-daily/build-logs/{YYYY-MM-DD}.md` and update `notes/melodia/2-tracking/module-tracker.md` and `notes/melodia/1-daily/module-queue.md`. Re-check known bugs in `notes/melodia/2-tracking/worklog/PENDING.md` while walking through. Message me with the end-of-run summary."

## Step 5 — Run the waves

After TeamCreate succeeds:

1. **Wave 1 — Parallel discovery:** All 5 of curriculum, song, ux (review), voice (review), qa-scribe (checklist prep) work in parallel. Content-builder waits.
2. **Gate 1:** When curriculum-architect and song-validator both message you that their specs are ready, validate the gate criteria (curriculum approved, vocab theme, speaking goal, cultural note direction, recyclingTargets, song approved, genre alts present, copyright boundaries clear). If all pass, SendMessage to content-builder unblocking Wave 2.
3. **Wave 2 — Parallel content + structure:** content-builder writes lesson content; ux-builder updates data model; voice-engineer finalizes ttsTriggers; qa-scribe preps validation checks.
4. **Gate 2:** Confirm lesson content complete, quiz variants, cultural note, genre alts, audio cues, recyclingTargets, no full lyrics, no unsupported claims. SendMessage to all teammates unblocking Wave 3.
5. **Wave 3 — Parallel implementation + QA + docs:** ux-builder wires content into app; voice-engineer generates audio (or surfaces blocker); qa-scribe runs full QA + simulator walk-through + docs.
6. **Final Gate:** All quality gates pass — mark lesson "App Ready" or list specific failures for Reine.

## Step 6 — Clean up and surface to Reine

Per Section 6 of the reference, always clean up via the lead — never via a teammate.

1. Confirm all teammates have completed their final tasks.
2. Use `TeamDelete` to shut down the team.
3. Print to Reine:
   - ✅ App Ready modules (with concept + song)
   - ⚠️ Needs Reine review (with reason)
   - ❌ Needs revision (with reason)
   - TypeScript check status
   - Simulator E2E status
   - Audio cost today
   - Tomorrow's recommended target from the queue

## Autonomy contract

Per project memory and `notes/melodia/3-reference/agent-team-launch-prompt.md`:
- Do NOT prompt Reine for routine read/write/test/git operations.
- Do NOT prompt Reine for individual file edits, npm/npx/tsc/expo commands, screenshots, or doc updates.
- DO prompt Reine ONLY for: destructive ops (rm -rf, force-push, hard reset), credential entry, paid service setup (ElevenLabs/OpenAI TTS billing, Supabase, RevenueCat), legal/copyright uncertainty, scope creep beyond Phase 4, or app architecture changes.

## Scope guard

Phase 4 lesson production ONLY. If any teammate attempts to touch backend, paywall, Spotify OAuth, retention, profile screens, analytics, polish, or App Store work — interrupt them via SendMessage and re-scope.

## If anything goes wrong

- **Teammate stops on error:** check its output, send instructions via SendMessage, or spawn a replacement (per Section 14).
- **Two teammates fighting over a file:** you mis-assigned ownership in Wave 0. Send corrected ownership via SendMessage; one teammate steps back.
- **Three consecutive QA failures on the same module:** stop the run, write a blocker into `notes/melodia/1-daily/build-logs/{YYYY-MM-DD}.md`, escalate to Reine.
- **Token budget bloating:** reduce next day's run to 1 module; tell teammates to summarize instead of re-reading.
