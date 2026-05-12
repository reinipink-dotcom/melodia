import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (selectedIndex === null) return;
    if (isLast) {
      // Compute final correct count synchronously: correctCount may not yet reflect last answer.
      const lastIsCorrect = selectedIndex === question.correctIndex;
      const finalCorrect = correctCount + (lastIsCorrect ? 1 : 0);
      const xpEarned = computeXp(finalCorrect, total, module!.xpReward);
      navigation.replace('QuizResults', {
        moduleId,
        score: finalCorrect,
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
            <Text style={styles.primaryBtnText}>
              {isLast ? 'See My Results' : 'Next Question'}
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: { ...Typography.caption, color: Colors.mist },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.surfaceHigh,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: Colors.coral },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  questionCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  questionNumber: {
    ...Typography.label,
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.mist,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
    color: Colors.white,
  },
  options: { gap: Spacing.sm },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: Colors.midnight,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.coral,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: Colors.surfaceHigh },
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
});
