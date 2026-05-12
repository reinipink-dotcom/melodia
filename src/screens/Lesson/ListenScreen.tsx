import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler,
  Animated,
  Easing,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
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
            if (intervalRef.current) clearInterval(intervalRef.current);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // App foreground sync — recalc seconds from timerStartedAt when returning from streaming app
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson?.timerStartedAt, phase]);

  if (!module) return null;

  async function startListening() {
    const granted = await ensureNotificationPermission();
    const id = granted
      ? await scheduleTimerNotification(durationSeconds, module!.song.title, moduleId)
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
    // Cancel current notification, reschedule +120 seconds, reopen streaming app
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
    if (intervalRef.current) clearInterval(intervalRef.current);
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
            <Ionicons name={platformIconName(platform) as React.ComponentProps<typeof Ionicons>['name']} size={18} color={Colors.white} />
            <Text style={styles.platformText}>Listen on {platformLabel(platform)}</Text>
          </TouchableOpacity>
        </View>

        {/* Timer section */}
        <View style={styles.timerSection}>
          <Text style={styles.sectionLabel}>TIME LISTENING</Text>
          <Text style={styles.timerDisplay}>{formatTime(secondsLeft)}</Text>
          {/* Linear progress bar — reliable across platforms */}
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
  songArtist: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.mist,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  platformBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24,
    alignSelf: 'stretch',
  },
  platformText: { ...Typography.bodyMedium, fontSize: 14, color: Colors.white },
  timerSection: { alignItems: 'center', marginBottom: Spacing.xl },
  sectionLabel: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.mist,
    marginBottom: Spacing.sm,
  },
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
  skipLink: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.mist,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surfaceHighest,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  chipText: { ...Typography.caption, fontSize: 13, color: Colors.white },
});
