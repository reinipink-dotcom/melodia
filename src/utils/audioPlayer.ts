import { Audio } from 'expo-av';
import { TtsTrigger } from '../data/modules';
import { speakSpanish } from './speech';

// Static asset map — all 17 Module 4 MP3s.
// require() calls must be statically analyzable by Metro bundler; dynamic require() does not work.
const AUDIO_MAP: Record<string, number> = {
  'assets/audio/module-004/vocab-de-slow.mp3':                        require('../../assets/audio/module-004/vocab-de-slow.mp3'),
  'assets/audio/module-004/vocab-de.mp3':                             require('../../assets/audio/module-004/vocab-de.mp3'),
  'assets/audio/module-004/vocab-con-slow.mp3':                       require('../../assets/audio/module-004/vocab-con-slow.mp3'),
  'assets/audio/module-004/vocab-con.mp3':                            require('../../assets/audio/module-004/vocab-con.mp3'),
  'assets/audio/module-004/vocab-sin-slow.mp3':                       require('../../assets/audio/module-004/vocab-sin-slow.mp3'),
  'assets/audio/module-004/vocab-sin.mp3':                            require('../../assets/audio/module-004/vocab-sin.mp3'),
  'assets/audio/module-004/vocab-pero-slow.mp3':                      require('../../assets/audio/module-004/vocab-pero-slow.mp3'),
  'assets/audio/module-004/vocab-pero.mp3':                           require('../../assets/audio/module-004/vocab-pero.mp3'),
  'assets/audio/module-004/vocab-tambien-slow.mp3':                   require('../../assets/audio/module-004/vocab-tambien-slow.mp3'),
  'assets/audio/module-004/vocab-tambien.mp3':                        require('../../assets/audio/module-004/vocab-tambien.mp3'),
  'assets/audio/module-004/contrast-perro-slow.mp3':                  require('../../assets/audio/module-004/contrast-perro-slow.mp3'),
  'assets/audio/module-004/phrase-cafe-con-leche.mp3':                require('../../assets/audio/module-004/phrase-cafe-con-leche.mp3'),
  'assets/audio/module-004/phrase-yo-tambien.mp3':                    require('../../assets/audio/module-004/phrase-yo-tambien.mp3'),
  'assets/audio/module-004/speaking-frame-quiero-cafe-con-leche.mp3': require('../../assets/audio/module-004/speaking-frame-quiero-cafe-con-leche.mp3'),
  'assets/audio/module-004/speaking-frame-hablo-ingles-pero.mp3':     require('../../assets/audio/module-004/speaking-frame-hablo-ingles-pero.mp3'),
  'assets/audio/module-004/reading-con-sus-seres.mp3':                require('../../assets/audio/module-004/reading-con-sus-seres.mp3'),
  'assets/audio/module-004/reading-sin-miedo.mp3':                    require('../../assets/audio/module-004/reading-sin-miedo.mp3'),
};

let currentSound: Audio.Sound | null = null;

export function stopAudio(): void {
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
    speakSpanish(trigger.text);
    return;
  }

  try {
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
    currentSound = sound;
  } catch {
    speakSpanish(trigger.text);
  }
}
