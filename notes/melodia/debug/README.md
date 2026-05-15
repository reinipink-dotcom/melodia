# Debug Handoff Folder

> Bug reports written by Claude (`/handoff-codex` slash command) and resolved by Codex live here.

## Workflow

1. Reine (or Claude) hits a bug Claude can't fix easily.
2. Reine runs `/handoff-codex` in Claude.
3. Claude writes a structured bug report to `notes/melodia/debug/{YYYY-MM-DD}-{bug-slug}.md` containing:
   - Failing behavior (steps to reproduce)
   - File paths involved
   - Stack trace / error message
   - What Claude already tried
   - Suspected root cause
   - Files Codex is allowed to edit
   - Files Codex must NOT touch
4. Reine opens her Codex CLI terminal.
5. Reine tells Codex: `read notes/melodia/debug/{filename}.md and resolve the bug`.
6. Codex fixes the bug, then appends a "Resolution" section to the same markdown file documenting what changed.
7. Reine switches back to Claude. Claude reads the resolution + verifies the fix.
8. Reine commits the fix.

## File naming

`{YYYY-MM-DD}-{kebab-case-bug-slug}.md`

Example: `2026-05-16-module-3-quiz-no-questions-available.md`

## Active bugs (oldest first)

_(Empty — Claude will write the first bug report here when needed.)_

## Resolved bugs

Move resolved bug files to `notes/melodia/debug/resolved/` once Reine has verified the fix and committed it.
