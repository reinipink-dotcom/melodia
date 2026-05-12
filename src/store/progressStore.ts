import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressState {
  currentModuleId: number;
  completedModuleIds: number[];
  totalXP: number;
  streak: number;
  lastActivityDate: string | null;

  completeModule: (moduleId: number, xp: number) => Promise<void>;
  loadProgress: () => Promise<void>;
}

const STORAGE_KEY = '@melodia_progress';

const DEFAULT_STATE = {
  currentModuleId: 2,
  completedModuleIds: [1],
  totalXP: 100,
  streak: 3,
  lastActivityDate: new Date().toISOString().split('T')[0],
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  ...DEFAULT_STATE,

  completeModule: async (moduleId, xp) => {
    const { completedModuleIds, totalXP } = get();
    const updated = {
      completedModuleIds: [...completedModuleIds, moduleId],
      currentModuleId: moduleId + 1,
      totalXP: totalXP + xp,
      streak: get().streak,
      lastActivityDate: new Date().toISOString().split('T')[0],
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set(updated);
  },

  loadProgress: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) set(JSON.parse(raw));
  },
}));
