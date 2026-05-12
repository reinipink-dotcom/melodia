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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  mascotWrap: { marginBottom: Spacing.lg },
  reactionText: { ...Typography.h2, fontSize: 24, color: Colors.white, marginBottom: Spacing.md },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.lg },
  scoreNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 48,
    color: Colors.white,
  },
  outOf: { ...Typography.body, fontSize: 15, color: Colors.mist },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  xpLabel: { ...Typography.caption, color: Colors.mist, fontSize: 13 },
  xpNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    color: Colors.amber,
    marginLeft: 4,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.coral,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
});
