# Plan: Content Authoring for Modules 1–3
**Phase:** 4 — Lesson Flow
**Plan:** 2 of 5
**Deps:** 01 (types must exist on `Module`)

## Objective
Populate Modules 1, 2, and 3 in `src/data/modules.ts` with real `quizQuestions[]` (5 multiple-choice questions each, testing Spanish concepts) and `readingPassage[]` (100–200 word original passages tokenized as `ReadingPassageToken[]`). Optionally add `spotifyId` for the three songs to enable exact-track Spotify deep links. After this plan, downstream screen plans have real data to render.

## Context
- D-01: Quiz questions must be REAL grammar/vocabulary questions tied to each module's concept. No placeholders.
- D-02: Reading passages must be 100% original — never copied from Wikipedia, fan sites, lyrics sites, or any external source.
- D-03: Content lives inline in `modules.ts` — same place `vocabulary[]` already lives.
- D-04: Passages are pre-tokenized as `{ text, isSpanish, english? }` arrays.

**COPYRIGHT — NON-NEGOTIABLE (CLAUDE.md §"Critical Legal & Copyright Rules"):**
- NEVER quote song lyrics in quiz options or in reading passages.
- Quiz questions test SPANISH CONCEPTS — e.g., "What does 'qué' mean?" — NOT "What word did Shakira sing in the chorus?"
- Reading passages must be authored from scratch. Do not transcribe content from any external source. Original phrasing only.

**Tokenization convention (from research §"Reading Passage Token Authoring Convention"):**
- Non-Spanish tokens include leading/trailing spaces in their `text` value: `{ text: "Shakira was born in ", isSpanish: false }`
- Spanish tokens do NOT include surrounding spaces: `{ text: "hola", isSpanish: true, english: "hello" }`
- Punctuation can ride along with the adjacent English token.

## Tasks

### Task 1: Add quizQuestions and readingPassage to Module 1
**Type:** content
**Files modified:** `src/data/modules.ts`
**Blocking:** no

Module 1 = "The Spanish Alphabet" (concept: pronunciation, the 27-letter alphabet, song: "Bésame Mucho" by Consuelo Velázquez). Locate the Module 1 object in MODULES array (starts around line 83). Add these two fields after `xpReward: 100,`:

```typescript
quizQuestions: [
  {
    question: 'How is the Spanish vowel "i" always pronounced?',
    options: ['Like "eye" in English', 'Like "ee" in "see"', 'Like "ih" in "sit"', 'Like "y" in "fly"'],
    correctIndex: 1,
    explanation: 'Spanish vowels are pure and consistent. "i" is always pronounced "ee".',
  },
  {
    question: 'Which letter is ALWAYS silent in Spanish?',
    options: ['j', 'h', 'v', 'r'],
    correctIndex: 1,
    explanation: 'The Spanish "h" is silent in every word: hola, hablar, hacer.',
  },
  {
    question: 'How is the double "ll" pronounced in most Spanish dialects?',
    options: ['Like English "l"', 'Like English "y"', 'Like English "j"', 'Like a rolled "r"'],
    correctIndex: 1,
    explanation: '"ll" sounds like "y" — so "llamar" sounds like "ya-mar".',
  },
  {
    question: 'What sound does "ñ" make?',
    options: ['"n" as in "no"', '"ng" as in "sing"', '"ny" as in "canyon"', 'Silent'],
    correctIndex: 2,
    explanation: '"ñ" makes the "ny" sound — niño = "neen-yo".',
  },
  {
    question: 'How many letters are in the modern Spanish alphabet?',
    options: ['26', '27', '28', '29'],
    correctIndex: 1,
    explanation: 'The modern Spanish alphabet has 27 letters — the 26 English letters plus ñ.',
  },
],
readingPassage: [
  { text: 'In 1940, a sixteen-year-old girl in Mexico City sat down at a piano and composed one of the most-recorded songs in history. Her name was Consuelo Velázquez, and the song was ', isSpanish: false },
  { text: '"Bésame Mucho"', isSpanish: true, english: 'Kiss Me a Lot' },
  { text: '. What makes it remarkable is not just the melody, but that Consuelo had never been kissed when she wrote it. She built the song from imagination and the bolero traditions she had grown up with. ', isSpanish: false },
  { text: 'Hola', isSpanish: true, english: 'Hello' },
  { text: ' is the first word most Spanish learners say, but a song can be the first phrase that truly sticks. Consuelo went on to perform with major orchestras and serve in the Mexican government, but the song followed her everywhere — translated into more than twenty languages and recorded by artists from Frank Sinatra to The Beatles. Listen closely to the chorus and you can hear the Spanish ', isSpanish: false },
  { text: 'b', isSpanish: true, english: 'the letter b' },
  { text: ' and ', isSpanish: false },
  { text: 'v', isSpanish: true, english: 'the letter v' },
  { text: ' that sound nearly identical, the ', isSpanish: false },
  { text: 'h', isSpanish: true, english: 'silent letter h' },
  { text: ' that you never hear, and the rolling vowels that make Spanish so musical. The whole alphabet, in one love song from a girl who had not yet lived the feeling.', isSpanish: false },
],
```

Optionally, add `spotifyId` to `song`:
```typescript
song: { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', durationSeconds: 210, spotifyId: '6jXSjt2gZkLQ9yEAGOC7CR' },
```
(If unsure of the exact ID, omit `spotifyId` — the helper falls back to a search URL.)

### Task 2: Add quizQuestions and readingPassage to Module 2
**Type:** content
**Files modified:** `src/data/modules.ts`
**Blocking:** no

Module 2 = "Accents & Stress" (concept: accent marks change meaning; default stress rules; song: "Quizás, Quizás, Quizás" by Nat King Cole). Locate the Module 2 object and add:

```typescript
quizQuestions: [
  {
    question: 'What does the accent on "él" change about the word?',
    options: [
      'Nothing — it is decorative',
      'It changes "the" into "he"',
      'It changes the pronunciation only',
      'It marks a question',
    ],
    correctIndex: 1,
    explanation: '"el" (no accent) = "the". "él" (with accent) = "he". The mark distinguishes meaning.',
  },
  {
    question: 'Which Spanish word means "yes"?',
    options: ['si', 'sí', 'se', 'sé'],
    correctIndex: 1,
    explanation: '"sí" with an accent means "yes". "si" without an accent means "if".',
  },
  {
    question: 'Where is the stress placed on the word "hablo" (I speak)?',
    options: ['HA-blo', 'ha-BLO', 'Equal stress on both', 'Stress depends on dialect'],
    correctIndex: 0,
    explanation: 'Words ending in a vowel, n, or s stress the second-to-last syllable by default — HA-blo.',
  },
  {
    question: 'Which question word is missing its required accent mark?',
    options: ['¿Qué?', '¿Cómo?', '¿Donde?', '¿Cuándo?'],
    correctIndex: 2,
    explanation: 'All Spanish question words carry accents when used as questions: ¿Dónde? not ¿Donde?',
  },
  {
    question: 'What does the accent on "tú" tell you?',
    options: [
      'It means "your"',
      'It means "you" (pronoun)',
      'It marks a stressed syllable only',
      'It signals a question',
    ],
    correctIndex: 1,
    explanation: '"tu" = your (possessive). "tú" with accent = you (subject pronoun).',
  },
],
readingPassage: [
  { text: 'Karla Camila Cabello was born in Havana, Cuba in 1997 and moved to the United States as a child. She grew up speaking Spanish at home and English at school — a balance that later shaped her music. After auditioning for a singing competition at fifteen, she joined a group that became briefly famous, then left to build a solo career on her own terms. Her first solo hit, ', isSpanish: false },
  { text: '"Havana"', isSpanish: true, english: 'a love letter to her birth city' },
  { text: ', made it impossible to ignore where she came from. The video opens with the words ', isSpanish: false },
  { text: 'la habana', isSpanish: true, english: 'Havana, written with no capital letters' },
  { text: ' on screen, and the chorus carries that lilting Cuban rhythm into pop radio worldwide. Camila has said that singing in Spanish feels different — the vowels are more open, the accents land in different places, and the meaning hits harder. Pay attention to how she pronounces ', isSpanish: false },
  { text: 'sí', isSpanish: true, english: 'yes' },
  { text: ' versus ', isSpanish: false },
  { text: 'si', isSpanish: true, english: 'if' },
  { text: ', or ', isSpanish: false },
  { text: 'tú', isSpanish: true, english: 'you' },
  { text: ' versus ', isSpanish: false },
  { text: 'tu', isSpanish: true, english: 'your' },
  { text: '. The accent marks are small, but in her singing they carry the entire emotion of a line.', isSpanish: false },
],
```

### Task 3: Add quizQuestions and readingPassage to Module 3
**Type:** content
**Files modified:** `src/data/modules.ts`
**Blocking:** no

Module 3 = "Question Words" (concept: ¿Qué? ¿Dónde? ¿Cómo? and the rest; song: "¿Dónde Jugarán los Niños?" by Maná). Locate the Module 3 object and add:

```typescript
quizQuestions: [
  {
    question: 'What does "¿Qué?" mean in English?',
    options: ['Who?', 'Where?', 'What?', 'When?'],
    correctIndex: 2,
    explanation: '¿Qué? = What?',
  },
  {
    question: 'How do you ask "Where?" in Spanish?',
    options: ['¿Quién?', '¿Dónde?', '¿Cuándo?', '¿Cómo?'],
    correctIndex: 1,
    explanation: '¿Dónde? = Where?',
  },
  {
    question: 'Which question word means "Why?"',
    options: ['¿Por qué?', '¿Cuál?', '¿Cuánto?', '¿Cómo?'],
    correctIndex: 0,
    explanation: '¿Por qué? = Why? (Note: literally "for what?")',
  },
  {
    question: 'What is missing from this Spanish question: "Cómo estás?"',
    options: ['The verb', 'The subject pronoun', 'The opening ¿', 'Nothing — it is correct'],
    correctIndex: 2,
    explanation: 'Every Spanish question opens with an inverted ¿ — "¿Cómo estás?"',
  },
  {
    question: 'You want to ask "Who is that?" — which word starts your question?',
    options: ['¿Qué?', '¿Quién?', '¿Cuál?', '¿Dónde?'],
    correctIndex: 1,
    explanation: '¿Quién? = Who?',
  },
],
readingPassage: [
  { text: 'Maná started in a garage in Guadalajara, Mexico in the 1980s. Four friends who could barely afford instruments rehearsed rock songs until the neighbors banged on the walls. They called themselves Sombrero Verde at first, then changed the name to Maná — a word that, in their telling, came from a dream. The band found their voice when they stopped imitating American rock and started writing in Spanish about the things they actually cared about: love, the environment, immigration, and the kids who had nowhere to play. Their song ', isSpanish: false },
  { text: '¿Dónde jugarán los niños?', isSpanish: true, english: 'Where will the children play?' },
  { text: ' became an anthem because it asked a question every parent already felt. The lyrics never preach — they just keep asking. ', isSpanish: false },
  { text: '¿Cómo', isSpanish: true, english: 'How' },
  { text: ' did we get here? ', isSpanish: false },
  { text: '¿Dónde', isSpanish: true, english: 'Where' },
  { text: ' did the forests go? ', isSpanish: false },
  { text: '¿Por qué', isSpanish: true, english: 'Why' },
  { text: ' did no one stop it? Spanish question words land harder than English ones because they are short, sharp, and carry an accent mark that pulls your voice up at the end. Maná sold over forty million albums by asking questions instead of giving answers.', isSpanish: false },
],
```

### Task 4: Verify the file still compiles
**Type:** fix
**Files modified:** none (verification step)
**Blocking:** no

Run from project root:
```bash
npx tsc --noEmit
```

Expected: zero errors. If `correctIndex` complains, ensure each value is `0`, `1`, `2`, or `3` literal — not a generic `number`. If `options` complains, ensure each is a 4-tuple (4 string elements exactly).

Also grep to confirm no lyric snippets snuck in:
```bash
grep -in "lyrics\|chorus says\|sang the line" /Users/reinebadejoko/Desktop/app/melodia-app/src/data/modules.ts
```
Expected: empty.

## Verification

1. `npx tsc --noEmit` passes.
2. Open `src/data/modules.ts` and confirm modules 1, 2, 3 each have `quizQuestions` of length 5 and `readingPassage` arrays.
3. Spot-check: every `correctIndex` is in range `0`–`3`. Every quiz question is about Spanish concepts (alphabet, accents, question words), never about song lyrics.
4. Spot-check: every reading passage is fewer than 250 words, written in original phrasing, and tokenized so Spanish words are flagged with `isSpanish: true` and have `english` translations.
5. No passage references specific song lyrics or quotes from the artist.

## Requirements Coverage
- CONTENT-01 (Module 1 has 5 quiz questions + reading passage)
- CONTENT-02 (Module 2 has 5 quiz questions + reading passage)
- CONTENT-03 (Module 3 has 5 quiz questions + reading passage)
- CONTENT-04 (all quiz questions test Spanish concepts, never lyrics)
- CONTENT-05 (all reading passages are original)
- Supports QUIZ-01 (3–5 multiple choice questions) and QUIZ-02 (Spanish concepts only)
- Supports READ-01 (original 100–200 word passage) and READ-03 (level-appropriate ratio — A1 means mostly English with Spanish words inserted)
