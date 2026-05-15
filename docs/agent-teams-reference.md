# Agent Teams — Master Reference Guide

> Source: Claude Code official docs (https://code.claude.com/docs/en/agent-teams)
> Purpose: Internal reference for building better, more effective multi-agent systems.

---

## Table of Contents

1. [What Are Agent Teams?](#1-what-are-agent-teams)
2. [Agent Teams vs. Subagents](#2-agent-teams-vs-subagents)
3. [Enabling Agent Teams](#3-enabling-agent-teams)
4. [Architecture Deep Dive](#4-architecture-deep-dive)
5. [Starting a Team](#5-starting-a-team)
6. [Controlling the Team](#6-controlling-the-team)
7. [Context & Communication Model](#7-context--communication-model)
8. [Best Practices](#8-best-practices)
9. [Use Case Patterns](#9-use-case-patterns)
10. [Hooks for Quality Gates](#10-hooks-for-quality-gates)
11. [Subagent Definitions as Teammates](#11-subagent-definitions-as-teammates)
12. [Token Costs & Economics](#12-token-costs--economics)
13. [Limitations & Workarounds](#13-limitations--workarounds)
14. [Troubleshooting Playbook](#14-troubleshooting-playbook)
15. [Quick-Reference Cheatsheet](#15-quick-reference-cheatsheet)

---

## 1. What Are Agent Teams?

Agent teams coordinate multiple Claude Code instances working together on a shared task. One session is the **team lead** — it creates the team, spawns teammates, assigns work, and synthesizes results. Each **teammate** is an independent Claude Code session with its own context window. Teammates communicate directly with each other and with the lead via a mailbox system.

**Key distinction from subagents:** teammates can talk to each other. Subagents only report back to the orchestrating session.

> Requires: Claude Code v2.1.32+ and the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env var enabled.

---

## 2. Agent Teams vs. Subagents

| Property | Subagents | Agent Teams |
|---|---|---|
| Context | Own context window | Own context window |
| Communication | Report to main agent only | Message each other directly |
| Coordination | Main agent manages all work | Shared task list + self-coordination |
| Best for | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| Token cost | Lower — results summarized back | Higher — each teammate is a full Claude instance |

**Decision rule:**
- Use **subagents** when workers only need to report a result back and don't need to talk to each other.
- Use **agent teams** when workers need to share findings, challenge each other's approaches, or coordinate on their own between tasks.

---

## 3. Enabling Agent Teams

**Option A — settings.json:**
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Option B — shell environment:**
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

> Agent teams are **experimental** and off by default. Known limitations exist around session resumption, task coordination, and shutdown behavior.

---

## 4. Architecture Deep Dive

### Components

| Component | Role |
|---|---|
| **Team lead** | The main Claude Code session. Creates the team, spawns teammates, coordinates work. |
| **Teammates** | Separate Claude Code instances. Each owns assigned tasks in its own context. |
| **Task list** | Shared work item queue. Teammates claim tasks and mark them complete. |
| **Mailbox** | Inter-agent messaging system. Messages are delivered automatically — no polling needed. |

### Storage (auto-managed, do not edit manually)

- **Team config:** `~/.claude/teams/{team-name}/config.json`
  - Contains: member names, agent IDs, tmux pane IDs, runtime state
  - **Never pre-author or edit by hand** — overwritten on every state update
- **Task list:** `~/.claude/tasks/{team-name}/`

### Task States

```
pending → in_progress → completed
```

Tasks can have **dependencies**. A pending task with unresolved dependencies cannot be claimed until those dependencies complete. The system unblocks tasks automatically when their dependencies are resolved.

**Task claiming uses file locking** to prevent race conditions when multiple teammates try to claim the same task simultaneously.

### Teammate Discovery

The team config's `members` array contains each teammate's name, agent ID, and agent type. Teammates can read this file to discover each other. Names are assigned by the lead at spawn time — specify them in your prompt if you need predictable names to reference later.

---

## 5. Starting a Team

Tell Claude (in natural language) what you want built and what team structure fits. Claude creates the team, spawns teammates, and coordinates based on your description.

**Example prompt (good — three independent roles):**
```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

**What happens next:**
1. Claude creates a shared task list
2. Spawns one teammate per role
3. Teammates explore independently and communicate findings
4. Lead synthesizes results
5. Lead cleans up the team when finished

Claude will also **propose** a team on its own if it determines your task benefits from parallel work — but it won't create one without your confirmation.

---

## 6. Controlling the Team

All control goes through the lead in natural language. The lead handles delegation, task assignment, and team coordination.

### Display Modes

| Mode | How it works | Requirements |
|---|---|---|
| `in-process` | All teammates in your main terminal. Shift+Down to cycle. | Any terminal |
| `tmux` / split panes | Each teammate in its own pane. See all output at once. | tmux or iTerm2 + it2 CLI |
| `auto` (default) | Split panes if inside tmux, in-process otherwise | — |

**Override for one session:**
```bash
claude --teammate-mode in-process
```

**Override in settings:**
```json
{ "teammateMode": "in-process" }
```

**iTerm2 setup:** install `it2` CLI, enable Python API in **iTerm2 → Settings → General → Magic → Enable Python API**.

### Specifying Teammates and Models

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Teammates do **not** inherit the lead's `/model` selection by default. To change the default teammate model: `/config` → **Default teammate model** → **Default (leader's model)**.

### Requiring Plan Approval

For risky or complex tasks, require teammates to plan before implementing:

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

**Approval flow:**
1. Teammate works in read-only plan mode
2. Sends plan approval request to lead
3. Lead approves or rejects with feedback
4. If rejected → teammate revises and resubmits
5. If approved → teammate exits plan mode and implements

To influence the lead's approval criteria, add it to the prompt:
- `"only approve plans that include test coverage"`
- `"reject plans that modify the database schema"`

### Talking to Teammates Directly

- **In-process:** Shift+Down to cycle to a teammate → type to send a message. Press Enter to view their session, Escape to interrupt their current turn. Ctrl+T toggles the task list.
- **Split pane:** click into the pane.

### Assigning Tasks

- **Lead assigns explicitly:** tell the lead which task goes to which teammate
- **Self-claim:** after finishing, a teammate picks up the next unassigned, unblocked task on its own

### Shutting Down Teammates

```
Ask the researcher teammate to shut down
```

The lead sends a shutdown request. The teammate can approve (exits gracefully) or reject with an explanation.

### Cleaning Up the Team

```
Clean up the team
```

Always use the **lead** to clean up — never a teammate. The lead checks that all teammates are shut down first and fails if any are still running.

---

## 7. Context & Communication Model

### What Each Teammate Loads at Spawn

- CLAUDE.md (from working directory)
- MCP servers (from project + user settings)
- Skills (from project + user settings)
- The spawn prompt from the lead

**What it does NOT inherit:** the lead's conversation history.

### How Information Flows

| Mechanism | How it works |
|---|---|
| Automatic message delivery | Messages between agents arrive automatically — no polling |
| Idle notifications | Teammate notifies lead automatically when it finishes |
| Shared task list | All agents see task status and can claim available work |
| Direct messaging | Any teammate can message any other by name |

To reach all teammates, send one message per recipient (there is no broadcast).

### Permissions

Teammates start with the lead's permission settings. `--dangerously-skip-permissions` on the lead propagates to all teammates. You can change individual teammate modes after spawning, but not at spawn time.

---

## 8. Best Practices

### Give Teammates Enough Context in the Spawn Prompt

Since teammates don't inherit conversation history, include all relevant context:

```
Spawn a security reviewer teammate with the prompt:
"Review the authentication module at src/auth/ for security vulnerabilities.
Focus on token handling, session management, and input validation.
The app uses JWT tokens stored in httpOnly cookies.
Report any issues with severity ratings."
```

### Team Size

- **Start with 3–5 teammates** for most workflows
- **5–6 tasks per teammate** keeps them productive without excessive context switching
- **Scale up only** when parallel work genuinely helps — 3 focused teammates often beat 5 scattered ones
- No hard limit, but each teammate adds token cost and coordination overhead

### Task Sizing

| Size | Problem |
|---|---|
| Too small | Coordination overhead exceeds benefit |
| Too large | Long runs without check-ins, risk of wasted effort |
| Just right | Self-contained unit with a clear deliverable (a function, a test file, a review) |

If the lead isn't creating enough tasks: `"Split the work into smaller pieces"`.

### Avoid File Conflicts

**Two teammates editing the same file = overwrites.** Assign each teammate its own set of files. Design work boundaries before spawning.

### Monitor and Steer

Check in on progress regularly. Redirect teammates whose approach isn't working. Don't let a team run unattended too long — risk of wasted tokens and divergent work.

### If the Lead Starts Doing Work Instead of Delegating

```
Wait for your teammates to complete their tasks before proceeding
```

### Start Simple

If you're new to agent teams, start with research/review tasks (no file writes). These show the value of parallel exploration without file-conflict risks.

---

## 9. Use Case Patterns

### Pattern 1: Parallel Code Review

Assign each teammate a distinct review lens so they don't overlap:

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Best for: PRs that span multiple concerns (security, performance, test coverage).

### Pattern 2: Competing Hypotheses Debug

Make teammates explicitly adversarial — each investigates one theory AND tries to disprove the others':

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific debate.
Update the findings doc with whatever consensus emerges.
```

Why it works: sequential debugging anchors on the first plausible theory. Adversarial parallel investigation forces the winning theory to survive challenge.

### Pattern 3: Parallel Feature Development

Each teammate owns a separate module or layer:

```
Create a team with 4 teammates to refactor these modules in parallel:
- Teammate 1: src/auth/
- Teammate 2: src/api/
- Teammate 3: src/db/
- Teammate 4: tests/
```

### Pattern 4: Multi-Perspective Exploration

Use named roles to get structured, non-overlapping perspectives:

```
Create an agent team to explore this from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

---

## 10. Hooks for Quality Gates

Use hooks to enforce rules at the team level:

| Hook | When it runs | Use case |
|---|---|---|
| `TeammateIdle` | When a teammate is about to go idle | Exit code 2 to send feedback and keep teammate working |
| `TaskCreated` | When a task is being created | Exit code 2 to prevent creation and send feedback |
| `TaskCompleted` | When a task is being marked complete | Exit code 2 to prevent completion and send feedback |

Example: enforce that no task is marked complete without a test file:
- Wire `TaskCompleted` hook to check for a corresponding `*.test.ts`
- Exit 2 with feedback if missing → teammate stays on the task

---

## 11. Subagent Definitions as Teammates

You can reference a named subagent type when spawning a teammate:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

**What this does:**
- Teammate honors that definition's `tools` allowlist and `model`
- Definition body is **appended** to the teammate's system prompt (does not replace it)
- Team coordination tools (`SendMessage`, task management) are always available even when `tools` restricts other tools

**What it does NOT do:**
- `skills` and `mcpServers` from the subagent definition are NOT applied to teammates
- Teammates always load skills and MCP servers from project/user settings

**Scope:** works from any subagent scope — project, user, plugin, or CLI-defined.

This is the right way to define reusable roles (security-reviewer, test-runner, performance-analyst) that can be used both as subagents and as team members.

---

## 12. Token Costs & Economics

- Each teammate has its own context window → token usage scales linearly with team size
- 3-teammate team = roughly 3× the token cost of a single session
- Worth it for: research, review, new feature work with independent modules
- Not worth it for: routine tasks, sequential work, same-file edits

See official cost docs: `https://code.claude.com/docs/en/costs#agent-team-token-costs`

---

## 13. Limitations & Workarounds

| Limitation | Workaround |
|---|---|
| `/resume` and `/rewind` don't restore in-process teammates | Tell the lead to spawn new teammates after resuming |
| Task status can lag (teammate doesn't mark complete) | Update status manually or tell lead to nudge the teammate |
| Shutdown can be slow (teammate finishes current turn first) | Plan for latency; don't force-kill |
| Only one team at a time per lead | Clean up before creating a new team |
| No nested teams (teammates can't spawn teams) | Use subagents within a teammate for sub-delegation |
| Lead is fixed for the team's lifetime | Can't promote a teammate; plan the lead role upfront |
| Permissions set at spawn | Change individual teammate modes after spawning if needed |
| Split panes not supported in VS Code terminal, Windows Terminal, Ghostty | Use in-process mode in those environments |

---

## 14. Troubleshooting Playbook

| Symptom | Fix |
|---|---|
| Teammates not appearing | In in-process mode: press Shift+Down. Check task complexity (Claude may not spawn a team for simple tasks). Verify `which tmux` if using split panes. |
| Too many permission prompts | Pre-approve common operations in permission settings before spawning |
| Teammate stops on error | Check output with Shift+Down, give instructions directly, or spawn a replacement |
| Lead shuts down before work is done | Tell it to keep going or to wait for teammates before proceeding |
| Orphaned tmux session after team ends | `tmux ls` → `tmux kill-session -t <session-name>` |
| Teammates fighting over the same file | Redesign task boundaries so each teammate owns separate files |

---

## 15. Quick-Reference Cheatsheet

```
ENABLE
  settings.json: { "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }

START
  "Create an agent team with 3 teammates: one for X, one for Y, one for Z."

CYCLE TEAMMATES (in-process)
  Shift+Down

TOGGLE TASK LIST (in-process)
  Ctrl+T

INTERRUPT TEAMMATE (in-process)
  Enter → view session | Escape → interrupt current turn

DISPLAY MODE
  claude --teammate-mode in-process
  { "teammateMode": "in-process" }

REQUIRE PLAN APPROVAL
  "Spawn a teammate to do X. Require plan approval before making changes."

SHUT DOWN TEAMMATE
  "Ask the [name] teammate to shut down"

CLEAN UP
  "Clean up the team"   ← always via lead, never via teammate

KILL ORPHANED TMUX
  tmux ls && tmux kill-session -t <name>

TEAM SIZE RULE OF THUMB
  3–5 teammates | 5–6 tasks per teammate

SUBAGENT DEFINITION AS TEAMMATE
  "Spawn a teammate using the security-reviewer agent type to..."

HOOKS
  TeammateIdle | TaskCreated | TaskCompleted — exit 2 to block + send feedback
```

---

## Key Design Principles (for building agents that work well in teams)

1. **Context is not shared** — always write spawn prompts that include all relevant background, file paths, constraints, and goals. Assume the teammate knows nothing about the conversation history.

2. **File ownership is critical** — design task boundaries around file ownership before spawning. Two teammates editing the same file will conflict.

3. **Name teammates explicitly** — use names in your spawn prompt so you can reference specific teammates in follow-up messages.

4. **Keep tasks self-contained** — each task should produce a clear deliverable. Vague tasks lead to wasted effort and hard-to-resolve dependencies.

5. **Use adversarial structure for debugging** — when root cause is uncertain, assign each teammate a different hypothesis and instruct them to challenge each other's theories.

6. **Plan gates for risky work** — require plan approval when a teammate is working on shared infrastructure, authentication, or database schema.

7. **Monitor actively** — agent teams are not fire-and-forget. Check in, redirect, and synthesize as work progresses.

8. **Define reusable roles as subagent types** — security-reviewer, test-runner, performance-analyst. Reference them by name at spawn time for consistent, repeatable teammate behavior.

9. **CLAUDE.md works normally** — teammates read CLAUDE.md from their working directory. Use it to provide project-specific guidance to all teammates automatically.

10. **Always clean up via the lead** — never ask a teammate to run cleanup. The lead validates all teammates are shut down before removing shared resources.
