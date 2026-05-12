import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SpanishLevel = 'beginner' | 'some-basics' | 'intermediate' | null;
export type Genre = 'pop' | 'reggaeton' | 'rnb' | 'regional-mexican';
export type Platform = 'spotify' | 'apple-music' | 'youtube-music' | 'youtube' | null;
export type DailyGoal = 5 | 10 | 15 | 20 | null;

interface OnboardingState {
  level: SpanishLevel;
  genres: Genre[];
  platform: Platform;
  dailyGoal: DailyGoal;
  isComplete: boolean;

  setLevel: (level: SpanishLevel) => void;
  toggleGenre: (genre: Genre) => void;
  setPlatform: (platform: Platform) => void;
  setDailyGoal: (goal: DailyGoal) => void;
  completeOnboarding: () => Promise<void>;
  loadOnboardingState: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const STORAGE_KEY = '@melodia_onboarding';

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  level: null,
  genres: [],
  platform: null,
  dailyGoal: null,
  isComplete: false,

  setLevel: (level) => set({ level }),

  toggleGenre: (genre) => {
    const current = get().genres;
    const exists = current.includes(genre);
    set({ genres: exists ? current.filter((g) => g !== genre) : [...current, genre] });
  },

  setPlatform: (platform) => set({ platform }),

  setDailyGoal: (dailyGoal) => set({ dailyGoal }),

  completeOnboarding: async () => {
    const { level, genres, platform, dailyGoal } = get();
    const data = { level, genres, platform, dailyGoal, isComplete: true };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    set({ isComplete: true });
  },

  loadOnboardingState: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      set(data);
    }
  },

  resetOnboarding: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ level: null, genres: [], platform: null, dailyGoal: null, isComplete: false });
  },
}));
