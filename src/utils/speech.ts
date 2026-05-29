import * as Speech from 'expo-speech';

export function speakText(text: string, language = 'es'): void {
  Speech.stop();
  Speech.speak(text, {
    language,
    pitch: 1.0,
    rate: 0.85,
  });
}

export function speakSpanish(text: string): void {
  speakText(text, 'es');
}

export function stopSpeech(): void {
  Speech.stop();
}
