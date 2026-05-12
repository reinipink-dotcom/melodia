import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler,
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

  if (!module) return null;
  const accent = levelColor(module.level);

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
