import * as Speech from 'expo-speech';

export function speakSpanish(text: string): void {
  Speech.stop();
  Speech.speak(text, {
    language: 'es',
    pitch: 1.0,
    rate: 0.85,
  });
}

export function stopSpeech(): void {
  Speech.stop();
}
