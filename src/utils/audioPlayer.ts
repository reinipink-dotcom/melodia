import { Audio } from 'expo-av';
import { TtsTrigger } from '../data/modules';
import { stopSpeech } from './speech';

let audioReady = false;
async function ensureAudioReady(): Promise<void> {
  if (audioReady) return;
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false });
  audioReady = true;
}

// Static asset map — Metro bundler requires static require() calls.
// After running /melodia-audio for each module, add new require() entries here
// and run `npx expo start --clear` to pick them up.
const AUDIO_MAP: Record<string, number> = {
  // Module 4 — reading tap tokens (v1 files, still used)
  'assets/audio/module-004/reading-con-sus-seres.mp3':                require('../../assets/audio/module-004/reading-con-sus-seres.mp3'),
  'assets/audio/module-004/reading-sin-miedo.mp3':                    require('../../assets/audio/module-004/reading-sin-miedo.mp3'),
  // Module 1 — reading tap tokens (v1 files, still used)
  'assets/audio/module-001/reading-token-besame-mucho.mp3':           require('../../assets/audio/module-001/reading-token-besame-mucho.mp3'),
  'assets/audio/module-001/reading-token-besame.mp3':                 require('../../assets/audio/module-001/reading-token-besame.mp3'),
  'assets/audio/module-001/reading-token-hola.mp3':                   require('../../assets/audio/module-001/reading-token-hola.mp3'),
  'assets/audio/module-001/reading-token-llorar.mp3':                 require('../../assets/audio/module-001/reading-token-llorar.mp3'),
  'assets/audio/module-001/reading-token-hablar.mp3':                 require('../../assets/audio/module-001/reading-token-hablar.mp3'),
  // ── Narration-style audio (v2) ─────────────────────────────────────────────
  // Add entries below after running /melodia-audio 1 2 3 4.
  // Format: 'assets/audio/module-00N/mN-slug.mp3': require('../../assets/audio/module-00N/mN-slug.mp3'),
  // Module 5 — Subject Pronouns
  'assets/audio/module-005/m5-intro-subject-pronouns.mp3':            require('../../assets/audio/module-005/m5-intro-subject-pronouns.mp3'),
  'assets/audio/module-005/m5-vocab-yo.mp3':                          require('../../assets/audio/module-005/m5-vocab-yo.mp3'),
  'assets/audio/module-005/m5-vocab-tu.mp3':                          require('../../assets/audio/module-005/m5-vocab-tu.mp3'),
  'assets/audio/module-005/m5-vocab-el-ella.mp3':                     require('../../assets/audio/module-005/m5-vocab-el-ella.mp3'),
  'assets/audio/module-005/m5-vocab-nosotros.mp3':                    require('../../assets/audio/module-005/m5-vocab-nosotros.mp3'),
  'assets/audio/module-005/m5-vocab-ellos.mp3':                       require('../../assets/audio/module-005/m5-vocab-ellos.mp3'),
  'assets/audio/module-005/m5-phrase-yo-soy-de.mp3':                  require('../../assets/audio/module-005/m5-phrase-yo-soy-de.mp3'),
  'assets/audio/module-005/m5-speaking-prompt.mp3':                   require('../../assets/audio/module-005/m5-speaking-prompt.mp3'),
  'assets/audio/module-005/m5-reading-bomba-estereo.mp3':             require('../../assets/audio/module-005/m5-reading-bomba-estereo.mp3'),
  'assets/audio/module-005/m5-lesson-complete.mp3':                   require('../../assets/audio/module-005/m5-lesson-complete.mp3'),
  'assets/audio/module-005/m5-cultural-note-ivy-queen.mp3':           require('../../assets/audio/module-005/m5-cultural-note-ivy-queen.mp3'),
};

let currentSound: Audio.Sound | null = null;

export function stopAudio(): void {
  stopSpeech();
  if (currentSound) {
    const s = currentSound;
    currentSound = null;
    s.unloadAsync().catch(() => {});
  }
}

export async function playTrigger(trigger: TtsTrigger): Promise<void> {
  stopAudio();

  const source = AUDIO_MAP[trigger.outputFile];
  if (source === undefined) {
    console.warn(`[audio] Missing bundled OpenAI audio asset for ${trigger.id}: ${trigger.outputFile}`);
    return;
  }

  try {
    await ensureAudioReady();
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
    currentSound = sound;
  } catch (error) {
    console.warn(`[audio] Failed to play OpenAI audio asset for ${trigger.id}: ${trigger.outputFile}`, error);
  }
}
