// ─── Types ────────────────────────────────────────────────────────────────────

export type CEFRLevel =
  | 'A1'
  | 'A1-A2'
  | 'A2'
  | 'A2-B1'
  | 'B1'
  | 'B1-B2'
  | 'B2';

// Display level: maps transition levels to their tab in the UI
export type DisplayLevel = 'A1' | 'A2' | 'B1' | 'B2';

export function getDisplayLevel(level: CEFRLevel): DisplayLevel {
  switch (level) {
    case 'A1':    return 'A1';
    case 'A1-A2': return 'A2';
    case 'A2':    return 'A2';
    case 'A2-B1': return 'B1';
    case 'B1':    return 'B1';
    case 'B1-B2': return 'B2';
    case 'B2':    return 'B2';
  }
}

export type ModuleStatus = 'completed' | 'active' | 'unlocked' | 'locked';

export type GenreTrack = 'pop' | 'reggaeton' | 'rnb' | 'regional-mexican';

export type Song = {
  title: string;
  artist: string;
  durationSeconds: number;
  spotifyId?: string;
  youtubeId?: string;
};

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
};

export type ReadingPassageToken = {
  text: string;
  isSpanish: boolean;
  english?: string;
  phonetic?: string;
};

export type VocabWord = {
  spanish: string;
  english: string;
};

// ─── Module 4+ enrichment types ───────────────────────────────────────────────

export type TtsTrigger = {
  id: string;
  screen: 'preListen' | 'listen' | 'quiz' | 'reading' | 'lessonComplete';
  text: string;
  language: string;
  slowVersion: boolean;
  normalVersion: boolean;
  outputFile: string;
  mvpRequired: boolean;
};

export type RecyclingTarget = {
  moduleId: number;
  concept: string;
  intervalDays: number[];
  reviewFormat: ('mini-quiz' | 'speaking-prompt' | 'translation' | 'listening-recognition')[];
};

// ─── Curriculum Enrichment Types ──────────────────────────────────────────────
// Added in curriculum update: vocabulary/speaking/listening/review overlay

export type SongDifficulty = {
  pace: 'slow' | 'medium' | 'fast';
  clarity: 'clear' | 'moderate' | 'difficult';
  slangLevel: 'none' | 'light' | 'moderate' | 'heavy';
  repetitionLevel: 'low' | 'medium' | 'high';
  beginnerSuitability: 'excellent' | 'good' | 'moderate' | 'challenging';
};

export type VocabPack = {
  coreWords: VocabWord[];    // 5 high-frequency words tied to the vocabulary theme
  bonusWords: VocabWord[];   // 3 slightly harder, still thematic
  phraseChunk: string;       // reusable phrase with a blank, e.g. "Quiero ___."
  speakingPattern: string;   // 3 example sentences showing the pattern in use
};

export type SpeakingPrompts = {
  prompts: string[];         // 3 "Say: ..." instructions for speaking practice
  sentenceFrames: string[];  // 3 fillable sentence frames in Spanish
  miniChallenge: string;     // one real-life speaking challenge combining grammar + context
};

export type Module = {
  id: number;
  title: string;
  level: CEFRLevel;
  concept: string;
  conceptDescription: string;
  song: Song;                                    // primary song (shown by default)
  genreSongs: Partial<Record<GenreTrack, Song>>; // genre overrides — agents fill these in
  vocabulary: VocabWord[];
  grammarPoints: string[];
  quizTypes: string[];
  readingTopic: string;
  readingRatio: string;   // e.g. "90% English / 10% Spanish"
  songsNeeded: number;
  status: ModuleStatus;
  xpReward: number;
  quizQuestions?: QuizQuestion[];
  easyQuizQuestions?: QuizQuestion[];
  hardQuizQuestions?: QuizQuestion[];
  readingPassage?: ReadingPassageToken[];
  culturalNote?: string;
  culturalNoteVariants?: Partial<Record<GenreTrack, string>>;
  ttsTriggers?: TtsTrigger[];
  // ── Curriculum enrichment overlay ──────────────────────────────────────────
  vocabularyTheme?: string;           // real-world vocabulary category for this module
  speakingGoal?: string;              // what the user can say after completing this module
  listeningSkill?: string;            // what to listen for actively in the song
  recyclingTargets?: RecyclingTarget[]; // spaced-repetition review schedule from earlier modules
  vocabPack?: VocabPack;             // 5 core + 3 bonus words + phrase chunk + pattern
  speakingPrompts?: SpeakingPrompts; // 3 prompts + 3 frames + 1 mini challenge
  songDifficulty?: SongDifficulty;   // pace/clarity/slang/repetition/beginner rating
  survivalPhrases?: string[];         // modules 1–12: essential phrases for this topic
  everydayVocabCategories?: string[]; // modules 1–30: adjacent real-world vocab categories
};

// Returns the best song for the user's genre preference, falls back to primary
export function getSongForGenre(module: Module, genre: GenreTrack | null): Song {
  if (genre && module.genreSongs[genre]) return module.genreSongs[genre]!;
  return module.song;
}

// ─── Level sections (4-tab UI) ────────────────────────────────────────────────

export const LEVEL_SECTIONS: { level: DisplayLevel; label: string; description: string; moduleRange: string }[] = [
  { level: 'A1', label: 'A1 Beginner',           description: 'First steps in Spanish',   moduleRange: '1–8' },
  { level: 'A2', label: 'A2 Elementary',          description: 'Building foundations',     moduleRange: '9–19' },
  { level: 'B1', label: 'B1 Intermediate',        description: 'Finding your voice',       moduleRange: '20–49' },
  { level: 'B2', label: 'B2 Advanced',            description: 'Near fluency',             moduleRange: '50–60' },
];

export const FREE_MODULE_LIMIT = 8;

// ─── Module data ──────────────────────────────────────────────────────────────

export const MODULES: Module[] = [

  // ── A1 Beginner — Modules 1–8 ─────────────────────────────────────────────

  {
    id: 1,
    title: 'The Spanish Alphabet',
    level: 'A1',
    concept: 'Pronunciation & the 27-letter alphabet',
    conceptDescription:
      'Spanish is almost perfectly phonetic — once you know the sounds, you can read anything out loud. Start here and the rest of the language opens up.',
    song: { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', durationSeconds: 210, spotifyId: '6jXSjt2gZkLQ9yEAGOC7CR', youtubeId: 'MY0fuEfBmD4' },
    genreSongs: {
      pop: { title: 'Limón y Sal', artist: 'Julieta Venegas', durationSeconds: 218, spotifyId: '7dITAq1YP5e0kTcaDq4YWI', youtubeId: 'tIpzfs5tBJU' },
      reggaeton: { title: 'Gasolina', artist: 'Daddy Yankee', durationSeconds: 192, spotifyId: '6jEZLz3YpnEBRpVkv35AmP', youtubeId: 'CCF1_jI8Prk' },
      rnb: { title: 'Burbujas de Amor', artist: 'Juan Luis Guerra 4.40', durationSeconds: 245, spotifyId: '0TarPYIjJndYucFUOMce8P', youtubeId: 'PWGwF_B0bxk' },
      'regional-mexican': { title: 'Cielito Lindo', artist: 'Vicente Fernández', durationSeconds: 195, spotifyId: '1YIE0WBii65tRNXsxV5iGs', youtubeId: 'T6o_zaTvHSI' },
    },
    vocabulary: [
      { spanish: 'a, e, i, o, u', english: 'the 5 vowels — always the same pure sound' },
      { spanish: 'ñ', english: '"ny" sound — niño, mañana, año' },
      { spanish: 'll', english: '"y" sound — llamar, llevar, llorar' },
      { spanish: 'h', english: 'always silent — hola, hablar, hacer' },
      { spanish: 'rr', english: 'rolled r — perro, carro, tierra' },
    ],
    grammarPoints: [
      '27-letter alphabet — includes ñ, not in English',
      'Vowels are always pure: a (ah), e (eh), i (ee), o (oh), u (oo)',
      'H is always silent: hola, hablar, hacer, hay',
      'LL sounds like "y": llamar, lluvia, llevar',
      'RR is a trilled roll: perro, carro, tierra',
    ],
    quizTypes: ['Letter identification', 'Sound matching', 'Pronunciation listening'],
    readingTopic: 'Consuelo Velázquez: The Woman Who Wrote Bésame Mucho at 16',
    readingRatio: '100% English with 5 Spanish words highlighted',
    songsNeeded: 2,
    status: 'completed',
    xpReward: 100,
    culturalNote:
      "The Girl Who Wrote Bésame Mucho — Picture a teenager at a piano in Mexico City around 1940. Her name is Consuelo Velázquez, and she has never been kissed. Out of her imagination and the bolero records spinning in her house, she writes a song called 'Bésame Mucho' — 'Kiss Me a Lot.' Within a decade it will be one of the most-recorded songs in history, translated into more than twenty languages and sung by Frank Sinatra, The Beatles, Plácido Domingo, and dozens more. What makes it your first listening text is not the romance — it is the sound. Consuelo's lyrics live almost entirely inside pure Spanish vowels and gentle consonants: the steady é in 'bésame,' the pure u in 'mucho.' Nothing in this song will ask your ear to do anything it cannot already do today. That is the point. A Mexican teenager wrote you a perfect first lesson.",
    quizQuestions: [
      {
        question: 'The title "Bésame Mucho" starts with B. In Spanish, B and V sound almost identical — like a soft ___',
        options: ['hard "p" sound', 'gentle sound between English "b" and "v"', 'silent letter', 'hard "d" sound'],
        correctIndex: 1,
        explanation: 'Spanish B and V are nearly indistinguishable — both are soft bilabial sounds, unlike the distinct English versions.',
      },
      {
        question: 'The word "bésame" has an accent on the é. What does that accent mark tell you?',
        options: ['The word is feminine', 'Stress that syllable when you say it', 'It marks a question', 'The word is a verb'],
        correctIndex: 1,
        explanation: 'The accent on é in BÉ-sa-me tells you to stress that syllable. Without the accent, stress would fall elsewhere.',
      },
      {
        question: 'How many syllables are in the word "bésame"?',
        options: ['1', '2', '3', '4'],
        correctIndex: 2,
        explanation: 'Bé-sa-me has three syllables: BÉ-sa-me. Say it with the stress on the first.',
      },
      {
        question: 'The word "mucho" contains the letter U. How is the Spanish U always pronounced?',
        options: ['Like "uh" in "cup"', 'Like "oo" in "food"', 'Like "you" in English', 'Like "u" in "but"'],
        correctIndex: 1,
        explanation: 'Spanish U is always a pure "oo" sound — so "mucho" sounds like "MOO-cho".',
      },
      {
        question: '"Mucho" is one of the first Spanish words English speakers recognize. What does it mean?',
        options: ['beautiful', 'music', 'a lot / very much', 'goodbye'],
        correctIndex: 2,
        explanation: '"Mucho" means "a lot" or "very much." Bésame Mucho = "Kiss Me a Lot."',
      },
    ],
    easyQuizQuestions: [
      {
        question: 'How is the letter H pronounced in Spanish words like "hola" and "hablar"?',
        options: [
          'Like the English "h" in "hat"',
          'Silent — you do not say it at all',
          'Like a soft "j" sound',
          'Like an "f" sound',
        ],
        correctIndex: 1,
        explanation:
          'The Spanish H is always silent. "Hola" sounds like "OH-la" — no breath at the start. This is the single most common mistake English speakers make on day one.',
      },
      {
        question: 'Which letter in the Spanish alphabet does NOT exist in the English alphabet?',
        options: ['ll', 'rr', 'ñ', 'h'],
        correctIndex: 2,
        explanation:
          'Ñ is its own letter in Spanish — not just an N with a decoration. It sounds like "ny" in "canyon" and appears in words like niño and mañana.',
      },
      {
        question: 'What does the word "hola" mean?',
        options: ['goodbye', 'please', 'hello', 'thank you'],
        correctIndex: 2,
        explanation:
          '"Hola" means "hello" — usually the first Spanish word anyone learns. And remember: the H is silent, so it sounds like "OH-la."',
      },
    ],
    hardQuizQuestions: [
      {
        question: 'Three of these Spanish words contain a silent letter. Which one does NOT?',
        options: ['hola', 'hablar', 'mucho', 'hacer'],
        correctIndex: 2,
        explanation:
          '"Mucho" has no silent letter — every sound is pronounced. The other three all start with a silent H. A useful test: if a Spanish word starts with H, the H stays quiet.',
      },
      {
        question: 'You see two written words: "pero" and "perro." What is the difference in how you say them?',
        options: [
          'They sound exactly the same — the extra R is silent',
          '"Pero" has one tapped R; "perro" has a rolled, trilled RR',
          '"Pero" is louder; "perro" is whispered',
          '"Perro" has a silent R; "pero" is rolled',
        ],
        correctIndex: 1,
        explanation:
          'A single R between vowels is a quick tap. A double RR is a full roll. The two words look almost identical on the page, but the trill changes everything. A single tap is fine if you can\'t roll yet — Spanish speakers will understand you.',
      },
      {
        question: 'Which of these Spanish words contains the "y"-like LL sound?',
        options: ['mañana', 'llamar', 'hola', 'mucho'],
        correctIndex: 1,
        explanation:
          '"Llamar" (to call) starts with LL, which in Spanish sounds like the English "y" — so it begins with a "ya-" sound, not an "la-" sound. The other three contain ñ, silent h, or a pure vowel run.',
      },
    ],
    readingPassage: [
      { text: 'In 1940, a sixteen-year-old girl in Mexico City sat down at a piano and composed one of the most-recorded songs in history. Her name was Consuelo Velázquez, and the song was ', isSpanish: false },
      { text: '"Bésame Mucho"', isSpanish: true, english: 'Kiss Me a Lot' },
      { text: '. What makes it remarkable is not just the melody, but that Consuelo had never been kissed when she wrote it. She built the song from imagination and the bolero traditions she had grown up with. ', isSpanish: false },
      { text: 'Hola', isSpanish: true, english: 'Hello' },
      { text: ' is the first word most Spanish learners say, but a song can be the first phrase that truly sticks. Consuelo went on to perform with major orchestras and serve in the Mexican government, but the song followed her everywhere — translated into more than twenty languages and recorded by artists from Frank Sinatra to The Beatles. Listen closely and your first alphabet lessons come alive: ', isSpanish: false },
      { text: 'bésame', isSpanish: true, english: 'kiss me', phonetic: 'BEH-sa-meh' },
      { text: ' shows how B and V blend into the same gentle sound. ', isSpanish: false },
      { text: 'llorar', isSpanish: true, english: 'to cry', phonetic: 'yo-RAR' },
      { text: ' shows the double-L that sounds like Y. And ', isSpanish: false },
      { text: 'hablar', isSpanish: true, english: 'to speak', phonetic: 'ah-BLAR' },
      { text: ' proves the H is always silent. The whole alphabet, in one love song from a girl who had not yet lived the feeling.', isSpanish: false },
    ],
    // Narration-style audio (v2) — replaces old slow+normal single-word format.
    // New files: m1-*.mp3 — generate via /melodia-audio 1 (module-001-tts-v2.json).
    // Reading tokens kept as single-word pronunciation files for tap-to-hear.
    ttsTriggers: [
      { id: 'm1-intro',               screen: 'preListen',      text: "Welcome to Module 1. Spanish is one of the most phonetic languages on earth — once you know the sounds, you can read anything out loud. As you listen to 'Bésame Mucho', pay attention to the vowels. Every vowel in the song sounds exactly the same as in every other Spanish word you'll ever hear.",                                                                                                                                                                                                  language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-intro-alphabet.mp3',    mvpRequired: true },
      { id: 'm1-vocab-vowels',         screen: 'preListen',      text: "Spanish has five vowels: a, e, i, o, u. Each one sounds exactly the same every single time — never reduced, never swallowed, never changed by the letters around it. A is 'ah', E is 'eh', I is 'ee', O is 'oh', U is 'oo'. Once those five sounds are in your ear, you can read any Spanish word out loud and it will sound right.",                                                                                                                                                                   language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-vocab-vowels.mp3',       mvpRequired: true },
      { id: 'm1-vocab-enye',           screen: 'preListen',      text: "'Ñ' is unique to Spanish — it doesn't exist in English. It sounds like the 'ny' in canyon. Think of it as the letter N wearing a little hat. Example words: niño, which means boy or child; mañana, meaning tomorrow or morning; año, meaning year. The tilde on top is the whole story — it transforms N into a completely different sound.",                                                                                                                                                          language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-vocab-enye.mp3',         mvpRequired: true },
      { id: 'm1-vocab-ll',             screen: 'preListen',      text: "'LL' in Spanish sounds like the English 'y' in 'yes' — a soft, gliding sound. It used to be considered a separate letter called elle, and in some regions it still sounds more like a 'j' or 'zh'. For standard Latin American Spanish, say it like 'y'. Example words: llamar — to call; llegar — to arrive; lluvia — rain. You'll hear this sound a lot in songs.",                                                                                                                                  language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-vocab-ll.mp3',           mvpRequired: true },
      { id: 'm1-vocab-h',              screen: 'preListen',      text: "The letter H in Spanish is completely silent — always. If you see an H, pretend it's not there. Hola is pronounced 'oh-la', not 'hoh-la'. Hablar — to speak — sounds like 'ah-BLAR'. Hotel sounds like 'oh-TEL'. The one exception is the combination CH, which sounds like the English 'ch' in cheese. But a standalone H? Silent, every time.",                                                                                                                                                   language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-vocab-h.mp3',            mvpRequired: true },
      { id: 'm1-vocab-rr',             screen: 'preListen',      text: "The double R — rr — is the famous Spanish trill. It's formed by flapping your tongue tip rapidly against the roof of your mouth, right behind your top teeth. Think of a child making a car engine sound. Words like perro — dog — and carro — car — need this full trill. A single R between vowels, like in pero — but — uses just one quick tap. The difference matters: perro is dog, pero is but. Two very different words.",                                                                    language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-vocab-rr.mp3',           mvpRequired: true },
      { id: 'm1-phrase-besame-mucho',  screen: 'preListen',      text: "'Bésame mucho' means 'kiss me a lot' — bésame means kiss me, and mucho means a lot or very much. This phrase has been recorded by hundreds of artists and is one of the most recognized Spanish phrases in the world. Notice how every vowel is clear and open: BEH-sa-meh MOO-cho. That's the Spanish vowel system doing its job — every syllable lands cleanly.",                                                                                                                                language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-phrase-besame-mucho.mp3', mvpRequired: true },
      { id: 'm1-reading-intro',        screen: 'reading',        text: "Now for a short reading passage about the song you just heard. You'll see some Spanish words highlighted in orange — tap any of them to hear the pronunciation and meaning. The goal here isn't to understand every word. It's to start recognizing the alphabet sounds you just learned, appearing in real text.",                                                                                                                                                                                       language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-reading-intro.mp3',      mvpRequired: true },
      { id: 'm1-lesson-complete',      screen: 'lessonComplete', text: "You just learned the foundation of Spanish pronunciation. The 27-letter alphabet, the five pure vowels, the silent H, the unique Ñ, the double-L, and the rolled RR. Spanish is phonetic — these rules work everywhere, every time. From here, every word you see, you can say out loud. That's a superpower. Next up: accent marks and stress — the tiny symbols that change meaning completely.",                                                                                              language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/m1-lesson-complete.mp3',    mvpRequired: true },
      // Reading tap tokens — single-word pronunciation (v1 files kept on disk)
      { id: 'reading-token-besame-mucho', screen: 'reading', text: 'Bésame Mucho', language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/reading-token-besame-mucho.mp3', mvpRequired: true },
      { id: 'reading-token-hola',         screen: 'reading', text: 'Hola',         language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/reading-token-hola.mp3',         mvpRequired: true },
      { id: 'reading-token-besame',       screen: 'reading', text: 'bésame',       language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/reading-token-besame.mp3',       mvpRequired: true },
      { id: 'reading-token-llorar',       screen: 'reading', text: 'llorar',       language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/reading-token-llorar.mp3',       mvpRequired: true },
      { id: 'reading-token-hablar',       screen: 'reading', text: 'hablar',       language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-001/reading-token-hablar.mp3',       mvpRequired: true },
    ],
  },

  {
    id: 2,
    title: 'Accents & Stress',
    level: 'A1',
    concept: 'Accent marks & stressed syllables',
    conceptDescription:
      'Those little marks over vowels aren\'t decoration — they change meaning and pronunciation entirely. Master them early and you\'ll sound natural from day one.',
    song: { title: 'Quizás, Quizás, Quizás', artist: 'Nat King Cole', durationSeconds: 174, youtubeId: 'rDGgUGBD-90' },
    genreSongs: {
      pop: { title: 'Señorita', artist: 'Shawn Mendes & Camila Cabello', durationSeconds: 193 },
      reggaeton: { title: 'Señorita', artist: 'Shawn Mendes & Camila Cabello', durationSeconds: 193 },
    },
    vocabulary: [
      { spanish: 'el vs él', english: '"the" (article) vs "he" (pronoun)' },
      { spanish: 'tu vs tú', english: '"your" (possessive) vs "you" (pronoun)' },
      { spanish: 'si vs sí', english: '"if" (conjunction) vs "yes"' },
      { spanish: 'se vs sé', english: 'reflexive particle vs "I know"' },
      { spanish: 'mas vs más', english: '"but" (literary) vs "more"' },
    ],
    grammarPoints: [
      'Accent marks change meaning: el (the) vs él (he)',
      'Most Spanish words stress the second-to-last syllable by default',
      'Words ending in a consonant (not n/s) stress the last syllable',
      'Accent marks override the default stress rule',
      'Question words always carry an accent: qué, dónde, cómo, cuándo',
    ],
    quizTypes: ['Identify stressed syllable', 'Accent placement', 'Meaning change pairs'],
    readingTopic: 'Camila Cabello: From Havana to Hollywood',
    readingRatio: '100% English with accented Spanish words highlighted',
    songsNeeded: 2,
    status: 'active',
    xpReward: 100,
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
    // Narration-style audio — generate via /melodia-audio 2 (module-002-tts.json)
    ttsTriggers: [
      { id: 'm2-intro',             screen: 'preListen',      text: "Module 2 is about accent marks — those little lines sitting over vowels in Spanish. They are not decoration. They change meaning, they change pronunciation, and they tell you exactly where to stress a word. As you listen to 'Quizás, Quizás, Quizás' by Nat King Cole, notice how the word quizás sounds — the stress lands on the last syllable, and that accent mark is why.",                                                                                                                                                                                                                                  language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-intro-accents.mp3',    mvpRequired: true },
      { id: 'm2-vocab-el-vs-el',    screen: 'preListen',      text: "Here's a pair that trips up learners for years: el without an accent means 'the' — it's the masculine article. Él with an accent on the E means 'he' — the pronoun. They sound identical out loud. The accent mark exists purely to tell you which one is on the page. El libro — the book. Él habla — he speaks. One little mark, two completely different jobs.",                                                                                                                                                                                                                                             language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-vocab-el-vs-el.mp3',   mvpRequired: true },
      { id: 'm2-vocab-tu-vs-tu',    screen: 'preListen',      text: "Tu without an accent means 'your' — a possessive. Tú with an accent on the U means 'you' — the pronoun. Again, identical sounds, completely different meanings on paper. Tu libro — your book. Tú hablas — you speak. Spanish uses accent marks as a disambiguation tool so you never have to guess from context alone which word is which.",                                                                                                                                                                                                                                                                   language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-vocab-tu-vs-tu.mp3',   mvpRequired: true },
      { id: 'm2-vocab-si-vs-si',    screen: 'preListen',      text: "Si without an accent means 'if' — a conditional connector. Sí with an accent on the I means 'yes'. Same sound, opposite jobs in a sentence. Si quieres — if you want. Sí, quiero — yes, I want. You'll see this pair constantly in song lyrics where singers say sí, sí, sí — yes, yes, yes — with the accent marking every single one as an affirmation, not a condition.",                                                                                                                                                                                                                                   language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-vocab-si-vs-si.mp3',   mvpRequired: true },
      { id: 'm2-vocab-se-vs-se',    screen: 'preListen',      text: "Se without an accent is a small grammar word you'll see in phrases like se llama — is called. Sé with an accent means 'I know'. They sound the same, but the accent tells your eyes which job the word is doing. Se llama Ana. Yo sé la respuesta. One mark, completely different meaning.",                                                                                                                                                                                                                                                                                    language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-vocab-se-vs-se.mp3',   mvpRequired: true },
      { id: 'm2-vocab-mas-vs-mas',  screen: 'preListen',      text: "Mas without an accent is an older, literary word for 'but'. Más with an accent means 'more' — the word you'll hear constantly in songs: más música, más amor, más y más. The accent on the á is what makes it 'more', not a connector.",                                                                                                                                                                                                                                                                                                                                 language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-vocab-mas-vs-mas.mp3', mvpRequired: true },
      { id: 'm2-phrase-el-acento-va-en', screen: 'preListen', text: "The phrase 'El acento va en blank' means 'The stress goes on blank'. Use it to talk about pronunciation: el acento va en tú; el acento va en más; el acento va en café. It gives you a sentence for explaining exactly where a word is stressed.",                                                                                                                                                                                                                                                                                                                language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-phrase-el-acento-va-en.mp3', mvpRequired: true },
      { id: 'm2-reading-intro',     screen: 'reading',        text: "Now a short reading passage about Camila Cabello, whose name itself is a great accent-mark lesson. You'll see Spanish words highlighted — some with accents, some without. Tap any of them to hear the word and see how the accent changes where the stress falls. Pay attention to how a single mark shifts the entire rhythm of a word.",                                                                                                                                                                                                                                                                         language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-reading-intro.mp3',    mvpRequired: true },
      { id: 'm2-lesson-complete',   screen: 'lessonComplete', text: "Accent marks are now in your toolkit. You know el from él, tu from tú, si from sí — and you know that quizás stresses the last syllable because the accent mark says so. From here on, every accent mark you see in a Spanish text is information, not decoration. Next up: question words — the eight little words that unlock thousands of real conversations.",                                                                                                                                                                                                                                                   language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-002/m2-lesson-complete.mp3',  mvpRequired: true },
    ],
  },

  {
    id: 3,
    title: 'Question Words',
    level: 'A1',
    concept: '¿Qué? ¿Dónde? ¿Cómo? and the rest',
    conceptDescription:
      'Eight question words unlock thousands of real conversations. Learn them once and they work in every tense, every context, forever.',
    song: { title: '¿Dónde Jugarán los Niños?', artist: 'Maná', durationSeconds: 275, spotifyId: '6wkt75iqzOk8YCCfwtaYqJ', youtubeId: 'KNo2o_TJF0I' },
    genreSongs: {
      pop: { title: 'Qué Calor', artist: 'Major Lazer ft. J Balvin & El Alfa', durationSeconds: 205 },
      reggaeton: { title: 'Qué Calor', artist: 'Major Lazer ft. J Balvin & El Alfa', durationSeconds: 205 },
    },
    vocabulary: [
      { spanish: '¿Qué?', english: 'What?' },
      { spanish: '¿Dónde?', english: 'Where?' },
      { spanish: '¿Cómo?', english: 'How?' },
      { spanish: '¿Quién?', english: 'Who?' },
      { spanish: '¿Por qué?', english: 'Why?' },
    ],
    grammarPoints: [
      '¿Qué? = What, ¿Quién? = Who, ¿Dónde? = Where',
      '¿Cuándo? = When, ¿Por qué? = Why, ¿Cómo? = How',
      '¿Cuál? = Which (out of options), ¿Cuánto/a? = How much/many',
      'Inverted ¿ opens every Spanish question — it\'s not optional',
      'Question words always carry an accent mark when used as questions',
    ],
    quizTypes: ['Match question word to meaning', 'Choose the right question word', 'Translate simple questions'],
    readingTopic: 'Maná: How a Guadalajara Garage Band Became Latin Rock Legends',
    readingRatio: '90% English / 10% Spanish — question words inserted throughout',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 100,
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
    // Narration-style audio — generate via /melodia-audio 3 (module-003-tts.json)
    ttsTriggers: [
      { id: 'm3-intro',           screen: 'preListen',      text: "Module 3 is about question words — the eight Spanish words that let you ask anything. Learn these once and they work in every tense, every context, for the rest of your life. As you listen to '¿Dónde Jugarán los Niños?' by Maná, the title itself is your first question: dónde — where. Where will the children play? One question word, carrying the weight of the whole song.",                                                                                                                                                                                                                                language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-intro-question-words.mp3', mvpRequired: true },
      { id: 'm3-vocab-que',       screen: 'preListen',      text: "'¿Qué?' means 'what?' — the most versatile question word in Spanish. Qué without the accent mark means 'that' or 'which', so the accent is doing real work here. ¿Qué es esto? — What is this? ¿Qué quieres? — What do you want? In songs, you'll hear ¿qué? used to express surprise, confusion, or emphasis. It's one syllable, sharp and direct: 'keh'.",                                                                                                                                                                                                                                                            language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-vocab-que.mp3',            mvpRequired: true },
      { id: 'm3-vocab-donde',     screen: 'preListen',      text: "'¿Dónde?' means 'where?' — your location question word. The accent on the ó tells you to stress the first syllable: DON-deh. ¿Dónde estás? — Where are you? ¿Dónde vives? — Where do you live? Without the accent, donde (no accent) means 'where' in a non-question context — as in the place where something happens. The accent is what makes it a question word.",                                                                                                                                                                                                                                                       language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-vocab-donde.mp3',          mvpRequired: true },
      { id: 'm3-vocab-como',      screen: 'preListen',      text: "'¿Cómo?' means 'how?' — and also 'what?' when you're asking someone to repeat themselves. The accent on the ó: CO-mo. ¿Cómo estás? — How are you? ¿Cómo te llamas? — What's your name? ¿Cómo? on its own is the polite way to say 'sorry, could you repeat that?' — more useful in real conversations than almost any other phrase.",                                                                                                                                                                                                                                                                                     language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-vocab-como.mp3',           mvpRequired: true },
      { id: 'm3-vocab-quien',     screen: 'preListen',      text: "'¿Quién?' means 'who?' — singular. The accent on the é: kyEN. ¿Quién eres tú? — Who are you? ¿Quién cantó eso? — Who sang that? The plural form is ¿quiénes? — who are they. Notice the QU in Spanish always makes a K sound — the U is silent after Q. So quién sounds like 'kyen', not 'kwyen'.",                                                                                                                                                                                                                                                                                                                     language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-vocab-quien.mp3',          mvpRequired: true },
      { id: 'm3-vocab-por-que',   screen: 'preListen',      text: "'¿Por qué?' means 'why?' — written as two words with an accent on the é. The answer word is 'porque' — because — written as one word with no accent. ¿Por qué te gusta esta canción? — Why do you like this song? Porque es perfecta — Because it's perfect. Two words, one accent = the question. One word, no accent = the answer. Spanish made them mirror images of each other on purpose.",                                                                                                                                                                                                                            language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-vocab-por-que.mp3',        mvpRequired: true },
      { id: 'm3-phrase-question-frame', screen: 'preListen', text: "The question frame '¿blank es tu blank?' gives you a reusable shell for asking about someone's favorites and identity. Try it with the words from this module: ¿Cuál es tu canción favorita? ¿Dónde está tu casa? ¿Cómo se llama tu artista favorito? The inverted question mark tells your eyes the question starts right now.",                                                                                                                                                                                                                                                   language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-phrase-question-frame.mp3', mvpRequired: true },
      { id: 'm3-reading-intro',   screen: 'reading',        text: "Time to read about Maná — the band whose question is the title of today's song. You'll see Spanish question words highlighted in the passage. Tap any of them to hear the pronunciation. Notice how every question word carries an accent mark — that's not a coincidence. In Spanish, accent marks on question words are mandatory, and they're how you tell a question word from a regular word.",                                                                                                                                                                                                                           language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-reading-intro.mp3',        mvpRequired: true },
      { id: 'm3-lesson-complete', screen: 'lessonComplete', text: "You now have the eight question words: qué, dónde, cómo, quién, por qué, cuándo, cuál, and cuánto. Every single one carries an accent mark — that's how you spot a question word in any Spanish text. These eight words let you build thousands of real questions, in any tense, forever. Next: prepositions and connectors — the small words that link ideas together.",                                                                                                                                                                                                                                                        language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-003/m3-lesson-complete.mp3',      mvpRequired: true },
    ],
  },

  {
    id: 4,
    title: 'Prepositions, Conjunctions & Adverbs',
    level: 'A1',
    concept: 'The glue words that hold sentences together',
    conceptDescription:
      'De, con, sin, pero, también — these small words appear in almost every sentence in Spanish. Learn them now and your comprehension jumps immediately.',
    song: { title: 'A Dios Le Pido', artist: 'Juanes', durationSeconds: 267, spotifyId: '0JHM9KIq6oUPd4gHxMlB0T', youtubeId: 'kMIaYXxLnUA' },
    genreSongs: {
      pop: { title: 'A Dios Le Pido', artist: 'Juanes', durationSeconds: 267, spotifyId: '0JHM9KIq6oUPd4gHxMlB0T', youtubeId: 'kMIaYXxLnUA' },
      reggaeton: { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', durationSeconds: 229, spotifyId: '6habFhsOp2NvshLv26DqMb', youtubeId: 'kJQP7kiw5Fk' },
      rnb: { title: 'Obsesión', artist: 'Aventura', durationSeconds: 252, spotifyId: '50iOwPQbtGmEc29q2okbEh', youtubeId: '8_QY5gFQUTg' },
      'regional-mexican': { title: 'El Rey', artist: 'Vicente Fernández', durationSeconds: 200, spotifyId: '6P3dT8EkJd0LOyZklOl0Na', youtubeId: 'oVdWmX4OEV8' },
    },
    vocabulary: [
      { spanish: 'de', english: 'of / from' },
      { spanish: 'con', english: 'with' },
      { spanish: 'sin', english: 'without' },
      { spanish: 'pero', english: 'but' },
      { spanish: 'también', english: 'also / too' },
    ],
    grammarPoints: [
      'Prepositions: de (from/of), en (in/on), con (with), sin (without), a (to/at)',
      'Conjunctions: y (and), o (or), pero (but), ni (nor), si (if)',
      'Adverbs: también (also), tampoco (neither), siempre (always), nunca (never)',
      'pero vs perro — context and double-r change everything',
      'para vs por both mean "for" — full contrast comes in Module 41',
    ],
    quizTypes: ['Fill-in the preposition', 'Match connectors to meaning', 'Sentence building'],
    readingTopic: 'Juanes: Music as a Force for Peace in Colombia',
    readingRatio: '90% English / 10% Spanish connectors inserted',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 100,
    culturalNote:
      "Juanes and the Sound of Connection — Juan Esteban Aristizábal Vásquez (Juanes) grew up in Medellín during one of Colombia's hardest decades. His songs link two worlds: rock and Colombian folk, English and Spanish audiences, pain and hope. Listen to 'A Dios Le Pido' and you'll hear the small words doing the heavy lifting — con, sin, de, para — stitching together a prayer that asks for life with his loved ones and without fear. That is exactly what these glue words do inside the language: they hold opposite ideas in the same breath. Juanes also founded Mi Sangre, a foundation supporting children affected by landmines. The connection between his music and his peace work is not a coincidence — both are built on the same idea of joining what war tries to separate.",
    quizQuestions: [
      {
        question: "Fill in the blank: 'Café ___ leche, ___ azúcar.' (Coffee with milk, without sugar.)",
        options: ['con / sin', 'sin / con', 'de / con', 'pero / y'],
        correctIndex: 0,
        explanation: "Con means 'with', sin means 'without'. They're functional opposites — when you can hear one, you can hear the other.",
      },
      {
        question: "Which word completes this sentence to show a contrast: 'Quiero café, ___ no tengo dinero.' (I want coffee, ___ I have no money.)",
        options: ['y', 'también', 'pero', 'con'],
        correctIndex: 2,
        explanation: "Pero means 'but' — the contrast connector. 'Quiero café, pero no tengo dinero.' Y means 'and', which would join ideas instead of contrasting them — the opposite of what the sentence needs.",
      },
      {
        question: "Which word order correctly says 'I'm from Colombia, but I speak English.'?",
        options: [
          'Soy de Colombia, pero hablo inglés.',
          'Soy Colombia de, pero inglés hablo.',
          'Soy con Colombia, y hablo inglés.',
          'Hablo inglés, de soy Colombia pero.',
        ],
        correctIndex: 0,
        explanation: 'De links you to a place and pero pivots to a contrast. Two glue words, one complete sentence.',
      },
      {
        question: "In the phrase 'café con leche', which connector tells you milk is being added?",
        options: ['sin', 'pero', 'con', 'de'],
        correctIndex: 2,
        explanation: 'Con introduces what is being added or included. Sin would mean the milk is absent.',
      },
    ],
    easyQuizQuestions: [
      {
        question: "Which word means 'with' in Spanish?",
        options: ['sin', 'con', 'de', 'pero'],
        correctIndex: 1,
        explanation: "Con means 'with' — think 'café con leche' (coffee with milk). Sin is its opposite.",
      },
      {
        question: "Which pairing matches Spanish to English correctly?",
        options: [
          'de = also / too',
          'sin = with',
          'pero = but',
          'también = without',
        ],
        correctIndex: 2,
        explanation: "Pero means 'but'. The other three pairs are scrambled — sin = without, también = also/too, de = of/from.",
      },
      {
        question: "How do you say 'me too' in Spanish?",
        options: ['Yo pero.', 'Yo sin.', 'Yo también.', 'Yo con.'],
        correctIndex: 2,
        explanation: "'Yo también' is the most useful two-word response in Spanish. Use it anytime someone says something you agree with.",
      },
    ],
    hardQuizQuestions: [
      {
        question: "'Tengo un ___' means 'I have a dog'. Which word fits — and how does it differ from the connector 'pero'?",
        options: [
          'pero (tapped R, single sound)',
          'perro (trilled R, rolled sound)',
          'pera (a pear)',
          'pero (means "but")',
        ],
        correctIndex: 1,
        explanation: 'Perro (dog) and pero (but) look almost identical, but the double R changes everything. Pero is a single soft tap; perro is a full rolled trill.',
      },
      {
        question: "Complete the sentence: 'Quiero un café ___ leche, ___ no quiero azúcar, ___ quiero agua.'",
        options: [
          'con / pero / también',
          'sin / y / también',
          'con / pero / nunca',
          'de / sin / también',
        ],
        correctIndex: 0,
        explanation: "Con leche (with milk), pero no quiero azúcar (but I don't want sugar), también quiero agua (I also want water). Three connectors stacked into one real sentence.",
      },
      {
        question: "Translate: 'I'm from Mexico, but I also speak English.'",
        options: [
          'Soy de México, pero también hablo inglés.',
          'Soy con México, y también hablo inglés.',
          'Soy sin México, pero hablo inglés también.',
          'Soy de México, y nunca hablo inglés.',
        ],
        correctIndex: 0,
        explanation: 'De (from), pero (but), también (also) — three connectors doing exactly the work they were designed for. También typically sits before the verb, not at the end.',
      },
    ],
    readingPassage: [
      { text: 'Juan Esteban Aristizábal Vásquez — known to the world as Juanes — grew up in Medellín during one of Colombia\'s hardest decades. His songs almost always link two worlds: rock and Colombian folk, English-speaking and Spanish-speaking audiences, pain and hope. Listen carefully to "A Dios Le Pido" and you will notice the small words doing the heavy lifting — ', isSpanish: false },
      { text: 'de', isSpanish: true, english: 'of / from' },
      { text: ', ', isSpanish: false },
      { text: 'con', isSpanish: true, english: 'with' },
      { text: ', ', isSpanish: false },
      { text: 'sin', isSpanish: true, english: 'without' },
      { text: ', ', isSpanish: false },
      { text: 'y', isSpanish: true, english: 'and' },
      { text: ' — stitching together a prayer that asks for life with his loved ones and without fear. That is exactly what these glue words do inside the language: they hold opposite ideas in the same breath. Juanes also founded Mi Sangre, a foundation supporting Colombian children affected by landmines. The connection between his music and his peace work is not a coincidence, ', isSpanish: false },
      { text: 'pero', isSpanish: true, english: 'but' },
      { text: ' a deliberate choice. Both are built on the same idea of joining what conflict tries to separate. Next time you hear him sing, ', isSpanish: false },
      { text: 'también', isSpanish: true, english: 'also / too' },
      { text: ' listen for the tiny words. They are carrying the message.', isSpanish: false },
    ],
    recyclingTargets: [
      {
        moduleId: 1,
        concept: 'Spanish phonetics — pero vs perro (single tap R vs trilled R) and the silent H in hablo',
        intervalDays: [1, 7],
        reviewFormat: ['listening-recognition'],
      },
      {
        moduleId: 2,
        concept: 'Accent marks shift stress — también lands on the final é; sí (yes) vs si (if)',
        intervalDays: [1, 3, 14],
        reviewFormat: ['mini-quiz'],
      },
      {
        moduleId: 3,
        concept: 'Question words combined with prepositions — ¿Con quién? ¿De dónde?',
        intervalDays: [3, 7, 30],
        reviewFormat: ['speaking-prompt', 'translation'],
      },
    ],
    // Narration-style audio (v2) — replaces old slow+normal single-word format.
    // New files: m4-*.mp3 — generate via /melodia-audio 4 (module-004-tts-v2.json).
    // Reading tokens kept from v1 (files exist on disk).
    ttsTriggers: [
      { id: 'm4-intro',                      screen: 'preListen',      text: "Module 4 covers the small words that hold Spanish sentences together — prepositions and connectors. De, con, sin, pero, también. They're short, they're everywhere, and once you know them, you can start building real phrases. As you listen to 'A Dios Le Pido' by Juanes, listen for how these words connect ideas: con sus ojos — with his eyes. A single preposition carrying a whole image.",                                                                                                                                                                                                              language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-intro-prepositions.mp3',  mvpRequired: true },
      { id: 'm4-vocab-de',                   screen: 'preListen',      text: "'De' means 'of' or 'from' — one of the most common words in Spanish. Soy de México — I'm from Mexico. Un vaso de agua — a glass of water. De noche — at night (literally: of night). It connects a noun to its origin, its material, or its container. You'll hear de in almost every Spanish sentence. Two letters, enormous range.",                                                                                                                                                                                                                                                                            language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-vocab-de.mp3',            mvpRequired: true },
      { id: 'm4-vocab-con',                  screen: 'preListen',      text: "'Con' means 'with' — it describes accompaniment, ingredients, or the manner of doing something. Café con leche — coffee with milk. Vivo con mi familia — I live with my family. Con mucho gusto — with pleasure. You'll hear con constantly in food orders, in song lyrics, in everyday speech. Three letters, always meaning 'with'.",                                                                                                                                                                                                                                                                            language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-vocab-con.mp3',           mvpRequired: true },
      { id: 'm4-vocab-sin',                  screen: 'preListen',      text: "'Sin' means 'without' — the opposite of con. Café sin azúcar — coffee without sugar. Sin miedo — without fear. Sin ti — without you, one of the most common phrases in Latin music. It shows up everywhere you want to say something is absent.",                                                                                                                                                                                                                                                                                                                                                              language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-vocab-sin.mp3',           mvpRequired: true },
      { id: 'm4-vocab-pero',                 screen: 'preListen',      text: "'Pero' means 'but' — the contrast connector. Hablo inglés, pero no hablo chino — I speak English, but I don't speak Chinese. When you see pero in a sentence, expect a contrast or a limitation after it. One quick note: pero has one R, not two. Perro with two Rs means dog. The trill makes all the difference.",                                                                                                                                                                                                                                                                                           language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-vocab-pero.mp3',          mvpRequired: true },
      { id: 'm4-vocab-tambien',              screen: 'preListen',      text: "'También' means 'also' or 'too' — the addition word. Yo también — me too. Ella habla español y también habla portugués — She speaks Spanish and also speaks Portuguese. The accent on the é: tam-BIÉN. In conversation, yo también is one of the most useful phrases you'll use — every time someone tells you something you share, that's your response.",                                                                                                                                                                                                                                                     language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-vocab-tambien.mp3',       mvpRequired: true },
      { id: 'm4-phrase-cafe-con-leche',      screen: 'preListen',      text: "'Café con leche' means coffee with milk — it's the classic Spanish breakfast drink. Three words, all Module 4 vocabulary: café is the noun, con is the preposition, leche is milk. You can extend it: café con leche sin azúcar — coffee with milk, without sugar. That single sentence uses three of the five words from this module. Order it in any Spanish-speaking country and you'll be understood immediately.",                                                                                                                                                                                        language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-phrase-cafe-con-leche.mp3', mvpRequired: true },
      { id: 'm4-speaking-prompt',            screen: 'preListen',      text: "Here's your speaking frame for today: 'Quiero ___ con ___, pero sin ___.' Fill in the blanks with something you'd order or want. I want — con — pero sin — that's three Module 4 words in one sentence. Say it out loud, substitute your own items, and you've just built a real Spanish sentence from scratch.",                                                                                                                                                                                                                                                                                             language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-speaking-prompt.mp3',     mvpRequired: true },
      { id: 'm4-reading-intro',              screen: 'reading',        text: "Now a reading passage about Juanes, the Colombian singer behind 'A Dios Le Pido'. You'll see the prepositions and connectors from this module highlighted as tappable words in the text. Tap them to hear each one. Notice how con, de, sin, and pero show up constantly — these small words are the connective tissue of every Spanish sentence.",                                                                                                                                                                                                                                                             language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-reading-intro.mp3',       mvpRequired: true },
      { id: 'm4-lesson-complete',            screen: 'lessonComplete', text: "Five small words — de, con, sin, pero, también — and you've just unlocked a huge part of how Spanish connects ideas. You also know the difference between pero and perro, which is the kind of detail that makes people think you've been studying for years. Next: subject pronouns — yo, tú, él, ella, nosotros, ellos. The building blocks of every sentence.",                                                                                                                                                                                                                                                language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/m4-lesson-complete.mp3',     mvpRequired: true },
      // Reading tap tokens — v1 files still on disk, kept for passage taps
      { id: 'reading-snippet-con-sus-seres', screen: 'reading', text: 'con sus seres queridos', language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/reading-con-sus-seres.mp3', mvpRequired: true },
      { id: 'reading-snippet-sin-miedo',     screen: 'reading', text: 'sin miedo',              language: 'es-419', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-004/reading-sin-miedo.mp3',    mvpRequired: true },
    ],
  },

  {
    id: 5,
    title: 'Subject Pronouns',
    level: 'A1',
    concept: 'Yo, tú, él, ella, nosotros...',
    conceptDescription:
      "Every Spanish sentence has a subject — the person doing the doing. Today you'll meet the five pronouns that name that person: yo, tú, él/ella, nosotros, ellos/ellas. They're small, but they unlock everything. Once you know who the sentence is about, the verbs you'll learn in the next few modules suddenly have a home. And here's the surprise: Spanish speakers often skip the pronoun entirely — the verb ending already tells you who's talking. So when a Spanish speaker does say yo out loud, it lands with weight. It means 'me — specifically.'",
    song: { title: 'Soy Yo', artist: 'Bomba Estéreo', durationSeconds: 159, spotifyId: '4Egb5xP6cniUx0kgZd5zLB', youtubeId: 'bxWxXncl53U' },
    genreSongs: {
      pop: { title: 'Tú', artist: 'Camila', durationSeconds: 197, spotifyId: '37Xdi9mHef3ZDcwyiqpBYw' },
      reggaeton: { title: 'Yo Quiero Bailar', artist: 'Ivy Queen', durationSeconds: 234, spotifyId: '7soEJURKTlW5Rku2TZ519W' },
      rnb: { title: 'Ella y Yo', artist: 'Aventura ft. Don Omar', durationSeconds: 252, spotifyId: '18C2ThadMI2M476zx00PFi' },
      'regional-mexican': { title: 'Yo Ya No Vuelvo Contigo', artist: 'Lenin Ramírez ft. Grupo Firme', durationSeconds: 240, spotifyId: '4dKY6JFNvj2yWzENIL1P6s' },
    },
    vocabulary: [
      { spanish: 'yo', english: 'I' },
      { spanish: 'tú', english: 'you (informal)' },
      { spanish: 'él / ella', english: 'he / she' },
      { spanish: 'nosotros', english: 'we' },
      { spanish: 'ellos / ellas', english: 'they (masc. / fem.)' },
    ],
    grammarPoints: [
      'Yo (I), Tú (you informal), Él/Ella/Usted (he/she/you formal)',
      'Nosotros/Nosotras (we), Vosotros (you all — Spain only)',
      'Ellos/Ellas/Ustedes (they / you all — Latin America uses ustedes)',
      'Subject pronouns are often dropped — verb endings signal the subject',
      'Tú vs Usted: use tú with friends/peers, usted with elders/strangers',
    ],
    quizTypes: ['Pronoun identification in lyrics', 'Match pronoun to English', 'Formal vs informal selection'],
    readingTopic: 'Bomba Estéreo and the Power of "Yo"',
    readingRatio: '90% English / 10% Spanish pronouns highlighted',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 100,
    // Tappable preview vocab (soy, somos, usted, ustedes) appear inline in explanations
    // below — content-builder marked them with [tappable: "word" → "translation"] markers.
    // Markers stripped here; full tappable-popover UI wiring deferred (see PENDING.md).
    culturalNoteVariants: {
      reggaeton:
        "If you picked reggaeton, your song today is 'Yo Quiero Bailar' by Ivy Queen — known across Latin America as La Reina del Reggaetón, the Queen of Reggaeton. She was making this music in the early 2000s, years before Bad Bunny brought the genre to global pop charts, and the chorus of this song is a clinic in subject pronouns: she opens with yo (I want), then pivots to tú (you want), drawing a sharp line between what she wants and what someone else assumes. That contrast — yo versus tú, planted at the front of each line — is the same emphatic-pronoun energy Bomba Estéreo uses in 'Soy Yo,' just a generation earlier. Ivy Queen was teaching this lesson before the textbooks caught up.",
    },
    culturalNote:
      "Bomba Estéreo formed in Bogotá in 2005, with lead singer Li Saumet drawing on the cumbia rhythms of Colombia's Caribbean coast. Their 2015 hit 'Soy Yo' — literally 'I am me' — became an anthem for outsiders and kids who didn't fit in. The song's music video features an eleven-year-old girl walking through her neighborhood as fully, unapologetically herself. Spanish usually drops the subject pronoun, so every time Li sings yo in the chorus, it's a choice — emphasis, identity, defiance. That choice is exactly the grammar concept you're learning today.",
    quizQuestions: [
      {
        question: "You want to say 'they' about a group of women. Which pronoun fits?",
        options: ['ellos', 'ellas', 'nosotros', 'él'],
        correctIndex: 1,
        explanation: "Ellas = 'they' (all-female). Ellos = 'they' (all-male or mixed). The default for unknown or mixed groups is the masculine form — a Spanish-language convention, not a Melodia rule.",
      },
      {
        question: 'Which pronoun would you use to talk about yourself?',
        options: ['tú', 'él', 'yo', 'nosotros'],
        correctIndex: 2,
        explanation: 'Yo is the first-person singular pronoun — the one you use when the subject of the sentence is you alone. If you and someone else are doing it together, switch to nosotros.',
      },
      {
        question: "Complete this sentence: '___ soy de México.' (I am from Mexico.)",
        options: ['Tú', 'Yo', 'Él', 'Nosotros'],
        correctIndex: 1,
        explanation: "'Yo soy de México' = 'I am from Mexico.' Soy means 'I am' (full verb in Module 9). This is your phrase chunk for the day — recycle de from Module 4 and you've built a complete sentence.",
      },
      {
        question: "In Module 3 you learned ¿Quién? (Who?). Someone asks ¿Quién habla español? — pointing at you. What's the one-word answer?",
        options: ['Tú.', 'Él.', 'Ella.', 'Yo.'],
        correctIndex: 3,
        explanation: "'Yo.' — just 'me.' Pronouns are the natural one-word answer to ¿Quién? You don't need a full verb yet — the pronoun alone carries the meaning. (habla = speaks, full conjugation in Module 9.)",
      },
    ],
    easyQuizQuestions: [
      {
        question: "Which word means 'I' in Spanish?",
        options: ['tú', 'yo', 'él', 'ella'],
        correctIndex: 1,
        explanation: "Yo means 'I' — and notice it's lowercase. Spanish never capitalizes 'I' the way English does.",
      },
      {
        question: "Which pronoun matches 'she'?",
        options: ['yo', 'tú', 'ella', 'nosotros'],
        correctIndex: 2,
        explanation: "Ella means 'she'. Él (with an accent) means 'he'. The matching pair anchors the third-person singular.",
      },
      {
        question: 'Which pronoun would you use to talk about a group that includes you?',
        options: ['yo', 'ellos', 'nosotros', 'tú'],
        correctIndex: 2,
        explanation: "Nosotros means 'we' — any group that includes you. If the group is all-female, use nosotras; mixed or masculine, use nosotros.",
      },
    ],
    hardQuizQuestions: [
      {
        question: "You meet your friend's grandmother for the first time. Which pronoun do you use when talking to her?",
        options: [
          "tú — she's family-adjacent, no need for formality",
          'usted — elder + first meeting = formal respect',
          'ella — she\'s a "she"',
          'ustedes — covers all cases',
        ],
        correctIndex: 1,
        explanation: 'Usted (you, formal singular) is the respect form — use it with elders, strangers, bosses, and anyone in a service role until invited to switch to tú. Choosing tú with someone older than you can sound disrespectful in many Latin American cultures.',
      },
      {
        question: "Why can a Spanish speaker say 'Soy de México' without ever saying yo?",
        options: [
          'Because yo is considered rude in formal Spanish.',
          'Because the verb ending in soy already tells you the subject is I — Spanish drops pronouns when context is clear.',
          'Because Latin American Spanish has no first-person pronoun.',
          'Because soy is itself a pronoun.',
        ],
        correctIndex: 1,
        explanation: "This is called pro-drop. The verb ending in soy (I am) carries the 'I'-ness of the sentence, so the yo becomes optional. When a speaker DOES include yo, it's for emphasis: 'I — specifically — am from Mexico.' This is exactly why Bomba Estéreo's 'Soy Yo' lands so hard — the artist is choosing to say yo when she could have dropped it.",
      },
      {
        question: "Translate: 'You and I are from Mexico, but they speak English.'",
        options: [
          'Tú y yo somos de México, pero ellos hablan inglés.',
          'Tú y yo soy de México, pero ella habla inglés.',
          'Nosotros somos de México, sin ellos hablan inglés.',
          'Yo y tú somos de México, pero nosotros hablan inglés.',
        ],
        correctIndex: 0,
        explanation: "Three things doing real work here: 'Tú y yo' (you and me — recycles y from Module 4), somos (we are) for the group, pero (Module 4 contrast), and ellos for the 'they' group. In Spanish, 'tú y yo' is the natural order — the other person comes first, you come last. A small politeness baked into the grammar.",
      },
    ],
    readingPassage: [
      { text: "Bomba Estéreo formed in Bogotá in 2005, but their sound was born on Colombia's Caribbean coast — the cumbia rhythms, the chants, the salt air. Their lead singer, Li Saumet, grew up in Santa Marta and carries that coastal pulse into every line she sings. When the band released 'Soy Yo' in 2015, the title was already the whole message. ", isSpanish: false },
      { text: 'Soy yo', isSpanish: true, english: 'I am me / it is me' },
      { text: " — I am me. The song became an anthem for kids who didn't fit in, with a music video starring an eleven-year-old girl walking through her neighborhood being unapologetically herself. The video has been watched hundreds of millions of times. Listen for how often Li sings ", isSpanish: false },
      { text: 'yo', isSpanish: true, english: 'I' },
      { text: ". Spanish usually drops the subject pronoun — the verb ending already does the work. So when a singer chooses to say it out loud, again and again, it is a deliberate choice. It means: me, specifically, no one else. Every time you hear it in the chorus, you are hearing a Spanish speaker choose to be seen. That is what yo means — not just 'I', but 'me, right here'.", isSpanish: false },
    ],
    // ttsTriggers: one file per cue (no slow/normal pairs from Module 5 onward —
    // per Reine, 2026-05-17). 10 mvpRequired + 1 conditional reggaeton variant.
    // Source: notes/melodia/5-lessons/module-005-tts.json (voice-engineer manifest).
    ttsTriggers: [
      { id: 'module-005-intro',                     screen: 'preListen',      text: "Today we're learning the subject pronouns — the small words that name who is doing the doing. Yo, tú, él, ella, nosotros, ellos. As you listen to 'Soy Yo' by Bomba Estéreo, count how often the singer says yo. Every time she does, she's choosing to. Press listen when you're ready.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-intro-subject-pronouns.mp3', mvpRequired: true },
      { id: 'module-005-vocab-yo',                  screen: 'preListen',      text: "'Yo' means 'I'. A pure 'yoh' sound — short and open. And here's the trick: Spanish often drops the pronoun, so when a singer says yo out loud, it's for emphasis. Me, specifically.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-vocab-yo.mp3', mvpRequired: true },
      { id: 'module-005-vocab-tu',                  screen: 'preListen',      text: "'Tú' means 'you' — the informal singular. Use it with friends, peers, kids, people your age. The accent mark on the ú is what tells it apart from tu, which means 'your'. Same sound, different jobs.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-vocab-tu.mp3', mvpRequired: true },
      { id: 'module-005-vocab-el-ella',             screen: 'preListen',      text: "'Él' means 'he' — with an accent on the é to tell it apart from el, which means 'the'. 'Ella' means 'she' — eh-yah. Together they cover any single third person you're talking about.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-vocab-el-ella.mp3', mvpRequired: true },
      { id: 'module-005-vocab-nosotros',            screen: 'preListen',      text: "'Nosotros' means 'we' — any group that includes you. If the group is all female, switch to 'nosotras'. Mixed or unknown? Stay with nosotros. It's the default.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-vocab-nosotros.mp3', mvpRequired: true },
      { id: 'module-005-vocab-ellos',               screen: 'preListen',      text: "'Ellos' means 'they' — a masculine or mixed group. 'Ellas' is the all-female version. Same logic as nosotros and nosotras. The default for unknown groups is the masculine form.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-vocab-ellos.mp3', mvpRequired: true },
      { id: 'module-005-phrase-yo-soy',             screen: 'preListen',      text: "'Yo soy de México.' I am from Mexico. Fill in your own country or city. Soy means 'I am' — you'll meet the full verb in Module 9. For now, just memorize the whole chunk: yo soy de, plus a place. The single most useful sentence you'll leave today's lesson with.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-phrase-yo-soy-de.mp3', mvpRequired: true },
      { id: 'module-005-speaking-prompt',           screen: 'preListen',      text: "Try this with me. Point at yourself and say 'yo'. Point at a friend your age and say 'tú'. Now one full sentence — 'Yo soy de' — and add your country. Say it out loud. Your mouth needs the reps, not just your eyes.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-speaking-prompt.mp3', mvpRequired: true },
      { id: 'module-005-reading-001',               screen: 'reading',        text: "Bomba Estéreo formed in Bogotá in 2005, but their sound was born on Colombia's Caribbean coast — the cumbia rhythms, the chants, the salt air. Their lead singer, Li Saumet, grew up in Santa Marta. When the band released 'Soy Yo' in 2015, the title was already the whole message. Soy yo — I am me. The song became an anthem for kids who didn't fit in, with a music video starring an eleven-year-old girl walking through her neighborhood being unapologetically herself. Listen for how often Li sings yo. Spanish usually drops the subject pronoun, so when a singer chooses to say yo out loud, again and again, it's a deliberate choice. It means: me, specifically, no one else. Every time you hear yo in the chorus, you're hearing a Spanish speaker plant a flag.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-reading-bomba-estereo.mp3', mvpRequired: true },
      { id: 'module-005-cultural-note-reggaeton',   screen: 'preListen',      text: "If you picked reggaeton, your song today is 'Yo Quiero Bailar' by Ivy Queen — La Reina del Reggaetón, the Queen of Reggaeton. She was making this music in the early 2000s, years before Bad Bunny brought the genre to global pop charts. Listen to the chorus: she opens with yo, then pivots to tú — drawing a line between what she wants and what someone else assumes. Same emphatic-pronoun energy as 'Soy Yo,' just a generation earlier.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-cultural-note-ivy-queen.mp3', mvpRequired: false },
      { id: 'module-005-lesson-complete',           screen: 'lessonComplete', text: "You can now name who is doing the doing. Five pronouns — yo, tú, él, ella, nosotros, ellos. And you know the secret: Spanish drops the pronoun by default, so when a speaker says it, they mean it. Try one sentence out loud tomorrow — 'Yo soy de' plus your country. Say it like you mean it.", language: 'en-US-with-es-419-tokens', slowVersion: false, normalVersion: true, outputFile: 'assets/audio/module-005/m5-lesson-complete.mp3', mvpRequired: true },
    ],
  },

  // TODO Phase 6: re-lock modules 9-60 when RevenueCat is set up
  {
    id: 6,
    title: 'Days, Months, Seasons & Time',
    level: 'A1',
    concept: 'Ayer, hoy, mañana — navigating time in Spanish',
    conceptDescription:
      'Talk about yesterday, today, and tomorrow. Name the days, months, and seasons. These time words appear in almost every real conversation.',
    song: { title: 'Mañana Será Bonito', artist: 'Karol G', durationSeconds: 219 },
    genreSongs: {
      pop: { title: 'Mañana Será Bonito', artist: 'Karol G', durationSeconds: 219 },
      rnb: { title: 'Ayer', artist: 'Luis Miguel', durationSeconds: 206 },
      'regional-mexican': { title: 'Ayer', artist: 'Luis Miguel', durationSeconds: 206 },
    },
    vocabulary: [
      { spanish: 'ayer', english: 'yesterday' },
      { spanish: 'hoy', english: 'today' },
      { spanish: 'mañana', english: 'tomorrow (also: morning)' },
      { spanish: 'el fin de semana', english: 'the weekend' },
      { spanish: 'verano', english: 'summer' },
    ],
    grammarPoints: [
      'Days: lunes, martes, miércoles, jueves, viernes, sábado, domingo',
      'Days and months are NOT capitalized in Spanish',
      'Time words: ayer (yesterday), hoy (today), mañana (tomorrow/morning)',
      'Seasons: verano (summer), otoño (fall), invierno (winter), primavera (spring)',
      'Time units: segundo, minuto, hora, día, semana, mes, año',
    ],
    quizTypes: ['Time vocabulary matching', 'Listen for days/months in songs', 'Calendar exercises'],
    readingTopic: 'Karol G: La Bichota\'s Journey from Medellín',
    readingRatio: '90% English / 10% Spanish time words inserted',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 100,
  },

  {
    id: 7,
    title: 'Numbers & Ordinals',
    level: 'A1',
    concept: '0–1,000,000 + primero, segundo, tercero...',
    conceptDescription:
      'Numbers unlock prices, ages, addresses, phone numbers, and dates. Ordinals let you say first, second, third. Essential from day one.',
    song: { title: '1, 2, 3', artist: 'Sofía Reyes ft. Jason Derulo & De La Ghetto', durationSeconds: 191 },
    genreSongs: {
      'regional-mexican': { title: 'Cien Años', artist: 'Pedro Infante', durationSeconds: 185 },
      rnb: { title: 'Cien Años', artist: 'Pedro Infante', durationSeconds: 185 },
    },
    vocabulary: [
      { spanish: 'uno, dos, tres', english: 'one, two, three' },
      { spanish: 'diez', english: 'ten' },
      { spanish: 'veinte', english: 'twenty' },
      { spanish: 'cien', english: 'one hundred' },
      { spanish: 'primero / segundo', english: 'first / second' },
    ],
    grammarPoints: [
      '1–15 individual words: uno, dos, tres... quince',
      '16–19 are compound (one word): dieciséis, diecisiete, dieciocho, diecinueve',
      '20+: veinte, veintiuno... treinta y uno, cuarenta, cincuenta, cien, mil',
      'Ordinals: primero, segundo, tercero, cuarto, quinto (agree in gender)',
      'Primero/Tercero drop -o before masculine nouns: el primer piso, el tercer día',
    ],
    quizTypes: ['Number dictation', 'Ordinal matching', 'Listening for numbers in lyrics'],
    readingTopic: 'Pedro Infante: The Golden Age of Mexican Cinema and Music',
    readingRatio: '90% English / 10% Spanish numbers and stats highlighted',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 100,
  },

  {
    id: 8,
    title: 'Greetings & Polite Phrases',
    level: 'A1',
    concept: 'Hola, gracias, adiós — the phrases you\'ll use every day',
    conceptDescription:
      'The social glue of Spanish. These phrases are your entry point into every real-world interaction — from ordering coffee to meeting someone for the first time.',
    song: { title: 'Gracias a la Vida', artist: 'Mercedes Sosa', durationSeconds: 287 },
    genreSongs: {
      pop: { title: 'Hola', artist: 'Bomba Estéreo', durationSeconds: 204 },
      reggaeton: { title: 'Hola', artist: 'Bomba Estéreo', durationSeconds: 204 },
    },
    vocabulary: [
      { spanish: 'hola', english: 'hello' },
      { spanish: 'gracias', english: 'thank you' },
      { spanish: 'de nada', english: 'you\'re welcome' },
      { spanish: 'por favor', english: 'please' },
      { spanish: 'hasta luego', english: 'see you later' },
    ],
    grammarPoints: [
      'Greetings: hola, buenos días, buenas tardes, buenas noches',
      '¿Cómo estás? (informal) vs ¿Cómo está usted? (formal)',
      'Responses: muy bien, gracias / más o menos / no muy bien',
      'Polite phrases: por favor, gracias, de nada, con permiso, perdón',
      'Farewells: adiós, hasta luego, hasta pronto, hasta mañana, chao',
    ],
    quizTypes: ['Greeting matching', 'Appropriate response selection', 'Listening comprehension'],
    readingTopic: 'Mercedes Sosa: La Negra and the Voice of Latin America',
    readingRatio: '100% English with Spanish greetings woven in as dialogue',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 100,
  },

  // ── A1-A2 Elementary Transition — Modules 9–19 ────────────────────────────
  // Songs marked TBD — to be finalized by content agent

  {
    id: 9,
    title: 'Definite & Indefinite Articles',
    level: 'A1-A2',
    concept: 'El, la, un, una — and all the exceptions',
    conceptDescription:
      'Every Spanish noun has a gender, and the article must match it. Get this right and sentences start to flow naturally.',
    song: { title: 'La La La (Brazil 2014)', artist: 'Shakira ft. Carlinhos Brown', durationSeconds: 188 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'el / la', english: 'the (masculine / feminine)' },
      { spanish: 'los / las', english: 'the (plural masc. / fem.)' },
      { spanish: 'un / una', english: 'a / an (masc. / fem.)' },
      { spanish: 'unos / unas', english: 'some (masc. / fem.)' },
      { spanish: 'la mano', english: 'the hand (feminine — exception!)' },
    ],
    grammarPoints: [
      'El/la for masculine/feminine singular, los/las for plural',
      'Un/una (a/an), unos/unas (some)',
      'General rule: -o ending = masculine, -a ending = feminine',
      'Exceptions: la clase, la carne, nouns ending in -ión/-dad are feminine',
      'El problema, el programa, el día, el agua — masculine despite -a ending',
    ],
    quizTypes: ['Article-noun matching', 'Gender identification', 'Plural formation'],
    readingTopic: 'Shakira: From Barranquilla to the World Stage',
    readingRatio: '70% English / 30% Spanish article+noun pairs highlighted',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 10,
    title: 'Present Tense — AR Verbs',
    level: 'A2',
    concept: 'The most common verb pattern in Spanish',
    conceptDescription:
      'Over 90% of new Spanish verbs follow the -AR pattern. Learn these endings once and you instantly unlock thousands of verbs.',
    song: { title: 'Bailando', artist: 'Enrique Iglesias ft. Descemer Bueno & Gente de Zona', durationSeconds: 243 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'bailar', english: 'to dance' },
      { spanish: 'hablar', english: 'to speak' },
      { spanish: 'escuchar', english: 'to listen' },
      { spanish: 'caminar', english: 'to walk' },
      { spanish: 'cantar', english: 'to sing' },
    ],
    grammarPoints: [
      'Remove -AR, add: -o, -as, -a, -amos, -áis, -an',
      'Yo hablo, tú hablas, él habla, nosotros hablamos...',
      'Over 90% of new Spanish verbs are -AR — this pattern is foundational',
      'Negation: place "no" directly before the verb',
      'Question formation: invert subject and verb, or just use rising intonation',
    ],
    quizTypes: ['Conjugation fill-in', 'Identify verb forms in lyrics', 'Translate sentences'],
    readingTopic: 'Enrique Iglesias: Son of a Legend, Star in His Own Right',
    readingRatio: '70% English / 30% Spanish with AR verbs',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 11,
    title: 'Present Tense — ER Verbs',
    level: 'A2',
    concept: 'The second verb pattern: -ER endings',
    conceptDescription:
      'Comer, beber, correr, leer — -ER verbs follow their own set of endings. Different from -AR but equally consistent.',
    song: { title: 'Quiero', artist: 'Jesse & Joy', durationSeconds: 229 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'comer', english: 'to eat' },
      { spanish: 'beber', english: 'to drink' },
      { spanish: 'leer', english: 'to read' },
      { spanish: 'correr', english: 'to run' },
      { spanish: 'querer', english: 'to want / to love' },
    ],
    grammarPoints: [
      'Remove -ER, add: -o, -es, -e, -emos, -éis, -en',
      'Yo como, tú comes, él come, nosotros comemos...',
      'ER and IR share endings for yo, tú, él, ellos — only nosotros/vosotros differ',
      'Querer is stem-changing (e>ie) — preview of Module 20',
      'Leer in yo form: leo (not leeo)',
    ],
    quizTypes: ['Conjugation practice', 'Verb identification in context', 'Sentence building'],
    readingTopic: 'Jesse & Joy: A Sibling Duo Who Changed Latin Pop',
    readingRatio: '65% English / 35% Spanish with ER verbs',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 12,
    title: 'Present Tense — IR Verbs',
    level: 'A2',
    concept: 'The third verb pattern: -IR endings',
    conceptDescription:
      'Vivir, escribir, abrir — -IR verbs complete the three-pattern system. Master all three and you can conjugate almost any regular Spanish verb.',
    song: { title: 'Vivir Mi Vida', artist: 'Marc Anthony', durationSeconds: 248 },
    genreSongs: {
      'regional-mexican': { title: 'Vivir Mi Vida', artist: 'Marc Anthony', durationSeconds: 248 },
    },
    vocabulary: [
      { spanish: 'vivir', english: 'to live' },
      { spanish: 'escribir', english: 'to write' },
      { spanish: 'abrir', english: 'to open' },
      { spanish: 'recibir', english: 'to receive' },
      { spanish: 'subir', english: 'to go up / to upload' },
    ],
    grammarPoints: [
      'Remove -IR, add: -o, -es, -e, -imos, -ís, -en',
      'Yo vivo, tú vives, él vive, nosotros vivimos...',
      'IR nosotros ends in -imos (not -emos like ER)',
      'Otherwise identical to ER for yo/tú/él/ellos forms',
      'Compare: comer → comemos, vivir → vivimos',
    ],
    quizTypes: ['Compare ER vs IR endings', 'Conjugation drills', 'Lyric translation'],
    readingTopic: 'Marc Anthony: Salsa, Soul, and New York City',
    readingRatio: '60% English / 40% Spanish short bio with IR verbs',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 13,
    title: 'Ser — To Be (Permanent)',
    level: 'A2',
    concept: 'Identity, origin, nationality, occupation',
    conceptDescription:
      'Ser is one of two "to be" verbs in Spanish. Use it for things that define who or what something fundamentally is — not how it feels right now.',
    song: { title: 'Soy Yo', artist: 'Bomba Estéreo', durationSeconds: 204 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'soy', english: 'I am (ser)' },
      { spanish: 'eres', english: 'you are (ser)' },
      { spanish: 'es', english: 'he/she/it is (ser)' },
      { spanish: 'somos', english: 'we are (ser)' },
      { spanish: 'son', english: 'they are (ser)' },
    ],
    grammarPoints: [
      'Soy/eres/es/somos/sois/son — fully irregular, must memorize',
      'Use ser for: name, nationality, origin, occupation, physical traits',
      'Use ser for: generalizations, material/composition, events (la fiesta es aquí)',
      'Use ser for: time/date (son las tres), ownership (es de María)',
      'Ser ≠ estar — the distinction is one of the most important in Spanish',
    ],
    quizTypes: ['Ser conjugation', 'Identify ser usage in lyrics', 'When to use ser vs estar (preview)'],
    readingTopic: 'Bomba Estéreo: Where Colombian Folklore Meets Electronic Music',
    readingRatio: '55% English / 45% Spanish with ser constructions',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 14,
    title: 'Estar — To Be (Temporary)',
    level: 'A2',
    concept: 'Location, emotions, and states',
    conceptDescription:
      'Estar is the other "to be." Use it for how something feels right now, where something is, or what\'s happening in this moment.',
    song: { title: 'Estoy Aquí', artist: 'Shakira', durationSeconds: 249 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'estoy', english: 'I am (estar)' },
      { spanish: 'estás', english: 'you are (estar)' },
      { spanish: 'está', english: 'he/she/it is (estar)' },
      { spanish: 'estamos', english: 'we are (estar)' },
      { spanish: 'están', english: 'they are (estar)' },
    ],
    grammarPoints: [
      'Estoy/estás/está/estamos/estáis/están — irregular yo only (estoy)',
      'Use estar for: location (¿Dónde estás?), health (estoy enfermo)',
      'Use estar for: emotions (estoy feliz), ongoing actions (estoy comiendo)',
      'Use estar for: resulting states (la puerta está abierta)',
      'The progressive tense is always estar + -ando/-iendo',
    ],
    quizTypes: ['Estar conjugation', 'Ser vs estar distinction', 'Emotion vocabulary matching'],
    readingTopic: 'Shakira: Early Life in Barranquilla and the Making of Laundry Service',
    readingRatio: '50% English / 50% Spanish with estar constructions',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 15,
    title: 'Ser vs Estar — Deep Dive',
    level: 'A2',
    concept: 'The most important distinction in Spanish',
    conceptDescription:
      'The same adjective can mean two different things depending on whether you use ser or estar. This module makes that click permanently.',
    song: { title: 'Loco', artist: 'Enrique Iglesias ft. Romeo Santos', durationSeconds: 218 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'es alto / está alto', english: 'is tall (trait) / is measuring tall right now' },
      { spanish: 'es aburrido', english: 'is boring (personality)' },
      { spanish: 'está aburrido', english: 'is bored (feeling right now)' },
      { spanish: 'es listo', english: 'is clever (trait)' },
      { spanish: 'está listo', english: 'is ready (state right now)' },
    ],
    grammarPoints: [
      'Ser = permanent / defining. Estar = temporary / changing',
      'Physical traits: ser (es alto). Temporary state: estar (está cansado)',
      'Adjectives that shift meaning: listo, malo, bueno, rico, seguro, aburrido',
      'Location: always estar — even for events (la fiesta está aquí is wrong; la fiesta es aquí)',
      'Exception: estar muerto (dead) — even though permanent, it\'s still estar',
    ],
    quizTypes: ['Choose ser or estar in context', 'Meaning-change adjective exercises', 'Lyric analysis'],
    readingTopic: 'Romeo Santos: The King of Bachata',
    readingRatio: '50% English / 50% Spanish contrasting ser/estar',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 16,
    title: 'Present Progressive',
    level: 'A2',
    concept: 'Estar + -ando / -iendo',
    conceptDescription:
      'Talk about what\'s happening right now. The Spanish progressive is simpler than English — two pieces, one rule.',
    song: { title: 'Latinoamérica', artist: 'Calle 13', durationSeconds: 336 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hablando', english: 'speaking (-AR → -ando)' },
      { spanish: 'comiendo', english: 'eating (-ER → -iendo)' },
      { spanish: 'viviendo', english: 'living (-IR → -iendo)' },
      { spanish: 'durmiendo', english: 'sleeping (stem change: dormir → durmiendo)' },
      { spanish: 'leyendo', english: 'reading (leer → leyendo, three-vowel rule)' },
    ],
    grammarPoints: [
      'AR verbs: drop -AR, add -ando (hablar → hablando)',
      'ER/IR verbs: drop ending, add -iendo (comer → comiendo, vivir → viviendo)',
      'Three-vowel rule: add -yendo instead (leer → leyendo, oír → oyendo)',
      'Stem-changing IR verbs change in the progressive: dormir → durmiendo, decir → diciendo',
      'Always use estar (not ser) for the progressive',
    ],
    quizTypes: ['Form the progressive', 'Identify progressive in lyrics', 'Translate ongoing actions'],
    readingTopic: 'Calle 13: Music as Political Protest Across Latin America',
    readingRatio: '45% English / 55% Spanish with progressive forms highlighted',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 17,
    title: 'Descriptive Adjectives',
    level: 'A2',
    concept: 'Agreement in gender and number',
    conceptDescription:
      'In Spanish, adjectives morph to match what they describe. Get agreement right and your Spanish sounds polished immediately.',
    song: { title: 'Bonita', artist: 'J Balvin', durationSeconds: 189 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'bonito / bonita', english: 'pretty / beautiful (masc./fem.)' },
      { spanish: 'grande', english: 'big / great (same form both genders)' },
      { spanish: 'inteligente', english: 'intelligent (same form both genders)' },
      { spanish: 'alto / alta', english: 'tall (masc./fem.)' },
      { spanish: 'feliz / felices', english: 'happy / happy (plural)' },
    ],
    grammarPoints: [
      'Adjectives ending in -o: change to -a for feminine (bonito/bonita)',
      'Adjectives ending in -e or consonant: same for both genders (inteligente, feliz)',
      'Plural: add -s after vowel, -es after consonant (felices)',
      'Most adjectives go AFTER the noun: el chico inteligente',
      'A few go before and change meaning: un gran hombre vs un hombre grande',
    ],
    quizTypes: ['Adjective agreement exercises', 'Placement rules', 'Ser/estar with adjectives'],
    readingTopic: 'J Balvin: Medellín\'s Ambassador to the World',
    readingRatio: '40% English / 60% Spanish descriptions of artists',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 18,
    title: 'Possessive Adjectives',
    level: 'A2',
    concept: 'Mi, tu, su, nuestro — my, your, his/her/our',
    conceptDescription:
      'Talk about what belongs to whom. Spanish possessives agree with the noun they modify, not the owner.',
    song: { title: 'Tu Foto', artist: 'Nicky Jam', durationSeconds: 195 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'mi / mis', english: 'my (singular / plural)' },
      { spanish: 'tu / tus', english: 'your (singular / plural)' },
      { spanish: 'su / sus', english: 'his/her/their/your-formal (sing./pl.)' },
      { spanish: 'nuestro/a', english: 'our (agrees with noun gender)' },
      { spanish: 'vuestro/a', english: 'your all (Spain — agrees with noun gender)' },
    ],
    grammarPoints: [
      'Mi/tu/su don\'t change for gender — only for plural (mis/tus/sus)',
      'Nuestro/nuestra/nuestros/nuestras — agrees in both gender AND number',
      'Su is ambiguous: su libro = his/her/their/your book — context clarifies',
      'Clarify su with: el libro de él, el libro de ella, el libro de ellos',
      'Possessives agree with the noun, NOT the owner: mi madre / mis padres',
    ],
    quizTypes: ['Possessive matching', 'Su disambiguation', 'Plural possessives'],
    readingTopic: 'Nicky Jam: From the Bronx to Reggaeton Royalty',
    readingRatio: '40% English / 60% Spanish with possessives throughout',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  {
    id: 19,
    title: 'Demonstrative Adjectives',
    level: 'A2',
    concept: 'Este, ese, aquel — this, that, that over there',
    conceptDescription:
      'Point to things in space. Spanish has three levels of distance — near, far, and very far — and they all agree in gender and number.',
    song: { title: 'Esta Noche', artist: 'Maluma', durationSeconds: 200 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'este / esta', english: 'this (near me — masc./fem.)' },
      { spanish: 'ese / esa', english: 'that (near you — masc./fem.)' },
      { spanish: 'aquel / aquella', english: 'that over there (far from both)' },
      { spanish: 'esto / eso', english: 'this / that (neuter — unidentified objects)' },
      { spanish: '¿Qué es esto?', english: 'What is this?' },
    ],
    grammarPoints: [
      'Three distances: este (here), ese (there), aquel (over there)',
      'All agree in gender and number: este/esta/estos/estas',
      'Neutral forms (esto/eso/aquello) for unidentified things — never change',
      'Este libro, esta mesa, estos libros, estas mesas',
      '¿Qué es esto? vs ¿Qué es este libro? — neutral vs identified',
    ],
    quizTypes: ['Demonstrative selection', 'Gender matching', 'Esto vs este distinction'],
    readingTopic: 'Maluma: Pretty Boy, Dirty Boy and the New Face of Reggaeton',
    readingRatio: '35% English / 65% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 120,
  },

  // ── A2-B1 Pre-Intermediate — Modules 20–30 ────────────────────────────────

  {
    id: 20,
    title: 'Stem-Changing Verbs',
    level: 'A2-B1',
    concept: 'E→IE, E→I, O→UE, U→UE — the boot pattern',
    conceptDescription:
      'Some of the most common Spanish verbs change their vowel in the stem. Spot the boot pattern (yo/tú/él/ellos change; nosotros/vosotros don\'t) and they become second nature.',
    song: { title: 'Quiero', artist: 'Jesse & Joy', durationSeconds: 215 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'querer (e→ie)', english: 'to want / love — quiero, quieres...' },
      { spanish: 'poder (o→ue)', english: 'to be able to — puedo, puedes...' },
      { spanish: 'decir (e→i)', english: 'to say — digo, dices...' },
      { spanish: 'jugar (u→ue)', english: 'to play — juego, juegas...' },
      { spanish: 'empezar (e→ie)', english: 'to begin — empiezo, empiezas...' },
    ],
    grammarPoints: [
      'Boot pattern: yo/tú/él/ellos change; nosotros/vosotros keep original vowel',
      'E→IE: querer, entender, empezar, preferir, venir',
      'O→UE: poder, volver, dormir, recordar, encontrar',
      'E→I: decir, pedir, servir, seguir (IR verbs only)',
      'U→UE: jugar (only common verb with this type)',
    ],
    quizTypes: ['Identify stem changes', 'Conjugation drills', 'Boot pattern recognition'],
    readingTopic: 'Jesse & Joy: Writing Songs About Real Life',
    readingRatio: '35% English / 65% Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 21,
    title: 'Irregular Yo Verbs',
    level: 'A2-B1',
    concept: 'Salgo, hago, tengo, traigo... only the "yo" is irregular',
    conceptDescription:
      'A group of very common verbs have a surprise only in the yo form — every other conjugation is completely regular. Learn the surprises once.',
    song: { title: 'Traigo Serenata', artist: 'Gerardo Ortiz', durationSeconds: 200 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hago', english: 'I do / make (hacer)' },
      { spanish: 'tengo', english: 'I have (tener)' },
      { spanish: 'salgo', english: 'I leave / go out (salir)' },
      { spanish: 'pongo', english: 'I put / place (poner)' },
      { spanish: 'traigo', english: 'I bring (traer)' },
    ],
    grammarPoints: [
      'Only the yo form is irregular — tú/él/nosotros follow normal rules',
      'Hacer → hago, Tener → tengo, Salir → salgo, Poner → pongo',
      'Traer → traigo, Dar → doy, Ver → veo, Decir → digo',
      'Conducir/traducir → conduzco/traduzco (-cir verbs add z)',
      'These irregular yo forms carry forward into other tenses (subjunctive, commands)',
    ],
    quizTypes: ['Irregular yo identification', 'Conjugation from infinitive', 'Sentence building'],
    readingTopic: 'Regional Mexican Music: The Sounds of Sinaloa',
    readingRatio: '30% English / 70% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 22,
    title: 'Poder — To Be Able To',
    level: 'A2',
    concept: 'Can, could, to be able to',
    conceptDescription:
      'Poder is one of the most useful verbs in Spanish — it unlocks permission, possibility, and polite requests in a single construction.',
    song: { title: 'Puedo', artist: 'Ricky Martin', durationSeconds: 214 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'puedo', english: 'I can / I am able to' },
      { spanish: 'puedes', english: 'you can' },
      { spanish: 'no puedo', english: 'I can\'t' },
      { spanish: '¿Puedes...?', english: 'Can you...?' },
      { spanish: 'poder + infinitivo', english: 'to be able to + verb' },
    ],
    grammarPoints: [
      'Poder is a stem-changing verb: o→ue (puedo, puedes, puede, podemos, podéis, pueden)',
      'Poder + infinitive = can/to be able to do something',
      '¿Puedo...? = Can I...? (asking permission)',
      '¿Puedes...? = Can you...? (asking someone to do something)',
      'No puedo = I can\'t — one of the most common phrases in any language',
    ],
    quizTypes: ['Poder conjugation', 'Poder + infinitive sentences', 'Translate ability phrases'],
    readingTopic: 'Ricky Martin: From Menudo to Global Superstar',
    readingRatio: '30% English / 70% Spanish with poder constructions',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 23,
    title: 'Ir — To Go',
    level: 'A2',
    concept: 'Voy, vas, va — and the near future',
    conceptDescription:
      'Ir is irregular but essential. Beyond going places, "ir a + infinitive" is the most natural way to talk about what you\'re about to do.',
    song: { title: 'Vamos', artist: 'Pitbull ft. Lil Jon', durationSeconds: 217 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'voy', english: 'I go / I\'m going' },
      { spanish: 'vamos', english: 'we go / let\'s go' },
      { spanish: 'voy a + infinitivo', english: 'I\'m going to + verb (near future)' },
      { spanish: '¿A dónde vas?', english: 'Where are you going?' },
      { spanish: 'ir de compras', english: 'to go shopping' },
    ],
    grammarPoints: [
      'Ir conjugation: voy/vas/va/vamos/vais/van — fully irregular',
      'Ir a + destination: voy al mercado, vamos a la playa',
      'Ir a + infinitive = near future: voy a comer (I\'m going to eat)',
      'No progressive form: never say "estoy yendo" — use voy instead',
      'Ir vs ir a: ir = to go, ir a + infinitive = to be going to',
    ],
    quizTypes: ['Ir conjugation', 'Ir a + infinitive for future', 'Destination phrases'],
    readingTopic: 'Pitbull: From Miami to Global Brand',
    readingRatio: '30% English / 70% Spanish with ir constructions',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 24,
    title: 'Tener — To Have',
    level: 'A2',
    concept: 'Tengo, tienes, tiene — and "tener que"',
    conceptDescription:
      'Tener is irregular, essential, and doubles as the way to express obligation ("have to"), age, hunger, fear, and more.',
    song: { title: 'Tengo Tu Love', artist: 'Sech', durationSeconds: 210 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'tengo', english: 'I have' },
      { spanish: 'tener que + inf.', english: 'to have to + verb (obligation)' },
      { spanish: 'tener hambre', english: 'to be hungry (lit: to have hunger)' },
      { spanish: 'tener miedo', english: 'to be afraid (lit: to have fear)' },
      { spanish: 'tener... años', english: 'to be ... years old' },
    ],
    grammarPoints: [
      'Irregular: tengo/tienes/tiene/tenemos/tenéis/tienen (e→ie stem change + irregular yo)',
      'Tener que + infinitive = have to/must: tengo que estudiar',
      'Tener expressions use nouns, not adjectives: tengo hambre (not estoy hambre)',
      'Common: tener hambre, sed, sueño, miedo, razón, prisa, suerte',
      'Age in Spanish: ¿Cuántos años tienes? / Tengo 25 años',
    ],
    quizTypes: ['Tener conjugation', 'Tener que + infinitive', 'Tener expressions'],
    readingTopic: 'Sech: Panama\'s Biggest Export in Music',
    readingRatio: '25% English / 75% Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 25,
    title: 'Al & Del Contractions',
    level: 'A2',
    concept: 'A + el = al. De + el = del.',
    conceptDescription:
      'Spanish has only two mandatory contractions, and they happen all the time. Simple rule, huge frequency.',
    song: { title: 'Al Otro Lado del Río', artist: 'Jorge Drexler', durationSeconds: 237 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'al', english: 'to the (a + el — mandatory contraction)' },
      { spanish: 'del', english: 'of the / from the (de + el)' },
      { spanish: 'voy al baño', english: 'I\'m going to the bathroom' },
      { spanish: 'es del mercado', english: 'it\'s from the market' },
      { spanish: 'a la / de la', english: 'to the / from the (feminine — NO contraction)' },
    ],
    grammarPoints: [
      'a + el → al (never a + el as two words)',
      'de + el → del (never de + el as two words)',
      'Only applies to the masculine singular article el — not la, los, las',
      'Never contract with the pronoun él (him): Hablo de él (not del)',
      'Voy al cine, vengo del trabajo, hablo del artista',
    ],
    quizTypes: ['Contraction identification', 'When to combine vs not', 'Fill-in exercises'],
    readingTopic: 'Jorge Drexler: The Uruguayan Doctor Who Won an Oscar',
    readingRatio: '25% English / 75% Spanish with al/del throughout',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 26,
    title: 'Prepositional Pronouns',
    level: 'A2-B1',
    concept: 'Para mí, para ti — and conmigo/contigo',
    conceptDescription:
      'After prepositions, Spanish uses special pronoun forms. Most are the same as subject pronouns — except for mí and ti, and the unique conmigo/contigo.',
    song: { title: 'Contigo Aprendí', artist: 'Armando Manzanero', durationSeconds: 228 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'para mí', english: 'for me' },
      { spanish: 'para ti', english: 'for you' },
      { spanish: 'conmigo', english: 'with me (con + mí = conmigo, special form)' },
      { spanish: 'contigo', english: 'with you (con + ti = contigo, special form)' },
      { spanish: 'sin él / sin ella', english: 'without him / without her' },
    ],
    grammarPoints: [
      'After prepositions: mí/ti (not yo/tú) — all others same as subject pronouns',
      'Con has special forms: conmigo (with me), contigo (with you), consigo (with himself)',
      'A mí me gusta... vs Me gusta... — adding a + pronoun for emphasis',
      'Entre tú y yo: exception — use subject pronouns after "entre"',
      'Never say "entre ti y mí" — it\'s "entre tú y yo"',
    ],
    quizTypes: ['Prepositional pronoun selection', 'Conmigo/contigo usage', 'Preposition + pronoun pairs'],
    readingTopic: 'Armando Manzanero: The Romantic Composer Who Defined Latin Ballads',
    readingRatio: '25% English / 75% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 27,
    title: 'Direct Object Pronouns',
    level: 'A2-B1',
    concept: 'Lo, la, los, las — replacing what\'s being acted on',
    conceptDescription:
      'Direct object pronouns let you replace nouns that are already understood, making your Spanish flow naturally instead of sounding repetitive.',
    song: { title: 'Dime', artist: 'A.B. Quintanilla & Selena', durationSeconds: 245 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'lo', english: 'it / him (direct object, masc. singular)' },
      { spanish: 'la', english: 'it / her (direct object, fem. singular)' },
      { spanish: 'los / las', english: 'them (masc. / fem. plural)' },
      { spanish: 'me / te', english: 'me / you (direct object)' },
      { spanish: 'personal a', english: 'required before direct object people: veo a María' },
    ],
    grammarPoints: [
      'DOPs: me/te/lo/la/nos/os/los/las',
      'Placement: before conjugated verb (lo veo), attached to infinitive (verlo)',
      'Personal a: required before human/pet direct objects — veo a mi madre',
      'Gender/number must match the noun replaced: el libro → lo, la canción → la',
      'With ir a + infinitive: lo voy a ver OR voy a verlo (both correct)',
    ],
    quizTypes: ['Replace noun with DOP', 'Placement exercises', 'Personal a identification'],
    readingTopic: 'Selena: The Queen of Tejano and Her Lasting Legacy',
    readingRatio: '20% English / 80% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 28,
    title: 'Indirect Object Pronouns',
    level: 'A2-B1',
    concept: 'Me, te, le, nos, les — to whom or for whom',
    conceptDescription:
      'Indirect object pronouns answer "to whom?" or "for whom?" They\'re the same forms used with gustar — so this unlocks a lot at once.',
    song: { title: 'Me Gustas Tú', artist: 'Manu Chao', durationSeconds: 262 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'me', english: 'to/for me' },
      { spanish: 'te', english: 'to/for you' },
      { spanish: 'le', english: 'to/for him/her/you-formal' },
      { spanish: 'nos', english: 'to/for us' },
      { spanish: 'les', english: 'to/for them/you-all' },
    ],
    grammarPoints: [
      'IOPs: me/te/le/nos/os/les — placed before conjugated verb',
      'Le is ambiguous (him/her/them) — clarify with a + pronoun: le digo a ella',
      'When both DOP and IOP appear: IOP comes first (me lo da)',
      'IOPs attach to infinitives with accent: darme, darte',
      'These are the same pronouns used with gustar — you already know them',
    ],
    quizTypes: ['IOP identification', 'Le clarification', 'Sentence restructuring'],
    readingTopic: 'Manu Chao: The Globetrotting Voice of Latin Alternative',
    readingRatio: '20% English / 80% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 29,
    title: 'Double Object Pronouns',
    level: 'B1',
    concept: 'IOP + DOP together — and the se substitution',
    conceptDescription:
      'When you use both an indirect and direct object pronoun in the same sentence, they follow strict order rules. And le/les always become se before lo/la/los/las.',
    song: { title: 'Dámelo', artist: 'Daddy Yankee', durationSeconds: 200 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'me lo da', english: 'he gives it to me (IOP + DOP)' },
      { spanish: 'se lo doy', english: 'I give it to him/her (se replaces le)' },
      { spanish: 'dámelo', english: 'give it to me (command with attached pronouns)' },
      { spanish: 'se lo explico', english: 'I explain it to him/her' },
      { spanish: 'no me lo digas', english: 'don\'t tell it to me' },
    ],
    grammarPoints: [
      'Order: IOP always before DOP (me lo, te la, nos los)',
      'Le/les → se before lo/la/los/las: le lo → se lo',
      'Clarify se with a + pronoun: se lo doy a ella',
      'Attached to affirmative commands, accent added: dámelo, díselo',
      'Separated in negative commands: no me lo digas',
    ],
    quizTypes: ['Combine DOPs and IOPs', 'Se substitution', 'Accent placement on commands'],
    readingTopic: 'Daddy Yankee: The Godfather of Reggaeton Retires in Style',
    readingRatio: '15% English / 85% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 140,
  },

  {
    id: 30,
    title: 'Gustar & Similar Verbs',
    level: 'A2-B1',
    concept: 'Me gusta / me gustan — liking things in Spanish',
    conceptDescription:
      'Gustar works backwards from English — literally "it pleases me." Once you understand the structure, molestar, encantar, interesar, and dozens more all work the same way.',
    song: { title: 'Me Gusta', artist: 'Shakira ft. Anuel AA', durationSeconds: 205 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'me gusta', english: 'I like it (lit: it pleases me — singular)' },
      { spanish: 'me gustan', english: 'I like them (lit: they please me — plural)' },
      { spanish: 'me encanta', english: 'I love it (encantar)' },
      { spanish: 'me molesta', english: 'it bothers me (molestar)' },
      { spanish: 'a mí me gusta', english: 'I like it (emphatic/clarifying form)' },
    ],
    grammarPoints: [
      'Gustar = to please. Me gusta el libro = The book pleases me',
      'Singular subject → gusta. Plural subject → gustan',
      'IOP tells you who likes it: me/te/le/nos/les',
      'Me gusta + infinitive: me gusta bailar (I like to dance)',
      'Same structure: encantar, molestar, interesar, aburrir, fascinar, faltar',
    ],
    quizTypes: ['Gusta vs gustan selection', 'Pronoun + gustar construction', 'Translate preference sentences'],
    readingTopic: 'Shakira & Anuel AA: When Pop Worlds Collide',
    readingRatio: '20% English / 80% Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 140,
  },

  // ── B1 Intermediate — Modules 31–49 ───────────────────────────────────────

  {
    id: 31,
    title: 'Saber — To Know (Facts)',
    level: 'B1',
    concept: 'Factual knowledge and knowing how to',
    conceptDescription: 'Saber expresses knowing facts and knowing how to do things.',
    song: { title: 'No Sé', artist: 'Sech', durationSeconds: 210 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'sé', english: 'I know (saber — irregular yo)' },
      { spanish: 'sé hablar', english: 'I know how to speak' },
      { spanish: 'no sé', english: 'I don\'t know' },
      { spanish: '¿Sabes...?', english: 'Do you know...?' },
      { spanish: 'saber + infinitivo', english: 'to know how to + verb' },
    ],
    grammarPoints: [
      'Irregular yo: sé — all other forms regular: sabes/sabe/sabemos/sabéis/saben',
      'Saber + infinitive = know how to: sé cocinar (I know how to cook)',
      'Saber + que clause = know that: sé que viene (I know that he\'s coming)',
      'Saber vs conocer: facts/skills vs familiarity (Module 32)',
      'No say "sé cómo hacerlo" — drop cómo: sé hacerlo',
    ],
    quizTypes: ['Saber conjugation', 'Saber vs context', 'Saber + infinitive'],
    readingTopic: 'Sech and the Panama City Sound',
    readingRatio: '15% English / 85% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 32,
    title: 'Conocer — To Be Familiar With',
    level: 'B1',
    concept: 'Knowing people, places, and things',
    conceptDescription: 'Conocer is about familiarity — people you\'ve met, places you\'ve been, things you\'ve experienced.',
    song: { title: 'Conóceme', artist: 'Ricky Martin', durationSeconds: 216 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'conozco', english: 'I know / I\'m familiar with (irregular yo)' },
      { spanish: 'conocer a', english: 'to know a person (personal a required)' },
      { spanish: '¿Conoces...?', english: 'Are you familiar with...? Have you been to...?' },
      { spanish: 'no conozco', english: 'I\'m not familiar with / I\'ve never been to' },
      { spanish: 'conocer vs saber', english: 'familiarity vs factual knowledge' },
    ],
    grammarPoints: [
      'Irregular yo: conozco — all others regular',
      'Use conocer for people, places, and creative works you\'re familiar with',
      'Personal a required before human objects: conozco a María',
      'Saber vs conocer: ¿Sabes dónde está? vs ¿Conoces Madrid?',
      'In preterite, conocer = met for the first time: conocí a mi mejor amigo aquí',
    ],
    quizTypes: ['Saber vs conocer selection', 'Personal a', 'Direct object pronouns with conocer'],
    readingTopic: 'Ricky Martin: The Man Behind the Voice',
    readingRatio: '15% English / 85% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 33,
    title: 'Preterite — Regular Verbs',
    level: 'B1',
    concept: 'Talking about completed past actions',
    conceptDescription: 'The preterite is for finished events — things that happened once, at a specific time, and are done.',
    song: { title: 'Lo Que Pasó, Pasó', artist: 'Daddy Yankee', durationSeconds: 195 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hablé', english: 'I spoke (-AR preterite)' },
      { spanish: 'comí', english: 'I ate (-ER preterite)' },
      { spanish: 'viví', english: 'I lived (-IR preterite)' },
      { spanish: 'ayer', english: 'yesterday — classic preterite trigger' },
      { spanish: 'el año pasado', english: 'last year' },
    ],
    grammarPoints: [
      'AR preterite: -é/-aste/-ó/-amos/-asteis/-aron',
      'ER/IR preterite: -í/-iste/-ió/-imos/-isteis/-ieron (same endings)',
      'Nosotros form same as present for -AR and -IR — context tells you which',
      'Preterite triggers: ayer, anoche, la semana pasada, el año pasado, de repente',
      'Accent marks critical: hablo (I speak) vs habló (he spoke)',
    ],
    quizTypes: ['Past tense conjugation', 'Identify past tense in lyrics', 'Time keyword recognition'],
    readingTopic: 'Daddy Yankee: A Career in His Own Words',
    readingRatio: '10% English / 90% Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 34,
    title: 'Preterite — Ser & Ir',
    level: 'B1',
    concept: 'Fui — same form for both verbs',
    conceptDescription: 'Ser and Ir share the exact same preterite. Context and surrounding words tell you which one is meant.',
    song: { title: 'Fue', artist: 'Alejandro Fernández ft. Marc Anthony', durationSeconds: 258 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'fui', english: 'I was (ser) / I went (ir)' },
      { spanish: 'fue', english: 'he/she was / he/she went' },
      { spanish: 'fuimos', english: 'we were / we went' },
      { spanish: 'fue un éxito', english: 'it was a success (ser)' },
      { spanish: 'fue al concierto', english: 'he went to the concert (ir + a)' },
    ],
    grammarPoints: [
      'Fui/fuiste/fue/fuimos/fuisteis/fueron — same for both ser and ir',
      'How to tell apart: ir + a = went (fue a la tienda). No a = ser (fue difícil)',
      'Fue as "it was" describes events: fue increíble, fue un error',
      'Context is almost always clear — native speakers never confuse them',
      'This is one of the most common preterite forms in everyday Spanish',
    ],
    quizTypes: ['Ser vs ir in preterite context', 'Fue identification', 'Event description exercises'],
    readingTopic: 'Alejandro Fernández: Carrying the Mariachi Legacy Forward',
    readingRatio: '10% English / 90% Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 35,
    title: 'Preterite — Irregular Verbs Part 1',
    level: 'B1',
    concept: 'Tener, estar, poder, hacer, venir and more',
    conceptDescription: 'The most common Spanish verbs are irregular in the preterite. They follow a pattern — new stems, same set of endings.',
    song: { title: 'Tuve', artist: 'Becky G', durationSeconds: 205 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'tuve', english: 'I had (tener → tuv-)' },
      { spanish: 'estuve', english: 'I was (estar → estuv-)' },
      { spanish: 'pude', english: 'I was able to (poder → pud-)' },
      { spanish: 'hice', english: 'I did/made (hacer → hic-/hiz-)' },
      { spanish: 'vine', english: 'I came (venir → vin-)' },
    ],
    grammarPoints: [
      'New stems + endings: -e/-iste/-o/-imos/-isteis/-ieron (no accent marks)',
      'Tener → tuv-, Estar → estuv-, Andar → anduv-, Poder → pud-',
      'Saber → sup-, Querer → quis-, Poner → pus-, Hacer → hic-/hiz-',
      'Venir → vin-, Decir → dij-, Traer → traj-, Conducir → conduj-',
      'Hizo (not hice) for él/ella — z before o to preserve sound',
    ],
    quizTypes: ['Irregular stem recognition', 'Conjugation from memory', 'Narrative comprehension'],
    readingTopic: 'Becky G: From Inglewood to International Star',
    readingRatio: '10% English / 90% Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 36,
    title: 'Preterite — Irregular Verbs Part 2',
    level: 'B1',
    concept: 'Ver/dar, stem-changing IR verbs, spelling changes',
    conceptDescription: 'Three more preterite patterns: the simple ver/dar forms, IR verbs that stem-change only in él/ellos, and spelling changes in yo.',
    song: { title: 'Creí', artist: 'Jesse & Joy', durationSeconds: 228 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'vi', english: 'I saw (ver — no accent)' },
      { spanish: 'di', english: 'I gave (dar — no accent)' },
      { spanish: 'pidió', english: 'he asked for (pedir — e→i in él/ellos only)' },
      { spanish: 'durmió', english: 'he slept (dormir — o→u in él/ellos only)' },
      { spanish: 'creí', english: 'I believed (creer — y instead of i between vowels)' },
    ],
    grammarPoints: [
      'Ver and dar: vi/viste/vio/vimos/visteis/vieron, di/diste/dio...',
      'Stem-changing IR verbs change ONLY in él and ellos: pidió, pidieron',
      'E→I: pedir, servir, seguir, repetir, conseguir',
      'O→U: dormir, morir',
      'Spelling change yo: buscar→busqué, llegar→llegué, empezar→empecé',
    ],
    quizTypes: ['Stem change in preterite', 'Spelling change recognition', 'Full narrative translation'],
    readingTopic: 'Jesse & Joy: The Album That Changed Their Lives',
    readingRatio: 'Fully Spanish with glossary for 5–10 difficult words',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 37,
    title: 'Imperfect Tense',
    level: 'B1',
    concept: 'Used to, was doing, ongoing past',
    conceptDescription: 'The imperfect is for the past that kept going — habits, descriptions, things that were happening. Only 3 irregular verbs. One of the easiest tenses to form.',
    song: { title: 'Cuando Me Enamoro', artist: 'Enrique Iglesias ft. Juan Luis Guerra', durationSeconds: 231 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hablaba', english: 'I used to speak / I was speaking' },
      { spanish: 'comía', english: 'I used to eat / I was eating' },
      { spanish: 'siempre', english: 'always — classic imperfect trigger' },
      { spanish: 'cuando era niño/a', english: 'when I was a child' },
      { spanish: 'antes', english: 'before / used to (time marker for imperfect)' },
    ],
    grammarPoints: [
      'AR: -aba/-abas/-aba/-ábamos/-abais/-aban',
      'ER/IR: -ía/-ías/-ía/-íamos/-íais/-ían',
      'Only 3 irregulars: ir (iba), ver (veía), ser (era)',
      'Used for: habits (siempre comía), descriptions (era alto), ongoing past (llovía)',
      'Imperfect triggers: siempre, todos los días, a veces, antes, cuando era niño',
    ],
    quizTypes: ['Imperfect conjugation', 'Preterite vs imperfect choice', 'Used to vs did exercises'],
    readingTopic: 'Juan Luis Guerra: The Poet of Dominican Music',
    readingRatio: 'Fully Spanish — artist reflecting on their past',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 38,
    title: 'Preterite vs Imperfect',
    level: 'B1',
    concept: 'Choosing the right past tense',
    conceptDescription: 'This is where Spanish learners get stuck. Preterite for completed events, imperfect for the ongoing backdrop. This module makes the choice feel instinctive.',
    song: { title: 'El Cuarto de Tula', artist: 'Buena Vista Social Club', durationSeconds: 325 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'Estaba en casa cuando llegó', english: 'I was home (imperfect) when he arrived (preterite)' },
      { spanish: 'de repente', english: 'suddenly — classic preterite trigger' },
      { spanish: 'mientras', english: 'while — often signals imperfect' },
      { spanish: 'fue / era', english: 'was (event, ser-preterite) / was (description, ser-imperfect)' },
      { spanish: 'conocí', english: 'I met (preterite of conocer = first meeting)' },
    ],
    grammarPoints: [
      'Preterite: specific, completed, one-time events (ayer, de repente, una vez)',
      'Imperfect: ongoing, habitual, background description (siempre, mientras, cuando era)',
      'Classic combo: imperfect sets the scene, preterite interrupts it',
      'Ser: era = was (ongoing description), fue = was (a specific event)',
      'Verb meaning can shift: saber (knew) / supo (found out), querer (wanted) / quiso (tried)',
    ],
    quizTypes: ['Choose preterite or imperfect in context', 'Rewrite sentences', 'Lyric tense analysis'],
    readingTopic: 'Buena Vista Social Club: Rediscovering Cuban Music',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 39,
    title: 'Reflexive Verbs',
    level: 'B1',
    concept: 'Actions done to yourself — lavarse, llamarse, sentirse',
    conceptDescription: 'Reflexive verbs describe actions where the subject and object are the same person. They unlock daily routine vocabulary and emotional states.',
    song: { title: 'Me Voy', artist: 'Julieta Venegas', durationSeconds: 215 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'me llamo', english: 'my name is (lit: I call myself)' },
      { spanish: 'me levanto', english: 'I get up' },
      { spanish: 'me siento', english: 'I feel / I sit down' },
      { spanish: 'irse', english: 'to leave / to go away (me voy)' },
      { spanish: 'enamorarse', english: 'to fall in love' },
    ],
    grammarPoints: [
      'Reflexive pronouns: me/te/se/nos/os/se — always before conjugated verb',
      'Verb + -se in infinitive signals reflexive: llamarse, levantarse',
      'Daily routine: bañarse, despertarse, dormirse, vestirse, peinarse',
      'Non-literal reflexives: irse (leave), ponerse (become), sentirse (feel)',
      'Reflexive vs non-reflexive: lavar (wash it) vs lavarse (wash oneself)',
    ],
    quizTypes: ['Reflexive identification', 'Conjugation with pronouns', 'Llamarse for introductions'],
    readingTopic: 'Julieta Venegas: Accordion, Indie Pop, and Mexican Identity',
    readingRatio: 'Fully Spanish — artist daily routine',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 40,
    title: 'Reciprocal Reflexive Verbs',
    level: 'B1',
    concept: 'Each other — nos amamos, se conocen',
    conceptDescription: 'When two or more people do something to each other, Spanish uses the same reflexive pronouns (nos/se) with a plural subject.',
    song: { title: 'Nos Fuimos Lejos', artist: 'Enrique Iglesias ft. Bad Bunny', durationSeconds: 210 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'nos amamos', english: 'we love each other' },
      { spanish: 'se conocen', english: 'they know each other' },
      { spanish: 'nos vemos', english: 'we see each other / see you (farewell)' },
      { spanish: 'se abrazan', english: 'they hug each other' },
      { spanish: 'se escriben', english: 'they write to each other' },
    ],
    grammarPoints: [
      'Only plural forms: nos (we) and se (they/you all)',
      'Same pronouns as reflexive — context/subject tells you it\'s reciprocal',
      'Common reciprocals: saludarse, conocerse, verse, abrazarse, besarse',
      'Used in present, progressive, and past just like any other verb',
      'Nos vemos → "see you" — one of the most common Spanish farewells',
    ],
    quizTypes: ['Reflexive vs reciprocal distinction', 'Create reciprocal sentences', 'Context identification'],
    readingTopic: 'Bad Bunny and Enrique Iglesias: Two Generations of Latin Music',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 41,
    title: 'Por vs Para',
    level: 'B1',
    concept: 'Two ways to say "for" — and much more',
    conceptDescription: 'Por and para both translate to "for" in English but they\'re not interchangeable. This module makes the distinction permanent.',
    song: { title: 'Por Favor', artist: 'Karol G ft. Nicki Minaj', durationSeconds: 196 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'por eso', english: 'that\'s why / because of that' },
      { spanish: 'para siempre', english: 'forever (purpose/goal)' },
      { spanish: 'por supuesto', english: 'of course' },
      { spanish: 'para ti', english: 'for you (recipient)' },
      { spanish: 'por ti', english: 'because of you / for you (reason/motivation)' },
    ],
    grammarPoints: [
      'Por: reason (por amor), duration (por dos horas), exchange (cien por cien)',
      'Por: movement through (pasar por la calle), agent in passive (escrito por)',
      'Por: per (dos veces por semana), idiomatic: por favor, por eso, por fin',
      'Para: purpose/goal (estudio para aprender), recipient (es para ti)',
      'Para: deadline (para el viernes), destination (salgo para Madrid), opinion (para mí)',
    ],
    quizTypes: ['Por vs para selection', 'Context analysis', 'Idiom recognition'],
    readingTopic: 'Karol G: La Bichota and the Rise of Female Reggaeton',
    readingRatio: 'Fully Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 42,
    title: 'Comparatives & Superlatives',
    level: 'B1',
    concept: 'More, less, the most, the best',
    conceptDescription: 'Compare people, places, and things in Spanish. Regular patterns plus four important irregulars.',
    song: { title: 'Mejor', artist: 'Becky G', durationSeconds: 198 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'más... que', english: 'more... than' },
      { spanish: 'menos... que', english: 'less... than' },
      { spanish: 'el/la más...', english: 'the most...' },
      { spanish: 'mejor / peor', english: 'better / worse (irregular)' },
      { spanish: 'mayor / menor', english: 'older / younger (irregular)' },
    ],
    grammarPoints: [
      'Comparative: más/menos + adjective + que (más alto que)',
      'Equality: tan + adjective + como (tan alto como)',
      'Superlative: el/la/los/las + más/menos + adjective',
      'Irregular comparatives: bueno→mejor, malo→peor, joven→menor, viejo→mayor',
      'Superlative of irregular: el mejor, la peor, el mayor, el menor',
    ],
    quizTypes: ['Form comparatives/superlatives', 'Irregular forms', 'Comparison sentences'],
    readingTopic: 'Becky G: The Many Sides of a Multilingual Star',
    readingRatio: 'Fully Spanish — comparing artists/albums',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 43,
    title: 'Negatives',
    level: 'B1',
    concept: 'Double negatives, nada, nadie, nunca, tampoco',
    conceptDescription: 'Spanish not only allows double negatives — it requires them. This module flips the English rule you\'ve been following your whole life.',
    song: { title: 'Nunca es Suficiente', artist: 'Los Ángeles Azules ft. Natalia Lafourcade', durationSeconds: 235 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'nada', english: 'nothing' },
      { spanish: 'nadie', english: 'nobody' },
      { spanish: 'nunca / jamás', english: 'never' },
      { spanish: 'tampoco', english: 'neither / not either' },
      { spanish: 'ningún / ninguno', english: 'none / no (adjective)' },
    ],
    grammarPoints: [
      'Double negatives required: No veo nada (I don\'t see anything)',
      'Negative before verb: no + verb + negative word',
      'OR negative word first, no verb negation needed: Nada veo',
      'Personal a with nadie: No veo a nadie',
      'Indefinite/negative pairs: algo/nada, alguien/nadie, siempre/nunca, también/tampoco',
    ],
    quizTypes: ['Form negative sentences', 'Double negative construction', 'Indefinite vs negative pairs'],
    readingTopic: 'Los Ángeles Azules: Cumbia as Cultural Identity',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 44,
    title: 'Tú Commands — Affirmative & Negative',
    level: 'B1',
    concept: 'Tell someone to do (or not do) something',
    conceptDescription: 'Commands are everywhere in real conversation. The affirmative and negative forms follow different rules — and 8 verbs are irregular.',
    song: { title: 'Ven Conmigo', artist: 'Selena', durationSeconds: 225 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'ven', english: 'come! (venir — irregular command)' },
      { spanish: 'haz', english: 'do/make! (hacer — irregular)' },
      { spanish: 'no hagas', english: 'don\'t do/make! (negative command)' },
      { spanish: 'dime', english: 'tell me! (decir + me attached)' },
      { spanish: 'escúchame', english: 'listen to me! (pronoun attached, accent added)' },
    ],
    grammarPoints: [
      'Affirmative tú command = él/ella present form: habla, come, escribe',
      '8 irregular affirmative: pon, haz, sal, ven, di, ve, ten, sé',
      'Negative tú command = no + opposite vowel ending: no hables, no comas',
      'Negative uses irregular yo present stem: no pongas, no hagas, no salgas',
      'Pronouns attach to affirmative (escúchame), separate in negative (no me escuches)',
    ],
    quizTypes: ['Form commands', 'Affirmative vs negative', 'Pronoun placement'],
    readingTopic: 'Selena: The Queen of Tejano Who Crossed All Borders',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 45,
    title: 'Nosotros Commands',
    level: 'B1',
    concept: 'Let\'s... — vámonos, comamos, hablemos',
    conceptDescription: '"Let\'s do something" in Spanish. The nosotros command form has its own rules, plus the beloved vámonos.',
    song: { title: 'Vámonos', artist: 'Los Ángeles Azules ft. Lila Downs', durationSeconds: 247 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hablemos', english: 'let\'s talk' },
      { spanish: 'comamos', english: 'let\'s eat' },
      { spanish: 'vámonos', english: 'let\'s go (vamos + nos, drops final s)' },
      { spanish: 'no nos vayamos', english: 'let\'s not go (negative nosotros command)' },
      { spanish: 'sentémonos', english: 'let\'s sit down (reflexive with accent)' },
    ],
    grammarPoints: [
      'Nosotros commands: AR swap to e (hablemos), ER/IR swap to a (comamos)',
      'Irregulars use the irregular yo stem: poner → pongamos, hacer → hagamos',
      'Stem-changing IR verbs change: dormir → durmamos, pedir → pidamos',
      'Reflexive: drop final -s, add nos: levantemos → levantémonos (accent)',
      'Vamos vs vámonos: vamos (let\'s go), vámonos (let\'s get going — more emphatic)',
    ],
    quizTypes: ['Form nosotros commands', 'Pronoun rules', 'Vamos vs vámonos'],
    readingTopic: 'Los Ángeles Azules: Four Decades of Cumbia Cumbia',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 46,
    title: 'Past Participles as Adjectives',
    level: 'B1',
    concept: '-ado, -ido — and the 10 irregular forms',
    conceptDescription: 'Past participles describe the result of an action. Used with estar, they describe states: la puerta está abierta, estoy perdido.',
    song: { title: 'Perdido Sin Ti', artist: 'Enrique Iglesias', durationSeconds: 240 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hablado', english: 'spoken (-AR → -ado)' },
      { spanish: 'comido', english: 'eaten (-ER → -ido)' },
      { spanish: 'abierto', english: 'open/opened (abrir — irregular)' },
      { spanish: 'hecho', english: 'done/made (hacer — irregular)' },
      { spanish: 'escrito', english: 'written (escribir — irregular)' },
    ],
    grammarPoints: [
      'Regular: AR → -ado (hablado), ER/IR → -ido (comido, vivido)',
      'Irregular: abierto, dicho, escrito, hecho, muerto, puesto, resuelto, roto, visto, vuelto',
      'Used with estar: agree in gender/number (la tienda está abierta)',
      'Two-vowel verbs add accent: leído, oído, creído',
      'Cultural note: El Día de los Muertos — los muertos (past participle as noun)',
    ],
    quizTypes: ['Form participles', 'Irregular recognition', 'Estar + participle exercises'],
    readingTopic: 'Día de los Muertos: The Living Holiday',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 47,
    title: 'Stressed Possessive Adjectives',
    level: 'B1',
    concept: 'Mío, tuyo, suyo — mine, yours, his/hers',
    conceptDescription: 'Stressed possessives come after the noun and carry more emphasis. They\'re how you say "that book of mine" or "a friend of yours."',
    song: { title: 'Tuyo Soy', artist: 'Ricardo Arjona', durationSeconds: 248 },
    genreSongs: {
      reggaeton: { title: 'La Tóxica', artist: 'Farruko', durationSeconds: 202 },
    },
    vocabulary: [
      { spanish: 'mío / mía', english: 'mine (masc./fem.)' },
      { spanish: 'tuyo / tuya', english: 'yours' },
      { spanish: 'suyo / suya', english: 'his/hers/theirs/yours-formal' },
      { spanish: 'nuestro / nuestra', english: 'ours' },
      { spanish: 'el libro es mío', english: 'the book is mine' },
    ],
    grammarPoints: [
      'Stressed possessives: mío/a, tuyo/a, suyo/a, nuestro/a, vuestro/a',
      'Agree in gender AND number: mío/mía/míos/mías',
      'Used after noun: el libro mío, una amiga mía',
      'Used after ser: el libro es mío (the book is mine)',
      'Suyo is ambiguous — clarify with a + pronoun: el libro es de él',
    ],
    quizTypes: ['Stressed vs regular possessive', 'Suyo clarification', 'Sentence rewriting'],
    readingTopic: 'Ricardo Arjona: Philosopher, Poet, and Guatemalan Icon',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 48,
    title: 'Present Perfect Tense',
    level: 'B1',
    concept: 'He hablado — what I have done',
    conceptDescription: 'The present perfect connects the past to now. Used more in Spain than Latin America, but essential for expressing recent or life experience.',
    song: { title: 'He Pensado en Ti', artist: 'Alejandro Fernández', durationSeconds: 235 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'he hablado', english: 'I have spoken' },
      { spanish: 'has comido', english: 'you have eaten' },
      { spanish: 'ha llegado', english: 'he/she has arrived' },
      { spanish: 'hemos visto', english: 'we have seen' },
      { spanish: 'ya', english: 'already — classic present perfect trigger' },
    ],
    grammarPoints: [
      'Formation: haber (he/has/ha/hemos/habéis/han) + past participle',
      'Participle never changes gender/number in the perfect tense',
      'Haber and participle never separate — nothing goes between them',
      'Negatives and pronouns go before haber: no lo he visto, lo he visto',
      'Haber vs tener: he comido (I have eaten) vs tengo comida (I have food)',
    ],
    quizTypes: ['Form present perfect', 'Haber conjugation', 'Participle selection'],
    readingTopic: 'Alejandro Fernández: Son of Vicente, King in His Own Right',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  {
    id: 49,
    title: 'Past Perfect Tense',
    level: 'B1',
    concept: 'Había hablado — what had happened before',
    conceptDescription: 'The past perfect goes one step further back in time. Use it to describe what had already happened before another past event.',
    song: { title: 'Antes de Ti', artist: 'Morat', durationSeconds: 210 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'había hablado', english: 'I had spoken' },
      { spanish: 'ya había llegado', english: 'he had already arrived' },
      { spanish: 'antes de', english: 'before (time marker for past perfect)' },
      { spanish: 'cuando llegué, ella ya había salido', english: 'when I arrived, she had already left' },
      { spanish: 'todavía no había', english: 'hadn\'t yet' },
    ],
    grammarPoints: [
      'Formation: imperfect of haber (había/habías/había/habíamos/habíais/habían) + participle',
      'Same participle rules as present perfect — no gender agreement',
      'Sequence: past perfect = before the other past event (preterite/imperfect)',
      'Triggers: ya (already), antes de (before), todavía no (not yet), cuando',
      'Spain uses present perfect where Latin America uses preterite for recent past',
    ],
    quizTypes: ['Form past perfect', 'Antes de + infinitive', 'Sequencing events'],
    readingTopic: 'Morat: Colombian Band Taking Over Latin Pop',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 160,
  },

  // ── B1-B2 Upper Intermediate — Modules 50–54 ──────────────────────────────

  {
    id: 50,
    title: 'Simple Future Tense',
    level: 'B1-B2',
    concept: 'Hablaré — what will happen',
    conceptDescription: 'The Spanish future tense is the most regular in the language — infinitive + endings. Master it and predict, promise, and speculate with confidence.',
    song: { title: 'Seré', artist: 'Ha-Ash', durationSeconds: 228 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hablaré', english: 'I will speak' },
      { spanish: 'comerás', english: 'you will eat' },
      { spanish: 'vivirá', english: 'he/she will live' },
      { spanish: 'haremos', english: 'we will do/make (hacer — irregular stem)' },
      { spanish: 'tendrán', english: 'they will have (tener — irregular stem)' },
    ],
    grammarPoints: [
      'Add to full infinitive: -é/-ás/-á/-emos/-éis/-án',
      'Same endings for ALL verbs (AR/ER/IR) — just add to infinitive',
      'Irregular stems (same as conditional): dir-, har-, podr-, pondr-, querr-, sabr-, saldr-, tendr-, vendr-',
      'Ir a + infinitive = near future (informal). Simple future = more definitive',
      'Future for speculation: ¿Dónde estará? (I wonder where he is)',
    ],
    quizTypes: ['Future conjugation', 'Irregular stems', 'Ir a vs simple future comparison'],
    readingTopic: 'Ha-Ash: Two American Sisters Who Conquered Mexico',
    readingRatio: 'Fully Spanish — artist future plans',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 180,
  },

  {
    id: 51,
    title: 'Future Perfect Tense',
    level: 'B1-B2',
    concept: 'Habré hablado — what will have happened',
    conceptDescription: 'Express what will have been completed by a future point in time. Less common but marks advanced fluency.',
    song: { title: 'Para Entonces', artist: 'Alejandro Sanz', durationSeconds: 228 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'habré terminado', english: 'I will have finished' },
      { spanish: 'para el viernes', english: 'by Friday' },
      { spanish: 'dentro de', english: 'within / in (time expression)' },
      { spanish: 'habrás llegado', english: 'you will have arrived' },
      { spanish: 'cuando llegues, ya habré salido', english: 'when you arrive, I will have already left' },
    ],
    grammarPoints: [
      'Formation: future of haber (habré/habrás/habrá/habremos/habréis/habrán) + participle',
      'Used for what will have been done by a future deadline',
      'Time expressions: para (by), dentro de (within), cuando (when)',
      'Also used for speculation about past: habrá llegado ya (he must have arrived by now)',
      'Less frequent than other perfect tenses — recognize and use when natural',
    ],
    quizTypes: ['Form future perfect', 'Time expression usage', 'Speculation about past'],
    readingTopic: 'Alejandro Sanz: Three Decades at the Top of Spanish Pop',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 180,
  },

  {
    id: 52,
    title: 'Conditional Tense',
    level: 'B1-B2',
    concept: 'Would — me gustaría, podría, debería',
    conceptDescription: 'The conditional lets you talk about what would happen, make polite requests, and discuss hypotheticals. Same irregular stems as the future.',
    song: { title: 'Me Gustaría', artist: 'Reik', durationSeconds: 234 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'me gustaría', english: 'I would like' },
      { spanish: 'podría', english: 'I could / I would be able to' },
      { spanish: 'debería', english: 'I should / I ought to' },
      { spanish: 'sería', english: 'it would be' },
      { spanish: '¿Podrías...?', english: 'Could you...? (polite request)' },
    ],
    grammarPoints: [
      'Add to full infinitive: -ía/-ías/-ía/-íamos/-íais/-ían',
      'Same irregular stems as future: dir-, har-, podr-, pondr-, tendr-, etc.',
      'Use for: what would happen, polite requests, speculation',
      '¿Podría/Podrías...? is the polite way to make requests in Spanish',
      'Si + imperfect subjunctive + conditional = hypothetical: si tuviera..., daría...',
    ],
    quizTypes: ['Conditional conjugation', 'Polite expressions', 'Hypothetical scenarios'],
    readingTopic: 'Reik: Mexican Pop Trio and the Sound of Romance',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 180,
  },

  {
    id: 53,
    title: 'Conditional Perfect Tense',
    level: 'B2',
    concept: 'Habría hablado — what would have happened',
    conceptDescription: 'Talk about regret, hindsight, and hypothetical past events. The mark of truly advanced expression in Spanish.',
    song: { title: 'Hubiera Sido', artist: 'Selena', durationSeconds: 197 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'habría dicho', english: 'I would have said' },
      { spanish: 'habría sido', english: 'it would have been' },
      { spanish: 'hubiera podido', english: 'I could have (past subjunctive alternative)' },
      { spanish: 'si hubiera sabido', english: 'if I had known' },
      { spanish: '¿Qué habrías hecho?', english: 'What would you have done?' },
    ],
    grammarPoints: [
      'Formation: conditional of haber (habría/habrías/habría/habríamos/habríais/habrían) + participle',
      'Used for: what would have happened, regret, hindsight',
      'Complete si clause: si + past perfect subjunctive + conditional perfect',
      'Si hubiera estudiado, habría aprobado (if I had studied, I would have passed)',
      'Interchangeable with si + hubiera... + hubiera...: both conditional and subjunctive forms',
    ],
    quizTypes: ['Form conditional perfect', 'Express regret', 'Hypothetical past si clauses'],
    readingTopic: 'Selena: What Could Have Been — A Cultural Reflection',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 180,
  },

  {
    id: 54,
    title: 'Qué vs Lo Que',
    level: 'B1-B2',
    concept: '"That" vs "what" — the clause connector',
    conceptDescription: 'Qué as a question word vs lo que as "what" in a statement. A subtle distinction that shows up constantly in natural Spanish.',
    song: { title: 'Lo Que la Vida Me Robó', artist: 'David Bisbal', durationSeconds: 247 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'lo que', english: 'what (that which) — not a question' },
      { spanish: 'lo que pasa es que', english: 'what\'s happening is that...' },
      { spanish: 'es lo que quiero', english: 'it\'s what I want' },
      { spanish: 'que', english: 'that (conjunction) — no accent' },
      { spanish: 'lo que más me gusta', english: 'what I like the most' },
    ],
    grammarPoints: [
      'Que (no accent) = "that" as conjunction: Sé que viene (I know that he\'s coming)',
      'Lo que = "what" as noun clause (not a question): lo que quiero (what I want)',
      'Lo que can start a sentence: Lo que me gusta es bailar',
      'Qué (with accent) = question word: ¿Qué quieres?',
      'Test: if replaceable with "that which" in English → lo que. If it\'s "that" → que',
    ],
    quizTypes: ['Que vs lo que selection', 'Sentence rephrasing', 'Conjunction identification'],
    readingTopic: 'David Bisbal: From Operación Triunfo to Global Stages',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 180,
  },

  // ── B2 Subjunctive & Advanced — Modules 55–60 ─────────────────────────────

  {
    id: 55,
    title: 'Subjunctive — Principles & WEIRD',
    level: 'B2',
    concept: 'A different mood for uncertainty and emotion',
    conceptDescription: 'The subjunctive isn\'t a tense — it\'s a mood. It appears in a separate clause triggered by certain verbs and expressions. Learn the WEIRD triggers and the structure clicks.',
    song: { title: 'Ojalá', artist: 'Silvio Rodríguez', durationSeconds: 354 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'ojalá', english: 'hopefully / I hope (triggers subjunctive always)' },
      { spanish: 'quiero que vengas', english: 'I want you to come (will/wish trigger)' },
      { spanish: 'espero que estés bien', english: 'I hope you\'re well (emotion trigger)' },
      { spanish: 'es importante que estudies', english: 'it\'s important that you study (impersonal)' },
      { spanish: 'dudo que sea verdad', english: 'I doubt it\'s true (doubt trigger)' },
    ],
    grammarPoints: [
      'Two-clause structure: trigger clause (indicative) + que + subjunctive clause',
      'WEIRD triggers: Will/Wish, Emotion, Influence/Recommendation, Recommendation, Doubt/Denial',
      'Impersonal expressions: es necesario que, es importante que, es bueno que',
      'Non-subjunctive: creer (affirmative), saber, pensar — use indicative',
      'Ojalá always triggers subjunctive — no que needed: ojalá llegue pronto',
    ],
    quizTypes: ['Identify subjunctive triggers', 'WEIRD categorization', 'Subjunctive vs indicative'],
    readingTopic: 'Silvio Rodríguez: The Poet Who Defined Cuban Nueva Trova',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 200,
  },

  {
    id: 56,
    title: 'Present Subjunctive — All Verb Types',
    level: 'B2',
    concept: 'Conjugating in the present subjunctive',
    conceptDescription: 'The present subjunctive swaps vowels — AR verbs use E endings, ER/IR verbs use A endings. Irregular yo forms carry forward.',
    song: { title: 'No Hay Nadie Más', artist: 'Sebastián Yatra', durationSeconds: 215 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hable', english: 'that (I/he) speak (AR → E vowel swap)' },
      { spanish: 'coma', english: 'that (I/he) eat (ER → A vowel swap)' },
      { spanish: 'viva', english: 'that (I/he) live (IR → A vowel swap)' },
      { spanish: 'ponga', english: 'that (I) put (poner — irregular yo stem pong-)' },
      { spanish: 'sea', english: 'that (I/he) be (ser — fully irregular)' },
    ],
    grammarPoints: [
      'AR subjunctive: swap A endings to E (hable, hables, hable, hablemos)',
      'ER/IR subjunctive: swap E/I endings to A (coma, comas, coma, comamos)',
      'Use the irregular yo present form as the subjunctive stem across all persons',
      'Spelling changes (car/gar/zar): busque, llegue, empiece',
      'Five fully irregular: estar (esté), dar (dé), ir (vaya), saber (sepa), ser (sea)',
    ],
    quizTypes: ['Conjugate in present subjunctive', 'Identify in lyrics', 'Full sentence construction'],
    readingTopic: 'Sebastián Yatra: Colombia\'s Romantic Lead',
    readingRatio: 'Fully Spanish',
    songsNeeded: 3,
    status: 'unlocked',
    xpReward: 200,
  },

  {
    id: 57,
    title: 'Present Subjunctive — Full Sentences',
    level: 'B2',
    concept: 'Building complete subjunctive sentences',
    conceptDescription: 'Apply the subjunctive in full sentences across all the WEIRD triggers. This is where the grammar becomes real conversation.',
    song: { title: 'Quiero que Me Quieras', artist: 'Cheap Trick (Spanish version) / various', durationSeconds: 198 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'quiero que vengas', english: 'I want you to come (not "I want that you come")' },
      { spanish: 'me alegra que estés aquí', english: 'I\'m glad you\'re here (emotion)' },
      { spanish: 'te recomiendo que pruebes', english: 'I recommend you try (recommendation)' },
      { spanish: 'no creo que sea verdad', english: 'I don\'t think it\'s true (negated creer → subjunctive)' },
      { spanish: 'busco a alguien que hable', english: 'I\'m looking for someone who speaks (unknown referent)' },
    ],
    grammarPoints: [
      'English "want you to" = Spanish "quiero que" + subjunctive (never quiero a ti)',
      'Negated creer/pensar triggers subjunctive: no creo que sea... (but creo que es... = indicative)',
      'Adjective clauses with unknown referent: busco un apartamento que tenga',
      'When subjects are the same, use infinitive: quiero ir (not quiero que vaya)',
      'Object pronouns go before subjunctive verb: quiero que me lo digas',
    ],
    quizTypes: ['Complete subjunctive sentences', 'Translate complex phrases', 'Lyric analysis'],
    readingTopic: 'The Grammar of Desire: Subjunctive in Latin Love Songs',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 200,
  },

  {
    id: 58,
    title: 'Past (Imperfect) Subjunctive',
    level: 'B2',
    concept: 'What I wished had happened / hypothetical past',
    conceptDescription: 'The past subjunctive opens the door to expressing past wishes, regrets, and the famous si clauses. The entire sentence shifts into the past.',
    song: { title: 'Quisiera', artist: 'Marc Anthony', durationSeconds: 248 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'quisiera', english: 'I would like (past subjunctive of querer — polite)' },
      { spanish: 'ojalá pudiera', english: 'I wish I could' },
      { spanish: 'si tuviera dinero', english: 'if I had money (hypothetical si clause)' },
      { spanish: 'quería que vinieras', english: 'I wanted you to come (past trigger → past subj.)' },
      { spanish: 'como si fuera', english: 'as if it were' },
    ],
    grammarPoints: [
      'Form from ellos preterite: hablaron → hablara. comieron → comiera. fueran → fuera',
      'Endings: -ara/-aras/-ara/-áramos/-arais/-aran (AR) / -iera/-ieras/-iera (ER/IR)',
      'All major preterite irregulars carry forward: tuviera, estuviera, dijera, fuera',
      'Sequence of tenses: past trigger → past subjunctive (quería que vinieras)',
      'Si clauses: si + imperfect subj. + conditional (si tuviera, daría)',
    ],
    quizTypes: ['Past subjunctive conjugation', 'Irregular stems', 'Full past si clause sentences'],
    readingTopic: 'Marc Anthony: The Salsa Singer Who Became a Legend',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 200,
  },

  {
    id: 59,
    title: 'Present Perfect Subjunctive',
    level: 'B2',
    concept: 'Haya hablado — expressing recent events in the subjunctive',
    conceptDescription: 'Combine the present subjunctive of haber with a past participle to express recent events that the main clause responds to emotionally or with doubt.',
    song: { title: 'Espero que Hayas Sido Feliz', artist: 'Los Bukis', durationSeconds: 240 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'haya llegado', english: 'that (he) has arrived (present perfect subj.)' },
      { spanish: 'espero que hayas dormido', english: 'I hope you\'ve slept' },
      { spanish: 'me alegra que hayan ganado', english: 'I\'m glad they\'ve won' },
      { spanish: 'dudo que haya dicho eso', english: 'I doubt he\'s said that' },
      { spanish: 'ojalá haya llegado', english: 'hopefully he\'s arrived' },
    ],
    grammarPoints: [
      'Formation: present subjunctive of haber (haya/hayas/haya/hayamos/hayáis/hayan) + participle',
      'Used when trigger is in present tense but subordinate event is recent/complete',
      'Negatives and pronouns go before haya: no lo haya dicho',
      'Entire sentence must be in present: me alegra que hayas venido',
      'Same participle rules — irregular participles apply: haya hecho, haya visto',
    ],
    quizTypes: ['Form present perfect subjunctive', 'Context selection', 'Full sentence construction'],
    readingTopic: 'Los Bukis: The Band That Defined Mexican Pop Romance',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 200,
  },

  {
    id: 60,
    title: 'Past Perfect Subjunctive',
    level: 'B2',
    concept: 'Hubiera hablado — the final frontier',
    conceptDescription: 'The most complex construction in Spanish — past perfect subjunctive. Used in si clauses for impossible past conditionals and in deep regret expressions. Complete this and you\'re at B2.',
    song: { title: 'Hubiera Sido', artist: 'Selena', durationSeconds: 197 },
    genreSongs: {},
    vocabulary: [
      { spanish: 'hubiera dicho', english: 'had said (past perfect subj.)' },
      { spanish: 'si hubiera sabido', english: 'if I had known' },
      { spanish: 'ojalá hubiera venido', english: 'I wish he had come' },
      { spanish: 'me habría gustado que hubiera venido', english: 'I would have liked him to have come' },
      { spanish: 'como si hubiera sido', english: 'as if it had been' },
    ],
    grammarPoints: [
      'Formation: past subjunctive of haber (hubiera/hubieras/hubiera...) + participle',
      'Used for past hypotheticals that didn\'t happen: si hubiera estudiado...',
      'Si clause structure: si + past perfect subj. + conditional perfect (habría)',
      'Ojalá + past perfect subj.: ojalá hubiera llegado a tiempo',
      'You have reached B2 — you now have all the grammatical tools of an advanced Spanish speaker',
    ],
    quizTypes: ['Form past perfect subjunctive', 'Complex past si clauses', 'Full advanced sentences'],
    readingTopic: 'Selena: A Life in Music, A Legacy That Never Ended',
    readingRatio: 'Fully Spanish',
    songsNeeded: 2,
    status: 'unlocked',
    xpReward: 200,
  },
];
