---
description: Write a structured bug report for Codex to fix. Claude diagnoses; Codex (GPT-5.5 extra-high) resolves. Use when Claude has been stuck on a bug for more than 2 attempts, or when you want a second pair of eyes from a different model.
argument-hint: "[short bug description]"
---

# /handoff-codex — debug handoff to Codex

You're handing a bug off to Codex (OpenAI's CLI, GPT-5.5 extra-high) for resolution. You (Claude) write the bug report; Reine switches to her Codex terminal to apply the fix.

## Step 1 — Gather context

User argument (short bug description): `$ARGUMENTS`

Read these to ground the bug report:
- The file(s) where the bug manifests
- Any recent error messages in Reine's terminal scroll, build logs, or `notes/melodia/1-daily/build-logs/`
- The relevant slice of `src/` and `src/data/modules.ts` if the bug is content/UI related
- `notes/melodia/3-reference/codex-scope.md` to know which files Codex is allowed to touch

## Step 2 — Write the bug report

File path: `notes/melodia/4-debug/{YYYY-MM-DD}-{kebab-case-bug-slug}.md`

Use this template:

```markdown
# Bug Report — {short description}

**Reported by:** Claude (handoff via /handoff-codex)
**Date:** YYYY-MM-DD
**Status:** open

## Failing behavior

{Concrete steps to reproduce. If from a simulator walk-through, include the screen/tap path. Include screenshots if available.}

## Error message / stack trace

```
{Paste exact error text. Empty if there's no error, just wrong behavior.}
```

## File paths involved

- `path/to/file.tsx` — lines X-Y
- `path/to/other.ts` — lines A-B

## What Claude already tried

1. {Attempt 1 — what was tried, what happened}
2. {Attempt 2 — ...}
3. {Attempt N — ...}

## Suspected root cause

{Your best hypothesis. Don't be definitive if you're not sure — say "I suspect" or "one theory is".}

## Constraints for Codex

**Files Codex MAY edit:**
- {explicit list — only the files actually involved in the bug fix}

**Files Codex MUST NOT touch:**
- `.claude/agents/*` — Claude infra
- `.claude/commands/*` — Claude infra
- `notes/melodia/1-daily/build-logs/*` — Claude qa-scribe owns this
- `notes/melodia/1-daily/module-queue.md` — Claude orchestrator owns this
- `notes/melodia/5-lessons/*` — Claude content-builder owns this
- `.planning/*` — GSD state

**Style rules to respect:**
- TypeScript strict mode must still pass (`npx tsc --noEmit`)
- No new dependencies without escalation to Reine
- Follow existing React Native + Expo patterns
- Use design tokens from `src/constants/` — no hardcoded colors

## How Codex should report the fix

After fixing, append a "## Resolution" section to THIS file documenting:
- Files changed (with brief explanation per file)
- Why the previous attempts failed (if Codex can tell)
- Any new tests / verification commands
- Whether `npx tsc --noEmit` passes after the fix

Then update the file's `**Status:**` line from `open` to `awaiting-claude-verify`.
```

## Step 3 — Tell Reine

After writing the bug report file, print to Reine:

```
Bug report written to notes/melodia/4-debug/{filename}.md

Next steps:
1. Open your Codex terminal in this folder.
2. Tell Codex: "read notes/melodia/4-debug/{filename}.md and resolve the bug"
3. When Codex finishes, come back to Claude and say "verify the codex fix" — Claude will check the resolution and verify the fix works.
```

Do NOT try to fix the bug yourself after writing the handoff — the whole point is fresh eyes from a different model.

## Step 4 (when Reine returns — separate invocation)

If Reine comes back with "verify the codex fix" or similar, read the bug report file's Resolution section, then:
- Read the changed files
- Run `npx tsc --noEmit`
- If applicable, run the simulator walk-through via XcodeBuildMCP
- Mark the bug as `resolved` in the file's status line
- Move the file to `notes/melodia/4-debug/resolved/`
- Commit the fix with message: `fix: {bug summary} (codex handoff)`
