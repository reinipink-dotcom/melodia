# Codex Lane — Scope and Rules

> This file documents which work Codex (OpenAI's CLI, GPT-5.5 extra-high) is allowed to touch while the Claude agent team is also active in this project. The goal: zero file-conflict risk between Codex and Claude.

## Current Codex scope (Phase 4 era)

**Codex owns ONLY:**
- `notes/melodia/debug/` — debug handoff files (Claude writes the bug report; Codex writes the fix)
- Anything Codex explicitly creates inside `notes/melodia/codex-work/` (its own scratch lane)

**Codex does NOT touch:**
- `src/` — Claude UX-builder owns this
- `src/data/modules.ts` — Claude content-builder + ux-builder own this
- `notes/melodia/lessons/`, `notes/melodia/curriculum/`, `notes/melodia/songs/` — Claude team owns these
- `notes/melodia/build-logs/` — Claude qa-scribe owns this
- `notes/melodia/module-queue.md`, `module-tracker.md` — Claude orchestrator + qa-scribe own these
- `.claude/agents/`, `.claude/commands/` — Claude infra; don't have Codex edit these
- `.planning/` — GSD state; off-limits

## Future Codex scope (Phase 5+ — backend)

When Phase 4 is done and Phase 5 (Supabase backend) starts, Codex can take ownership of a new lane. We'll write that scope into this file at that time. **Do not start Phase 5 work yet** — scope-guard rule.

Planned future Codex ownership (sketch only — not active):
- `src/lib/supabase.ts` (and related backend client code)
- `src/lib/auth/` (auth flow)
- `notes/melodia/backend/` (design docs)
- A separate git branch (`melodia/phase-5-backend`)
- `.env.local` for backend keys (NEVER commit)

## Coordination rule

If Codex needs to edit a file Claude owns (or vice versa), the human (Reine) makes the call manually. Never both at the same time.

## Trigger pattern (current)

Reine invokes the Codex lane only via:

1. **`/handoff-codex`** in Claude — Claude writes a bug report to `notes/melodia/debug/{date}-{bug-slug}.md`, then Reine switches to her Codex terminal and tells Codex to read + fix that file.
2. **Manual `codex` open** — Reine opens Codex herself for tasks she wants Codex to do directly (research, copy drafting, etc.).

## Why this lane is narrow right now

We want to prove the Claude `/melodia` pipeline works cleanly first. Adding Codex on top of an unproven pipeline doubles the failure surface. Once `/melodia` ships 5-10 clean lessons in a row, we widen Codex's scope.
