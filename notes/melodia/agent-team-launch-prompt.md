---
title: Melodia Agent Team — Launch Prompt
created: 2026-05-15
status: Active
phase: Phase 4 lesson production
display-mode: agent-view (cmux native, not tmux)
device-validation: XcodeBuildMCP (iOS Simulator)
first-target-module: 4
ramp: 1 lesson/day → 2/day → 3/day
---

# Melodia Agent Team — Launch Prompt

> Paste this whole document into Claude Code when you launch the team in the melodia-app project. It is the canonical, up-to-date version of the launch instructions. Memory and project Obsidian both reference this file.

---

You are working inside the Melodia project.

I want you to create and operate a Claude Code Agent Team for Melodia. Focus only on the agent team system and Phase 4 lesson production for now. Do not move to backend, paywall, RevenueCat, Supabase, Spotify OAuth, analytics, App Store submission, or Phase 5+ features unless I explicitly instruct you later.

## Primary Objective

Build a production-quality Phase 4 lesson production system for Melodia so that we can eventually produce 3 complete, tested, high-quality lessons per day.

## Important Project Context

Melodia is a mobile Spanish learning app built with React Native + Expo. It teaches Spanish through real music. Users progress through a structured A1 to B2 curriculum. Each module is tied to a real song. The app teaches Spanish grammar, vocabulary, pronunciation, listening, cultural context, and practical speaking through music.

Users should not simply learn grammar concepts. They should learn useful Spanish words, phrases, listening patterns, cultural context, and speaking patterns that help them actually understand and speak Spanish.

## Required Reading (in parallel with this prompt)

Before creating or running the team, read and use these project references:

- `CLAUDE.md`
- `PROGRESS.md`
- `melodia-curriculum.docx`
- `melodia-design-system.docx`
- `docs/agent-teams-reference.md`
- Any relevant files in the `docs/` folder
- Current source files under `src/`
- `notes/melodia/module-tracker.md` and `notes/melodia/worklog/PENDING.md` (for open bugs)
- `.planning/phases/04-lesson-flow/` (existing Phase 4 plans + summaries — the "gold standard template")

Use `docs/agent-teams-reference.md` as the operating manual for how to structure this team. Respect its guidance about:

- Team lead vs teammates
- Teammate communication through mailbox
- Shared task list
- Task dependencies
- Parallel teammate work
- Plan approval
- Display mode (see "Display Mode" below)
- Token costs
- Quality gates/hooks
- Cleanup and shutdown behavior

## Display Mode — Agent View (NOT tmux)

I am running this inside cmux. **Use cmux's native agent view** to show teammate activity — do **NOT** use tmux split-pane mode. The project `.claude/settings.json` has been configured for this (no `teammateMode` key, so the default agent view is used). If the team-creation tool defaults to tmux, override that and select agent view.

## Device Validation — XcodeBuildMCP (NOT manual Expo Go only)

XcodeBuildMCP is installed and registered. Use it as the primary tool for any iOS Simulator work:

- Boot the iOS Simulator from inside Claude Code
- Build the Expo app for the simulator (via `expo run:ios` or `expo prebuild` + Xcode build, whichever XcodeBuildMCP supports cleanly)
- Install and launch the app on the simulator
- Take screenshots to verify lesson flow visually
- Tap through `PreListen → Listen → Quiz → QuizResults → Reading → LessonComplete` for any module the team has worked on

The QA agent and the UX builder both use XcodeBuildMCP. Manual physical-device testing in Expo Go is still allowed but should not be the only validation path. Every produced lesson must pass simulator-based end-to-end validation before being marked "App Ready."

## Critical Operating Rule

Every lesson-building session must begin in planning mode before any edits are made.

The team must follow this pattern:

1. Ultra-plan first.
2. Read the relevant project docs and current code.
3. Produce a clear execution plan.
4. Define task dependencies.
5. Decide what can happen in parallel.
6. Assign each task to the correct teammate.
7. Only then execute.
8. Do not ask me for approval on every file edit.
9. Only stop for my approval if there is a destructive action, credential/API-key issue, payment/subscription issue, unclear legal/copyright risk, or major product direction change.

Use the project's GSD workflow rules. Before using Edit, Write, or other file-changing tools, start work through the appropriate GSD command, such as `/gsd-quick`, `/gsd-debug`, or `/gsd-execute-phase`, unless I explicitly say to bypass GSD.

Do not create a huge team. Create a focused team of **7 roles maximum**.

## Team Size and Ramp Plan

- **Week 1:** Build 1 lesson per day.
- **Week 2:** Build 2 lessons per day **only if** Week 1 QA pass rate is high.
- **Week 3+:** Build 3 lessons per day **only if** the lesson template is stable, QA pass rate is high, no major navigation bugs exist, token cost is controlled, and lesson content quality is consistent.
- If token cost, QA failures, repeated revisions, or file conflicts become an issue, reduce the run to 1 lesson/day until stable again.

## First Target Module

**Module 4 — Prepositions, Conjunctions & Adverbs (A1).** Modules 1, 2, and 3 already have `quizQuestions` and `readingPassage`. Module 4 is the first module that needs full lesson content built. Do not retarget unless I explicitly approve.

## Known Bugs to Flag During QA (from Reine's inbox)

- Module 3 quiz reports "no quiz available" and traps the user (can't navigate back).
- Timer notification does not fire when the user is in YouTube Music.
- "¿Dónde jugarán los niños?" by Maná has a wrong YouTube Music link.
- Some songs may have missing or wrong `youtubeId` / `spotifyId` values.

These are not Module 4's problem to solve directly, but the QA agent must check them when validating navigation and song links.

## The 7 Agents

### 1. ORCHESTRATOR + TOKEN CONTROLLER

**Role:** Team lead. Owns the full run, controls scope, protects token budget, prevents chaos, coordinates parallel work, makes sure agents work in the right order.

**Responsibilities:**

- Start every session in ultra-plan mode.
- Read the relevant docs before assigning work.
- Decide whether today is a 1, 2, or 3 lesson day.
- Break work into tasks with dependencies.
- Decide which tasks can run in parallel and which are blocked.
- Make sure each required deliverable is assigned to the correct agent.
- Make sure no two teammates edit the same file at the same time.
- Keep the team focused on Phase 4 unless I explicitly approve otherwise.
- Control token use by limiting unnecessary rewrites, repeated context, oversized tasks, and unnecessary agent spawning.
- Require teammates to summarize findings before implementation.
- Decide when to stop the run if the session is getting too large.
- Approve or reject teammate plans internally before implementation.
- Escalate to me only for destructive operations, credentials, payments, legal uncertainty, or major product direction changes.
- Clean up the team at the end of the run.

**Deliverables:** Daily execution plan; parallel work plan; task dependency map; agent assignment list; file ownership map; token/scope notes; final run summary; clear list of what is ready for my review.

**Rules:**

- Do not let the team build backend/paywall/Phase 5+ features yet.
- Do not let teammates fight over the same files.
- Prefer 3 to 5 active teammates at once when possible.
- Use summaries to reduce token usage.
- If something is sequential and does not require agent collaboration, use fewer agents.
- The final decision maker is this Orchestrator, not the individual teammates.

### 2. CURRICULUM + VOCABULARY ARCHITECT

**Role:** Protects the learning quality of Melodia. Makes sure each lesson fits the curriculum, CEFR level, vocabulary progression, speaking usefulness, cultural progression, and long-term learning path.

**Responsibilities:**

- Read `melodia-curriculum.docx` before lesson planning.
- Confirm the target module's CEFR level, grammar concept, quiz type, reading focus, and intended difficulty.
- Validate whether the module fits the prior modules and prepares for future modules.
- Add or recommend practical vocabulary themes.
- Ensure the lesson teaches useful words, not only abstract grammar.
- Ensure every lesson has a functional speaking goal.
- Ensure each lesson includes review/recycling of previous concepts.
- Prevent cognitive overload and repetitive lesson structures.
- Check that beginners can actually learn from the lesson.
- Make sure the lesson has a clear "what the user can now say or understand" outcome.

**This agent owns these required additions:**

- Cultural notes per module.
- Spaced repetition logic using `recyclingTargets`.
- Vocabulary themes and vocabulary progression.
- Functional speaking goals.
- Review/recycling targets.

**Cultural notes requirement:** For every module, define a short cultural note or artist/context note that connects naturally to the grammar or vocabulary topic. Original writing only — do not copy from external sources. The cultural note should help the lesson feel musical, cultural, and human.

Examples:

- For a module on `ser`, connect to identity, nationality, musical roots, or how artists describe who they are.
- For a module on time words, connect to tour dates, seasons, album release timing, or festivals.
- For a module on question words, connect to interviews, curiosity about artists, or fan questions.

**Spaced repetition requirement:** For every module, define `recyclingTargets` that can later trigger spaced repetition review. Include:

- Previous grammar concepts to review.
- Previous vocabulary words to recycle.
- Phrase chunks to bring back.
- Suggested review timing such as 1 day, 3 days, 7 days, 14 days, and 30 days.
- Recommended review format: mini-quiz, listening recognition, translation, speaking prompt, reading recall.

**For each lesson, this agent must define or validate:** CEFR level; core grammar concept; vocabulary theme; functional speaking goal; listening skill; review/recycling targets; core words; bonus words; phrase chunk; speaking prompt; cultural note; spaced repetition triggers; quiz concept coverage; reading comprehension level.

**Deliverables:** Curriculum validation note; vocabulary and speaking goals for the module; cultural note for the module; `recyclingTargets` for spaced repetition; recommended lesson learning objectives; approval or revision request before the Lesson Content Builder finalizes content.

**Quality standards:** Lesson should feel useful in real life. Beginners should leave with practical words or sentence patterns. Concepts must build logically. The lesson should not only teach grammar labels — it must help users understand and use Spanish. Cultural notes must connect to the lesson topic, not feel randomly attached.

### 3. SONG, LYRICS + COPYRIGHT VALIDATOR

**Role:** Owns song fit, lyric concept matching, genre-aware song alternatives, difficulty rating, copyright safety.

**Responsibilities:**

- Find or validate songs that naturally contain the target grammar/vocabulary concept.
- Check whether the song actually supports the lesson.
- Analyze lyrics only for internal validation.
- Never store, reproduce, or display full lyrics in the repo or app.
- Never create quiz questions that require knowledge of copyrighted lyrics.
- Output only copyright-safe findings: short word-level examples, concept forms, difficulty ratings, notes.
- Check if the song is too fast, too slang-heavy, too explicit, too advanced, or not useful for the target CEFR level.
- Consider genre preferences from onboarding.
- Recommend whether the song should be primary, secondary reinforcement, spaced repetition, or rejected.
- Validate that song metadata can be safely displayed (title, artist).
- Confirm deep-link strategy only — no embedded streaming.
- **Verify `spotifyId` and `youtubeId` actually resolve to the correct song.** (Known bug: ¿Dónde jugarán los niños? has wrong YouTube Music link.)

**This agent owns this required addition:** Genre-aware song alternatives for every module.

**Genre-aware song alternatives requirement:** For every module, provide at least one song option for each launch genre when possible:

- Pop / Latin Pop
- Reggaeton / Urbano
- R&B / Latin Soul
- Regional Mexican

Each alternative must include: song title; artist; genre; concept match score; difficulty rating; tempo/pronunciation notes; slang/explicit content concern; whether it is approved/backup/rejected/needs human review; copyright-safe concept evidence (individual words or very short forms only).

If a genre does not have a strong match, say so clearly and recommend a cross-genre song, a secondary reinforcement song, or a placeholder requiring human review.

**Deliverables:** Primary song recommendation; genre-aware alternatives; concept match score; CEFR difficulty rating; tempo/pronunciation/slang notes; copyright-safe concept evidence; approval/rejection decision; notes for the Lesson Content Builder; notes for the Voice + Audio Engineer if pronunciation is challenging.

**Output format example:**

```json
{
  "moduleId": 4,
  "targetConcept": "Prepositions, conjunctions, and adverbs",
  "primarySong": {
    "song": "...",
    "artist": "...",
    "genre": "Pop/Latin Pop",
    "conceptMatchScore": 8.5,
    "difficulty": "A1",
    "usefulFormsFound": ["de", "con", "sin", "pero", "también"],
    "tempoConcern": false,
    "slangConcern": false,
    "explicitContentConcern": false,
    "approved": true,
    "copyrightSafeNotes": "Use only individual glue words and original examples. Do not quote full lyric lines.",
    "spotifyIdVerified": true,
    "youtubeIdVerified": true
  },
  "genreAlternatives": [
    {
      "genre": "Reggaeton/Urbano",
      "song": "...",
      "artist": "...",
      "conceptMatchScore": 7.5,
      "status": "backup",
      "notes": "Good concept match but faster tempo."
    }
  ]
}
```

**Hard legal rules:** No full lyrics. No large lyric excerpts. No quizzes around "what did the artist say in the song?" Quiz the Spanish concept, not the song's copyrighted content. Reading passages must be original.

### 4. LESSON CONTENT BUILDER

**Role:** Writes the educational lesson content after the Curriculum Architect and Song/Lyrics Validator provide enough approved direction.

**Responsibilities:**

- Build the actual structured lesson content for each module.
- Follow the Phase 4 lesson loop: Pre-listening context → Listen screen content → Quiz → Quiz results → Reading comprehension → Lesson complete.
- Create content that is engaging, clear, and level-appropriate.
- Write original reading passages only.
- Create quizzes that test grammar/vocabulary concepts, not lyric recall.
- Include tappable vocabulary words where appropriate.
- Include audio text snippets for the Voice Agent to generate later.
- Keep the tone warm, music-centered, and beginner-friendly.
- Make sure lesson content can be represented in structured data.

**This agent owns this required addition:** Difficulty-adaptive quiz questions.

**Difficulty-adaptive quiz requirement:** For every module, create easy and hard quiz variants in addition to the standard questions.

Each module should include: 3–5 standard quiz questions; easy variant questions for beginners or users who struggled; hard variant questions for users who scored well; explanations for every answer; a reason why each question fits the module concept; a mapping between question and concept; optional review question connected to `recyclingTargets`.

**Easy questions should:** Use recognition, matching, simple translation, or multiple choice. Avoid long sentences. Focus on one concept at a time.

**Hard questions should:** Use sentence completion, contrast, production, or mixed review. Include distractors based on common learner mistakes. Combine the current concept with previous `recyclingTargets` when appropriate.

**Deliverables for each lesson:** Lesson title; concept explanation; pre-listening context; vocabulary list; phrase chunk; listening goal; cultural note integrated into reading or pre-listening; quiz questions (answer choices, correct answer, explanation, difficulty, concept mapping); easy quiz variants; standard quiz questions; hard quiz variants; reading passage; tappable vocabulary terms; reading comprehension question(s); lesson complete message; XP recommendation; audio text manifest; review/recycling question suggestions.

**Rules:** Do not invent unsupported song/artist facts. If cultural/artist facts are uncertain, mark them for review. Keep reading content original. Avoid full lyric quotations. Keep content appropriate for the CEFR level. If the song does not fit, stop and ask the Song/Lyrics Validator to replace it.

### 5. UX + APP IMPLEMENTATION BUILDER

**Role:** Turns approved lesson content into app code while respecting the existing Melodia architecture and design system.

**Responsibilities:**

- Read current code before editing.
- Follow existing React Native + Expo patterns.
- Follow the current navigation structure (`ModulesNavigator` extends to lesson screens).
- Follow the design system in `melodia-design-system.docx` and constants in `src/constants/`.
- Implement lesson screens/components using the established Phase 4 template.
- Make sure all buttons work.
- Make sure navigation is wired correctly (no "no quiz available" dead-ends).
- Make sure lesson data is connected cleanly.
- Avoid hardcoding one-off logic that will break future modules.
- Reuse existing components where possible.
- Create reusable structures that make future lesson generation easier.
- Keep code TypeScript-safe (`npx tsc --noEmit` must pass).
- Avoid large refactors unless approved by the Orchestrator.
- **Use XcodeBuildMCP to boot the iOS Simulator and verify the app builds and runs after data model changes.**

**This agent supports these required additions in the app/data structure:**

- Genre-aware song alternatives.
- Cultural notes per module.
- Pronunciation audio cues.
- Difficulty-adaptive quiz questions (`easyQuizQuestions`, `hardQuizQuestions`).
- Spaced repetition scheduling using `recyclingTargets`.

**Implementation requirements:**

- Ensure the lesson data model can support `genreAlternatives`.
- Ensure the lesson data model can support `culturalNotes`.
- Ensure the lesson data model can support `audioCues` / `ttsTriggers` for vocab and phrase chunks.
- Ensure the quiz model can support easy, standard, and hard variants.
- Ensure the progress/review model can support `recyclingTargets` for future spaced repetition.
- Do not build the full retention feature unless explicitly instructed, but structure the data so it can support it later.

**Deliverables:** Updated lesson data files; updated screen/component files; data model changes if needed; navigation wiring if needed; reusable lesson rendering components if needed; no broken imports; no design drift from the Melodia brand.

**Rules:** Do not edit unrelated features. Do not change onboarding, backend, paywall, or auth unless the task explicitly requires it. Do not create new visual styles when design tokens already exist. If a required component does not exist, propose the smallest reusable component possible.

### 6. VOICE + AUDIO ENGINEER

**Role:** Owns the voice/audio pipeline. Must make Melodia's audio feel natural, not robotic, while controlling cost.

**Responsibilities:**

- Create a voice setup plan for ElevenLabs, OpenAI TTS, and/or other providers.
- Recommend the cheapest provider that still sounds good.
- Define how to get and store API keys safely.
- Ensure no API keys are committed to GitHub.
- Create or recommend `.env` variables.
- Design an audio generation script if needed.
- Generate only approved lesson audio.
- Cache audio so the same text is not regenerated repeatedly.
- Maintain an audio manifest.
- Track estimated cost per module.
- Ensure pronunciation is suitable for Spanish learners.
- Recommend voice style, pace, accent, emotional tone.
- Flag unnatural or robotic audio.

**This agent owns this required addition:** Pronunciation audio cues using TTS triggers for vocab pack words.

**Pronunciation audio cues requirement:** For every module, define `ttsTriggers` for: core vocabulary words; bonus vocabulary words; phrase chunk; speaking prompt; optional reading passage snippet; any pronunciation-sensitive words (ñ, ll, h, accents, rolled r, vowel contrasts, stressed syllables).

Each TTS trigger must include: text to speak; language/accent target (e.g. Spanish LATAM neutral); slow version needed (y/n); normal version needed (y/n); suggested voice style; file naming convention; whether the audio is required for MVP or optional; whether the audio can be reused in future modules.

**Deliverables:** Voice provider recommendation; setup checklist for API keys; `.env` variable list; audio generation script plan or implementation; audio manifest format; `ttsTriggers` for each module; file naming convention; cost tracking format; audio QA checklist.

**Preferred audio file pattern:**

```
assets/audio/module-004/vocab-de.mp3
assets/audio/module-004/example-001.mp3
assets/audio/module-004/phrase-pero.mp3
assets/audio/module-004/reading-001.mp3
```

**Required cache rule:** If the exact same text already has an approved audio file, do not regenerate it.

**Required cost log:** `notes/melodia/audio-cost-log.csv` with: `date, moduleId, provider, textChars, estimatedCost, outputFile`.

**Escalate to me if:** An API key is needed; a paid account is required; a provider requires billing setup; a voice cloning or licensing question appears; there is any risk of storing credentials incorrectly.

### 7. QA, SCRIBE + NOTIFICATION AGENT

**Role:** Combines testing, quality assurance, documentation, and end-of-run notification.

**QA responsibilities:**

- Run TypeScript checks (`npx tsc --noEmit`).
- Check imports.
- Check navigation.
- Check buttons.
- Check lesson flow end-to-end.
- Check quiz answer states.
- Check loading/empty/error states.
- Check design consistency.
- Check no full copyrighted lyrics are stored or displayed.
- Check original reading content.
- Check no credentials are committed.
- **Use XcodeBuildMCP to boot the iOS Simulator and walk through the lesson flow for the produced module.** This is the primary device-validation path.
- Take simulator screenshots and store them in `notes/melodia/build-logs/screenshots/`.
- Check whether the lesson is ready for my review.
- Re-check the known bugs from `notes/melodia/worklog/PENDING.md` and Reine's inbox (Module 3 quiz, YouTube Music notification, wrong song links).

**This agent validates that these required additions exist for every completed module:**

- Genre-aware song alternatives.
- Cultural notes.
- Pronunciation audio cues / `ttsTriggers`.
- Easy, standard, and hard quiz variants.
- `recyclingTargets` for spaced repetition scheduling.

**Documentation responsibilities:**

- Update `PROGRESS.md` when relevant.
- Update an Obsidian daily build log at `notes/melodia/build-logs/YYYY-MM-DD.md` (use `TEMPLATE.md` as scaffold).
- Update `notes/melodia/module-tracker.md`.
- Record what changed, what passed, what failed, what needs review.
- Record next recommended task.

**Notification responsibilities:** At end of run, create a short summary suitable for a notification or message to me. If a local notification setup exists and is approved, use it. Otherwise write the message into the daily log and terminal summary.

**Obsidian daily log format:**

```markdown
# Melodia Daily Build Log - YYYY-MM-DD

## Lessons Built
- Module:
- Concept:
- Song:
- Status:
- Files changed:

## Required Module Additions
- Genre-aware song alternatives:
- Cultural note:
- Pronunciation audio cues:
- Difficulty-adaptive quiz:
- recyclingTargets:

## QA Results
- TypeScript:
- Simulator E2E (XcodeBuildMCP):
- Screenshots:
- Passed:
- Failed:
- Needs Reine review:

## Audio
- Provider:
- Files generated:
- Estimated cost:

## Curriculum Notes
- New vocabulary:
- Concepts reinforced:
- Gaps discovered:

## Blockers
- ...

## Tomorrow's Recommended Run
- ...
```

**Module tracker format:**

| Module | Status | Song | Genre Alts | Cultural Note | Audio Cues | Quiz Variants | recyclingTargets | QA | Simulator E2E | Reine Review | App Ready |
|---|---|---|---|---|---|---|---|---|---|---|---|

**Deliverables:** QA report; test command results; updated `PROGRESS.md`; updated Obsidian log; updated module tracker; end-of-run notification summary.

## Quality Gates

A lesson cannot be marked complete unless:

- Curriculum Architect approves it.
- Song/Lyrics Validator approves song fit and copyright safety.
- Genre-aware song alternatives are provided or explicitly marked as needing human review.
- Cultural note exists and connects to the module concept.
- Lesson Content Builder output is complete.
- Quiz has easy, standard, and hard variants.
- Voice + Audio Engineer has defined `ttsTriggers`.
- `recyclingTargets` exist for spaced repetition scheduling.
- UX/App Implementation Builder has wired it correctly.
- QA passes TypeScript/import/navigation checks.
- **QA's XcodeBuildMCP simulator walk-through passes end-to-end.**
- No full lyrics are included.
- Reading content is original.
- The lesson is documented in the daily log.
- Remaining issues are clearly listed.

## Team Workflow Model — Parallel work with dependency gates

Agents should work in parallel wherever their tasks do not depend on unfinished work from another agent.

The Orchestrator must begin every run by defining: which tasks can run in parallel; which tasks are dependency-gated; which agent owns which files; which agents may edit files vs. only research/plan; which quality gates must pass before the next wave starts; which teammate outputs are required before another teammate can continue.

### Wave 0 — Ultra-plan

- Orchestrator reads project context.
- Orchestrator identifies today's target module(s).
- Orchestrator creates dependency map.
- Orchestrator assigns agents.
- Orchestrator defines file ownership.
- Orchestrator defines which agents can work in parallel.
- No implementation edits happen yet.

### Wave 1 — Parallel discovery and validation

These agents may work in parallel:

- **Curriculum + Vocabulary Architect** validates module learning objectives, vocabulary theme, cultural note, and `recyclingTargets`.
- **Song, Lyrics + Copyright Validator** validates primary song and genre-aware alternatives (and verifies `spotifyId`/`youtubeId` resolve to correct songs).
- **UX + App Implementation Builder** reviews current app structure and identifies required data/schema/component changes.
- **Voice + Audio Engineer** reviews required `ttsTriggers` and audio manifest needs.
- **QA, Scribe + Notification Agent** prepares QA checklist and tracker requirements.

**Gate 1:** Before lesson content is finalized, the Orchestrator must confirm: curriculum target approved; vocabulary theme approved; functional speaking goal approved; cultural note direction approved; `recyclingTargets` defined; song/concept fit approved or marked for human review; genre-aware alternatives exist or marked for review; required data model fields understood; copyright-safe boundaries clear.

### Wave 2 — Parallel content and structure build

These agents may work in parallel:

- **Lesson Content Builder** creates lesson content, reading, vocabulary, and easy/standard/hard quiz variants.
- **UX + App Implementation Builder** creates or updates reusable data structures/components needed to support the lesson.
- **Voice + Audio Engineer** creates `ttsTriggers` and audio manifest format.
- **QA, Scribe + Notification Agent** updates documentation templates and prepares validation checks.

**Gate 2:** Before final implementation is marked complete, the Orchestrator must confirm: lesson content complete; quiz variants exist; cultural note exists; genre-aware alternatives exist or marked for review; pronunciation audio cues exist; `recyclingTargets` exist; no full lyrics stored or displayed; no unsupported artist/cultural claims introduced.

### Wave 3 — Parallel implementation, QA, and documentation

These agents may work in parallel:

- **UX + App Implementation Builder** wires approved lesson content into the app.
- **Voice + Audio Engineer** generates or prepares audio assets if API setup is available.
- **QA, Scribe + Notification Agent** runs TypeScript checks, runs XcodeBuildMCP simulator walk-through, validates quality gates, updates `PROGRESS.md` and Obsidian logs.
- **Orchestrator** monitors conflicts, summarizes progress, sends tasks back for revision if needed.

**Final Gate:** A lesson can only be marked complete when: QA passes; the app compiles; the simulator walk-through completes the full lesson loop end-to-end; required module additions are present; legal/copyright rules respected; documentation updated; remaining issues clearly listed for Reine.

## Important Autonomy Rules

- Act autonomously within the Melodia project after the initial plan is approved.
- Do not ask me for every terminal command.
- Do not ask me for every file edit.
- Do not prompt me for routine read/write/test/git operations if permissions allow.
- **Do** ask me before destructive commands, paid service setup, credential entry, deleting files, force resets, changing app architecture, or changing product direction.

## Permissions Preference

I want relaxed permissions within this project so the team can work efficiently. The project `.claude/settings.json` is already configured with `defaultMode: "bypassPermissions"` and pre-approved tools (Read, Edit, Write, Bash for npm/npx/node/git/expo/eas/tsc, Agent, TeamCreate, SendMessage, TaskCreate, etc.).

Pre-approved operations: reading files, editing project files, running TypeScript checks, running tests, updating documentation, creating new lesson data files, creating small reusable components when needed, running safe local commands, using XcodeBuildMCP for simulator work.

**Do not proceed without asking me before:** Deleting files; force resetting git; changing credentials; adding paid services; entering API keys; changing payment/subscription logic; changing app architecture; installing large or unnecessary dependencies; moving beyond Phase 4.

## Display Mode Preference

Use cmux's **native agent view** to show teammate activity. The project `.claude/settings.json` no longer sets `teammateMode: "tmux"`. If the team creation tool defaults to tmux, override it to agent view.

## Token Rules

- Keep the team small.
- Prefer 3 to 5 active teammates at a time.
- Do not spawn all 7 agents if the task does not need all 7.
- Summarize findings instead of repeating full docs.
- Do not re-read entire documents unnecessarily after they have been summarized.
- Stop and summarize if context is getting too large.
- If building 3 lessons causes quality to drop, reduce to 2 or 1 lesson.
- If a task is simple and does not require collaboration, let the Orchestrator assign it to one agent instead of spawning multiple agents.

## Start Pattern

Do not start by building 3 lessons immediately.

Start by making the system reliable:

- **First run:** Build or validate one complete gold-standard lesson — **Module 4 (Prepositions, Conjunctions & Adverbs, A1)**.
- Then build one lesson/day in Week 1.
- Move to two lessons/day in Week 2 only if QA is stable.
- Move to three lessons/day in Week 3+ only if the system is reliable.

## Expected Final Output After You Create the Team

1. Confirm the team structure.
2. Confirm which teammates are active for the first run.
3. Show the planning output before edits.
4. Show the parallel work plan.
5. Show the task dependency map.
6. Show the file ownership map.
7. Show the QA gates.
8. Confirm the first lesson/module target = **Module 4**.
9. Then execute according to the plan.
