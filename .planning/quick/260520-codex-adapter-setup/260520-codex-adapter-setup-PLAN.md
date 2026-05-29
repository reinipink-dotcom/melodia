# Codex Adapter Setup

## Goal
Confirm the Claude-to-Codex adapter setup exists and make the smallest safe cleanup needed for Codex usage.

## Scope
- Add a concise Codex adapter preamble and project map to `AGENTS.md`.
- Add local Codex/MCP override ignores to `.gitignore`.
- Do not recreate existing `.agents/skills`, `.codex/agents`, or `.codex/config.toml` files.
- Do not add secrets.

## Validation
- Inspect the changed files.
- Confirm no accidental changes to Claude source files or generated app code.
