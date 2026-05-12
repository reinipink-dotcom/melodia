# Phase 4: Lesson Flow — Research

**Generated:** 2026-05-12
**Phase:** 04-lesson-flow
**Status:** Ready for planning

---

## Standard Stack

| Area | Package / API | Status |
|------|--------------|--------|
| Local notifications (timer) | `expo-notifications` | NOT YET INSTALLED — needs `npx expo install expo-notifications` |
| Deep linking to streaming apps | `expo-linking` (already installed ~8.0.12) | Ready |
| Tappable inline text | React Native `Text` + `TouchableOpacity` inline | No new package needed |
| Navigator structure | Extend existing `ModulesNavigator` (Stack) | No new package needed |
| Lesson state persistence | New `lessonStore.ts` (Zustand + AsyncStorage) | Same pattern as `progressStore.ts` |
| Animated countdown timer | React Native `Animated` API | Already in use — consistent with codebase |
| Circular timer ring | React Native `Animated` rotation mask (no SVG) | Animated API only |

**No new packages required beyond `expo-notifications`.** The UI-SPEC confirms this explicitly.

---

## Implementation Patterns

### expo-notifications

#### Installation
```bash
npx expo install expo-notifications
```

After install, `app.json` must be updated to add the plugin:
```json
{
  "expo": {
    "plugins": [
      "expo-font",
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#FF6B4A",
          "sounds": []
        }
      ]
    ]
  }
}
```

#### iOS Permission Request
Must request permissions before scheduling. Call this once — best placed in ListenScreen when user taps "I'm listening":

```typescript
import * as Notifications from 'expo-notifications';

async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
```

On iOS, `requestPermissionsAsync()` shows the system dialog once. If denied, never shows again — no second chance. The permission dialog timing matters: prompt at the moment of value (when user taps "I'm listening"), not before.

#### Scheduling a Local Notification with Delay
```typescript
async function scheduleTimerNotification(
  durationSeconds: number,
  songTitle: string
): Promise<string> {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to quiz! 🎵",
      body: `You've been listening to "${songTitle}". Ready to test what you learned?`,
      sound: true,
      data: { screen: 'ListenScreen' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: durationSeconds,
      repeats: false,
    },
  });
  return notificationId; // Save this to lessonStore for cancellation
}
```

**Expo SDK 54 note:** The `trigger` type field is required as of SDK 52+. Use `Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL` (not the older object-literal form). Omitting `type` causes a TypeScript error and runtime crash.

#### Cancelling a Pending Notification (for "I need more time")
```typescript
async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Reschedule for +2 minutes:
async function rescheduleNotification(
  oldId: string,
  songTitle: string
): Promise<string> {
  await cancelNotification(oldId);
  return scheduleTimerNotification(120, songTitle); // 2 more minutes
}
```

#### Handling Notification Tap (Navigate to ListenScreen)
Set up a notification response handler in `App.tsx` (at the root, not inside a screen):

```typescript
import * as Notifications from 'expo-notifications';
import { useNavigationContainerRef } from '@react-navigation/native';

// In App.tsx, inside the component:
const navigationRef = useNavigationContainerRef();

useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      if (data?.screen === 'ListenScreen') {
        // Navigate to MainTabs → Modules tab
        // The lessonStore will have the active module ID — ListenScreen reads it on mount
        navigationRef.navigate('MainTabs', { screen: 'Modules' });
      }
    }
  );
  return () => subscription.remove();
}, []);
```

**Critical:** The `NavigationContainer` must receive `ref={navigationRef}` for this to work. Deep link into a specific Lesson screen from a notification is complex — the simpler approach (per D-07 decision) is to navigate to the Modules tab and let ListenScreen resume from persisted lessonStore state.

**Alternative approach (simpler for Phase 4):** Set the notification handler at app level to just show the notification banner while in-foreground too, and let the user tap the CTA inside the app:

```typescript
// In App.tsx, before component:
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

#### iOS Simulator Limitation
Local notifications do NOT fire in iOS Simulator in all cases. Test on a physical device via Expo Go for notification verification.

#### Expo SDK 54 / New Architecture Gotcha
With `newArchEnabled: true` (this app's config), `expo-notifications` SDK 54 is compatible but requires the plugin entry in `app.json`. Without the plugin entry, EAS builds will miss the native notification entitlement on iOS.

---

### Deep Linking

#### URL Formats by Platform

| Platform | `onboardingStore.platform` value | Deep Link URL Format |
|----------|----------------------------------|----------------------|
| Spotify | `'spotify'` | `spotify:track:{trackId}` (URI scheme) — falls back to `https://open.spotify.com/search/{encoded_title}%20{encoded_artist}` |
| Apple Music | `'apple-music'` | `music://` scheme is unreliable; use `https://music.apple.com/search?term={encoded_title}` |
| YouTube Music | `'youtube-music'` | No reliable deep link to specific track; use `https://music.youtube.com/search?q={encoded_title}` |
| YouTube | `'youtube'` | `vnd.youtube://results?search_query={encoded_query}` — falls back to `https://www.youtube.com/results?search_query={encoded_query}` |

**Note on Spotify:** `spotify:track:{trackId}` is the gold standard and opens the exact track. This requires a `spotifyId` field on the `Song` type. For Phase 4, modules 1–3 need `spotifyId` added to their `song` objects. If `spotifyId` is missing, fall back to the search URL.

**Note on Apple Music:** The `music://` URI scheme has spotty cross-device support. The HTTPS link to Apple Music search is more reliable and opens the app via universal link on iOS.

#### Implementation Pattern

```typescript
import * as Linking from 'expo-linking';
import { Platform as RNPlatform } from 'react-native';

type StreamingPlatform = 'spotify' | 'apple-music' | 'youtube-music' | 'youtube';

function getStreamingUrl(
  platform: StreamingPlatform,
  song: { title: string; artist: string; spotifyId?: string }
): string {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);

  switch (platform) {
    case 'spotify':
      if (song.spotifyId) return `spotify:track:${song.spotifyId}`;
      return `https://open.spotify.com/search/${query}`;
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

async function openStreaming(
  platform: StreamingPlatform | null,
  song: { title: string; artist: string; spotifyId?: string }
): Promise<void> {
  const resolvedPlatform = platform ?? 'spotify';
  const url = getStreamingUrl(resolvedPlatform, song);
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    // Fallback: open web search if URI scheme not available (app not installed)
    const webFallback = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
    await Linking.openURL(webFallback);
  }
}
```

#### Graceful Fallback Behavior
`Linking.canOpenURL()` returns `false` when the native app is not installed (e.g., `spotify:` scheme on a device without Spotify). The pattern above always falls back to a web URL. On iOS, HTTPS links to Spotify/Apple Music open the native app via Universal Links if installed, so the web fallback is usually fine.

**iOS note:** `canOpenURL` requires the URL scheme to be registered in `app.json` info.plist `LSApplicationQueriesSchemes` for `spotify:` and `vnd.youtube:` schemes. Add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["spotify", "vnd.youtube"]
      }
    }
  }
}
```
Without this, `canOpenURL('spotify:...')` always returns `false` on iOS (no permission to query the scheme).

#### Song Type Extension Needed
The current `Song` type in `modules.ts` is:
```typescript
export type Song = {
  title: string;
  artist: string;
  durationSeconds: number;
};
```

Phase 4 needs to add `spotifyId?: string` to support exact-track Spotify deep links for modules 1–3:
```typescript
export type Song = {
  title: string;
  artist: string;
  durationSeconds: number;
  spotifyId?: string;  // ADD: for spotify:track:{id} deep links
};
```

---

### Tappable Text

#### Problem
React Native has no built-in "inline tappable word" component. The challenge is rendering a passage of mixed English + tappable Spanish words as a single flowing paragraph without layout breaks.

#### Recommended Pattern: Nested Text with TouchableOpacity (no WebView)
The UI-SPEC specifies: tokens pre-authored as `{ text: string, isSpanish: boolean, english?: string }[]`. The render pattern:

```typescript
// ReadingPassageToken type (add to modules.ts):
export type ReadingPassageToken = {
  text: string;
  isSpanish: boolean;
  english?: string;    // required when isSpanish is true
  phonetic?: string;   // optional
};

// Rendering (simplified):
function ReadingPassage({ tokens }: { tokens: ReadingPassageToken[] }) {
  const [activeToken, setActiveToken] = useState<ReadingPassageToken | null>(null);

  return (
    <>
      <Text style={styles.passage}>
        {tokens.map((token, i) =>
          token.isSpanish ? (
            <Text
              key={i}
              onPress={() => setActiveToken(token)}
              style={styles.spanishWord}
            >
              {token.text}
            </Text>
          ) : (
            <Text key={i} style={styles.englishWord}>{token.text}</Text>
          )
        )}
      </Text>

      {/* Tooltip modal */}
      {activeToken && (
        <Modal transparent animationType="fade" onRequestClose={() => setActiveToken(null)}>
          <TouchableWithoutFeedback onPress={() => setActiveToken(null)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipSpanish}>{activeToken.text}</Text>
                  <Text style={styles.tooltipEnglish}>{activeToken.english}</Text>
                  {activeToken.phonetic && (
                    <Text style={styles.tooltipPhonetic}>{activeToken.phonetic}</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}
```

#### Why Nested `<Text>` with `onPress` (not `<TouchableOpacity>`)
`<TouchableOpacity>` breaks inline text flow — it renders as a block. For inline tappable words, `<Text onPress={...}>` is the correct React Native pattern. This maintains natural text wrapping.

The tooltip uses a centered `<Modal>` (not anchored to word position) per the UI-SPEC — this avoids the complex layout math of positioning a tooltip near a word at an arbitrary position in a scrollable view.

#### Key: Spaces in Tokens
The tokenization must include spaces. Either:
- Each token's `text` value includes trailing space: `{ text: "Shakira ", isSpanish: false }`, or
- Render a separator `" "` between tokens.

Recommended: include space in `text` field for non-Spanish tokens, and NOT in Spanish tokens (so the styled chip doesn't have trailing-space styling applied). The planner/content author must follow this convention when writing tokenized passages.

#### Performance
For 100–200 word passages, this is trivially fast. No virtualization needed — `FlatList` is overkill. A single `<Text>` parent with up to 200 child `<Text>` nodes is within React Native's comfortable render range.

---

### Navigator Structure

#### Decision: Extend ModulesNavigator Stack (Not a Separate Navigator Root)

The UI-SPEC navigation contract specifies:
```
ModulesNavigator (Stack)
  ModulesList
  ModuleDetail → "Start Lesson" → LessonNavigator

LessonNavigator (Stack, headerShown: false)
  PreListen
  Listen
  Quiz
  QuizResults
  Reading
  LessonComplete → pop to root (MainTabs)
```

**Recommended implementation:** Add lesson screens directly to `ModulesNavigator`'s `ParamList` and `Stack.Navigator`, NOT as a nested navigator. A nested navigator adds complexity with no benefit at this scale.

```typescript
// ModulesNavigator.tsx (updated)
export type ModulesStackParamList = {
  ModulesList: undefined;
  ModuleDetail: { moduleId: number };
  // Lesson flow (Phase 4):
  PreListen: { moduleId: number };
  Listen: { moduleId: number };
  Quiz: { moduleId: number };
  QuizResults: { moduleId: number; score: number; total: number; xpEarned: number };
  Reading: { moduleId: number; xpEarned: number };
  LessonComplete: { moduleId: number; xpEarned: number };
};
```

#### Hiding the Tab Bar During Lesson
The `@react-navigation/bottom-tabs` tab bar is shown by any screen inside the Modules tab by default. To hide it for lesson screens, use the `tabBarStyle` option on individual stack screens:

```typescript
// In ModulesNavigator — lesson screens:
<Stack.Screen
  name="PreListen"
  component={PreListenScreen}
  options={{ tabBarStyle: { display: 'none' } }}  // <-- hides tab bar
/>
```

**Important:** This option is read by the bottom tab navigator from the focused screen's options. It works because React Navigation propagates screen options upward through the navigator hierarchy. This is the standard pattern — no `tabBarVisible` hack needed (that was the old API; it was removed).

#### Disabling Back Gesture
Per the UI-SPEC and CONTEXT.md, back gesture must be disabled on Listen, Quiz, QuizResults, Reading, LessonComplete:

```typescript
<Stack.Screen
  name="Listen"
  component={ListenScreen}
  options={{ gestureEnabled: false, tabBarStyle: { display: 'none' } }}
/>
```

`gestureEnabled: false` disables the iOS swipe-back gesture. The custom confirm dialog (Alert.alert) handles intentional exits.

**Android back button:** The hardware back button on Android must also be intercepted. Use `useEffect` + `BackHandler` in each restricted screen:

```typescript
import { BackHandler } from 'react-native';

useEffect(() => {
  const handler = BackHandler.addEventListener('hardwareBackPress', () => {
    showExitConfirmDialog();
    return true; // true = event handled, suppress default behavior
  });
  return () => handler.remove();
}, []);
```

#### Navigating Back to MainTabs from LessonComplete
```typescript
// "Continue to Modules"
navigation.navigate('MainTabs', { screen: 'Modules' });

// "Go to Home"
navigation.navigate('MainTabs', { screen: 'Home' });
```

This works because `MainTabs` is defined in `RootStackParamList` and `navigation.navigate` can cross navigator boundaries. However, the TypeScript types need to accommodate cross-navigator navigation. The practical approach:

```typescript
// In lesson screens, use the root navigation prop type or cast:
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// Inside component:
const rootNav = useNavigation<StackNavigationProp<RootStackParamList>>();
rootNav.navigate('MainTabs');
```

---

### Lesson State Persistence

#### Decision: Create a Separate `lessonStore.ts` (Do NOT extend `progressStore.ts`)

**Reasoning:**
- `progressStore.ts` tracks permanent learning history. Lesson state is transient — it exists only during an active lesson and is cleared on completion or abandonment.
- Mixing transient and permanent state into one store creates a messy reset pattern.
- Follows the single-responsibility pattern already established (two stores for two concerns).

#### Shape (per D-10 in CONTEXT.md)
```typescript
// src/store/lessonStore.ts

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LessonPhase = 'prelisten' | 'listening' | 'quiz' | 'reading' | 'complete';

interface LessonState {
  // Active lesson — null when no lesson in progress
  activeLesson: {
    moduleId: number;
    phase: LessonPhase;
    notificationId: string | null;
    startedAt: string;       // ISO date string
  } | null;

  startLesson: (moduleId: number) => Promise<void>;
  updatePhase: (phase: LessonPhase) => Promise<void>;
  setNotificationId: (id: string) => Promise<void>;
  completeLesson: () => Promise<void>;
  loadLessonState: () => Promise<void>;
}

const STORAGE_KEY = '@melodia_lesson';

export const useLessonStore = create<LessonState>((set, get) => ({
  activeLesson: null,

  startLesson: async (moduleId) => {
    const lesson = {
      moduleId,
      phase: 'prelisten' as LessonPhase,
      notificationId: null,
      startedAt: new Date().toISOString(),
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

#### Where to Call `loadLessonState()`
Same place as `loadOnboardingState()` — in `App.tsx` or `RootNavigator.tsx` on mount. Or lazily in `ModulesScreen` if opening lessons is always entry point.

#### Resume Logic
When user opens the app after a kill, `RootNavigator` or `ModulesScreen` checks `lessonStore.activeLesson`. If it exists, route to `ListenScreen` with the saved `moduleId` (per D-09). The ListenScreen checks the phase and shows "Ready when you are" state.

---

### Animated Timer

#### Circular Progress Ring (No SVG — Pure Animated API)

The rotation-mask approach: two half-circle views, one rotates to fill the arc. This is the standard React Native pattern for circular progress without SVG.

```typescript
// Circular timer: outer ring 144px (radius 72), stroke 4px
// Animated.Value: 1.0 (full) → 0.0 (empty) over durationSeconds

const progress = useRef(new Animated.Value(1)).current;
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
const [isRunning, setIsRunning] = useState(false);

function startTimer() {
  setIsRunning(true);

  // Visual animation
  Animated.timing(progress, {
    toValue: 0,
    duration: durationSeconds * 1000,
    easing: Easing.linear,
    useNativeDriver: false,  // IMPORTANT: false because we're driving layout
  }).start(({ finished }) => {
    if (finished) onTimerComplete();
  });

  // Text countdown (setInterval for MM:SS display)
  timerRef.current = setInterval(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerRef.current!);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}
```

**Note:** `useNativeDriver: false` is required when the animated value drives layout properties like `borderColor`, `backgroundColor`, or clipping. For the ring fill approach, it's needed. If using transform-only approach, `useNativeDriver: true` is possible but more complex to set up.

#### Simple SVG-Free Ring: Dashed Border Trick (Simpler for Phase 4)
An even simpler approach that avoids the rotation mask complexity: use a single `View` with a large `borderRadius` and animated `borderColor` — but this only works for full/empty states, not smooth progress.

**Better simple approach:** Use two nested views with overflow hidden:
```
<View style={ring_container}>           // 144×144, position relative
  <View style={ring_track} />            // full coral ring (borderWidth 4)
  <Animated.View style={ring_mask} />    // white overlay that rotates away
</View>
```

The most reliable cross-platform approach for Phase 4: use a simple linear `ProgressBar` component (already exists in the codebase) styled as the timer indicator, reserving the circular ring as a nice-to-have. The UI-SPEC specifies the circular ring, so implement it — but document the rotation mask approach carefully.

**Rotation mask implementation:**
```typescript
// The fill is achieved by rotating a "pie slice" mask
// Left half and right half independently animated

const leftDeg = progress.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: ['180deg', '180deg', '0deg'],
});
const rightDeg = progress.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: ['0deg', '180deg', '180deg'],
});
```

#### App Backgrounding
When user switches to Spotify, the timer animation pauses (React Native `Animated` pauses when app is backgrounded). The text countdown (`setInterval`) also fires less reliably in background.

**Approach for Phase 4:** Record `timerStartedAt` (Date.now()) when timer starts, store in `lessonStore`. On app foreground return (`AppState.addEventListener('change')`), recalculate `secondsLeft = durationSeconds - elapsed`. The notification fires independently (via `expo-notifications`) so the timer display is cosmetic — accuracy is not critical.

```typescript
import { AppState } from 'react-native';

useEffect(() => {
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active' && timerStartedAt) {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      const remaining = Math.max(0, durationSeconds - elapsed);
      setSecondsLeft(remaining);
      // Reset and restart the Animated value from remaining point
    }
  });
  return () => sub.remove();
}, [timerStartedAt]);
```

#### MM:SS Formatting
```typescript
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

---

## Data Schema Extensions

The `Module` type in `src/data/modules.ts` needs two new fields for Phase 4. The planner must include these in every task that touches `modules.ts`:

```typescript
// Add to ReadingPassageToken (new type):
export type ReadingPassageToken = {
  text: string;
  isSpanish: boolean;
  english?: string;
  phonetic?: string;
};

// New quiz question types:
export type QuizQuestion = {
  question: string;
  options: [string, string, string, string]; // Always exactly 4
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;  // Optional — not shown in Phase 4 UI but useful later
};

// Updated Module type (add two fields):
export type Module = {
  // ... existing fields ...
  quizQuestions?: QuizQuestion[];      // Phase 4: add for modules 1–3
  readingPassage?: ReadingPassageToken[]; // Phase 4: add for modules 1–3
};
```

`quizQuestions` and `readingPassage` are optional (`?`) so the TypeScript compiler doesn't complain about the 57 modules that won't have this data in Phase 4.

#### Song Type Extension (for Spotify deep links):
```typescript
export type Song = {
  title: string;
  artist: string;
  durationSeconds: number;
  spotifyId?: string;  // ADD for Phase 4
};
```

---

## Validation Architecture

### What TypeScript Catches Automatically
- Missing required props on `QuizOption`, `Button`, `MascotIcon`
- Incorrect route param shapes (if `ModulesStackParamList` is fully typed)
- `platform` values outside the `Platform` type union from `onboardingStore`
- `CEFRLevel` values outside the union (prevents bad `levelColor()` mapping)
- `QuizQuestion.correctIndex` outside `0 | 1 | 2 | 3` range

### Manual Testing Checklist (per screen)

**PreListenScreen**
- [ ] Vocabulary list renders 3–5 words with correct Spanish/English from `modules.ts`
- [ ] Concept explanation text matches `module.conceptDescription`
- [ ] "I'm ready to listen" navigates to ListenScreen with `moduleId` param

**ListenScreen**
- [ ] Platform icon and label reflects `onboardingStore.platform`
- [ ] "Listen on [Platform]" button opens correct URL in native app
- [ ] If Spotify not installed, falls back to web URL (test by removing app temporarily)
- [ ] Timer starts on "I'm listening" tap
- [ ] Timer counts down and ring depletes
- [ ] "I'm done listening" appears after timer starts
- [ ] Timer auto-completes at 0:00 — CTA changes to "Continue to Quiz"
- [ ] Haptic fires on timer completion
- [ ] Notification permission prompt appears (iOS, first time)
- [ ] Notification fires after `durationSeconds` (test with short duration like 10s)
- [ ] Notification tap navigates back to app on ListenScreen
- [ ] Exit confirm dialog appears on back press — "Exit" abandons, "Stay" dismisses
- [ ] Tab bar is hidden during ListenScreen

**QuizScreen**
- [ ] 5 questions load from `module.quizQuestions`
- [ ] "Check Answer" is disabled until option selected
- [ ] Correct answer shows teal state, wrong answer shows coral incorrect + correct teal revealed
- [ ] Haptic fires correctly (success/error)
- [ ] Progress label shows "Question N of 5"
- [ ] Progress bar advances each question
- [ ] Last question CTA says "See My Results"
- [ ] Cannot change answer after Check Answer tap

**QuizResultsScreen**
- [ ] Score fraction correct
- [ ] XP matches formula (5/5=100%, 4/5=80%, 3/5=60%, 0-2/5=40% of `module.xpReward`)
- [ ] Mascot bounces
- [ ] Reaction message correct for score
- [ ] "Continue to Reading" navigates with `xpEarned` param

**ReadingScreen**
- [ ] Passage renders with English/Spanish token distinction visible
- [ ] Tapping Spanish word shows tooltip with English translation
- [ ] Tapping outside tooltip dismisses it
- [ ] "Continue" navigates to LessonComplete with `xpEarned` param

**LessonCompleteScreen**
- [ ] `completeModule(moduleId, xpEarned)` called on mount — not on button tap
- [ ] If already completed (re-visit), guard prevents double-XP
- [ ] XP number matches `xpEarned` passed via nav param
- [ ] Next module preview shows correct `module.id + 1` title
- [ ] "Add to Playlist" tap shows toast "Playlist sync coming soon!"
- [ ] "Continue to Modules" navigates to MainTabs Modules tab
- [ ] "Go to Home" navigates to MainTabs Home tab
- [ ] Tab bar visible again after navigation

### End-to-End Flow Test (Module 1)
Walk through PreListen → Listen (tap "I'm done listening" to skip) → Quiz (answer all 5) → Results → Reading (tap 2+ Spanish words) → LessonComplete → verify HomeScreen streak/XP updated.

---

## Risks & Gotchas

### 1. `expo-notifications` Not Yet Installed
The package is absent from `package.json`. **Must run `npx expo install expo-notifications` AND add the plugin to `app.json` before any notification code compiles.** This is a blocker for ListenScreen.

### 2. iOS Notification Permission is One-Shot
If the user denies notification permission when first prompted, they can only re-enable in iOS Settings > Notifications. The UX must gracefully handle the `denied` case — timer still works visually in-app, notification just won't fire. Show a subtle note: "Enable notifications to be reminded when your song ends."

### 3. Tab Bar Hiding via Stack Screen Options
The pattern `options={{ tabBarStyle: { display: 'none' } }}` propagates upward through React Navigation's hierarchy. This requires that lesson screens are inside `ModulesNavigator` which is inside the `Tab.Screen name="Modules"` — the current structure already satisfies this. If lesson screens were in a separate root-level navigator, this wouldn't work.

### 4. `useNativeDriver: false` for Timer Ring
The circular progress ring cannot use `useNativeDriver: true` if it drives color or layout (only transform/opacity support native driver). This means the animation runs on the JS thread. For a slow-moving countdown animation (over 3+ minutes), this is fine — no jank risk.

### 5. Animated Pauses in Background
`Animated.timing` pauses when app goes to background. The `expo-notifications` timer fires independently (OS-level), so the notification timing is correct. Only the visual ring/countdown is stale after returning from Spotify. Implement `AppState` recalculation (described above) or accept minor visual inaccuracy as acceptable for v1.

### 6. `navigation.navigate('MainTabs')` Type Safety
Navigating from a deeply nested lesson screen to `MainTabs` (which is in `RootStackParamList`) requires either `useNavigation<StackNavigationProp<RootStackParamList>>()` or using `navigation.getParent()`. The cleanest approach: use `useNavigation()` with the root type cast. This will have TypeScript complaints unless `RootStackParamList` is imported. Document this type-casting pattern in the implementation tasks.

### 7. `QuizOption.tsx` Uses `Inter_400Regular` Font
The existing `QuizOption` component references `fontFamily: 'Inter_400Regular'` in its `styles.label`. Inter fonts are installed but **not loaded in `App.tsx`**. This means quiz option text falls back to system font. For Phase 4, either: (a) update `QuizOption` to use `BeVietnamPro_400Regular` (consistent with codebase), or (b) load Inter in `App.tsx`. **Recommendation: update `QuizOption` to use `BeVietnamPro_400Regular` as a fix during Phase 4 implementation.**

Similarly, `Button.tsx` references `Inter_500Medium`. Same fix needed.

### 8. `ModulesStackParamList` Must Be Exported for Cross-File Use
Lesson screens need to import `ModulesStackParamList` to type their `navigation` and `route` props. It's already exported in `ModulesNavigator.tsx`. Lesson screens follow the exact same import pattern as `ModuleDetailScreen.tsx`.

### 9. Reading Passage Token Authoring Convention
The tokenized passage format requires careful authoring. Spanish word tokens must NOT include surrounding spaces (so the chip styling looks right). English text tokens must include surrounding spaces. This is a content authoring constraint — the planner must document it clearly when requesting content generation for modules 1–3.

### 10. Expo SDK 54 + New Architecture
With `newArchEnabled: true`, some older Expo packages have known issues. `expo-notifications` SDK 54 is documented as compatible with New Architecture. No known blockers, but test on physical device before marking notification tasks complete.

---

## Summary Reference Card

| Decision | Approach | File |
|----------|----------|------|
| Lesson screens location | `src/screens/Lesson/` | New directory |
| Navigator | Extend `ModulesNavigator` stack | `src/navigation/ModulesNavigator.tsx` |
| Lesson state | New `lessonStore.ts` | `src/store/lessonStore.ts` |
| Timer animation | `Animated.timing` + `setInterval` | ListenScreen |
| Timer ring | Rotation mask, `useNativeDriver: false` | ListenScreen |
| Deep links | `expo-linking` + platform URL map | ListenScreen |
| Tappable text | `<Text onPress>` inline + Modal tooltip | ReadingScreen |
| Notification | `expo-notifications` local (install first) | ListenScreen + App.tsx |
| XP formula | 100/80/60/40% of `module.xpReward` | QuizResultsScreen |
| Progress update | `completeModule()` on LessonComplete mount | LessonCompleteScreen |
| Back gesture block | `gestureEnabled: false` + `BackHandler` | All lesson screens |
| Tab bar hide | `options={{ tabBarStyle: { display: 'none' } }}` | All lesson stack screens |
| Font fix | Replace `Inter_*` with `BeVietnamPro_*` | `QuizOption.tsx`, `Button.tsx` |
