---
description: Generate Melodia lesson audio (.mp3 files) from a narration manifest using the local .env's OPENAI_API_KEY. Run on Mac after the cloud agent produced a daily lesson manifest overnight.
argument-hint: "[module-id or 'today' or path/to/manifest.json]"
---

# /melodia-audio — generate audio from narration manifest

You are generating Melodia lesson audio on Reine's Mac using OpenAI TTS. The cloud agent wrote a narration manifest overnight; your job is to convert it to actual .mp3 files.

## Step 1 — Identify the manifest

User argument: `$ARGUMENTS`

Resolve the manifest path as follows:
- If `$ARGUMENTS` is a number (e.g., `4`), use `notes/melodia/lessons/module-004-tts.json`
- If `$ARGUMENTS` is `today` or empty, find the most recent `module-*-tts.json` file in `notes/melodia/lessons/`
- If `$ARGUMENTS` is a path, use it directly

If no manifest exists, abort with an error explaining the cloud agent must have run first.

## Step 2 — Verify OPENAI_API_KEY

Read `.env` and verify `OPENAI_API_KEY` is set and starts with `sk-`. If missing, abort and tell Reine to add the key per `docs/agent-teams-reference.md` or this conversation's earlier instructions.

## Step 3 — Generate audio

For each `ttsTrigger` in the manifest:

1. Compute output path: `assets/audio/module-{NNN}/{filename}.mp3`
2. **Skip if file already exists** (cache hit — don't regenerate)
3. Make a `curl` call to OpenAI TTS:

```bash
curl -s -o "$OUTPUT_PATH" https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"tts-1-hd\",\"voice\":\"$VOICE\",\"input\":$TEXT_JSON_ESCAPED,\"speed\":$SPEED,\"response_format\":\"mp3\"}"
```

Where:
- `$VOICE` = `nova` (default) or `shimmer` (if `voiceStyle: secondary` in the trigger)
- `$SPEED` = `0.85` (if `slowVersion: true`) or `1.0` (otherwise)
- `$TEXT_JSON_ESCAPED` = the trigger's `text` field, properly JSON-escaped

4. Verify the output file is non-empty (>1KB). If not, log error and continue.
5. Compute `estimatedCost = (chars / 1_000_000) * 30` (tts-1-hd is $30/M chars)
6. Append to `notes/melodia/audio-cost-log.csv`:
   `YYYY-MM-DD,N,openai,$chars,$cost,$output_path`

## Step 4 — Summary

Print to Reine:

```
Audio generation complete:
  Module N (concept — song)
  Generated: X new files
  Cached (skipped): Y files
  Failed: Z files (if any, list them)
  Total chars: $CHARS
  Estimated cost: $0.XX
  Output dir: assets/audio/module-{NNN}/
```

If any files failed, prompt Reine to check the manifest or rerun.

## Step 5 — Commit the audio

After generation:

```bash
git add assets/audio/module-{NNN}/ notes/melodia/audio-cost-log.csv
git commit -m "feat(audio): generate Module N audio via openai tts-1-hd"
git push
```

(Per the global memory rule: always push after commit.)

## Performance target

A typical module (~50 cues × ~40 chars avg = 2000 chars) should generate in 15-30 seconds. If a single API call takes >10 seconds, something is wrong — abort and surface the issue.

## Constraints

- Never echo or log the OPENAI_API_KEY value.
- Never commit `.env` (it's gitignored anyway).
- Don't regenerate files that already exist — cache discipline saves money.
- Don't add new dependencies (use built-in `curl`, no npm packages).
