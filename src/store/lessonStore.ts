import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LessonPhase =
  | 'prelisten'
  | 'listening'
  | 'quiz'
  | 'results'
  | 'reading'
  | 'complete';

export interface ActiveLesson {
  moduleId: number;
  phase: LessonPhase;
  notificationId: string | null;
  startedAt: string;
  timerStartedAt: number | null;
}

interface LessonState {
  activeLesson: ActiveLesson | null;

  startLesson: (moduleId: number) => Promise<void>;
  updatePhase: (phase: LessonPhase) => Promise<void>;
  setNotificationId: (id: string | null) => Promise<void>;
  setTimerStartedAt: (ms: number | null) => Promise<void>;
  completeLesson: () => Promise<void>;
  loadLessonState: () => Promise<void>;
}

const STORAGE_KEY = '@melodia_lesson';

export const useLessonStore = create<LessonState>((set, get) => ({
  activeLesson: null,

  startLesson: async (moduleId) => {
    const lesson: ActiveLesson = {
      moduleId,
      phase: 'prelisten',
      notificationId: null,
      startedAt: new Date().toISOString(),
      timerStartedAt: null,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lesson));
    set({ activeLesson: lesson });
  },

  updatePhase: async (phase) => {
    const current = get().activeLesson;
    if (!current) return;
    const updated = { ...current, phase };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ activeLesson: updated });
  },

  setNotificationId: async (notificationId) => {
    const current = get().activeLesson;
    if (!current) return;
    const updated = { ...current, notificationId };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ activeLesson: updated });
  },

  setTimerStartedAt: async (ms) => {
    const current = get().activeLesson;
    if (!current) return;
    const updated = { ...current, timerStartedAt: ms };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ activeLesson: updated });
  },

  completeLesson: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ activeLesson: null });
  },

  loadLessonState: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) set({ activeLesson: JSON.parse(raw) });
  },
}));
