import { Audio } from 'expo-av';
import { TtsTrigger } from '../data/modules';
import { AUDIO_ASSETS } from './audioAssets';
import { speakText, stopSpeech } from './speech';

let audioReady = false;
async function ensureAudioReady(): Promise<void> {
  if (audioReady) return;
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false });
  audioReady = true;
}

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

  const source = AUDIO_ASSETS[trigger.outputFile];
  if (source === undefined) {
    console.warn(`[audio] Missing bundled OpenAI audio asset for ${trigger.id}: ${trigger.outputFile}`);
    speakText(trigger.text, trigger.language.startsWith('en') ? 'en-US' : 'es');
    return;
  }

  try {
    await ensureAudioReady();
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
    currentSound = sound;
  } catch (error) {
    console.warn(`[audio] Failed to play OpenAI audio asset for ${trigger.id}: ${trigger.outputFile}`, error);
    speakText(trigger.text, trigger.language.startsWith('en') ? 'en-US' : 'es');
  }
}
