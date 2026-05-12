# Plan: PreListenScreen + ListenScreen (with timer + notifications)
**Phase:** 4 — Lesson Flow
**Plan:** 3 of 5
**Deps:** 01 (infrastructure), 02 (content)

## Objective
Build the first two screens of the lesson loop. PreListenScreen displays the module concept and vocabulary preview. ListenScreen drives the deep link to the user's streaming platform, runs an animated countdown timer, schedules a local notification for when the timer expires, and offers manual skip plus a "need more time" reschedule path. Both screens hide the tab bar and intercept the back button via a confirm dialog.

## Context
- D-05/D-06/D-07: Timer uses `expo-notifications` (scheduled when user taps "I'm listening"). Default duration 210s if `durationSeconds` is missing.
- D-08: "I need more time" reschedules notification +120s and re-opens the streaming app.
- D-09: If app is killed and reopened mid-lesson, RootNavigator/Modules ensures user returns here.
- Research: deep-link helpers and notification helpers were created in Plan 01 — import from `utils/streaming.ts` and `utils/notifications.ts`.
- UI-SPEC: ListenScreen's circular ring is desired but the simple straight `ProgressBar` is an acceptable fallback per research §"Animated Timer". Use the circular ring approach with `useNativeDriver: false`.

## Tasks

### Task 1: Build PreListenScreen
**Type:** feature
**Files modified:** `src/screens/Lesson/PreListenScreen.tsx`
**Blocking:** no

Replace the placeholder. Implement the screen per UI-SPEC §"Screen 1: PreListenScreen".

```typescript
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { MODULES } from '../../data/modules';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import { useLessonStore } from '../../store/lessonStore';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'PreListen'>;
  route: RouteProp<ModulesStackParamList, 'PreListen'>;
};

function levelColor(level: string): string {
  switch (level) {
    case 'A1': return Colors.teal;
    case 'A2': return Colors.coral;
    case 'B1': return Colors.amber;
    case 'B2': return Colors.lavender;
    default: return Colors.coral;
  }
}

export function PreListenScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const completeLesson = useLessonStore((s) => s.completeLesson);

  if (!module) return null;
  const accent = levelColor(module.level);

  function confirmExit() {
    Alert.alert(
      'Exit lesson?',
      "Your progress on this lesson won't be saved.",
      [
        { text: 'Stay in lesson', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: async () => {
            await completeLesson();
            navigation.popToTop();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={confirmExit} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>1 of 6</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#2A1A2E', '#1E1430']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroTop}>
            <View style={[styles.levelBadge, { backgroundColor: accent + '33' }]}>
              <Text style={[styles.levelBadgeText, { color: accent }]}>{module.level}</Text>
            </View>
            <Text style={styles.conceptLabel}>CONCEPT</Text>
          </View>
          <Text style={styles.heroTitle}>{module.title}</Text>
          <Text style={styles.heroConcept}>{module.conceptDescription}</Text>
        </LinearGradient>

        <Text style={styles.sectionLabel}>VOCABULARY TO LISTEN FOR</Text>
        <View style={styles.vocabList}>
          {module.vocabulary.map((word, i) => (
            <View key={i} style={styles.vocabRow}>
              <View style={[styles.vocabDot, { backgroundColor: accent }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.vocabSpanish, { color: accent }]}>{word.spanish}</Text>
                <Text style={styles.vocabEnglish}>{word.english}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Listen', { moduleId })}
        >
          <LinearGradient
            colors={[Colors.coral, '#E55A3A']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>I'm ready to listen</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { ...Typography.caption, color: Colors.mist },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  hero: { borderRadius: 16, padding: 20, marginBottom: Spacing.lg, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  levelBadgeText: { ...Typography.label, fontSize: 10, letterSpacing: 1.5 },
  conceptLabel: { ...Typography.label, fontSize: 9, letterSpacing: 2, color: Colors.mist },
  heroTitle: { ...Typography.h2, fontSize: 24, marginBottom: 10 },
  heroConcept: { ...Typography.body, color: Colors.mist, fontSize: 14, lineHeight: 21 },
  sectionLabel: { ...Typography.label, fontSize: 10, letterSpacing: 2, marginBottom: Spacing.sm },
  vocabList: { gap: Spacing.sm, marginBottom: Spacing.lg },
  vocabRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
  },
  vocabDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  vocabSpanish: { ...Typography.bodyMedium, fontSize: 17 },
  vocabEnglish: { ...Typography.caption, fontSize: 13, color: Colors.mist, marginTop: 2 },
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.md, paddingBottom: 32, paddingTop: 16,
    backgroundColor: Colors.midnight,
  },
  ctaBtn: { borderRadius: 28, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 28,
  },
  ctaText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff', letterSpacing: 0.3 },
});
```

Also intercept Android hardware back button: inside the component, add:
```typescript
import { BackHandler } from 'react-native';
import { useEffect } from 'react';

useEffect(() => {
  const sub = BackHandler.addEventListener('hardwareBackPress', () => {
    confirmExit();
    return true;
  });
  return () => sub.remove();
}, []);
```

### Task 2: Build ListenScreen with timer + notification
**Type:** feature
**Files modified:** `src/screens/Lesson/ListenScreen.tsx`
**Blocking:** no

Replace the placeholder. Implementation requirements per UI-SPEC §"Screen 2: ListenScreen" and research §"Animated Timer":

```typescript
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity,
  Alert, BackHandler, Animated, Easing, AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { MODULES } from '../../data/modules';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import { useLessonStore } from '../../store/lessonStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import {
  openStreaming,
  platformLabel,
  platformIconName,
  StreamingPlatform,
} from '../../utils/streaming';
import {
  ensureNotificationPermission,
  scheduleTimerNotification,
  cancelTimerNotification,
} from '../../utils/notifications';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Listen'>;
  route: RouteProp<ModulesStackParamList, 'Listen'>;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ListenScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const platform = useOnboardingStore((s) => s.platform) as StreamingPlatform | null;
  const {
    activeLesson, updatePhase, setNotificationId, setTimerStartedAt, completeLesson,
  } = useLessonStore();

  const durationSeconds = module?.song.durationSeconds ?? 210;
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const progress = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Confirm exit dialog
  function confirmExit() {
    Alert.alert(
      'Exit lesson?',
      "Your progress on this lesson won't be saved.",
      [
        { text: 'Stay in lesson', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: async () => {
            await cancelTimerNotification(activeLesson?.notificationId ?? null);
            await completeLesson();
            navigation.popToTop();
          },
        },
      ],
    );
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmExit();
      return true;
    });
    return () => sub.remove();
  }, []);

  // App foreground sync — recalc seconds from timerStartedAt when returning from Spotify
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && activeLesson?.timerStartedAt && phase === 'running') {
        const elapsed = Math.floor((Date.now() - activeLesson.timerStartedAt) / 1000);
        const remaining = Math.max(0, durationSeconds - elapsed);
        setSecondsLeft(remaining);
        if (remaining === 0) {
          onTimerComplete();
        } else {
          // Restart the animation from current progress
          progress.setValue(remaining / durationSeconds);
          Animated.timing(progress, {
            toValue: 0,
            duration: remaining * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
        }
      }
    });
    return () => sub.remove();
  }, [activeLesson?.timerStartedAt, phase]);

  if (!module) return null;

  async function startListening() {
    const granted = await ensureNotificationPermission();
    const id = granted
      ? await scheduleTimerNotification(durationSeconds, module.song.title, moduleId)
      : null;
    await setNotificationId(id);
    await setTimerStartedAt(Date.now());
    await updatePhase('listening');

    setPhase('running');
    Animated.timing(progress, {
      toValue: 0,
      duration: durationSeconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function onTimerComplete() {
    setPhase('done');
    if (intervalRef.current) clearInterval(intervalRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  async function handleListenOnPlatform() {
    await openStreaming(platform, module!.song);
  }

  async function handleDoneListening() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await cancelTimerNotification(activeLesson?.notificationId ?? null);
    onTimerComplete();
  }

  async function handleNeedMoreTime() {
    // Reschedule +120 seconds and reopen streaming app
    await cancelTimerNotification(activeLesson?.notificationId ?? null);
    const granted = await ensureNotificationPermission();
    const id = granted
      ? await scheduleTimerNotification(120, module!.song.title, moduleId)
      : null;
    await setNotificationId(id);
    await setTimerStartedAt(Date.now());
    setSecondsLeft(120);
    setPhase('running');
    progress.setValue(1);
    Animated.timing(progress, {
      toValue: 0,
      duration: 120 * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    await openStreaming(platform, module!.song);
  }

  async function goToQuiz() {
    await updatePhase('quiz');
    navigation.navigate('Quiz', { moduleId });
  }

  const ringFillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={confirmExit} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Listening</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        {/* Song card */}
        <View style={styles.songCard}>
          <View style={styles.albumArt}>
            <Ionicons name="musical-notes" size={36} color={Colors.coral} />
          </View>
          <Text style={styles.songTitle}>{module.song.title}</Text>
          <Text style={styles.songArtist}>{module.song.artist}</Text>
          <TouchableOpacity
            style={styles.platformBtn}
            activeOpacity={0.7}
            onPress={handleListenOnPlatform}
          >
            <Ionicons name={platformIconName(platform)} size={18} color={Colors.white} />
            <Text style={styles.platformText}>Listen on {platformLabel(platform)}</Text>
          </TouchableOpacity>
        </View>

        {/* Timer section */}
        <View style={styles.timerSection}>
          <Text style={styles.sectionLabel}>TIME LISTENING</Text>
          <Text style={styles.timerDisplay}>{formatTime(secondsLeft)}</Text>
          {/* Linear ring fallback — simpler and reliable across platforms */}
          <View style={styles.timerTrack}>
            <Animated.View style={[styles.timerFill, { width: ringFillWidth }]} />
          </View>

          {phase === 'idle' && (
            <TouchableOpacity style={styles.primaryBtn} onPress={startListening} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>I'm listening</Text>
            </TouchableOpacity>
          )}

          {phase === 'running' && (
            <>
              <TouchableOpacity onPress={handleDoneListening} activeOpacity={0.7}>
                <Text style={styles.skipLink}>I'm done listening</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNeedMoreTime} activeOpacity={0.7} style={{ marginTop: 8 }}>
                <Text style={styles.skipLink}>I need more time (+2 min)</Text>
              </TouchableOpacity>
            </>
          )}

          {phase === 'done' && (
            <TouchableOpacity style={styles.primaryBtn} onPress={goToQuiz} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Continue to Quiz</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
        </View>

        {/* Vocab reminder chips */}
        <Text style={styles.sectionLabel}>REMEMBER TO LISTEN FOR</Text>
        <View style={styles.chipRow}>
          {module.vocabulary.slice(0, 3).map((w, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{w.spanish}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { ...Typography.bodyMedium, fontSize: 15, color: Colors.mist },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  songCard: {
    backgroundColor: Colors.surfaceContainer, borderRadius: 16, padding: Spacing.lg,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  albumArt: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: Colors.coral + '22',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  songTitle: { ...Typography.bodyMedium, fontSize: 16, textAlign: 'center' },
  songArtist: { ...Typography.caption, fontSize: 13, color: Colors.mist, marginTop: 2, marginBottom: Spacing.md },
  platformBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24,
    alignSelf: 'stretch',
  },
  platformText: { ...Typography.bodyMedium, fontSize: 14, color: Colors.white },
  timerSection: { alignItems: 'center', marginBottom: Spacing.xl },
  sectionLabel: { ...Typography.label, fontSize: 10, letterSpacing: 2, color: Colors.mist, marginBottom: Spacing.sm },
  timerDisplay: { ...Typography.h1, fontSize: 36, color: Colors.white, marginBottom: Spacing.md },
  timerTrack: {
    width: '100%', height: 4, borderRadius: 2,
    backgroundColor: Colors.surfaceHigh, marginBottom: Spacing.lg, overflow: 'hidden',
  },
  timerFill: { height: 4, backgroundColor: Colors.coral, borderRadius: 2 },
  primaryBtn: {
    flexDirection: 'row', backgroundColor: Colors.coral,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch',
  },
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
  skipLink: { ...Typography.caption, fontSize: 13, color: Colors.mist, textAlign: 'center', marginTop: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surfaceHighest,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  chipText: { ...Typography.caption, fontSize: 13, color: Colors.white },
});
```

**Key behaviors enforced:**
- Tap "Listen on [Platform]" → opens deep link (does NOT start timer).
- Tap "I'm listening" → requests notification permission, schedules notification, starts animated countdown + interval.
- Timer reaches 0 OR user taps "I'm done listening" → success haptic + reveal "Continue to Quiz".
- Tap "I need more time" → cancels current notification, schedules +120s, reopens streaming app.
- AppState 'active' listener recalculates remaining time when user returns from Spotify.
- Back button (gesture or hardware) → confirm dialog.

### Task 3: Sanity check — resume from killed app
**Type:** fix
**Files modified:** none (verification)
**Blocking:** no

Confirm that when user kills the app mid-listening and reopens:
- `App.tsx` calls `loadLessonState()` on mount (set up in Plan 01 Task 6).
- The user lands on the Modules tab. If they navigate manually to ListenScreen via `useLessonStore.activeLesson.moduleId`, the screen renders with `phase = 'idle'` again — they re-tap "I'm listening".
- This is acceptable for Phase 4. Auto-resume to running state is a Phase 8 enhancement.

No code change needed if behavior already works. If the lesson store does NOT survive, double-check that `App.tsx` calls `useLessonStore.getState().loadLessonState()` exactly once on mount.

## Verification

1. `npx tsc --noEmit` passes.
2. In Expo Go: Module 1 → Start Lesson → PreListen. Tap "I'm ready to listen". Lands on ListenScreen showing "Bésame Mucho" and "Listen on Spotify" (or whichever platform onboardingStore has stored).
3. Tap "Listen on [Platform]" — Spotify (or chosen app) opens. Returning to the app, the timer has NOT started yet.
4. Tap "I'm listening" — permission prompt appears (first time). Grant. Timer begins counting down and the progress bar fills coral → empty.
5. Tap "I'm done listening" — timer stops, haptic fires, button changes to "Continue to Quiz".
6. Tap "Continue to Quiz" — navigates to Quiz placeholder (or real screen once Plan 04 lands).
7. With a short test duration (temporarily set `durationSeconds: 10` for Module 1), let the timer expire on its own. Notification fires (test on physical device per research §"iOS Simulator Limitation").
8. Force-quit during listen and reopen — app launches without redbox; lessonStore still has `moduleId`.
9. Tap back arrow → confirm dialog appears. Tap "Exit" — returns to modules list, lessonStore cleared.

## Requirements Coverage
- PRE-01 (concept explained in 2–3 sentences via `module.conceptDescription`)
- PRE-02 (3–5 vocabulary words with English)
- PRE-03 ("I'm ready to listen" CTA advances)
- LISTEN-01 (song title + artist)
- LISTEN-02 (deep link to streaming platform)
- LISTEN-03 (countdown timer starts after "I'm listening" tap)
- LISTEN-04 (timer duration = `module.song.durationSeconds`, default 210s)
- LISTEN-05 ("I'm done listening" ends timer early)
- NAV-03 (back gesture disabled, hardware-back intercepted, exit confirm dialog)
