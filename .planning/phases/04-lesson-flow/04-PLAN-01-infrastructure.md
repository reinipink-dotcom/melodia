# Plan: Infrastructure (Types, Store, Navigation, Notifications)
**Phase:** 4 — Lesson Flow
**Plan:** 1 of 5
**Deps:** none

## Objective
Set up all foundational infrastructure for the lesson flow: install `expo-notifications`, extend the `Module` and `Song` types in `modules.ts` with new fields, create the `lessonStore` for transient lesson state, extend `ModulesNavigator` with 6 new lesson routes (tab bar hidden, gestures disabled), wire root-level notification response handling in `App.tsx`, build a deep-link helper, and fix the dangling `Inter_*` font references in `Button.tsx` and `QuizOption.tsx`. After this plan, every downstream screen plan can compile without infrastructure blockers.

## Context
- D-03: content fields live inline on `Module` (no separate files). Optional `?` markers so the 57 modules without Phase 4 content still type-check.
- D-05/D-07/D-08: timer uses `expo-notifications` local scheduling. On fire (or manual return), user lands on ListenScreen with quiz CTA.
- D-09/D-10: lesson state persists across kills — separate `lessonStore` (not `progressStore`), keyed `@melodia_lesson`.
- Research §"Navigator Structure": extend `ModulesNavigator` directly. Don't create a nested LessonNavigator.
- Research §"Risks #7": `Button.tsx` and `QuizOption.tsx` reference Inter fonts that are NEVER loaded in `App.tsx`, so text silently falls back to system font. Must fix before Phase 4 screens use these components.

## Tasks

### Task 1: Install expo-notifications and update app.json
**Type:** setup
**Files modified:** `package.json`, `package-lock.json`, `app.json`
**Blocking:** yes

Run:
```bash
npx expo install expo-notifications
```

Then edit `/Users/reinebadejoko/Desktop/app/melodia-app/app.json`. In the existing `expo.plugins` array, add the `expo-notifications` plugin. Also add iOS query schemes for deep-link detection. The relevant additions:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["spotify", "vnd.youtube"]
      }
    },
    "plugins": [
      "...existing entries...",
      ["expo-notifications", { "color": "#FF6B4A" }]
    ]
  }
}
```

Notes:
- Do NOT pass an `icon` field unless `./assets/notification-icon.png` actually exists — omitting it is fine.
- Preserve every existing plugin entry. Only add the new one.
- If an `ios.infoPlist` block already exists, merge `LSApplicationQueriesSchemes` into it; don't overwrite.

### Task 2: Extend modules.ts types
**Type:** feature
**Files modified:** `src/data/modules.ts`
**Blocking:** yes

In `/Users/reinebadejoko/Desktop/app/melodia-app/src/data/modules.ts`, modify the type definitions in the Types section (lines 1–65):

1. Add `spotifyId?: string` to the existing `Song` type:
```typescript
export type Song = {
  title: string;
  artist: string;
  durationSeconds: number;
  spotifyId?: string;  // Phase 4: for spotify:track:{id} deep links
};
```

2. Add two new exported types:
```typescript
export type QuizQuestion = {
  question: string;
  options: [string, string, string, string]; // exactly 4
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
};

export type ReadingPassageToken = {
  text: string;
  isSpanish: boolean;
  english?: string;   // required when isSpanish is true
  phonetic?: string;  // optional pronunciation hint
};
```

3. Add two optional fields to the existing `Module` type (place after `xpReward: number;`):
```typescript
quizQuestions?: QuizQuestion[];        // Phase 4: populated for modules 1-3
readingPassage?: ReadingPassageToken[]; // Phase 4: populated for modules 1-3
```

Do NOT touch any module data rows in this task. Content is added in Plan 02.

### Task 3: Create lessonStore.ts
**Type:** feature
**Files modified:** `src/store/lessonStore.ts` (new)
**Blocking:** yes

Create `/Users/reinebadejoko/Desktop/app/melodia-app/src/store/lessonStore.ts`. Follow the exact same Zustand + AsyncStorage pattern as `progressStore.ts`:

```typescript
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
  startedAt: string; // ISO date string
  timerStartedAt: number | null; // Date.now() — set when timer begins
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
```

### Task 4: Create streaming deep-link helper
**Type:** feature
**Files modified:** `src/utils/streaming.ts` (new)
**Blocking:** no (Plan 03 consumes this)

Create `/Users/reinebadejoko/Desktop/app/melodia-app/src/utils/streaming.ts`:

```typescript
import * as Linking from 'expo-linking';
import { Song } from '../data/modules';

export type StreamingPlatform = 'spotify' | 'apple-music' | 'youtube-music' | 'youtube';

export function getStreamingUrl(
  platform: StreamingPlatform | null,
  song: Pick<Song, 'title' | 'artist' | 'spotifyId'>
): string {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  const resolved = platform ?? 'spotify';

  switch (resolved) {
    case 'spotify':
      return song.spotifyId
        ? `spotify:track:${song.spotifyId}`
        : `https://open.spotify.com/search/${query}`;
    case 'apple-music':
      return `https://music.apple.com/search?term=${query}`;
    case 'youtube-music':
      return `https://music.youtube.com/search?q=${query}`;
    case 'youtube':
      return `https://www.youtube.com/results?search_query=${query}`;
    default:
      return `https://open.spotify.com/search/${query}`;
  }
}

export async function openStreaming(
  platform: StreamingPlatform | null,
  song: Pick<Song, 'title' | 'artist' | 'spotifyId'>
): Promise<void> {
  const url = getStreamingUrl(platform, song);
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return;
    }
  } catch {
    // fall through to web fallback
  }
  const fallback = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
  await Linking.openURL(fallback);
}

export function platformLabel(platform: StreamingPlatform | null): string {
  switch (platform) {
    case 'spotify': return 'Spotify';
    case 'apple-music': return 'Apple Music';
    case 'youtube-music': return 'YouTube Music';
    case 'youtube': return 'YouTube';
    default: return 'Spotify';
  }
}

export function platformIconName(platform: StreamingPlatform | null): 'logo-spotify' | 'musical-note' | 'logo-youtube' {
  switch (platform) {
    case 'spotify': return 'logo-spotify';
    case 'youtube':
    case 'youtube-music':
      return 'logo-youtube';
    default: return 'musical-note';
  }
}
```

### Task 5: Create notification helper
**Type:** feature
**Files modified:** `src/utils/notifications.ts` (new)
**Blocking:** no (Plan 03 consumes this)

Create `/Users/reinebadejoko/Desktop/app/melodia-app/src/utils/notifications.ts`:

```typescript
import * as Notifications from 'expo-notifications';

export async function ensureNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function scheduleTimerNotification(
  durationSeconds: number,
  songTitle: string,
  moduleId: number
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time's up!",
      body: `You've been listening to "${songTitle}". Ready to quiz?`,
      sound: true,
      data: { screen: 'Listen', moduleId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, durationSeconds),
      repeats: false,
    },
  });
  return id;
}

export async function cancelTimerNotification(id: string | null): Promise<void> {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // notification may have already fired — ignore
  }
}
```

### Task 6: Configure root notification handler in App.tsx
**Type:** feature
**Files modified:** `App.tsx`
**Blocking:** yes (NavigationContainer ref must exist for Plan 03 notification taps to navigate)

In `/Users/reinebadejoko/Desktop/app/melodia-app/App.tsx`:

1. At the top of the file (before component body), add:
```typescript
import * as Notifications from 'expo-notifications';
import { useNavigationContainerRef } from '@react-navigation/native';
import { useLessonStore } from './src/store/lessonStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
```

2. Inside the App component, add a `navigationRef`:
```typescript
const navigationRef = useNavigationContainerRef();
```

3. Wire the existing `<NavigationContainer>` JSX with `ref={navigationRef}`.

4. On mount (in an existing `useEffect` or a new one), load the lesson store and register the response listener:
```typescript
useEffect(() => {
  useLessonStore.getState().loadLessonState();

  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as { screen?: string; moduleId?: number };
    if (data?.screen === 'Listen' && typeof data.moduleId === 'number') {
      // Cross-navigator deep nav: MainTabs → Modules → Listen
      // @ts-expect-error nested screen typing
      navigationRef.navigate('MainTabs', {
        screen: 'Modules',
        params: {
          screen: 'Listen',
          params: { moduleId: data.moduleId },
        },
      });
    }
  });

  return () => sub.remove();
}, []);
```

Note: if `App.tsx` already loads `onboardingStore` or `progressStore` on mount, add `loadLessonState()` next to those calls — keep one consolidated effect rather than duplicating.

### Task 7: Extend ModulesNavigator with 6 lesson routes
**Type:** feature
**Files modified:** `src/navigation/ModulesNavigator.tsx`
**Blocking:** yes (Plans 03–05 import these screen names + param shapes)

Replace `/Users/reinebadejoko/Desktop/app/melodia-app/src/navigation/ModulesNavigator.tsx` with:

```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModulesScreen } from '../screens/Modules/ModulesScreen';
import { ModuleDetailScreen } from '../screens/Modules/ModuleDetailScreen';
import { PreListenScreen } from '../screens/Lesson/PreListenScreen';
import { ListenScreen } from '../screens/Lesson/ListenScreen';
import { QuizScreen } from '../screens/Lesson/QuizScreen';
import { QuizResultsScreen } from '../screens/Lesson/QuizResultsScreen';
import { ReadingScreen } from '../screens/Lesson/ReadingScreen';
import { LessonCompleteScreen } from '../screens/Lesson/LessonCompleteScreen';

export type ModulesStackParamList = {
  ModulesList: undefined;
  ModuleDetail: { moduleId: number };
  PreListen: { moduleId: number };
  Listen: { moduleId: number };
  Quiz: { moduleId: number };
  QuizResults: { moduleId: number; score: number; total: number; xpEarned: number };
  Reading: { moduleId: number; xpEarned: number };
  LessonComplete: { moduleId: number; xpEarned: number };
};

const Stack = createStackNavigator<ModulesStackParamList>();

const lessonScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
  tabBarStyle: { display: 'none' as const },
};

export function ModulesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ModulesList" component={ModulesScreen} />
      <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
      <Stack.Screen name="PreListen" component={PreListenScreen} options={lessonScreenOptions} />
      <Stack.Screen name="Listen" component={ListenScreen} options={lessonScreenOptions} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={lessonScreenOptions} />
      <Stack.Screen name="QuizResults" component={QuizResultsScreen} options={lessonScreenOptions} />
      <Stack.Screen name="Reading" component={ReadingScreen} options={lessonScreenOptions} />
      <Stack.Screen name="LessonComplete" component={LessonCompleteScreen} options={lessonScreenOptions} />
    </Stack.Navigator>
  );
}
```

Important: this navigator will not compile until the 6 lesson screen files exist. Create empty placeholder files in Task 9 to keep TypeScript green between plans.

### Task 8: Wire "Start Lesson" button in ModuleDetailScreen
**Type:** feature
**Files modified:** `src/screens/Modules/ModuleDetailScreen.tsx`
**Blocking:** no

In `ModuleDetailScreen.tsx`, the `Start Lesson` `TouchableOpacity` currently has no `onPress`. Wire it to start the lesson:

1. Add import:
```typescript
import { useLessonStore } from '../../store/lessonStore';
```

2. Inside component, just below `const module = MODULES.find(...)`:
```typescript
const startLesson = useLessonStore((s) => s.startLesson);
```

3. Replace the `<TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>` with:
```typescript
<TouchableOpacity
  style={styles.ctaBtn}
  activeOpacity={0.85}
  onPress={async () => {
    await startLesson(module.id);
    navigation.navigate('PreListen', { moduleId: module.id });
  }}
>
```

### Task 9: Create placeholder lesson screen files
**Type:** setup
**Files modified:** 6 new files in `src/screens/Lesson/`
**Blocking:** yes (without these, ModulesNavigator won't compile)

Create directory `/Users/reinebadejoko/Desktop/app/melodia-app/src/screens/Lesson/` and add 6 files. Each is a placeholder so TypeScript can resolve imports — Plans 03-05 will fill them in. Each file uses this template (rename per screen):

```typescript
import React from 'react';
import { View, Text } from 'react-native';

export function PreListenScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#111125', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff' }}>PreListenScreen</Text>
    </View>
  );
}
```

Files to create with matching exports:
- `PreListenScreen.tsx` exports `PreListenScreen`
- `ListenScreen.tsx` exports `ListenScreen`
- `QuizScreen.tsx` exports `QuizScreen`
- `QuizResultsScreen.tsx` exports `QuizResultsScreen`
- `ReadingScreen.tsx` exports `ReadingScreen`
- `LessonCompleteScreen.tsx` exports `LessonCompleteScreen`

### Task 10: Fix dangling Inter font references
**Type:** fix
**Files modified:** `src/components/Button.tsx`, `src/components/QuizOption.tsx`
**Blocking:** no

**Background:** Inter fonts are NOT loaded in `App.tsx`. Both `Button.tsx` and `QuizOption.tsx` reference `fontFamily: 'Inter_500Medium'` / `'Inter_400Regular'`, causing silent fallback to system font.

In `src/components/Button.tsx`: find every `fontFamily: 'Inter_500Medium'` and replace with `fontFamily: 'BeVietnamPro_500Medium'`. Do the same for `Inter_400Regular` → `BeVietnamPro_400Regular` and `Inter_600SemiBold` → `BeVietnamPro_600SemiBold` (if present).

In `src/components/QuizOption.tsx`: find every `fontFamily: 'Inter_*'` reference and convert to its `BeVietnamPro_*` equivalent at the same weight.

If either file references `Inter_700Bold`, switch to `PlusJakartaSans_700Bold` (heading weight in this codebase).

Sanity-check by grepping after edits:
```bash
grep -rn "Inter_" /Users/reinebadejoko/Desktop/app/melodia-app/src
```
Expected output: empty.

### Task 11: Load lesson store + resume routing in RootNavigator
**Type:** feature
**Files modified:** `src/navigation/RootNavigator.tsx`
**Blocking:** no

Open `/Users/reinebadejoko/Desktop/app/melodia-app/src/navigation/RootNavigator.tsx`. If `loadLessonState` is not already called via App.tsx Task 6, ensure it's called once on mount. The simplest safe pattern: rely on Task 6 — no edit needed here unless `App.tsx` does not have an effect to extend, in which case add the same `useEffect` block in RootNavigator.

**No code change is required if Task 6 covers it.** Document this and move on.

## Verification

1. Run `npx tsc --noEmit` from project root — must complete with zero errors.
2. Run `grep -rn "Inter_" /Users/reinebadejoko/Desktop/app/melodia-app/src` — expected empty.
3. Run `npx expo start --clear` and open in Expo Go. App must launch without redbox.
4. Navigate Modules tab → tap Module 1 → tap "Start Lesson" — should navigate to PreListen placeholder screen and the bottom tab bar should be hidden.
5. Force-quit the app while on a lesson screen and relaunch — `useLessonStore.getState().activeLesson` should be non-null (verify via React DevTools or temporary console log).
6. Open `/Users/reinebadejoko/Desktop/app/melodia-app/app.json` and confirm `expo.plugins` contains the `expo-notifications` entry and `ios.infoPlist.LSApplicationQueriesSchemes` contains `"spotify"` and `"vnd.youtube"`.

## Requirements Coverage
- NAV-01 (navigator wires all 6 lesson screens)
- NAV-02 (Start Lesson button enters lesson flow)
- NAV-03 (back gesture disabled on lesson screens via `gestureEnabled: false`)
- Foundational support for LISTEN-03/04 (notification scheduling), LISTEN-02 (deep links), COMPLETE-03 (lesson store + progress store coordination)
