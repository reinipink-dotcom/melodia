// src/data/curriculum-enrichment.ts
// Curriculum enrichment overlay — vocabulary themes, speaking goals, listening skills,
// recycling targets, vocab packs, speaking prompts, song difficulty, survival phrases.
// Keyed by moduleId. Use getEnrichment(id) to merge with base Module data.

import type { VocabWord } from './modules';

export type SongDifficulty = {
  pace: 'slow' | 'medium' | 'fast';
  clarity: 'clear' | 'moderate' | 'difficult';
  slangLevel: 'none' | 'light' | 'moderate' | 'heavy';
  repetitionLevel: 'low' | 'medium' | 'high';
  beginnerSuitability: 'excellent' | 'good' | 'moderate' | 'challenging';
};

export type VocabPack = {
  coreWords: VocabWord[];
  bonusWords: VocabWord[];
  phraseChunk: string;
  speakingPattern: string;
};

export type SpeakingPrompts = {
  prompts: string[];
  sentenceFrames: string[];
  miniChallenge: string;
};

export type ModuleEnrichment = {
  moduleId: number;
  vocabularyTheme: string;
  speakingGoal: string;
  listeningSkill: string;
  recyclingTargets: string[];
  vocabPack: VocabPack;
  speakingPrompts: SpeakingPrompts;
  songDifficulty: SongDifficulty;
  survivalPhrases?: string[];
  everydayVocabCategories?: string[];
};

export const MODULE_ENRICHMENT: ModuleEnrichment[] = [

  // ── A1 Beginner — Modules 1–8 ──────────────────────────────────────────────

  {
    moduleId: 1,
    vocabularyTheme: 'Sounds, letters, phonetics — the building blocks of reading Spanish aloud',
    speakingGoal: 'User can read any Spanish word aloud and identify the sounds of all 27 letters including ñ, ll, rr, and silent h.',
    listeningSkill: 'Notice how every vowel sounds the same every time — open and pure, never reduced like English vowels.',
    recyclingTargets: [],
    vocabPack: {
      coreWords: [
        { spanish: 'hola', english: 'hello' },
        { spanish: 'adiós', english: 'goodbye' },
        { spanish: 'gracias', english: 'thank you' },
        { spanish: 'sí', english: 'yes' },
        { spanish: 'no', english: 'no' },
      ],
      bonusWords: [
        { spanish: 'nombre', english: 'name' },
        { spanish: 'pronunciar', english: 'to pronounce' },
        { spanish: 'letra', english: 'letter (of alphabet)' },
      ],
      phraseChunk: 'Bésame mucho.',
      speakingPattern: 'Bésame mucho. / Hola. / Llamar.',
    },
    speakingPrompts: {
      prompts: [
        'Say: spell your own first name out loud in Spanish letters.',
        "Say: 'Hola, me llamo ___' using your real name.",
        "Say: 'La h es muda' (The h is always silent).",
      ],
      sentenceFrames: [
        'Mi nombre se escribe con ___.',
        "La letra ___ suena como '___'.",
        'En español, la ___ siempre suena igual.',
      ],
      miniChallenge: 'Spell your first name in Spanish, then spell the name of your favorite artist. Say each letter out loud.',
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'high',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      'Hola. (Hello.)',
      'Adiós. / Hasta luego. (Goodbye. / See you later.)',
      '¿Cómo se pronuncia esto? (How do you pronounce this?)',
      'Más despacio, por favor. (More slowly, please.)',
      'Repita, por favor. (Please repeat.)',
    ],
    everydayVocabCategories: ['phonetics & pronunciation', 'the alphabet', 'reading & spelling'],
  },

  {
    moduleId: 2,
    vocabularyTheme: 'Accent marks, stress patterns, and minimal pairs that change meaning',
    speakingGoal: 'User can place stress correctly on any Spanish word and read accent marks as meaning signals, not decoration.',
    listeningSkill: 'Hear where the singer places stress on words — notice when an accent mark pulls a syllable forward.',
    recyclingTargets: ['The 27-letter alphabet (M1)', 'vowel sounds: a, e, i, o, u (M1)'],
    vocabPack: {
      coreWords: [
        { spanish: 'más', english: 'more' },
        { spanish: 'tú', english: 'you (pronoun)' },
        { spanish: 'él', english: 'he (pronoun)' },
        { spanish: 'sí', english: 'yes' },
        { spanish: 'qué', english: 'what (question)' },
      ],
      bonusWords: [
        { spanish: 'también', english: 'also / too' },
        { spanish: 'después', english: 'after / later' },
        { spanish: 'difícil', english: 'difficult' },
      ],
      phraseChunk: 'El acento va en ___.',
      speakingPattern: "El acento va en 'tú'. / El acento va en 'más'. / El acento va en 'café'.",
    },
    speakingPrompts: {
      prompts: [
        "Say: 'tú eres' — stress the accented tú distinctly from 'tu casa'.",
        "Say: 'más música' — feel the accent pulling 'más' forward.",
        "Say: '¿Cómo?' with a clear rising tone on the accented ó.",
      ],
      sentenceFrames: [
        'El acento cambia el significado de ___ a ___.',
        'La palabra ___ se pronuncia con énfasis en ___.',
        'Sin acento, ___ significa ___.',
      ],
      miniChallenge: "Read these three pairs aloud and notice the meaning shift: el/él, tu/tú, si/sí. Explain what changes.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'high',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      '¿Puede repetir más despacio? (Can you repeat more slowly?)',
      'No entiendo. (I do not understand.)',
      '¿Cómo se escribe? (How do you spell it?)',
      '¿Puede hablar más despacio? (Can you speak more slowly?)',
    ],
    everydayVocabCategories: ['accent marks', 'stress & rhythm', 'reading for meaning'],
  },

  {
    moduleId: 3,
    vocabularyTheme: 'Asking questions, seeking directions, starting any conversation',
    speakingGoal: 'User can form any basic question using ¿Qué?, ¿Dónde?, ¿Cómo?, ¿Quién?, ¿Por qué?, ¿Cuándo?, ¿Cuál?, ¿Cuánto?',
    listeningSkill: 'Catch the question words in lyrics — notice how they always carry an accent and tend to sit at the start of the phrase.',
    recyclingTargets: ['Accent marks on question words (M2)', 'vowel sounds (M1)'],
    vocabPack: {
      coreWords: [
        { spanish: '¿Qué?', english: 'What?' },
        { spanish: '¿Dónde?', english: 'Where?' },
        { spanish: '¿Cómo?', english: 'How?' },
        { spanish: '¿Quién?', english: 'Who?' },
        { spanish: '¿Por qué?', english: 'Why?' },
      ],
      bonusWords: [
        { spanish: '¿Cuándo?', english: 'When?' },
        { spanish: '¿Cuál?', english: 'Which?' },
        { spanish: '¿Cuánto/a?', english: 'How much / How many?' },
      ],
      phraseChunk: '¿___ es tu ___?',
      speakingPattern: '¿Cómo es tu nombre? / ¿Dónde está tu casa? / ¿Qué es tu trabajo?',
    },
    speakingPrompts: {
      prompts: [
        "Say: '¿Cómo te llamas?' (What's your name?)",
        "Say: '¿Dónde vives?' (Where do you live?)",
        "Say: '¿Por qué aprendes español?' (Why are you learning Spanish?)",
      ],
      sentenceFrames: [
        '¿___ es tu canción favorita?',
        '¿___ estás hoy?',
        '¿___ se llama tu artista favorito/a?',
      ],
      miniChallenge: "Ask three questions to an imaginary Spanish speaker about their music taste — use a different question word each time.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    survivalPhrases: [
      '¿Dónde está el baño? (Where is the bathroom?)',
      '¿Cómo se llama usted? (What is your name? — formal)',
      '¿Por qué? (Why?)',
      '¿Qué hora es? (What time is it?)',
      '¿Quién es? (Who is it?)',
    ],
    everydayVocabCategories: ['asking directions', 'starting conversations', 'information-seeking'],
  },

  {
    moduleId: 4,
    vocabularyTheme: 'Giving directions, linking ideas, describing location and timing',
    speakingGoal: 'User can connect two ideas with y/pero/también and describe location using de/en/con/sin.',
    listeningSkill: "Spot the glue words — de, con, sin, pero — that hold long phrases together in the song's verses.",
    recyclingTargets: ['Question words (M3)', 'accent marks (M2)', 'vowel sounds (M1)'],
    vocabPack: {
      coreWords: [
        { spanish: 'de', english: 'of / from' },
        { spanish: 'con', english: 'with' },
        { spanish: 'sin', english: 'without' },
        { spanish: 'en', english: 'in / on / at' },
        { spanish: 'pero', english: 'but' },
      ],
      bonusWords: [
        { spanish: 'desde', english: 'from / since' },
        { spanish: 'hasta', english: 'until / up to' },
        { spanish: 'entre', english: 'between' },
      ],
      phraseChunk: '___ con ___.',
      speakingPattern: 'Café con leche. / Pizza con queso. / Música con ritmo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Soy de ___' — where are you from?",
        "Say: 'Me gusta la música con ritmo' (I like music with rhythm).",
        "Say: 'Habla español pero no habla inglés' (She speaks Spanish but not English).",
      ],
      sentenceFrames: [
        'Soy de ___ pero vivo en ___.',
        'Me gusta ___ con ___, sin ___.',
        '___ y ___, pero no ___.',
      ],
      miniChallenge: "Describe your city using three prepositions: 'Está en ___, cerca de ___, sin ___.'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    survivalPhrases: [
      'Está a la derecha. / Está a la izquierda. (It is to the right. / To the left.)',
      'Cerca de aquí. (Near here.)',
      'Con permiso. (Excuse me. / With your permission.)',
      'Sin problema. (No problem.)',
      'Lejos de aquí. (Far from here.)',
    ],
    everydayVocabCategories: ['giving directions', 'places in town', 'linking ideas'],
  },

  {
    moduleId: 5,
    vocabularyTheme: 'Talking about yourself and others — people, identity, introductions',
    speakingGoal: 'User can say I am, you are, he/she is, we are and introduce themselves and others.',
    listeningSkill: 'Notice which pronoun appears at the start of each phrase — or when it is dropped (Spanish often omits pronouns since the verb ending already signals who).',
    recyclingTargets: ['Question words ¿Quién? ¿Cómo? (M3)', 'connectors pero/y (M4)', 'vowel sounds (M1)'],
    vocabPack: {
      coreWords: [
        { spanish: 'yo', english: 'I' },
        { spanish: 'tú', english: 'you (informal)' },
        { spanish: 'él / ella', english: 'he / she' },
        { spanish: 'nosotros', english: 'we' },
        { spanish: 'ellos / ellas', english: 'they' },
      ],
      bonusWords: [
        { spanish: 'usted', english: 'you (formal)' },
        { spanish: 'ustedes', english: 'you all' },
        { spanish: 'vosotros', english: 'you all (Spain)' },
      ],
      phraseChunk: 'Yo soy ___.',
      speakingPattern: 'Yo soy estudiante. / Yo soy de México. / Yo soy músico.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Yo soy de ___' — your country or city.",
        "Say: 'Él/Ella se llama ___' — name someone you know.",
        "Say: 'Nosotros somos amigos' (We are friends).",
      ],
      sentenceFrames: [
        'Yo soy ___ y tú eres ___.',
        'Él/Ella es ___ de ___.',
        'Nosotros somos ___ y ellos son ___.',
      ],
      miniChallenge: "Introduce yourself fully: 'Yo soy ___, soy de ___, y soy ___' (name, origin, one thing you are).",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      'Yo soy de ___. (I am from ___)',
      'Él/Ella se llama ___. (His/Her name is ___)',
      'Somos amigos. (We are friends.)',
      'Yo no sé. (I do not know.)',
      'No hablo mucho español. (I do not speak much Spanish.)',
    ],
    everydayVocabCategories: ['people & family', 'introductions & identity', 'nationalities'],
  },

  {
    moduleId: 6,
    vocabularyTheme: 'Identity vs state — naming who you are and how you are',
    speakingGoal: "User can introduce themselves with ser (identity) and describe how they feel and where they are with estar (state/location), back-to-back.",
    listeningSkill: "Catch ser vs estar choices in natural-speed Spanish lyrics — Shakira's 'estoy' lands once per chorus line in 'Estoy Aquí', and the contrast with 'soy' is the whole lesson.",
    recyclingTargets: ['Subject pronouns (M5)', 'connector y (M4)', '¿Cómo estás? question intonation (M3)', 'accent rules está vs esta (M2)'],
    vocabPack: {
      coreWords: [
        { spanish: 'soy', english: 'I am (identity)' },
        { spanish: 'eres', english: 'you are (identity)' },
        { spanish: 'es', english: 'he / she is (identity)' },
        { spanish: 'estoy', english: 'I am (state / location)' },
        { spanish: 'está', english: 'he / she is (state / location)' },
      ],
      bonusWords: [
        { spanish: 'estás', english: 'you are (state)' },
        { spanish: 'bien', english: 'well / fine' },
        { spanish: 'aquí', english: 'here' },
      ],
      phraseChunk: 'Estoy bien, ¿y tú?',
      speakingPattern: 'Soy [name]. / Estoy bien. / Estoy aquí.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Soy ___' — your name. That's identity (ser).",
        "Say: 'Estoy ___' — bien, cansado, or feliz. That's state (estar).",
        "Someone asks '¿Cómo estás?' — answer: 'Estoy bien, ¿y tú?'",
      ],
      sentenceFrames: [
        'Soy ___ y estoy ___.',
        'Yo soy de ___ pero estoy en ___.',
        '¿Cómo estás? — Estoy ___, ¿y tú?',
      ],
      miniChallenge: "Look in a mirror. Say one ser sentence about yourself ('Soy ___') and one estar sentence ('Estoy ___'). Same person, two verbs, two different truths.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'high',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      'Soy ___. (I am ___ — your name or where you\'re from.)',
      'Estoy bien. (I\'m well.)',
      'Estoy bien, ¿y tú? (I\'m well, and you?)',
      'Estoy aquí. (I am here.)',
      '¿Cómo estás? (How are you?)',
    ],
    everydayVocabCategories: ['identity & introductions', 'feelings & moods', 'location & place'],
  },

  {
    moduleId: 7,
    vocabularyTheme: 'Definite articles and noun gender — wrapping every Spanish noun in el, la, los, or las',
    speakingGoal: 'User can say any noun out loud with its correct definite article (el libro, la canción, los chicos, las casas) and explain when -o → masculine and -a → feminine.',
    listeningSkill: "Catch el, la, los, las at the front of noun phrases in natural-speed Spanish lyrics — Celia Cruz lands la and un right in the title, and the gendered noun arrives a beat later.",
    recyclingTargets: ['Subject pronouns él/ella (M5)', 'ser/estar es vs está (M6)', 'connector de (M4)', 'accent rules el vs él (M2)'],
    vocabPack: {
      coreWords: [
        { spanish: 'el', english: 'the (masculine singular)' },
        { spanish: 'la', english: 'the (feminine singular)' },
        { spanish: 'los', english: 'the (masculine plural)' },
        { spanish: 'las', english: 'the (feminine plural)' },
        { spanish: 'la casa', english: 'the house (feminine)' },
      ],
      bonusWords: [
        { spanish: 'el día', english: 'the day (masc. exception)' },
        { spanish: 'la mano', english: 'the hand (fem. exception)' },
        { spanish: 'el agua', english: 'the water (fem. but takes el)' },
      ],
      phraseChunk: 'La canción es bonita.',
      speakingPattern: 'El libro es bonito. / La canción es bonita. / Los chicos / Las casas.',
    },
    speakingPrompts: {
      prompts: [
        "Look around. Pick three objects and say each with its article: 'el ___', 'la ___', 'el ___'.",
        "Say: 'La canción es bonita' — feminine article + feminine adjective ending.",
        "Say: 'El libro es bonito' — flip the gender and watch the endings flip with it.",
      ],
      sentenceFrames: [
        'El ___ es bonito. / La ___ es bonita.',
        'Los ___ están aquí. / Las ___ están aquí.',
        'El día es ___. (exception — looks feminine, is masculine)',
      ],
      miniChallenge: "Pick five objects in the room and say each one out loud with its article — never the noun alone. Spanish nouns travel with their article.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'high',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      'El libro / La canción. (The book / The song.)',
      'Los chicos / Las casas. (The boys / The houses.)',
      'La canción es bonita. (The song is pretty.)',
      'El día / La mano / El agua / El problema. (The four exceptions.)',
      '¿Cómo se dice ___ en español? (How do you say ___ in Spanish?)',
    ],
    everydayVocabCategories: ['definite articles', 'noun gender', 'article+noun pairs', 'gender-exception nouns'],
  },

  {
    moduleId: 8,
    vocabularyTheme: 'Meeting people, saying goodbye, thanking, apologizing, asking for help',
    speakingGoal: 'User can greet someone formally and informally, say goodbye, thank someone, apologize, and ask if someone speaks English.',
    listeningSkill: 'Listen for how greetings shift in tone between formal and informal — notice the warmth and musicality in Spanish salutations.',
    recyclingTargets: ['Subject pronouns tú/usted (M5)', 'question word ¿Cómo? (M3)', 'time words buenos días/tardes/noches (M6)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hola', english: 'hello (informal)' },
        { spanish: 'adiós', english: 'goodbye' },
        { spanish: 'gracias', english: 'thank you' },
        { spanish: 'perdón', english: 'excuse me / sorry' },
        { spanish: 'mucho gusto', english: 'nice to meet you' },
      ],
      bonusWords: [
        { spanish: 'encantado/a', english: 'delighted to meet you' },
        { spanish: 'bienvenido/a', english: 'welcome' },
        { spanish: 'igualmente', english: 'likewise' },
      ],
      phraseChunk: '¡Buenos ___!',
      speakingPattern: '¡Buenos días! / ¡Buenas tardes! / ¡Buenas noches!',
    },
    speakingPrompts: {
      prompts: [
        "Say: '¡Buenos días! ¿Cómo estás?' — greet someone for the morning.",
        "Say: 'Mucho gusto, me llamo ___' — introduce yourself.",
        "Say: 'Gracias. De nada.' — practice the exchange.",
      ],
      sentenceFrames: [
        '¡Buenos ___, me llamo ___ y soy de ___!',
        'Mucho gusto, ___, encantado/a de conocerte.',
        'Gracias por ___. De nada, con ___.',
      ],
      miniChallenge: "Do a full greeting exchange: buenos días → ¿cómo estás? → mucho gusto → introduce yourself → hasta luego.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      '¡Buenos días! / ¡Buenas tardes! / ¡Buenas noches! (Good morning! / Good afternoon! / Good night!)',
      'Mucho gusto. (Nice to meet you.)',
      'Gracias. / De nada. (Thank you. / You\'re welcome.)',
      'Lo siento. (I\'m sorry.)',
      '¿Habla usted inglés? (Do you speak English?)',
    ],
    everydayVocabCategories: ['greetings & farewells', 'polite expressions', 'meeting people'],
  },

  // ── A2 Elementary — Modules 9–19 ──────────────────────────────────────────

  {
    moduleId: 9,
    vocabularyTheme: 'Talking about specific vs. general things — nouns in everyday situations',
    speakingGoal: 'User can correctly use el/la/los/las and un/una/unos/unas when referring to people and things.',
    listeningSkill: 'Notice the article before every noun in the song — hear how el/la signal gender of each word.',
    recyclingTargets: ['Subject pronouns (M5)', 'greetings (M8)', 'question words (M3)'],
    vocabPack: {
      coreWords: [
        { spanish: 'el / la', english: 'the (masculine / feminine)' },
        { spanish: 'los / las', english: 'the (plural)' },
        { spanish: 'un / una', english: 'a / an' },
        { spanish: 'unos / unas', english: 'some' },
        { spanish: 'café', english: 'coffee' },
      ],
      bonusWords: [
        { spanish: 'mesa', english: 'table' },
        { spanish: 'cuenta', english: 'bill / check' },
        { spanish: 'menú', english: 'menu' },
      ],
      phraseChunk: 'Quiero ___ ___.',
      speakingPattern: 'Quiero un café. / Quiero una mesa. / Quiero los libros.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Un café, por favor' — order at a café.",
        "Say: 'La música es mi vida' (Music is my life).",
        "Say: 'El español es difícil pero bonito' (Spanish is hard but beautiful).",
      ],
      sentenceFrames: [
        'El/La ___ es muy ___ y lo/la escucho todos los días.',
        'Quiero un/una ___, por favor.',
        'Los/Las ___ son mis favoritos/as.',
      ],
      miniChallenge: "Name five things in your room — assign el/la to each one. Say: 'El libro, la ventana, el teléfono...'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'light',
      repetitionLevel: 'high',
      beginnerSuitability: 'good',
    },
    survivalPhrases: [
      'Un café, por favor. (A coffee, please.)',
      'La cuenta, por favor. (The bill, please.)',
      '¿Dónde está el baño? (Where is the bathroom?)',
      'Una mesa para dos. (A table for two.)',
    ],
    everydayVocabCategories: ['food & drinks', 'ordering at a restaurant', 'everyday objects'],
  },

  {
    moduleId: 10,
    vocabularyTheme: 'Daily routines, work, study, and regular activities — what you do every day',
    speakingGoal: 'User can say what they, someone else, or a group regularly does using hablar, trabajar, escuchar, caminar, bailar.',
    listeningSkill: 'Spot -ar verb endings in the lyrics — hear -o, -as, -a, -amos, -an changing with each person.',
    recyclingTargets: ['Subject pronouns (M5)', 'articles el/la (M9)', 'question word ¿Qué? (M3)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hablar', english: 'to speak' },
        { spanish: 'trabajar', english: 'to work' },
        { spanish: 'bailar', english: 'to dance' },
        { spanish: 'caminar', english: 'to walk' },
        { spanish: 'escuchar', english: 'to listen' },
      ],
      bonusWords: [
        { spanish: 'cantar', english: 'to sing' },
        { spanish: 'cocinar', english: 'to cook' },
        { spanish: 'comprar', english: 'to buy' },
      ],
      phraseChunk: 'Yo ___ todos los días.',
      speakingPattern: 'Yo bailo todos los días. / Yo trabajo todos los días. / Yo escucho música todos los días.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Yo hablo español un poco' (I speak Spanish a little).",
        "Say: '¿Trabajas los fines de semana?' (Do you work on weekends?)",
        "Say: 'Ella baila muy bien' (She dances very well).",
      ],
      sentenceFrames: [
        'Yo ___ todos los días y tú ___ los fines de semana.',
        'Nosotros ___ juntos cuando ___.',
        'Ella ___ y él ___ al mismo tiempo.',
      ],
      miniChallenge: "Describe your typical Tuesday using five -ar verbs: 'Los martes yo trabajo, camino, escucho...'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'high',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['daily routines', 'work & school', 'hobbies & activities'],
  },

  {
    moduleId: 11,
    vocabularyTheme: 'Food, eating habits, reading, running — what you consume and experience',
    speakingGoal: 'User can say what they eat, drink, read, and run using comer, beber, leer, correr, and vender.',
    listeningSkill: 'Catch -er verb endings — hear how -o/-es/-e differ from -ar verbs but signal the same person framework.',
    recyclingTargets: ['-ar verb endings (M10)', 'subject pronouns (M5)', 'articles el/la (M9)'],
    vocabPack: {
      coreWords: [
        { spanish: 'comer', english: 'to eat' },
        { spanish: 'beber', english: 'to drink' },
        { spanish: 'leer', english: 'to read' },
        { spanish: 'correr', english: 'to run' },
        { spanish: 'vender', english: 'to sell' },
      ],
      bonusWords: [
        { spanish: 'aprender', english: 'to learn' },
        { spanish: 'comprender', english: 'to understand' },
        { spanish: 'romper', english: 'to break' },
      ],
      phraseChunk: '¿Qué quieres ___?',
      speakingPattern: '¿Qué quieres comer? / ¿Qué quieres beber? / ¿Qué quieres leer?',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Como pizza los viernes' (I eat pizza on Fridays).",
        "Say: 'Bebo café por la mañana' (I drink coffee in the morning).",
        "Say: 'Leo música — quiero decir, escucho música y leo las letras' (I read music — I mean, I listen and read the lyrics).",
      ],
      sentenceFrames: [
        'Como ___ y bebo ___ todos los días.',
        'Leo ___ cuando ___.',
        'Corremos ___ veces por semana.',
      ],
      miniChallenge: "Describe your eating habits for one day: breakfast, lunch, dinner — use comer and beber for each meal.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['food & drinks', 'health & daily habits', 'reading & learning'],
  },

  {
    moduleId: 12,
    vocabularyTheme: 'Going places, living somewhere, writing, coming and going — movement verbs',
    speakingGoal: 'User can say where they live, what they write, and what they receive using vivir, escribir, abrir, subir, recibir.',
    listeningSkill: 'Notice -ir verb endings — hear how vivo, vives, vive form the familiar conjugation pattern.',
    recyclingTargets: ['-ar verbs (M10)', '-er verbs (M11)', 'subject pronouns (M5)'],
    vocabPack: {
      coreWords: [
        { spanish: 'vivir', english: 'to live' },
        { spanish: 'escribir', english: 'to write' },
        { spanish: 'abrir', english: 'to open' },
        { spanish: 'subir', english: 'to go up / to upload' },
        { spanish: 'recibir', english: 'to receive' },
      ],
      bonusWords: [
        { spanish: 'compartir', english: 'to share' },
        { spanish: 'cubrir', english: 'to cover' },
        { spanish: 'decidir', english: 'to decide' },
      ],
      phraseChunk: 'Vivo en ___.',
      speakingPattern: 'Vivo en la ciudad. / Vivo en México. / Vivo en un apartamento pequeño.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Vivo en ___' — your city or neighborhood.",
        "Say: 'Escribo canciones en español' or 'Escribo mensajes en inglés'.",
        "Say: '¿Dónde vives?' — then answer for yourself.",
      ],
      sentenceFrames: [
        'Vivo en ___ desde hace ___ años.',
        'Escribo ___ todos los ___.',
        'Recibo ___ de mi ___.',
      ],
      miniChallenge: "Describe where you live: city, type of home, and how long you've lived there — all in Spanish using vivir.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'high',
      beginnerSuitability: 'excellent',
    },
    survivalPhrases: [
      'Vivo en ___. (I live in ___)',
      '¿Dónde vives? (Where do you live?)',
      'Quiero ir a ___. (I want to go to ___)',
      'Necesito escribir. (I need to write.)',
      'Abra la puerta, por favor. (Please open the door.)',
    ],
    everydayVocabCategories: ['places to live', 'transportation & movement', 'writing & communication'],
  },

  {
    moduleId: 13,
    vocabularyTheme: 'Identity, origins, nationality, profession, and permanent traits',
    speakingGoal: 'User can describe who they are, where they are from, and what they do for work using ser correctly.',
    listeningSkill: "Listen for 'soy', 'eres', 'es', 'somos', 'son' — these are identity statements that tell you who a person fundamentally is.",
    recyclingTargets: ['Subject pronouns (M5)', '-ar/-er/-ir verb patterns (M10–12)', 'question words ¿Quién? ¿De dónde? (M3)'],
    vocabPack: {
      coreWords: [
        { spanish: 'soy', english: 'I am (permanent)' },
        { spanish: 'eres', english: 'you are (permanent)' },
        { spanish: 'es', english: 'he/she/it is (permanent)' },
        { spanish: 'somos', english: 'we are (permanent)' },
        { spanish: 'son', english: 'they are (permanent)' },
      ],
      bonusWords: [
        { spanish: 'médico/a', english: 'doctor' },
        { spanish: 'maestro/a', english: 'teacher' },
        { spanish: 'músico/a', english: 'musician' },
      ],
      phraseChunk: 'Soy ___ de ___.',
      speakingPattern: 'Soy estudiante de España. / Soy músico de Colombia. / Soy doctora de México.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Soy ___ y soy de ___' — name and origin.",
        "Say: 'Ella es cantante y es de Cuba' (She is a singer and from Cuba).",
        "Say: 'Somos estudiantes de español' (We are Spanish students).",
      ],
      sentenceFrames: [
        'Soy ___ de ___ y mi trabajo es ___.',
        'Él/Ella es ___ — es de ___ y es muy ___.',
        'Somos ___ y somos de ___.',
      ],
      miniChallenge: "Introduce your favorite artist using ser: nationality, profession, and two personality traits.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['nationalities & countries', 'professions & work', 'personality descriptions'],
  },

  {
    moduleId: 14,
    vocabularyTheme: 'Emotions, physical states, and location — how you feel and where you are',
    speakingGoal: 'User can say how they feel (estoy cansado/a, estoy feliz) and where something is (está en la mesa).',
    listeningSkill: "Catch 'estoy', 'estás', 'está' — notice how emotion and location words follow estar throughout the song.",
    recyclingTargets: ['Ser (M13)', 'subject pronouns (M5)', 'prepositions of location (M4)'],
    vocabPack: {
      coreWords: [
        { spanish: 'estoy', english: 'I am (temporary/location)' },
        { spanish: 'estás', english: 'you are (temporary/location)' },
        { spanish: 'cansado/a', english: 'tired' },
        { spanish: 'feliz', english: 'happy' },
        { spanish: 'triste', english: 'sad' },
      ],
      bonusWords: [
        { spanish: 'emocionado/a', english: 'excited' },
        { spanish: 'preocupado/a', english: 'worried' },
        { spanish: 'sorprendido/a', english: 'surprised' },
      ],
      phraseChunk: 'Estoy muy ___.',
      speakingPattern: 'Estoy muy feliz. / Estoy muy cansado. / Estoy muy emocionado hoy.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Estoy ___ hoy' — how are you feeling right now?",
        "Say: '¿Dónde está el libro?' then answer: 'Está en la mesa'.",
        "Say: 'Ella está triste pero él está feliz'.",
      ],
      sentenceFrames: [
        'Estoy ___ porque ___.',
        'El/La ___ está en ___.',
        'Hoy estamos ___ y mañana estaremos ___.',
      ],
      miniChallenge: "Describe your emotional weather report for the day: 'Hoy estoy ___ porque ___. Mañana espero estar ___.'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['emotions & feelings', 'health & body', 'places & locations'],
  },

  {
    moduleId: 15,
    vocabularyTheme: 'Descriptions that change vs. descriptions that are permanent — mood vs. character',
    speakingGoal: 'User can correctly choose ser or estar for any description, distinguishing permanent identity from temporary state.',
    listeningSkill: 'In the song, note every ser/estar usage and ask: is this who the person is, or how they are right now?',
    recyclingTargets: ['Ser (M13)', 'Estar (M14)', 'descriptive adjectives (M17 preview)'],
    vocabPack: {
      coreWords: [
        { spanish: 'aburrido/a', english: 'boring (ser) / bored (estar)' },
        { spanish: 'listo/a', english: 'clever (ser) / ready (estar)' },
        { spanish: 'malo/a', english: 'bad/mean (ser) / sick (estar)' },
        { spanish: 'seguro/a', english: 'safe/reliable (ser) / certain (estar)' },
        { spanish: 'vivo/a', english: 'clever (ser) / alive (estar)' },
      ],
      bonusWords: [
        { spanish: 'rico/a', english: 'wealthy (ser) / delicious (estar)' },
        { spanish: 'muerto/a', english: 'lifeless (ser) / dead (estar)' },
        { spanish: 'orgulloso/a', english: 'proud' },
      ],
      phraseChunk: '___ está/es ___.',
      speakingPattern: 'La sopa está caliente. / La sopa es deliciosa. / Él está cansado pero es muy fuerte.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'La música es buena' — then 'La música está sonando' — notice the difference.",
        "Say: 'Estoy aburrido/a' (I'm bored right now) vs 'Esa clase es aburrida' (That class is boring by nature).",
        "Say: 'Mi amigo es malo jugando fútbol pero está malo hoy — está enfermo.'",
      ],
      sentenceFrames: [
        '___ es ___ (permanent trait) pero hoy está ___ (current state).',
        'Esta canción es ___ y está ___ en las listas.',
        'Soy ___ de carácter pero hoy estoy ___ de ánimo.',
      ],
      miniChallenge: "Pick an artist. Use ser for three permanent traits and estar for three current-moment descriptions.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['emotions vs personality', 'physical descriptions', 'talking about people'],
  },

  {
    moduleId: 16,
    vocabularyTheme: 'What is happening right now — actions in progress, live descriptions',
    speakingGoal: 'User can say what is happening right now using estar + -ando/-iendo (estoy comiendo, estás bailando).',
    listeningSkill: 'Listen for -ando and -iendo endings — those words tell you exactly what is in progress at that moment.',
    recyclingTargets: ['Estar (M14)', '-ar/-er/-ir infinitives (M10–12)', 'ser vs estar (M15)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hablando', english: 'speaking' },
        { spanish: 'comiendo', english: 'eating' },
        { spanish: 'bailando', english: 'dancing' },
        { spanish: 'cantando', english: 'singing' },
        { spanish: 'escribiendo', english: 'writing' },
      ],
      bonusWords: [
        { spanish: 'estudiando', english: 'studying' },
        { spanish: 'durmiendo', english: 'sleeping' },
        { spanish: 'leyendo', english: 'reading' },
      ],
      phraseChunk: 'Estoy ___ ahora mismo.',
      speakingPattern: 'Estoy escuchando ahora mismo. / Estoy aprendiendo ahora mismo. / Estoy bailando ahora mismo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Estoy aprendiendo español ahora mismo' — you literally are.",
        "Say: '¿Qué estás haciendo?' then answer for yourself.",
        "Say: 'Ella está cantando y él está bailando al mismo tiempo'.",
      ],
      sentenceFrames: [
        'Ahora mismo estoy ___ y también estoy ___.',
        'Ella está ___ mientras él está ___.',
        'Estamos ___ juntos en este momento.',
      ],
      miniChallenge: "Describe a concert scene in three sentences using the present progressive — what is each person doing?",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'low',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['activities in progress', 'describing the moment', 'what people are doing'],
  },

  {
    moduleId: 17,
    vocabularyTheme: 'Describing people, places, and things — colors, sizes, and personality',
    speakingGoal: 'User can describe a person or place using at least five adjectives with correct gender and number agreement.',
    listeningSkill: 'Notice adjective placement — Spanish adjectives usually follow the noun, unlike English. Hear how this sounds natural.',
    recyclingTargets: ['Ser (M13)', 'articles el/la/los/las (M9)', 'subject pronouns (M5)'],
    vocabPack: {
      coreWords: [
        { spanish: 'grande', english: 'big / great' },
        { spanish: 'pequeño/a', english: 'small / little' },
        { spanish: 'bonito/a', english: 'pretty / nice' },
        { spanish: 'rápido/a', english: 'fast' },
        { spanish: 'alto/a', english: 'tall / high' },
      ],
      bonusWords: [
        { spanish: 'delgado/a', english: 'thin / slim' },
        { spanish: 'fuerte', english: 'strong' },
        { spanish: 'lento/a', english: 'slow' },
      ],
      phraseChunk: 'Es muy ___ y ___.',
      speakingPattern: 'Es muy grande y bonito. / Es muy pequeño y rápido. / Es muy alto y delgado.',
    },
    speakingPrompts: {
      prompts: [
        "Say: describe your phone using three adjectives — remember they follow the noun.",
        "Say: 'Mi ciudad es ___, ___, y ___' — three adjectives for your city.",
        "Say: 'La música reggaeton es ___ y ___'.",
      ],
      sentenceFrames: [
        'Mi ciudad favorita es ___ — es ___, ___, y ___.',
        'Él/Ella es ___ y ___, pero no es ___.',
        'La canción es ___ y tiene un ritmo ___.',
      ],
      miniChallenge: "Describe your favorite artist physically and personality-wise using five adjectives with correct ser agreement.",
    },
    songDifficulty: {
      pace: 'fast',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['physical descriptions', 'colors & appearance', 'personality traits'],
  },

  {
    moduleId: 18,
    vocabularyTheme: 'Ownership, relationships, family members, and things that belong to you',
    speakingGoal: "User can say 'my family', 'your house', 'his song' using possessive adjectives with correct gender and number agreement.",
    listeningSkill: 'Catch mi/tu/su in the lyrics — notice how they shift to mis/tus/sus when the noun is plural.',
    recyclingTargets: ['Articles el/la (M9)', 'adjective agreement (M17)', 'subject pronouns (M5)'],
    vocabPack: {
      coreWords: [
        { spanish: 'mi / mis', english: 'my' },
        { spanish: 'tu / tus', english: 'your (informal)' },
        { spanish: 'su / sus', english: 'his / her / your (formal) / their' },
        { spanish: 'nuestro/a', english: 'our' },
        { spanish: 'familia', english: 'family' },
      ],
      bonusWords: [
        { spanish: 'vuestro/a', english: 'your (plural, Spain)' },
        { spanish: 'propio/a', english: 'own' },
        { spanish: 'ajeno/a', english: "someone else's" },
      ],
      phraseChunk: 'Mi ___ es ___.',
      speakingPattern: 'Mi familia es grande. / Mi canción favorita es ésta. / Mis amigos son increíbles.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Mi canción favorita es ___' — name it.",
        "Say: 'Nuestra clase de español es difícil pero interesante'.",
        "Say: 'Sus canciones son mis favoritas' — talking about an artist.",
      ],
      sentenceFrames: [
        'Mi ___ favorito/a es ___ porque es ___.',
        'Nuestro/a ___ es ___ y nos encanta.',
        'Su ___ es ___ — por eso es famoso/a.',
      ],
      miniChallenge: "Describe your music setup at home using possessives: 'Mi ___, tus ___, nuestros ___...'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['family members', 'home & belongings', 'relationships'],
  },

  {
    moduleId: 19,
    vocabularyTheme: 'Pointing to things — this, that, those in stores, conversations, and songs',
    speakingGoal: 'User can point to things using este/esta/estos/estas and ese/esa/esos/esas in conversation.',
    listeningSkill: 'Hear este/esta/ese/esa in lyrics — notice they point toward or away, near or far from the speaker.',
    recyclingTargets: ['Possessive adjectives (M18)', 'adjective agreement (M17)', 'articles (M9)'],
    vocabPack: {
      coreWords: [
        { spanish: 'este / esta', english: 'this (near me)' },
        { spanish: 'estos / estas', english: 'these (near me)' },
        { spanish: 'ese / esa', english: 'that (near you)' },
        { spanish: 'esos / esas', english: 'those (near you)' },
        { spanish: 'aquel / aquella', english: 'that (far from both)' },
      ],
      bonusWords: [
        { spanish: 'aquellos / aquellas', english: 'those (far from both, plural)' },
        { spanish: 'esto', english: 'this (neuter — referring to a concept)' },
        { spanish: 'eso', english: 'that (neuter)' },
      ],
      phraseChunk: 'Me gusta ___ ___.',
      speakingPattern: 'Me gusta este libro. / Me gusta esta canción. / Me gusta ese restaurante.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Esta canción es increíble' — point to a song playing right now.",
        "Say: 'Ese artista canta mejor' — comparing two artists.",
        "Say: 'Estos zapatos son míos, esos son tuyos'.",
      ],
      sentenceFrames: [
        'Este/Esta ___ es mejor que ese/esa ___ porque ___.',
        'Quiero ___ este/esta ___, no ese/esa ___.',
        'Estos/Estas ___ son mis favoritos/as.',
      ],
      miniChallenge: "You're in a music store. Point to three albums: 'Este álbum es de ___, ese es de ___, aquel es de ___.'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['shopping', 'clothing & objects', 'pointing & specifying'],
  },

  // ── B1 Intermediate — Modules 20–49 ────────────────────────────────────────

  {
    moduleId: 20,
    vocabularyTheme: 'Wanting, sleeping, playing, understanding — high-frequency irregular verbs',
    speakingGoal: 'User can conjugate querer, poder, dormir, jugar, entender in present tense for all persons.',
    listeningSkill: 'Notice how quiero sounds different from queremos — the stem vowel shift is audible in the melody.',
    recyclingTargets: ['Present tense -ar/-er/-ir (M10–12)', 'subject pronouns (M5)', 'irregular yo verbs (M21 preview)'],
    vocabPack: {
      coreWords: [
        { spanish: 'quiero', english: 'I want' },
        { spanish: 'puedo', english: 'I can' },
        { spanish: 'duermo', english: 'I sleep' },
        { spanish: 'juego', english: 'I play' },
        { spanish: 'entiendo', english: 'I understand' },
      ],
      bonusWords: [
        { spanish: 'pienso', english: 'I think' },
        { spanish: 'vuelvo', english: 'I return' },
        { spanish: 'encuentro', english: 'I find' },
      ],
      phraseChunk: 'Yo quiero ___.',
      speakingPattern: 'Yo quiero aprender. / Yo quiero bailar contigo. / Yo quiero una vida nueva.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Quiero aprender español porque ___' — give your real reason.",
        "Say: 'Puedo hablar un poco de español' — say it with confidence.",
        "Say: 'No entiendo todo pero entiendo mucho' (I don't understand everything but I understand a lot).",
      ],
      sentenceFrames: [
        'Quiero ___ pero no puedo porque ___.',
        'Entiendo ___ pero no entiendo ___.',
        'Dormimos ___ horas y jugamos ___ veces por semana.',
      ],
      miniChallenge: "Use quiero, puedo, and entiendo to describe your relationship with Spanish right now in three honest sentences.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['wants & desires', 'daily routines', 'sports & hobbies'],
  },

  {
    moduleId: 21,
    vocabularyTheme: 'Making music, going out, putting things, knowing — first-person irregular forms',
    speakingGoal: 'User can use hago, pongo, salgo, traigo, conozco, sé, digo, vengo correctly in first-person sentences.',
    listeningSkill: 'Listen for the irregular yo forms — hago, traigo, salgo — they are unpredictable but extremely common.',
    recyclingTargets: ['Stem-changing verbs (M20)', 'present tense patterns (M10–12)', 'subject pronouns (M5)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hago', english: 'I do / I make' },
        { spanish: 'pongo', english: 'I put / I place' },
        { spanish: 'salgo', english: 'I leave / I go out' },
        { spanish: 'traigo', english: 'I bring' },
        { spanish: 'digo', english: 'I say' },
      ],
      bonusWords: [
        { spanish: 'vengo', english: 'I come' },
        { spanish: 'conozco', english: 'I know (people/places)' },
        { spanish: 'sé', english: 'I know (facts)' },
      ],
      phraseChunk: 'Yo ___ mucho.',
      speakingPattern: 'Yo salgo mucho. / Yo traigo música a las fiestas. / Yo hago ejercicio todos los días.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Hago música' or 'Hago ejercicio' — something you actually do.",
        "Say: 'Salgo los viernes por la noche' (I go out Friday nights).",
        "Say: 'Traigo mi guitarra a todas partes' (I bring my guitar everywhere).",
      ],
      sentenceFrames: [
        'Yo hago ___ y pongo ___ en ___.',
        'Salgo ___ veces por semana y vengo a casa a las ___.',
        'Traigo ___ porque siempre digo que ___.',
      ],
      miniChallenge: "Write a mini monologue starting with 'Yo soy músico/a...' using five irregular yo forms.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['daily actions', 'music & entertainment', 'going out'],
  },

  {
    moduleId: 22,
    vocabularyTheme: 'Ability, permission, and possibility — what you can and cannot do',
    speakingGoal: "User can say 'I can', 'I can't', 'Can you?' and express ability or permission using poder + infinitive.",
    listeningSkill: "Hear 'puedo', 'puedes', 'puede' — listen for what the singer can or cannot do, and the emotion behind it.",
    recyclingTargets: ['Stem-changing verbs: poder (M20)', 'infinitives (M10–12)', 'subject pronouns (M5)'],
    vocabPack: {
      coreWords: [
        { spanish: 'puedo', english: 'I can' },
        { spanish: 'puedes', english: 'you can' },
        { spanish: 'puede', english: 'he/she can' },
        { spanish: 'podemos', english: 'we can' },
        { spanish: 'pueden', english: 'they can' },
      ],
      bonusWords: [
        { spanish: 'imposible', english: 'impossible' },
        { spanish: 'capaz', english: 'capable' },
        { spanish: 'posible', english: 'possible' },
      ],
      phraseChunk: '¿Puedes ___?',
      speakingPattern: '¿Puedes ayudarme? / ¿Puedes repetir? / ¿Puedes hablar más despacio?',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Puedo hablar español un poco' — even if it feels like a stretch.",
        "Say: 'No puedo cantar bien pero puedo bailar' (I can't sing well but I can dance).",
        "Say: '¿Puedes enseñarme?' (Can you teach me?)",
      ],
      sentenceFrames: [
        'Puedo ___ pero no puedo ___ todavía.',
        '¿Puedes ___ conmigo? Me gustaría ___.',
        'Ellos pueden ___ porque ___.',
      ],
      miniChallenge: "List three things you can do in Spanish and one thing you cannot do yet — use poder for all four.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['asking for help', 'ability & permission', 'daily requests'],
  },

  {
    moduleId: 23,
    vocabularyTheme: 'Going places, transportation, and near-future plans using ir',
    speakingGoal: "User can say where they're going (Voy a la tienda) and express a near-future plan (Voy a comer).",
    listeningSkill: 'Catch voy/vas/va/vamos/van — and listen for ir + a + infinitive as the natural near-future construction.',
    recyclingTargets: ['Poder (M22)', 'prepositions a/de (M4)', 'articles el/la (M9)'],
    vocabPack: {
      coreWords: [
        { spanish: 'voy', english: 'I go / I am going' },
        { spanish: 'vas', english: 'you go' },
        { spanish: 'va', english: 'he/she goes' },
        { spanish: 'vamos', english: 'we go / let\'s go' },
        { spanish: 'van', english: 'they go' },
      ],
      bonusWords: [
        { spanish: 'destino', english: 'destination' },
        { spanish: 'rumbo a', english: 'heading to' },
        { spanish: 'camino', english: 'path / way' },
      ],
      phraseChunk: 'Voy a ___ mañana.',
      speakingPattern: 'Voy al mercado mañana. / Voy a la escuela mañana. / Voy a aprender más mañana.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Voy a ___ este fin de semana' — your actual plan.",
        "Say: 'Vamos a hablar español hoy' — make it a group commitment.",
        "Say: '¿A dónde vas?' then answer for yourself.",
      ],
      sentenceFrames: [
        'Voy a ___ y luego voy a ___.',
        'Este verano vamos a ___ y ___ en ___.',
        'Ella va a ___ porque quiere ___.',
      ],
      miniChallenge: "Plan your ideal music weekend using ir + a: three places, three activities, with who you go with.",
    },
    songDifficulty: {
      pace: 'fast',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'high',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['places in town', 'transportation', 'making plans'],
  },

  {
    moduleId: 24,
    vocabularyTheme: 'Possession, age, hunger, luck — tener expressions for daily life',
    speakingGoal: "User can say what they have, their age, and tener idioms: tengo hambre, tengo suerte, tengo ganas de.",
    listeningSkill: "Hear 'tengo', 'tienes', 'tiene' in lyrics — notice what the singer claims to have, feel, or own.",
    recyclingTargets: ['Ir (M23)', 'stem-changing verbs (M20)', 'numbers (M7)'],
    vocabPack: {
      coreWords: [
        { spanish: 'tengo', english: 'I have' },
        { spanish: 'tienes', english: 'you have' },
        { spanish: 'hambre', english: 'hunger' },
        { spanish: 'sed', english: 'thirst' },
        { spanish: 'ganas de', english: 'desire to / feel like' },
      ],
      bonusWords: [
        { spanish: 'prisa', english: 'rush / hurry' },
        { spanish: 'sueño', english: 'sleepiness' },
        { spanish: 'miedo', english: 'fear' },
      ],
      phraseChunk: 'Tengo ___ de ___.',
      speakingPattern: 'Tengo ganas de bailar. / Tengo miedo de hablar. / Tengo ganas de viajar contigo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Tengo ___ años' — your real age.",
        "Say: 'Tengo hambre de aprender' — playful use of the idiom.",
        "Say: 'Tengo ganas de escuchar esta canción otra vez'.",
      ],
      sentenceFrames: [
        'Tengo ___ años y tengo ___ de ___.',
        '¿Tienes ___ para ___?',
        'Ella tiene ___ y él tiene ___, pero nosotros tenemos ___.',
      ],
      miniChallenge: "Say five tener idioms that describe exactly how you feel right now: tengo hambre, tengo sueño...",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['family & relationships', 'food & hunger', 'feelings & physical states'],
  },

  {
    moduleId: 25,
    vocabularyTheme: 'Directions, destinations, and contracted articles in motion and possession',
    speakingGoal: "User can correctly say 'Voy al mercado' and 'Vengo del trabajo' without error.",
    listeningSkill: "Listen for 'al' and 'del' — notice how they naturally shorten in fast speech.",
    recyclingTargets: ['Ir (M23)', 'prepositions a/de (M4)', 'articles el/la (M9)'],
    vocabPack: {
      coreWords: [
        { spanish: 'al', english: 'to the (a + el)' },
        { spanish: 'del', english: 'of the / from the (de + el)' },
        { spanish: 'ir al', english: 'going to the' },
        { spanish: 'venir del', english: 'coming from the' },
        { spanish: 'cerca del', english: 'near the' },
      ],
      bonusWords: [
        { spanish: 'lejos del', english: 'far from the' },
        { spanish: 'dentro del', english: 'inside the' },
        { spanish: 'alrededor del', english: 'around the' },
      ],
      phraseChunk: 'Voy al ___ del barrio.',
      speakingPattern: 'Voy al café del barrio. / Voy al parque del centro. / Voy al mercado del pueblo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Voy al ___ y vengo del ___' — a place you go and come from.",
        "Say: 'El concierto del viernes fue increíble' (The Friday concert was incredible).",
        "Say: 'Vivo cerca del centro y lejos del aeropuerto'.",
      ],
      sentenceFrames: [
        'Voy al ___ y vengo del ___ todos los días.',
        'El ___ del ___ es muy famoso.',
        'Vivo cerca del ___ y lejos del ___.',
      ],
      miniChallenge: "Give three directions to your favorite spot using al/del: 'Vas al ___, cruzas el ___, llegas al ___.'",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'excellent',
    },
    everydayVocabCategories: ['places in town', 'directions & location', 'daily destinations'],
  },

  {
    moduleId: 26,
    vocabularyTheme: 'Talking about people — with me, for you, without him, because of her',
    speakingGoal: 'User can use conmigo, contigo, con él/ella, para mí, para ti, sin ti in natural conversation.',
    listeningSkill: "Hear 'contigo', 'sin ti', 'para mí' — prepositional pronouns carry enormous emotional weight in Spanish songs.",
    recyclingTargets: ['Prepositions (M4)', 'subject pronouns (M5)', 'tener expressions (M24)'],
    vocabPack: {
      coreWords: [
        { spanish: 'conmigo', english: 'with me' },
        { spanish: 'contigo', english: 'with you' },
        { spanish: 'sin ti', english: 'without you' },
        { spanish: 'para mí', english: 'for me' },
        { spanish: 'para ti', english: 'for you' },
      ],
      bonusWords: [
        { spanish: 'para ella', english: 'for her' },
        { spanish: 'entre tú y yo', english: 'between you and me' },
        { spanish: 'detrás de mí', english: 'behind me' },
      ],
      phraseChunk: '___ contigo.',
      speakingPattern: 'Quiero estar contigo. / Quiero bailar contigo. / Quiero viajar contigo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Esta canción es para ti' — dedicate a song.",
        "Say: 'No puedo vivir sin ti' — dramatic, but great practice.",
        "Say: 'Ven conmigo a ese lugar' (Come with me to that place).",
      ],
      sentenceFrames: [
        'Esta canción es para ___ porque ___.',
        'No puedo ___ sin ___.',
        'Ven ___ — vamos a ___.',
      ],
      miniChallenge: "Dedicate a song to someone using three prepositional pronouns: para ti, conmigo, sin ti.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'excellent',
    },
    everydayVocabCategories: ['relationships & feelings', 'talking about others', 'emotional expression'],
  },

  {
    moduleId: 27,
    vocabularyTheme: 'Replacing nouns fluently — lo, la, los, las to avoid repetition',
    speakingGoal: 'User can replace a noun with lo/la/los/las and correctly place it before the conjugated verb.',
    listeningSkill: 'Catch lo/la/los/las in lyrics — listen for what they replace and where they appear in the sentence.',
    recyclingTargets: ['Articles el/la/los/las (M9)', 'present tense verbs (M10–12)', 'tener (M24)'],
    vocabPack: {
      coreWords: [
        { spanish: 'lo', english: 'it / him (masculine direct object)' },
        { spanish: 'la', english: 'it / her (feminine direct object)' },
        { spanish: 'los', english: 'them (masculine direct object)' },
        { spanish: 'las', english: 'them (feminine direct object)' },
        { spanish: 'me', english: 'me (direct object)' },
      ],
      bonusWords: [
        { spanish: 'te', english: 'you (direct object)' },
        { spanish: 'nos', english: 'us (direct object)' },
        { spanish: 'os', english: 'you all (direct object, Spain)' },
      ],
      phraseChunk: 'Yo ___ ___.',
      speakingPattern: 'Yo lo entiendo. / Yo la escucho todos los días. / Yo los necesito.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Esta canción — la escucho todos los días' — practice the pronoun placement.",
        "Say: 'El español es difícil pero lo aprendo poco a poco'.",
        "Say: '¿Ves a Bad Bunny? Sí, lo veo en el escenario'.",
      ],
      sentenceFrames: [
        'Esta canción — ___ escucho porque ___.',
        'El español — ___ aprendo porque ___.',
        '___ necesito pero no ___ tengo.',
      ],
      miniChallenge: "Talk about your three favorite songs replacing the title each time with lo/la: '¿Conoces ___? Sí, la/lo escucho cuando ___.'",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'excellent',
    },
    everydayVocabCategories: ['talking about objects & music', 'replacing nouns', 'fluent conversation'],
  },

  {
    moduleId: 28,
    vocabularyTheme: 'Giving, telling, sending — me, te, le, nos, les receiving the action',
    speakingGoal: "User can say 'I give you', 'he tells me', 'she sends him' using indirect object pronouns.",
    listeningSkill: "Notice 'me gusta', 'te quiero', 'le digo' — indirect object pronouns shift who receives the action.",
    recyclingTargets: ['Direct object pronouns (M27)', 'present tense (M10–12)', 'gustar preview (M30)'],
    vocabPack: {
      coreWords: [
        { spanish: 'me', english: 'to me / for me' },
        { spanish: 'te', english: 'to you / for you' },
        { spanish: 'le', english: 'to him / to her / to you (formal)' },
        { spanish: 'nos', english: 'to us / for us' },
        { spanish: 'les', english: 'to them / for them' },
      ],
      bonusWords: [
        { spanish: 'dar', english: 'to give' },
        { spanish: 'decir', english: 'to say / to tell' },
        { spanish: 'mandar', english: 'to send' },
      ],
      phraseChunk: 'Me ___ mucho.',
      speakingPattern: 'Me gusta mucho. / Me duele mucho. / Me importa mucho.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Me gusta esta canción' — use the indirect object pronoun naturally.",
        "Say: 'Te digo la verdad' (I'm telling you the truth).",
        "Say: 'Nos manda mensajes todos los días' (She sends us messages every day).",
      ],
      sentenceFrames: [
        'Me ___ que ___ — por eso ___.',
        'Te ___ algo importante: ___.',
        'Le ___ a ___ que ___.',
      ],
      miniChallenge: "Say something to three different people using te, le, and les — all with different verbs (dar, decir, mandar).",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'light',
      repetitionLevel: 'high',
      beginnerSuitability: 'good',
    },
    everydayVocabCategories: ['giving & receiving', 'communication & messaging', 'relationships'],
  },

  {
    moduleId: 29,
    vocabularyTheme: 'Fluent sentence-level replacement — combining indirect and direct object pronouns',
    speakingGoal: "User can combine indirect + direct pronouns correctly: 'Se lo doy' (I give it to him/her).",
    listeningSkill: 'Listen for two-pronoun clusters in fast lyrics — they blur together but each one carries meaning.',
    recyclingTargets: ['Direct object pronouns (M27)', 'indirect object pronouns (M28)', 'present tense verbs (M10–12)'],
    vocabPack: {
      coreWords: [
        { spanish: 'me lo', english: 'it to me' },
        { spanish: 'te lo', english: 'it to you' },
        { spanish: 'se lo', english: 'it to him/her/them (le + lo → se lo)' },
        { spanish: 'nos lo', english: 'it to us' },
        { spanish: 'dámelo', english: 'give it to me' },
      ],
      bonusWords: [
        { spanish: 'prestárselo', english: 'to lend it to him/her' },
        { spanish: 'mandárselo', english: 'to send it to her/him' },
        { spanish: 'contármelo', english: 'to tell it to me' },
      ],
      phraseChunk: 'Te ___ ___.',
      speakingPattern: 'Te lo doy. / Te lo mando. / Te lo explico ahora.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Te lo juro' (I swear it to you) — extremely common in Spanish.",
        "Say: '¿Me lo puedes explicar?' (Can you explain it to me?)",
        "Say: 'Se lo digo mañana' (I'll tell him/her tomorrow).",
      ],
      sentenceFrames: [
        'Te ___ porque tú ___.',
        'Se ___ a ___ cuando ___.',
        'Me ___ y yo ___.',
      ],
      miniChallenge: "Walk through a favor exchange: you give something, they thank you, you say you'll send them something else — all using double pronouns.",
    },
    songDifficulty: {
      pace: 'fast',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'challenging',
    },
    everydayVocabCategories: ['fluent conversation patterns', 'giving & receiving', 'explaining actions'],
  },

  {
    moduleId: 30,
    vocabularyTheme: 'Expressing preferences, tastes, and opinions — music, food, and activities',
    speakingGoal: 'User can say what they like, love, hate, and find bothersome using gustar, encantar, molestar, and fascinar.',
    listeningSkill: "Hear 'me gusta', 'te encanta', 'nos fascina' — notice the verb agrees with the THING, not the person who feels it.",
    recyclingTargets: ['Indirect OPs (M28)', 'infinitives (M10–12)', 'double pronouns (M29)'],
    vocabPack: {
      coreWords: [
        { spanish: 'me gusta', english: 'I like it (lit: it pleases me)' },
        { spanish: 'me encanta', english: 'I love it (lit: it enchants me)' },
        { spanish: 'me molesta', english: 'it bothers me' },
        { spanish: 'me fascina', english: 'it fascinates me' },
        { spanish: 'me importa', english: 'it matters to me' },
      ],
      bonusWords: [
        { spanish: 'me aburre', english: 'it bores me' },
        { spanish: 'me sorprende', english: 'it surprises me' },
        { spanish: 'me preocupa', english: 'it worries me' },
      ],
      phraseChunk: 'Me ___ ___.',
      speakingPattern: 'Me encanta la música latina. / Me gusta bailar. / Me molesta el ruido.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Me encanta ___ porque ___' — your favorite genre.",
        "Say: 'Me molesta cuando ___ en las canciones' — something in music that bothers you.",
        "Say: 'Nos gusta mucho aprender juntos'.",
      ],
      sentenceFrames: [
        'Me encanta ___ pero me molesta ___.',
        'Nos gusta ___ y nos fascina ___.',
        '¿Te gusta ___? A mí me ___ porque ___.',
      ],
      miniChallenge: "Give your full music opinion using five gustar-family verbs: gusta, encanta, molesta, fascina, aburre.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
    everydayVocabCategories: ['music preferences', 'food & taste', 'hobbies & opinions'],
  },

  // ── Modules 31–60 ────────────────────────────────────────────────────────────

  {
    moduleId: 31,
    vocabularyTheme: 'Facts, information, and knowing how to do things',
    speakingGoal: "User can say 'I know how to dance', 'I don't know why', and 'Do you know the answer?' using saber.",
    listeningSkill: "Catch 'sé', 'sabes', 'sabe' in lyrics — these signal factual knowledge or the absence of it.",
    recyclingTargets: ['Irregular yo: sé (M21)', 'gustar expressions (M30)', 'question words (M3)'],
    vocabPack: {
      coreWords: [
        { spanish: 'sé', english: 'I know (a fact)' },
        { spanish: 'sabes', english: 'you know (a fact)' },
        { spanish: 'saber nadar', english: 'to know how to swim' },
        { spanish: 'no sé', english: "I don't know" },
        { spanish: '¿Sabes qué?', english: 'You know what?' },
      ],
      bonusWords: [
        { spanish: 'sabio/a', english: 'wise' },
        { spanish: 'sabiduría', english: 'wisdom' },
        { spanish: 'ignorar', english: 'to not know / to ignore' },
      ],
      phraseChunk: '¿Sabes ___?',
      speakingPattern: '¿Sabes bailar? / ¿Sabes hablar español? / ¿Sabes qué hora es?',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Sé hablar un poco de español' — you literally can.",
        "Say: '¿Sabes tocar algún instrumento?' — ask someone.",
        "Say: 'No sé por qué, pero me encanta esta canción'.",
      ],
      sentenceFrames: [
        'Sé ___ pero no sé ___.',
        '¿Sabes ___ en español?',
        'Ellos saben ___ pero no saben ___.',
      ],
      miniChallenge: "List three things you know how to do and two things you don't know yet — all using saber + infinitive.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 32,
    vocabularyTheme: 'People, places, and experiences — being acquainted vs. knowing facts',
    speakingGoal: 'User can correctly use conocer for people and places, and distinguish it from saber for facts.',
    listeningSkill: "Notice 'conozco', 'conoces', 'conoce' — they refer to familiarity and personal connection, not factual data.",
    recyclingTargets: ['Saber (M31)', 'irregular yo: conozco (M21)', 'direct object pronouns (M27)'],
    vocabPack: {
      coreWords: [
        { spanish: 'conozco', english: 'I know (a person/place)' },
        { spanish: 'conoces', english: 'you know (a person/place)' },
        { spanish: 'conocer', english: 'to meet / to be familiar with' },
        { spanish: 'desconocido/a', english: 'unknown / stranger' },
        { spanish: 'familiar', english: 'familiar' },
      ],
      bonusWords: [
        { spanish: 'reconocer', english: 'to recognize' },
        { spanish: 'descubrir', english: 'to discover' },
        { spanish: 'explorar', english: 'to explore' },
      ],
      phraseChunk: 'Conozco ___ desde ___.',
      speakingPattern: 'Conozco esta ciudad desde siempre. / Conozco esta canción desde niño. / Conozco a Shakira desde sus primeros álbumes.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Conozco a ___' — a person you know personally.",
        "Say: '¿Conoces Buenos Aires? Es increíble.'",
        "Say: 'Conozco esta canción — sé todas las palabras'.",
      ],
      sentenceFrames: [
        'Conozco ___ pero no conozco ___.',
        '¿Conoces a ___? Yo ___ mucho.',
        'Ella conoce ___ porque vivió allí.',
      ],
      miniChallenge: "Use saber and conocer in the same paragraph about a city you know: facts (saber) and personal experience (conocer).",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 33,
    vocabularyTheme: 'Completed past actions — what you did yesterday, last week, last year',
    speakingGoal: 'User can say what they did in the past using regular -ar/-er/-ir preterite endings.',
    listeningSkill: 'Listen for -é, -aste, -ó endings on verbs — these are past tense signals in storytelling songs.',
    recyclingTargets: ['-ar/-er/-ir present tense (M10–12)', 'time expressions: ayer, la semana pasada (M6)', 'subject pronouns (M5)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hablé', english: 'I spoke' },
        { spanish: 'comí', english: 'I ate' },
        { spanish: 'viví', english: 'I lived' },
        { spanish: 'bailé', english: 'I danced' },
        { spanish: 'escuché', english: 'I listened' },
      ],
      bonusWords: [
        { spanish: 'terminé', english: 'I finished' },
        { spanish: 'empecé', english: 'I started' },
        { spanish: 'llegué', english: 'I arrived' },
      ],
      phraseChunk: 'Ayer ___ por primera vez.',
      speakingPattern: 'Ayer bailé por primera vez. / Ayer canté en público por primera vez. / Ayer viajé solo/a por primera vez.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Ayer escuché ___ y me encantó' — a song you heard.",
        "Say: 'El año pasado aprendí mucho español'.",
        "Say: '¿Qué hiciste ayer?' then answer for yourself.",
      ],
      sentenceFrames: [
        'Ayer ___ y también ___.',
        'El año pasado ___ y aprendí ___.',
        'La semana pasada ___ con ___ en ___.',
      ],
      miniChallenge: "Tell a full story about yesterday using five preterite verbs: what you did from morning to night.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 34,
    vocabularyTheme: 'Telling stories — who was somewhere and who went where in the past',
    speakingGoal: "User can use fui, fuiste, fue, fuimos, fueron for both 'to go' and 'to be' in past tense.",
    listeningSkill: "Hear 'fue', 'fui', 'fuimos' in the lyrics — notice the singer uses the same form for two completely different verbs.",
    recyclingTargets: ['Regular preterite (M33)', 'ser (M13)', 'ir (M23)'],
    vocabPack: {
      coreWords: [
        { spanish: 'fui', english: 'I went / I was' },
        { spanish: 'fuiste', english: 'you went / you were' },
        { spanish: 'fue', english: 'he/she went / was' },
        { spanish: 'fuimos', english: 'we went / we were' },
        { spanish: 'fueron', english: 'they went / they were' },
      ],
      bonusWords: [
        { spanish: 'la primera vez', english: 'the first time' },
        { spanish: 'el año pasado', english: 'last year' },
        { spanish: 'hace mucho', english: 'a long time ago' },
      ],
      phraseChunk: 'Fui a ___ y fue ___.',
      speakingPattern: 'Fui al concierto y fue increíble. / Fui a México y fue hermoso. / Fui a la escuela y fue difícil.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Fui a un concierto el año pasado y fue ___'.",
        "Say: 'Ella fue la primera en llegar' (She was the first to arrive).",
        "Say: 'Fuimos juntos y fue una experiencia increíble'.",
      ],
      sentenceFrames: [
        'Fui a ___ y fue ___ porque ___.',
        'Ella/Él fue ___ antes de ser ___.',
        'Fuimos a ___ juntos y fue ___.',
      ],
      miniChallenge: "Tell a short story about a memorable trip or event using fue/fui/fuimos at least three times.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 35,
    vocabularyTheme: 'High-frequency irregular past actions — tener, estar, poder, poner, saber',
    speakingGoal: 'User can use tuve, estuve, pude, puse, supe in past tense narratives.',
    listeningSkill: 'Catch irregular preterite stems: tuv-, estuv-, pud- — listen for them in storytelling verses.',
    recyclingTargets: ['Regular preterite (M33)', 'preterite ser/ir (M34)', 'tener (M24)'],
    vocabPack: {
      coreWords: [
        { spanish: 'tuve', english: 'I had (past)' },
        { spanish: 'estuve', english: 'I was (past)' },
        { spanish: 'pude', english: 'I could / I managed to (past)' },
        { spanish: 'puse', english: 'I put (past)' },
        { spanish: 'supe', english: 'I found out / I learned (past)' },
      ],
      bonusWords: [
        { spanish: 'anduve', english: 'I walked (past)' },
        { spanish: 'cupe', english: 'I fit (past)' },
        { spanish: 'produje', english: 'I produced (past)' },
      ],
      phraseChunk: 'Tuve que ___ porque ___.',
      speakingPattern: 'Tuve que trabajar porque llegué tarde. / Tuve que salir porque supe la verdad. / Tuve que cantar porque pude.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Tuve un día difícil pero pude con todo' (I had a hard day but I managed).",
        "Say: 'Estuve en el concierto hasta las dos de la mañana'.",
        "Say: 'Supe que era mi canción favorita cuando la escuché por primera vez'.",
      ],
      sentenceFrames: [
        'Tuve que ___ porque ___.',
        'Estuve ___ por ___ horas y ___.',
        'Supe ___ cuando ___ y entonces ___.',
      ],
      miniChallenge: "Narrate a challenge you overcame using tuve, estuve, pude, and supe in the same story.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 36,
    vocabularyTheme: 'More irregular past actions — querer, venir, decir, hacer, traer',
    speakingGoal: 'User can correctly say quise, vine, dije, hice, traje in past tense stories.',
    listeningSkill: "Notice how irregular preterite stems sound nothing like their infinitives — train your ear to recognize quise, dije, hice.",
    recyclingTargets: ['Irregular preterite Part 1 (M35)', 'irregular yo (M21)', 'regular preterite (M33)'],
    vocabPack: {
      coreWords: [
        { spanish: 'quise', english: 'I wanted (past)' },
        { spanish: 'vine', english: 'I came (past)' },
        { spanish: 'dije', english: 'I said (past)' },
        { spanish: 'hice', english: 'I did / made (past)' },
        { spanish: 'traje', english: 'I brought (past)' },
      ],
      bonusWords: [
        { spanish: 'conduje', english: 'I drove (past)' },
        { spanish: 'traduje', english: 'I translated (past)' },
        { spanish: 'reduje', english: 'I reduced (past)' },
      ],
      phraseChunk: 'Te dije que ___.',
      speakingPattern: 'Te dije que vine. / Te dije que hice todo lo posible. / Te dije que traje comida.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Hice una lista de mis canciones favoritas ayer'.",
        "Say: 'Vine a esta clase porque quise aprender'.",
        "Say: 'Dije lo que pensaba y nadie me escuchó'.",
      ],
      sentenceFrames: [
        'Hice ___ y dije ___ porque quise ___.',
        'Vine a ___ y traje ___ para ___.',
        'Quise ___ pero no ___.',
      ],
      miniChallenge: "Tell a story about a decision you made using quise, vine, dije, hice, and traje.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 37,
    vocabularyTheme: 'Childhood memories, habits, and descriptions — what used to happen',
    speakingGoal: 'User can describe past habits and ongoing states using -aba/-ía endings (comía, hablaba, era, había).',
    listeningSkill: 'Hear -aba and -ía endings in nostalgic lyrics — these signal ongoing or habitual past action, not a single event.',
    recyclingTargets: ['Preterite (M33–36)', 'ser/estar (M13–14)', 'time expressions (M6)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hablaba', english: 'I/he/she used to speak' },
        { spanish: 'comía', english: 'I/he/she used to eat' },
        { spanish: 'era', english: 'I/he/she was (habitual/descriptive)' },
        { spanish: 'había', english: 'there was / there used to be' },
        { spanish: 'tenía', english: 'I/he/she had / used to have' },
      ],
      bonusWords: [
        { spanish: 'soñaba', english: 'I/he/she used to dream' },
        { spanish: 'vivía', english: 'I/he/she used to live' },
        { spanish: 'pensaba', english: 'I/he/she used to think' },
      ],
      phraseChunk: 'Cuando era niño/a, ___ todos los días.',
      speakingPattern: 'Cuando era niño, cantaba todos los días. / Cuando era pequeña, soñaba con ser cantante. / Cuando tenía diez años, bailaba en la escuela.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Cuando era niño/a, me gustaba ___'.",
        "Say: 'Antes escuchaba ___ pero ahora prefiero ___'.",
        "Say: 'Había una canción que siempre sonaba en mi casa — era ___'.",
      ],
      sentenceFrames: [
        'Cuando era ___, ___ todos los días.',
        'Antes ___ mucho pero ahora ___.',
        'Había ___ en ___ que me ___.',
      ],
      miniChallenge: "Describe your childhood music memories using five imperfect verbs: what you listened to, what you sang, where you danced.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 38,
    vocabularyTheme: 'Storytelling — setting the scene vs. the events that happened',
    speakingGoal: 'User can tell a short story using both tenses correctly: background in imperfect, events in preterite.',
    listeningSkill: 'Listen for tense shifts in narrative songs — imperfect sets the mood and scene, preterite moves the story forward.',
    recyclingTargets: ['Preterite (M33–36)', 'imperfect (M37)', 'connectors (M4)'],
    vocabPack: {
      coreWords: [
        { spanish: 'mientras', english: 'while' },
        { spanish: 'de repente', english: 'suddenly' },
        { spanish: 'entonces', english: 'then / so' },
        { spanish: 'antes', english: 'before' },
        { spanish: 'después', english: 'after / then' },
      ],
      bonusWords: [
        { spanish: 'en ese momento', english: 'at that moment' },
        { spanish: 'al mismo tiempo', english: 'at the same time' },
        { spanish: 'hasta que', english: 'until' },
      ],
      phraseChunk: 'Mientras ___, de repente ___.',
      speakingPattern: 'Mientras dormía, de repente sonó el teléfono. / Mientras caminaba, de repente empezó a llover. / Mientras escuchaba, de repente entendí todo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Mientras escuchaba la radio, de repente oí mi canción favorita'.",
        "Say: 'Era un día normal cuando de repente todo cambió'.",
        "Say: 'Estaba bailando cuando se acabó la música'.",
      ],
      sentenceFrames: [
        'Era ___ y de repente ___.',
        'Mientras ___ (imperfect), ___ (preterite).',
        'Antes ___ siempre, pero un día ___.',
      ],
      miniChallenge: "Tell a 5-sentence story about a memorable music moment — use at least two imperfect verbs (background) and three preterite verbs (events).",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 39,
    vocabularyTheme: 'Morning routines, self-care, and emotional states — verbs you do to yourself',
    speakingGoal: 'User can describe their morning routine using levantarse, ducharse, vestirse, acostarse, llamarse.',
    listeningSkill: 'Notice the reflexive pronouns me/te/se attached before or after verbs — they show the action circles back to the subject.',
    recyclingTargets: ['-ar/-er/-ir verbs (M10–12)', 'subject pronouns (M5)', 'present progressive (M16)'],
    vocabPack: {
      coreWords: [
        { spanish: 'me levanto', english: 'I get up' },
        { spanish: 'me baño', english: 'I bathe / shower' },
        { spanish: 'me visto', english: 'I get dressed' },
        { spanish: 'me acuesto', english: 'I go to bed' },
        { spanish: 'me llamo', english: 'I am called / my name is' },
      ],
      bonusWords: [
        { spanish: 'me peino', english: 'I comb my hair' },
        { spanish: 'me maquillo', english: 'I put on makeup' },
        { spanish: 'me afeito', english: 'I shave' },
      ],
      phraseChunk: 'Me ___ a las ___.',
      speakingPattern: 'Me levanto a las siete. / Me acuesto a las once. / Me baño a las ocho de la mañana.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Me despierto a las ___ y me levanto a las ___'.",
        "Say: 'Me llamo ___ y me llaman ___ entre amigos'.",
        "Say: 'Antes de acostarme, siempre escucho música'.",
      ],
      sentenceFrames: [
        'Me levanto a las ___, me ducho, y me visto en ___ minutos.',
        'Me acuesto tarde porque ___.',
        'Ella se despierta a las ___ y se prepara en ___ minutos.',
      ],
      miniChallenge: "Describe your full morning routine using six reflexive verbs from wake-up to leaving the house.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 40,
    vocabularyTheme: 'Mutual actions between people — we see each other, they love each other',
    speakingGoal: 'User can express mutual actions: nos vemos, se quieren, os entendéis using reciprocal reflexives.',
    listeningSkill: "Hear nos/se in love songs — the plural reflexive signals 'each other', not 'himself' or 'herself'.",
    recyclingTargets: ['Reflexive verbs (M39)', 'plural subject pronouns (M5)', 'preterite (M33)'],
    vocabPack: {
      coreWords: [
        { spanish: 'nos queremos', english: 'we love each other' },
        { spanish: 'se ven', english: 'they see each other' },
        { spanish: 'nos hablamos', english: 'we talk to each other' },
        { spanish: 'se entienden', english: 'they understand each other' },
        { spanish: 'nos conocemos', english: 'we know each other' },
      ],
      bonusWords: [
        { spanish: 'se abrazan', english: 'they hug each other' },
        { spanish: 'nos ayudamos', english: 'we help each other' },
        { spanish: 'se respetan', english: 'they respect each other' },
      ],
      phraseChunk: 'Nos ___ desde hace ___.',
      speakingPattern: 'Nos conocemos desde hace años. / Nos hablamos desde hace tiempo. / Nos vemos desde hace semanas.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Nos vemos todos los días' — about a friend or colleague.",
        "Say: 'Se conocieron en un concierto y se enamoraron' (They met at a concert and fell in love).",
        "Say: 'Nos entendemos sin palabras' (We understand each other without words).",
      ],
      sentenceFrames: [
        'Nos ___ desde hace ___ y ___.',
        'Ellos se ___ en ___ y desde entonces se ___.',
        'Nos ___ mucho porque ___.',
      ],
      miniChallenge: "Describe a friendship or relationship using four reciprocal verbs: how you met, what you do together, how you feel.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 41,
    vocabularyTheme: "Purpose, exchange, duration, gratitude, deadlines — when 'for' splits into two words",
    speakingGoal: 'User can correctly choose por or para in context: para for purpose/destination, por for exchange/duration/cause.',
    listeningSkill: 'Catch por/para in the song and ask yourself: is this a purpose (para) or a cause/exchange/movement through (por)?',
    recyclingTargets: ['Prepositions (M4)', 'ir + a (M23)', 'indirect object pronouns (M28)'],
    vocabPack: {
      coreWords: [
        { spanish: 'para ti', english: 'for you (purpose/benefit)' },
        { spanish: 'por ti', english: 'because of you / for your sake' },
        { spanish: 'gracias por', english: 'thank you for' },
        { spanish: 'para mañana', english: 'for/by tomorrow (deadline)' },
        { spanish: 'por eso', english: "that's why / for that reason" },
      ],
      bonusWords: [
        { spanish: 'por supuesto', english: 'of course' },
        { spanish: 'para siempre', english: 'forever' },
        { spanish: 'por fin', english: 'finally' },
      ],
      phraseChunk: '___ para ___.',
      speakingPattern: 'Canto para ti. / Trabajo para vivir mejor. / Estudio para aprender.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Gracias por escucharme' (Thank you for listening to me).",
        "Say: 'Esta canción es para ti' vs 'Canto por amor' — feel the difference.",
        "Say: 'Por fin entiendo la diferencia entre por y para'.",
      ],
      sentenceFrames: [
        'Hago ___ para ___ y lo hago por ___.',
        'Esta canción es para ___ — la escribí por ___.',
        'Por fin ___ — lo hice para ___.',
      ],
      miniChallenge: "Write three sentences about why you learn Spanish — use para in one, por in one, and both in the third.",
    },
    songDifficulty: {
      pace: 'fast',
      clarity: 'moderate',
      slangLevel: 'moderate',
      repetitionLevel: 'high',
      beginnerSuitability: 'challenging',
    },
  },

  {
    moduleId: 42,
    vocabularyTheme: 'Comparing things — bigger, better, the best, the most beautiful',
    speakingGoal: 'User can compare two things (más alto que, menos rápido que) and form superlatives (el más / la mejor).',
    listeningSkill: 'Listen for más/menos + adjective patterns — comparisons are everywhere in opinion-heavy lyrics.',
    recyclingTargets: ['Descriptive adjectives (M17)', 'ser/estar (M13–14)', 'articles el/la (M9)'],
    vocabPack: {
      coreWords: [
        { spanish: 'más ... que', english: 'more ... than' },
        { spanish: 'menos ... que', english: 'less ... than' },
        { spanish: 'mejor', english: 'better' },
        { spanish: 'peor', english: 'worse' },
        { spanish: 'tan ... como', english: 'as ... as' },
      ],
      bonusWords: [
        { spanish: 'mayor', english: 'older / bigger' },
        { spanish: 'menor', english: 'younger / smaller' },
        { spanish: 'tanto como', english: 'as much as' },
      ],
      phraseChunk: '___ es más ___ que ___.',
      speakingPattern: 'El español es más musical que el inglés. / La música es más poderosa que las palabras. / Ella canta mejor que nadie.',
    },
    speakingPrompts: {
      prompts: [
        "Say: '___ es mejor que ___ porque ___' — compare two artists.",
        "Say: 'Hablar español es más difícil que escuchar, pero tan importante como ambos'.",
        "Say: 'Esta es la mejor canción del año'.",
      ],
      sentenceFrames: [
        '___ es más ___ que ___ pero menos ___ que ___.',
        'El/La mejor ___ es ___ porque ___.',
        'Tan ___ como ___, pero diferente en ___.',
      ],
      miniChallenge: "Rank your top three artists using comparatives and one superlative: mejor, más, tan...como.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 43,
    vocabularyTheme: 'Disagreeing, refusing, expressing absence — no, nunca, nada, nadie, tampoco',
    speakingGoal: 'User can form Spanish double negatives correctly: No tengo nada, No hay nadie, No voy nunca.',
    listeningSkill: 'Hear no + negative word patterns — Spanish double negatives reinforce each other rather than canceling out.',
    recyclingTargets: ['Present tense (M10–12)', 'connectors también/tampoco (M4)', 'gustar expressions (M30)'],
    vocabPack: {
      coreWords: [
        { spanish: 'nunca', english: 'never' },
        { spanish: 'nada', english: 'nothing' },
        { spanish: 'nadie', english: 'nobody / no one' },
        { spanish: 'tampoco', english: 'neither / not either' },
        { spanish: 'ningún / ninguna', english: 'no / not any' },
      ],
      bonusWords: [
        { spanish: 'jamás', english: 'never (emphatic)' },
        { spanish: 'ni ... ni', english: 'neither ... nor' },
        { spanish: 'en absoluto', english: 'not at all' },
      ],
      phraseChunk: 'No tengo ___ para ___.',
      speakingPattern: 'No tengo nada para decir. / No hay nadie para llamar. / No tengo tiempo para esperar.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Nunca he escuchado eso — nunca jamás' — emphatic never.",
        "Say: 'No me gusta nada esa canción' (I don't like that song at all).",
        "Say: 'No conozco a nadie aquí pero tampoco me importa'.",
      ],
      sentenceFrames: [
        'No ___ nunca porque ___.',
        'No hay ___ que ___ como ___.',
        'Nunca ___ y tampoco ___.',
      ],
      miniChallenge: "Express five things you never do, using five different negative words: nunca, nada, nadie, tampoco, ningún.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 44,
    vocabularyTheme: 'Giving instructions, invitations, and warnings — direct commands',
    speakingGoal: 'User can give a direct command or prohibition to a friend using tú imperative forms.',
    listeningSkill: 'Listen for short, punchy verbs at the start of a line — those are often commands in Spanish songs.',
    recyclingTargets: ['-ar/-er/-ir present tense (M10–12)', 'negatives (M43)', 'irregular yo forms (M21)'],
    vocabPack: {
      coreWords: [
        { spanish: 'habla', english: 'speak! (command)' },
        { spanish: 'come', english: 'eat! (command)' },
        { spanish: 'escucha', english: 'listen! (command)' },
        { spanish: 'baila', english: 'dance! (command)' },
        { spanish: 'canta', english: 'sing! (command)' },
      ],
      bonusWords: [
        { spanish: 'ven', english: 'come! (command, irregular)' },
        { spanish: 'di', english: 'say! / tell! (command, irregular)' },
        { spanish: 'haz', english: 'do! / make! (command, irregular)' },
      ],
      phraseChunk: '¡___ y ___!',
      speakingPattern: '¡Escucha y repite! / ¡Baila y disfruta! / ¡Canta y aprende!',
    },
    speakingPrompts: {
      prompts: [
        "Say: '¡Ven conmigo!' — invite someone dramatically.",
        "Say: '¡No te rindas!' (Don't give up!) — encourage someone.",
        "Say: '¡Di la verdad!' (Tell the truth!) — use the irregular command.",
      ],
      sentenceFrames: [
        '¡___ y no ___!',
        '¡___ conmigo porque ___!',
        'No ___ — mejor ___.',
      ],
      miniChallenge: "Give a pep talk to a language-learning friend using five commands: escucha, repite, practica, canta, no te rindas.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'high',
      beginnerSuitability: 'excellent',
    },
  },

  {
    moduleId: 45,
    vocabularyTheme: "Group decisions and invitations — let's go, let's eat, let's dance",
    speakingGoal: "User can invite a group using Vamos a... or nosotros subjunctive commands: ¡Comamos! ¡Bailemos!",
    listeningSkill: "Hear '¡vámonos!', '¡bailemos!', '¡cantemos!' — nosotros commands are rally cries in music.",
    recyclingTargets: ['Tú commands (M44)', 'ir (M23)', 'present subjunctive preview (M55)'],
    vocabPack: {
      coreWords: [
        { spanish: 'vamos', english: "let's go" },
        { spanish: 'bailemos', english: "let's dance" },
        { spanish: 'cantemos', english: "let's sing" },
        { spanish: 'comamos', english: "let's eat" },
        { spanish: 'hablemos', english: "let's talk" },
      ],
      bonusWords: [
        { spanish: 'brindemos', english: "let's toast" },
        { spanish: 'aprendamos', english: "let's learn" },
        { spanish: 'disfrutemos', english: "let's enjoy" },
      ],
      phraseChunk: '¡Vamos a ___!',
      speakingPattern: '¡Vamos a bailar! / ¡Vamos a cantar! / ¡Vamos a aprender juntos!',
    },
    speakingPrompts: {
      prompts: [
        "Say: '¡Vámonos!' — with energy.",
        "Say: '¡Cantemos esta canción juntos!' — invite the group.",
        "Say: '¡No nos rindamos — sigamos aprendiendo!' (Let's not give up — let's keep learning!)",
      ],
      sentenceFrames: [
        '¡___ juntos esta noche!',
        '¡Vamos a ___ y ___!',
        'No ___ — mejor ___.',
      ],
      miniChallenge: "Plan a Spanish learning party using four nosotros commands: what you'll do, eat, sing, and celebrate.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 46,
    vocabularyTheme: 'States resulting from past actions — broken, finished, fallen, lost, in love',
    speakingGoal: 'User can use past participles as adjectives: la puerta está abierta, el trabajo está hecho, está enamorado.',
    listeningSkill: 'Listen for -ado/-ido words used as descriptions, not actions — they tell you the resulting state of something.',
    recyclingTargets: ['-ar/-er/-ir infinitives (M10–12)', 'estar (M14)', 'ser vs estar (M15)'],
    vocabPack: {
      coreWords: [
        { spanish: 'abierto/a', english: 'open (result of opening)' },
        { spanish: 'cerrado/a', english: 'closed' },
        { spanish: 'hecho/a', english: 'done / made' },
        { spanish: 'perdido/a', english: 'lost' },
        { spanish: 'enamorado/a', english: 'in love' },
      ],
      bonusWords: [
        { spanish: 'roto/a', english: 'broken' },
        { spanish: 'escrito/a', english: 'written' },
        { spanish: 'dicho', english: 'said / the thing said' },
      ],
      phraseChunk: 'Estoy ___ de ___.',
      speakingPattern: 'Estoy enamorado de la música. / Estoy perdido en este idioma. / Estoy hecho de sueños.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Estoy enamorado/a del español' — even if it's complicated.",
        "Say: 'La canción está hecha para hacerte bailar'.",
        "Say: 'Me siento perdido/a cuando escucho canciones rápidas'.",
      ],
      sentenceFrames: [
        'Estoy ___ de ___ desde que ___.',
        'La ___ está ___ porque ___.',
        'Él/Ella está ___ pero no está ___.',
      ],
      miniChallenge: "Describe your emotional state using five past participles as adjectives: enamorado, perdido, hecho, abierto, cerrado.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 47,
    vocabularyTheme: 'Emphasis on ownership — mío, tuyo, suyo, nuestro as strong possessives',
    speakingGoal: "User can emphasize possession: 'Este amor es mío', 'La culpa es tuya', 'Es suyo — no es mío'.",
    listeningSkill: 'Catch mío/tuyo/suyo in love songs — these stressed forms carry emotional weight and finality.',
    recyclingTargets: ['Possessive adjectives (M18)', 'ser (M13)', 'demonstratives (M19)'],
    vocabPack: {
      coreWords: [
        { spanish: 'mío / mía', english: 'mine (emphatic)' },
        { spanish: 'tuyo / tuya', english: 'yours (emphatic)' },
        { spanish: 'suyo / suya', english: 'his / hers / yours (formal)' },
        { spanish: 'nuestro / nuestra', english: 'ours' },
        { spanish: 'la culpa es tuya', english: "it's your fault" },
      ],
      bonusWords: [
        { spanish: 'propio/a', english: 'own (as in my own)' },
        { spanish: 'ajeno/a', english: "someone else's" },
        { spanish: 'compartido/a', english: 'shared' },
      ],
      phraseChunk: 'Ese ___ es ___.',
      speakingPattern: 'Ese amor es mío. / Esa canción es tuya. / Ese sueño es nuestro.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Este ritmo es mío — lo siento en los huesos' (This rhythm is mine — I feel it in my bones).",
        "Say: 'La música no es mía ni tuya — es de todos'.",
        "Say: 'El español es tuyo ahora — úsalo'.",
      ],
      sentenceFrames: [
        'Este/Esta ___ es ___ porque ___.',
        'La ___ no es mía — es ___.',
        'Nuestro/a ___ es ___ y lo/la compartimos.',
      ],
      miniChallenge: "Claim ownership of three things important to you — a skill, a genre, a goal — using mío/mía emphatically.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 48,
    vocabularyTheme: 'Recent experiences and achievements — what you have done and seen',
    speakingGoal: 'User can say what they have done recently using haber + past participle: he comido, has viajado, ha llegado.',
    listeningSkill: "Hear 'he', 'has', 'ha' + past participle — the present perfect links a past action to the present moment.",
    recyclingTargets: ['Past participles as adjectives (M46)', 'irregular past participles (roto, visto, hecho)', 'preterite (M33)'],
    vocabPack: {
      coreWords: [
        { spanish: 'he viajado', english: 'I have traveled' },
        { spanish: 'has comido', english: 'you have eaten' },
        { spanish: 'ha llegado', english: 'he/she has arrived' },
        { spanish: 'hemos visto', english: 'we have seen' },
        { spanish: 'han dicho', english: 'they have said' },
      ],
      bonusWords: [
        { spanish: 'he descubierto', english: 'I have discovered' },
        { spanish: 'ha crecido', english: 'he/she has grown' },
        { spanish: 'han logrado', english: 'they have achieved' },
      ],
      phraseChunk: 'Nunca he ___ pero quiero ___.',
      speakingPattern: 'Nunca he estado en España pero quiero ir. / Nunca he comido paella pero quiero probar. / Nunca he cantado en público pero quiero intentarlo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'He aprendido mucho español este año'.",
        "Say: '¿Has escuchado a ___? Es increíble' — recommend an artist.",
        "Say: 'Nunca he escuchado reggaeton, pero lo he intentado hoy'.",
      ],
      sentenceFrames: [
        'He ___ y también he ___.',
        '¿Has ___ alguna vez? Yo sí — una vez ___.',
        'Nunca hemos ___ pero queremos ___.',
      ],
      miniChallenge: "Share three life experiences using the present perfect: something you've done, something you've never done, and something you've just discovered.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 49,
    vocabularyTheme: 'Before something else happened — what had already occurred',
    speakingGoal: "User can say 'I had already eaten', 'She had left before I arrived' using había + past participle.",
    listeningSkill: 'Notice había/habías/había + past participle — these set up the backstory before the main story event.',
    recyclingTargets: ['Present perfect (M48)', 'preterite (M33)', 'imperfect (M37)'],
    vocabPack: {
      coreWords: [
        { spanish: 'había comido', english: 'had eaten' },
        { spanish: 'había llegado', english: 'had arrived' },
        { spanish: 'había dicho', english: 'had said' },
        { spanish: 'habías salido', english: 'you had left' },
        { spanish: 'habían terminado', english: 'they had finished' },
      ],
      bonusWords: [
        { spanish: 'ya había', english: 'had already' },
        { spanish: 'todavía no había', english: 'had not yet' },
        { spanish: 'cuando llegué', english: 'when I arrived' },
      ],
      phraseChunk: 'Cuando llegué, ya ___ ___.',
      speakingPattern: 'Cuando llegué, ya habían empezado. / Cuando llamé, ya se había ido. / Cuando entré, ya había terminado la canción.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Cuando llegué al concierto, ya había empezado'.",
        "Say: 'Ya había aprendido los verbos cuando llegó la parte difícil'.",
        "Say: 'Nunca había escuchado esa canción hasta hoy'.",
      ],
      sentenceFrames: [
        'Cuando ___, ya había ___.',
        'Nunca había ___ hasta que ___.',
        'Ya habíamos ___ cuando ___.',
      ],
      miniChallenge: "Tell a story about arriving late to something important — use había for everything that had already happened before you got there.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

  // ── B2 Advanced — Modules 50–60 ────────────────────────────────────────────

  {
    moduleId: 50,
    vocabularyTheme: 'Promises, predictions, and plans — what will happen',
    speakingGoal: 'User can say what will happen using -é/-ás/-á/-emos/-án endings: hablaré, comerás, vivirá.',
    listeningSkill: 'Listen for -é/-ás/-á endings on verbs — these are future tense promises and predictions in the song.',
    recyclingTargets: ['Ir + a + infinitive near future (M23)', 'conditional preview (M52)', '-ar/-er/-ir infinitives (M10–12)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hablaré', english: 'I will speak' },
        { spanish: 'comerás', english: 'you will eat' },
        { spanish: 'vivirá', english: 'he/she will live' },
        { spanish: 'seremos', english: 'we will be' },
        { spanish: 'tendrán', english: 'they will have' },
      ],
      bonusWords: [
        { spanish: 'podrá', english: 'will be able to' },
        { spanish: 'querrá', english: 'will want to' },
        { spanish: 'sabrá', english: 'will know' },
      ],
      phraseChunk: 'Un día ___ en ___.',
      speakingPattern: 'Un día cantaré en español. / Un día viviré en Madrid. / Un día hablaré perfectamente.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Un día hablaré español con fluidez' — make a promise to yourself.",
        "Say: 'Seré ___ en cinco años' — a future version of yourself.",
        "Say: 'Esta canción siempre me recordará de ___'.",
      ],
      sentenceFrames: [
        'Dentro de ___ años, ___ y ___.',
        'Un día ___ y nunca más ___.',
        'Cuando aprenda español, ___ y ___.',
      ],
      miniChallenge: "Write a 5-sentence letter to your future self using five simple future verbs about your Spanish journey.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 51,
    vocabularyTheme: 'What will have been accomplished by a deadline — looking forward to completion',
    speakingGoal: "User can say 'I will have finished', 'She will have arrived by then' using habré + past participle.",
    listeningSkill: 'Hear habrá/habré in lyrics — these look forward and set a future completion point.',
    recyclingTargets: ['Simple future (M50)', 'present perfect (M48)', 'past participles (M46)'],
    vocabPack: {
      coreWords: [
        { spanish: 'habré terminado', english: 'I will have finished' },
        { spanish: 'habrás llegado', english: 'you will have arrived' },
        { spanish: 'habrá aprendido', english: 'he/she will have learned' },
        { spanish: 'habremos visto', english: 'we will have seen' },
        { spanish: 'habrán salido', english: 'they will have left' },
      ],
      bonusWords: [
        { spanish: 'para entonces', english: 'by then' },
        { spanish: 'para el lunes', english: 'by Monday' },
        { spanish: 'para fin de año', english: "by year's end" },
      ],
      phraseChunk: 'Para ___, habré ___.',
      speakingPattern: 'Para el verano, habré aprendido más español. / Para mañana, habré terminado. / Para entonces, habrás visto grandes cambios.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Para el final de este año, habré terminado todos los módulos'.",
        "Say: 'Para cuando llegues, ya habremos empezado'.",
        "Say: 'Habrá cambiado todo para entonces'.",
      ],
      sentenceFrames: [
        'Para ___, habré ___ y ___.',
        'Cuando ___, ya habremos ___.',
        'Para entonces, ___ habrá ___.',
      ],
      miniChallenge: "Set three language goals using future perfect: what you will have achieved by a specific date.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 52,
    vocabularyTheme: 'Hypotheticals, wishes, and polite requests — what would happen',
    speakingGoal: "User can express wishes and hypotheticals: me gustaría, hablaría contigo, ¿podrías ayudarme?",
    listeningSkill: 'Catch -ía/-ías/-íamos endings — conditional mood turns statements into wishes, dreams, and polite requests.',
    recyclingTargets: ['Simple future (M50)', 'gustar (M30)', 'por/para (M41)'],
    vocabPack: {
      coreWords: [
        { spanish: 'me gustaría', english: 'I would like' },
        { spanish: 'hablaría', english: 'I would speak' },
        { spanish: 'comería', english: 'I would eat' },
        { spanish: 'iría', english: 'I would go' },
        { spanish: 'sería', english: 'I/he/she would be' },
      ],
      bonusWords: [
        { spanish: 'podría', english: 'could / would be able to' },
        { spanish: 'querría', english: 'would want' },
        { spanish: 'debería', english: 'should / ought to' },
      ],
      phraseChunk: 'Me gustaría ___ contigo.',
      speakingPattern: 'Me gustaría cantar contigo. / Me gustaría viajar contigo. / Me gustaría hablar en español contigo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Me gustaría vivir en un país hispanohablante' — where?",
        "Say: '¿Podrías hablar más despacio?' — polite conditional request.",
        "Say: 'Yo sería músico/a si pudiera elegir otra vez'.",
      ],
      sentenceFrames: [
        'Me gustaría ___ pero no puedo porque ___.',
        '¿Podrías ___ para mí? Sería muy ___.',
        'Si pudiera, ___ y ___.',
      ],
      miniChallenge: "Use five conditional verbs to describe your ideal day if you lived in a Spanish-speaking country.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 53,
    vocabularyTheme: 'What would have happened — regrets, alternate histories, and deep hypotheticals',
    speakingGoal: 'User can express regret using habría + past participle: Habría llamado, Hubiera ido, Lo habría dicho.',
    listeningSkill: "Hear 'habría' and 'hubiera' in reflective lyrics — these mark turning points where the story could have gone differently.",
    recyclingTargets: ['Conditional (M52)', 'past perfect (M49)', 'past participles (M46)'],
    vocabPack: {
      coreWords: [
        { spanish: 'habría hablado', english: 'would have spoken' },
        { spanish: 'habría ido', english: 'would have gone' },
        { spanish: 'habría sido', english: 'would have been' },
        { spanish: 'habría podido', english: 'would have been able to' },
        { spanish: 'habría dicho', english: 'would have said' },
      ],
      bonusWords: [
        { spanish: 'de haberlo sabido', english: 'had I known' },
        { spanish: 'ojalá hubiera', english: 'if only had' },
        { spanish: 'sin duda', english: 'without a doubt' },
      ],
      phraseChunk: 'Habría ___ si ___.',
      speakingPattern: 'Habría llamado si hubiera podido. / Habría ido si me hubieras invitado. / Habría cantado si hubiera sabido la letra.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Habría aprendido español antes si hubiera sabido lo bonito que es'.",
        "Say: 'De haberlo sabido, habría empezado antes'.",
        "Say: '¿Qué habrías hecho diferente?' — ask yourself.",
      ],
      sentenceFrames: [
        'Habría ___ si ___ — pero no ___.',
        'De haberlo sabido, habría ___.',
        'Ojalá hubiera ___ cuando ___.',
      ],
      miniChallenge: "Reflect on your language learning path — what would you have done differently? Use three conditional perfect sentences.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 54,
    vocabularyTheme: 'Relative clauses and embedded meaning — what I want vs. what you said',
    speakingGoal: "User can use 'lo que' correctly as 'what/that which': Lo que quiero es... / No sé lo que dijiste.",
    listeningSkill: "Notice 'lo que' in lyrics — it bridges two clauses and expresses 'what' as a thing or concept, not a question.",
    recyclingTargets: ['Question words (M3)', 'direct object pronouns (M27)', 'preterite (M33)'],
    vocabPack: {
      coreWords: [
        { spanish: 'lo que', english: 'what / that which' },
        { spanish: 'lo que quiero', english: 'what I want' },
        { spanish: 'no sé lo que', english: "I don't know what" },
        { spanish: 'todo lo que', english: 'everything that' },
        { spanish: 'es lo que es', english: "it is what it is" },
      ],
      bonusWords: [
        { spanish: 'lo cual', english: 'which (formal relative)' },
        { spanish: 'aquello que', english: 'that which' },
        { spanish: 'lo que sea', english: 'whatever' },
      ],
      phraseChunk: 'Lo que más me gusta es ___.',
      speakingPattern: 'Lo que más me gusta es la música. / Lo que más quiero es aprender. / Lo que me fascina es el español.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Lo que más me gusta de esta canción es ___'.",
        "Say: 'No sé lo que dice exactamente, pero me encanta cómo suena'.",
        "Say: 'Lo que aprendí hoy fue ___'.",
      ],
      sentenceFrames: [
        'Lo que más me ___ es ___ porque ___.',
        'No entiendo lo que ___, pero sé que ___.',
        'Todo lo que ___ es ___ y eso es suficiente.',
      ],
      miniChallenge: "Describe your experience learning Spanish using lo que three times: what you love, what you find hard, what you've discovered.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 55,
    vocabularyTheme: 'Wishes, emotions, requests, and doubt — the mood of uncertainty and desire',
    speakingGoal: 'User understands when the subjunctive is triggered (WEIRD: Wish, Emotion, Impersonal, Requests, Doubt/Denial) and recognizes ojalá.',
    listeningSkill: "Listen for 'ojalá' — this is the most common subjunctive trigger in Spanish songs. It means 'I hope that' or 'if only'.",
    recyclingTargets: ['Tú commands (M44)', 'conjunctions (M4)', 'gustar expressions (M30)'],
    vocabPack: {
      coreWords: [
        { spanish: 'ojalá', english: 'I hope that / if only' },
        { spanish: 'quiero que', english: 'I want (you) to' },
        { spanish: 'espero que', english: 'I hope that' },
        { spanish: 'es importante que', english: "it's important that" },
        { spanish: 'dudo que', english: 'I doubt that' },
      ],
      bonusWords: [
        { spanish: 'temo que', english: 'I fear that' },
        { spanish: 'insisto en que', english: 'I insist that' },
        { spanish: 'sugiero que', english: 'I suggest that' },
      ],
      phraseChunk: 'Ojalá ___ ___.',
      speakingPattern: 'Ojalá pueda aprender. / Ojalá tengamos tiempo. / Ojalá sea verdad.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Ojalá hable español perfectamente algún día'.",
        "Say: 'Espero que esta canción te guste'.",
        "Say: 'Es importante que practiques todos los días'.",
      ],
      sentenceFrames: [
        'Ojalá ___ — lo deseo de verdad.',
        'Espero que ___ porque ___.',
        'Es importante que ___ si quieres ___.',
      ],
      miniChallenge: "Express three wishes for your Spanish learning using ojalá, espero que, and quiero que — all with different verbs.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 56,
    vocabularyTheme: 'Expressing what you want others to do, what you hope happens, what you doubt',
    speakingGoal: 'User can conjugate regular and irregular verbs in present subjunctive for all persons.',
    listeningSkill: "Notice the 'opposite vowel' pattern — -ar verbs use -e endings, -er/-ir verbs use -a endings in subjunctive.",
    recyclingTargets: ['WEIRD triggers (M55)', '-ar/-er/-ir present tense (M10–12)', 'irregular yo forms (M21)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hable', english: 'that (I/he/she) speak (subjunctive)' },
        { spanish: 'coma', english: 'that (I/he/she) eat (subjunctive)' },
        { spanish: 'viva', english: 'that (I/he/she) live (subjunctive)' },
        { spanish: 'sea', english: 'that (I/he/she) be (subjunctive)' },
        { spanish: 'tenga', english: 'that (I/he/she) have (subjunctive)' },
      ],
      bonusWords: [
        { spanish: 'vaya', english: 'that (I/he/she) go (subjunctive)' },
        { spanish: 'haga', english: 'that (I/he/she) do (subjunctive)' },
        { spanish: 'pueda', english: 'that (I/he/she) can (subjunctive)' },
      ],
      phraseChunk: 'Espero que ___ ___.',
      speakingPattern: 'Espero que hables español pronto. / Espero que comas bien. / Espero que tengas suerte.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Espero que este módulo sea interesante'.",
        "Say: 'Quiero que mi español mejore cada día'.",
        "Say: 'Es necesario que practiques aunque sea cinco minutos'.",
      ],
      sentenceFrames: [
        'Espero que ___ pronto — lo necesito.',
        'Quiero que ___ porque ___.',
        'Es necesario que ___ si quieres ___.',
      ],
      miniChallenge: "Express five subjunctive sentences using five different triggers: espero, quiero, es importante, dudo, ojalá.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 57,
    vocabularyTheme: 'Embedded clauses with emotion and desire — Quiero que..., Espero que..., Es posible que...',
    speakingGoal: 'User can form complete two-clause subjunctive sentences: Quiero que vengas, Espero que tengas suerte.',
    listeningSkill: 'Hear full subjunctive sentences in the song — the two-clause structure where the second verb shifts mood.',
    recyclingTargets: ['Present subjunctive conjugations (M56)', 'WEIRD (M55)', 'indirect object pronouns (M28)'],
    vocabPack: {
      coreWords: [
        { spanish: 'Quiero que vengas', english: 'I want you to come' },
        { spanish: 'Espero que llegues', english: 'I hope you arrive' },
        { spanish: 'Es posible que llueva', english: 'It may rain' },
        { spanish: 'Me alegra que estés', english: "I'm glad you're here" },
        { spanish: 'Necesito que me ayudes', english: 'I need you to help me' },
      ],
      bonusWords: [
        { spanish: 'Prefiero que', english: 'I prefer that' },
        { spanish: 'Sugiero que', english: 'I suggest that' },
        { spanish: 'Recomiendo que', english: 'I recommend that' },
      ],
      phraseChunk: 'Quiero que ___ conmigo.',
      speakingPattern: 'Quiero que bailes conmigo. / Quiero que vengas conmigo. / Quiero que aprendas conmigo.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Quiero que la música me enseñe español'.",
        "Say: 'Me alegra que hayas llegado hasta este módulo'.",
        "Say: 'Espero que este ejercicio te ayude'.",
      ],
      sentenceFrames: [
        'Quiero que ___ porque ___.',
        'Me alegra que ___ — significa que ___.',
        'Es posible que ___ si ___ todos los días.',
      ],
      miniChallenge: "Write a heartfelt message to a Spanish-learning friend using four subjunctive sentences expressing wishes, hope, and encouragement.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'moderate',
      slangLevel: 'light',
      repetitionLevel: 'medium',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 58,
    vocabularyTheme: 'Past hypotheticals and wishes — Si tuviera, Quería que vinieras, Ojalá pudiera',
    speakingGoal: 'User can express past wishes and counterfactuals: Quería que hablaras, Si pudiera ir, Ojalá supiera.',
    listeningSkill: 'Catch -ara/-iera endings — these are the past subjunctive markers in emotional, reflective, and longing lyrics.',
    recyclingTargets: ['Present subjunctive (M56–57)', 'imperfect (M37)', 'conditional (M52)'],
    vocabPack: {
      coreWords: [
        { spanish: 'quisiera', english: 'I would like (polite wish)' },
        { spanish: 'pudiera', english: 'could / might (subjunctive past)' },
        { spanish: 'tuviera', english: 'had (subjunctive past)' },
        { spanish: 'fuera', english: 'were / went (subjunctive past)' },
        { spanish: 'hablara', english: 'spoke (subjunctive past)' },
      ],
      bonusWords: [
        { spanish: 'supiera', english: 'knew (subjunctive past)' },
        { spanish: 'dijera', english: 'said (subjunctive past)' },
        { spanish: 'hiciera', english: 'did/made (subjunctive past)' },
      ],
      phraseChunk: 'Si yo pudiera, ___.',
      speakingPattern: 'Si yo pudiera, viajaría por el mundo. / Si tuviera tiempo, aprendería más. / Si fuera músico/a, compondría canciones en español.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Quisiera hablar español perfectamente' — polite and wistful.",
        "Say: 'Si pudiera, viviría en México un año'.",
        "Say: 'Ojalá pudiera entender las canciones rápidas sin ayuda'.",
      ],
      sentenceFrames: [
        'Si pudiera ___, ___.',
        'Quisiera ___ pero la realidad es que ___.',
        'Ojalá ___ — sería increíble.',
      ],
      miniChallenge: "Express three impossible or unlikely wishes for your Spanish journey using si + past subjunctive + conditional.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'medium',
      beginnerSuitability: 'good',
    },
  },

  {
    moduleId: 59,
    vocabularyTheme: 'Recent completed actions in doubt or emotion — I hope you have, I doubt she has done',
    speakingGoal: 'User can use haya + past participle in subjunctive context: Espero que hayas llegado, Dudo que lo haya dicho.',
    listeningSkill: "Notice 'que hayas/haya' in emotional lyrics — these link present hope or doubt to a recently completed action.",
    recyclingTargets: ['Imperfect subjunctive (M58)', 'present perfect (M48)', 'WEIRD (M55)'],
    vocabPack: {
      coreWords: [
        { spanish: 'haya llegado', english: 'have arrived (subjunctive)' },
        { spanish: 'haya dicho', english: 'have said (subjunctive)' },
        { spanish: 'hayas visto', english: 'have seen (subjunctive)' },
        { spanish: 'hayan terminado', english: 'have finished (subjunctive)' },
        { spanish: 'haya pasado', english: 'have happened (subjunctive)' },
      ],
      bonusWords: [
        { spanish: 'me alegra que hayas', english: "I'm glad you have" },
        { spanish: 'espero que haya', english: 'I hope he/she has' },
        { spanish: 'dudo que haya', english: 'I doubt that has' },
      ],
      phraseChunk: 'Me alegra que hayas ___.',
      speakingPattern: 'Me alegra que hayas llegado hasta aquí. / Me alegra que hayas aprendido tanto. / Me alegra que hayas disfrutado.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Espero que hayas entendido la lección de hoy'.",
        "Say: 'Me alegra que hayas llegado tan lejos en tu aprendizaje'.",
        "Say: 'Dudo que haya terminado ya — es muy rápido'.",
      ],
      sentenceFrames: [
        'Espero que hayas ___ porque ___.',
        'Me alegra que hayas ___ — significa mucho.',
        'Dudo que ___ haya ___ todavía.',
      ],
      miniChallenge: "Write three reflective sentences about your language journey using present perfect subjunctive with espero, me alegra, and dudo.",
    },
    songDifficulty: {
      pace: 'slow',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'moderate',
    },
  },

  {
    moduleId: 60,
    vocabularyTheme: 'The deepest counterfactuals — if only things had been different, ultimate regrets and dreams',
    speakingGoal: "User can express the most hypothetical regrets: Si hubiera sabido, Si hubieras venido, Ojalá hubiera podido.",
    listeningSkill: "Hear 'hubiera/hubiese' — the most emotionally loaded constructions in Spanish, used for profound regret and longing.",
    recyclingTargets: ['Present perfect subjunctive (M59)', 'conditional perfect (M53)', 'past perfect (M49)'],
    vocabPack: {
      coreWords: [
        { spanish: 'hubiera sabido', english: 'had known (subjunctive)' },
        { spanish: 'hubiera podido', english: 'had been able to (subjunctive)' },
        { spanish: 'hubiera ido', english: 'had gone (subjunctive)' },
        { spanish: 'hubieras venido', english: 'had come (subjunctive, you)' },
        { spanish: 'hubiera sido', english: 'had been (subjunctive)' },
      ],
      bonusWords: [
        { spanish: 'de haberlo sabido', english: 'had I known / if only I had known' },
        { spanish: 'ojalá hubiera habido', english: 'if only there had been' },
        { spanish: 'si hubiéramos', english: 'if we had' },
      ],
      phraseChunk: 'Si hubiera ___, habría ___.',
      speakingPattern: 'Si hubiera sabido, habría venido antes. / Si hubiera podido, habría cantado. / Si hubiera tenido tiempo, habría aprendido más.',
    },
    speakingPrompts: {
      prompts: [
        "Say: 'Si hubiera sabido lo bonito que es el español, habría empezado antes'.",
        "Say: 'Ojalá hubiera podido estudiar en México' — a genuine wish.",
        "Say: 'De haberlo sabido, todo habría sido diferente'.",
      ],
      sentenceFrames: [
        'Si hubiera ___, habría ___ — pero no fue posible.',
        'Ojalá hubiera ___ cuando todavía podía.',
        'De haberlo sabido, ___ — y ahora ___.',
      ],
      miniChallenge: "Reflect on your entire Spanish learning journey: what would you have done differently? Write three past perfect subjunctive sentences — one regret, one wish, one moment you're grateful for.",
    },
    songDifficulty: {
      pace: 'medium',
      clarity: 'clear',
      slangLevel: 'none',
      repetitionLevel: 'low',
      beginnerSuitability: 'good',
    },
  },

];

export function getEnrichment(moduleId: number): ModuleEnrichment | undefined {
  return MODULE_ENRICHMENT.find(e => e.moduleId === moduleId);
}
