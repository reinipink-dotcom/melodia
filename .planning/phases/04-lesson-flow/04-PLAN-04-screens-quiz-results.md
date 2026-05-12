# Plan: QuizScreen + QuizResultsScreen
**Phase:** 4 — Lesson Flow
**Plan:** 4 of 5
**Deps:** 01 (infrastructure), 02 (content)

## Objective
Build the quiz and results screens. QuizScreen renders 5 multiple-choice questions from `module.quizQuestions`, uses the existing `QuizOption` component for the four answer states (default/selected/correct/incorrect), enforces sequential answering with no skipping, and fires haptics. QuizResultsScreen computes XP from score, displays the mascot reaction, and routes to ReadingScreen with `xpEarned` as a navigation param.

## Context
- Existing `QuizOption` component already supports the 4 states. Use it as-is (after Plan 01 Task 10's font fix).
- UI-SPEC quiz flow: idle → selected → revealed → next. "Check Answer" disabled until selection. Cannot change answer after check.
- XP formula (CONTEXT.md / UI-SPEC): 5/5 = 100%, 4/5 = 80%, 3/5 = 60%, 0-2/5 = 40% of `module.xpReward`. Rounded.
- Haptics: success on correct, error on incorrect.
- No back navigation from QuizResults (lesson is committed).

## Tasks

### Task 1: Build QuizScreen
**Type:** feature
**Files modified:** `src/screens/Lesson/QuizScreen.tsx`
**Blocking:** no

Replace the placeholder:

```typescript
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity,
  Alert, BackHandler,
} from 'react-native';
import { useEffect } from 'react';
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
import { QuizOption } from '../../components/QuizOption';
import { useLessonStore } from '../../store/lessonStore';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Quiz'>;
  route: RouteProp<ModulesStackParamList, 'Quiz'>;
};

export function QuizScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const questions = module?.quizQuestions ?? [];
  const completeLesson = useLessonStore((s) => s.completeLesson);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

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

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmExit();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!module || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={[Typography.body, { color: Colors.mist, padding: Spacing.md }]}>
          No quiz available for this module yet.
        </Text>
      </SafeAreaView>
    );
  }

  const question = questions[questionIndex];
  const total = questions.length;
  const isLast = questionIndex === total - 1;

  function checkAnswer() {
    if (selectedIndex === null) return;
    const isCorrect = selectedIndex === question.correctIndex;
    setRevealed(true);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  }

  function advance() {
    if (isLast) {
      const finalScore = correctCount + (selectedIndex === question.correctIndex ? 0 : 0);
      // correctCount already includes the just-answered question via setCorrectCount
      const xpEarned = computeXp(correctCount, total, module!.xpReward);
      navigation.replace('QuizResults', {
        moduleId,
        score: correctCount,
        total,
        xpEarned,
      });
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelectedIndex(null);
    setRevealed(false);
  }

  const progressPercent = ((questionIndex + (revealed ? 1 : 0)) / total) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={confirmExit} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.progressLabel}>Question {questionIndex + 1} of {total}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Q{questionIndex + 1}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.options}>
          {question.options.map((option, i) => {
            let state: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
            if (!revealed) {
              state = selectedIndex === i ? 'selected' : 'default';
            } else {
              if (i === question.correctIndex) state = 'correct';
              else if (i === selectedIndex) state = 'incorrect';
              else state = 'default';
            }
            return (
              <QuizOption
                key={i}
                label={option}
                state={state}
                onPress={() => {
                  if (revealed) return;
                  setSelectedIndex(i);
                }}
              />
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        {!revealed ? (
          <TouchableOpacity
            style={[styles.primaryBtn, selectedIndex === null && styles.primaryBtnDisabled]}
            activeOpacity={0.85}
            disabled={selectedIndex === null}
            onPress={checkAnswer}
          >
            <Text style={styles.primaryBtnText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={advance}
          >
            <Text style={styles.primaryBtnText}>{isLast ? 'See My Results' : 'Next Question'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function computeXp(correct: number, total: number, base: number): number {
  if (total === 0) return 0;
  if (correct === total) return base;
  const pct = correct / total;
  if (pct >= 0.8) return Math.round(base * 0.8);
  if (pct >= 0.6) return Math.round(base * 0.6);
  return Math.round(base * 0.4);
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  progressLabel: { ...Typography.caption, color: Colors.mist },
  progressTrack: {
    height: 4, backgroundColor: Colors.surfaceHigh, marginHorizontal: 0, overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: Colors.coral },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  questionCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16, padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  questionNumber: {
    ...Typography.label, fontSize: 11, letterSpacing: 2,
    color: Colors.mist, marginBottom: Spacing.sm,
  },
  questionText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 18, lineHeight: 26, color: Colors.white,
  },
  options: { gap: Spacing.sm },
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.md, paddingBottom: 32, paddingTop: 16,
    backgroundColor: Colors.midnight,
  },
  primaryBtn: {
    flexDirection: 'row', backgroundColor: Colors.coral,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: Colors.surfaceHigh },
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
});
```

**Important detail about correctCount + advance flow:** when `checkAnswer` is tapped on the LAST question, `setCorrectCount` is queued (React batches). At that moment, when we tap "See My Results", the state has settled and `correctCount` reflects the just-checked answer. The implementation uses `navigation.replace` to prevent back-nav into the quiz from Results.

**Verify QuizOption signature:** open `src/components/QuizOption.tsx` and confirm its props are roughly `{ label: string; state: 'default'|'selected'|'correct'|'incorrect'; onPress?: () => void }`. If the prop names differ, adapt the JSX above to match (do not change the component).

### Task 2: Build QuizResultsScreen
**Type:** feature
**Files modified:** `src/screens/Lesson/QuizResultsScreen.tsx`
**Blocking:** no

Replace the placeholder:

```typescript
import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import MascotIcon from '../../components/MascotIcon';
import { useLessonStore } from '../../store/lessonStore';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'QuizResults'>;
  route: RouteProp<ModulesStackParamList, 'QuizResults'>;
};

function reaction(score: number, total: number): string {
  if (score === total) return 'Perfecto!';
  if (score === 4) return 'Nice work!';
  if (score === 3) return 'Good effort!';
  return 'Keep going!';
}

export function QuizResultsScreen({ navigation, route }: Props) {
  const { moduleId, score, total, xpEarned } = route.params;
  const updatePhase = useLessonStore((s) => s.updatePhase);

  React.useEffect(() => {
    updatePhase('results');
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={{ flex: 1 }} />

        <View style={styles.mascotWrap}>
          <MascotIcon size={120} />
        </View>

        <Text style={styles.reactionText}>{reaction(score, total)}</Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.outOf}> out of </Text>
          <Text style={[styles.scoreNumber, { color: Colors.mist }]}>{total}</Text>
        </View>

        <View style={styles.xpCard}>
          <Ionicons name="star" size={20} color={Colors.amber} />
          <Text style={styles.xpLabel}>XP Earned</Text>
          <Text style={styles.xpNumber}>+{xpEarned}</Text>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.replace('Reading', { moduleId, xpEarned })}
        >
          <Text style={styles.primaryBtnText}>Continue to Reading</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, alignItems: 'center' },
  mascotWrap: { marginBottom: Spacing.lg },
  reactionText: { ...Typography.h2, fontSize: 24, color: Colors.white, marginBottom: Spacing.md },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.lg },
  scoreNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 48, color: Colors.white,
  },
  outOf: { ...Typography.body, fontSize: 15, color: Colors.mist },
  xpCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  xpLabel: { ...Typography.caption, color: Colors.mist, fontSize: 13 },
  xpNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28, color: Colors.amber, marginLeft: 4,
  },
  primaryBtn: {
    flexDirection: 'row', backgroundColor: Colors.coral,
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch',
  },
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
});
```

**Notes:**
- `MascotIcon` is a default export (per CLAUDE.md conventions). Confirm the import line matches the actual file. If it's a named export, switch to `{ MascotIcon }`.
- `MascotIcon` props per CLAUDE.md include a `size` prop and the bounce animation is the default behavior — no explicit prop needed.
- `useEffect` calls `updatePhase('results')` so lessonStore reflects the user's current state.
- Uses `navigation.replace` to advance — prevents back-nav into Quiz.

## Verification

1. `npx tsc --noEmit` passes.
2. Run app: walk PreListen → Listen → Quiz. Confirm Q1 of 5 renders with module's first quiz question text and 4 options.
3. Tap an option → coral selected border appears. "Check Answer" CTA goes from mist-disabled to coral-enabled.
4. Tap "Check Answer" → if correct, the option turns teal; if wrong, your option turns coral incorrect AND the correct option reveals teal. Haptic fires.
5. CTA changes to "Next Question". Confirm no further taps on the options change state.
6. After Q5: CTA reads "See My Results". Tap → QuizResults shows score (e.g. 4 out of 5), mascot bouncing, reaction "Nice work!", XP card "+80" (assuming `module.xpReward = 100`).
7. Tap "Continue to Reading" → navigates to Reading placeholder/screen.
8. Try iOS swipe-back gesture on Quiz — must be blocked (`gestureEnabled: false` from Plan 01 Task 7).
9. Try Android hardware back on Quiz — confirm dialog appears.
10. Verify back-nav from QuizResults is impossible (used `replace`, plus `gestureEnabled: false`).
11. Sanity: answer all 5 wrong → score 0, XP = 40 (40% of 100). All correct → score 5, XP = 100.

## Requirements Coverage
- QUIZ-01 (5 multiple-choice questions presented)
- QUIZ-02 (questions test Spanish concepts only — content authored in Plan 02)
- QUIZ-03 (selected state via QuizOption)
- QUIZ-04 (correct = teal, incorrect = coral)
- QUIZ-05 (user advances sequentially before results)
- QUIZ-06 (cannot change answer after Check Answer tap — `if (revealed) return`)
- RESULTS-01 (score fraction "N out of M")
- RESULTS-02 (XP based on score multiplier)
- RESULTS-03 (MascotIcon shows bounce animation)
- RESULTS-04 ("Continue to Reading" advances)
- NAV-03 (back gesture and Android back intercepted)
