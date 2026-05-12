import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
  navigation: StackNavigationProp<ModulesStackParamList, 'ModuleDetail'>;
  route: RouteProp<ModulesStackParamList, 'ModuleDetail'>;
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

function platformIcon(platform: string): string {
  switch (platform) {
    case 'spotify': return 'logo-spotify' as const;
    case 'apple-music': return 'musical-note';
    default: return 'musical-note';
  }
}

export function ModuleDetailScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const startLesson = useLessonStore((s) => s.startLesson);

  if (!module) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={[Typography.body, { color: Colors.mist, padding: Spacing.md }]}>Module not found.</Text>
      </SafeAreaView>
    );
  }

  const accent = levelColor(module.level);
  const minutes = Math.ceil(module.song.durationSeconds / 60);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Back header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Module {module.id}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#2A1A2E', '#1E1430']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroGlow} pointerEvents="none" />

          <View style={styles.heroTop}>
            <View style={[styles.levelBadge, { backgroundColor: accent + '33' }]}>
              <Text style={[styles.levelBadgeText, { color: accent }]}>{module.level}</Text>
            </View>
            <Text style={styles.conceptLabel}>CONCEPT</Text>
          </View>

          <Text style={styles.heroTitle}>{module.title}</Text>
          <Text style={styles.heroConcept}>{module.conceptDescription}</Text>
        </LinearGradient>

        {/* Song card */}
        <Text style={styles.sectionLabel}>FEATURED SONG</Text>
        <View style={styles.songCard}>
          <View style={styles.songIconBox}>
            <Ionicons name="musical-notes" size={22} color={Colors.coral} />
          </View>
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{module.song.title}</Text>
            <Text style={styles.songArtist}>{module.song.artist}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color={Colors.mist} />
            <Text style={styles.durationText}>{minutes} min</Text>
          </View>
        </View>

        {/* Grammar points */}
        <Text style={styles.sectionLabel}>GRAMMAR FOCUS</Text>
        <View style={styles.card}>
          {module.grammarPoints.map((point, i) => (
            <View key={i} style={[styles.grammarRow, i > 0 && styles.grammarRowBorder]}>
              <View style={[styles.grammarDot, { backgroundColor: accent }]} />
              <Text style={styles.grammarText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* Vocabulary */}
        <Text style={styles.sectionLabel}>VOCABULARY PREVIEW</Text>
        <View style={styles.vocabGrid}>
          {module.vocabulary.map((word, i) => (
            <View key={i} style={styles.vocabCard}>
              <Text style={[styles.vocabSpanish, { color: accent }]}>{word.spanish}</Text>
              <Text style={styles.vocabEnglish}>{word.english}</Text>
            </View>
          ))}
        </View>

        {/* Reading topic */}
        <Text style={styles.sectionLabel}>READING TRACK</Text>
        <View style={styles.readingCard}>
          <Ionicons name="book-outline" size={16} color={Colors.lavender} />
          <Text style={styles.readingText}>{module.readingTopic}</Text>
        </View>

        {/* XP reward */}
        <View style={styles.xpRow}>
          <Ionicons name="star" size={14} color={Colors.amber} />
          <Text style={styles.xpText}>Complete this module to earn {module.xpReward} XP</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={async () => {
            await startLesson(module.id);
            navigation.navigate('PreListen', { moduleId: module.id });
          }}
        >
          <LinearGradient
            colors={[Colors.coral, '#E55A3A']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Start Lesson</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },

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
  navTitle: {
    ...Typography.bodyMedium,
    fontSize: 15,
    color: Colors.mist,
  },

  hero: {
    borderRadius: 16,
    padding: 20,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.coral,
    opacity: 0.07,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelBadgeText: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  conceptLabel: {
    ...Typography.label,
    fontSize: 9,
    letterSpacing: 2,
    color: Colors.mist,
  },
  heroTitle: {
    ...Typography.h2,
    fontSize: 24,
    marginBottom: 10,
  },
  heroConcept: {
    ...Typography.body,
    color: Colors.mist,
    fontSize: 14,
    lineHeight: 21,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },

  songCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  songIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.coral + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songInfo: { flex: 1 },
  songTitle: {
    ...Typography.bodyMedium,
    fontSize: 14,
    marginBottom: 2,
  },
  songArtist: {
    ...Typography.caption,
    fontSize: 12,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    ...Typography.caption,
    fontSize: 11,
  },

  card: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  grammarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
  },
  grammarRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceHigh,
  },
  grammarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  grammarText: {
    ...Typography.body,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  vocabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  vocabCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 10,
    padding: 12,
    minWidth: '45%',
    flex: 1,
  },
  vocabSpanish: {
    ...Typography.bodyMedium,
    fontSize: 15,
    marginBottom: 3,
  },
  vocabEnglish: {
    ...Typography.caption,
    fontSize: 12,
  },

  readingCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  readingText: {
    ...Typography.body,
    fontSize: 14,
    flex: 1,
  },

  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  xpText: {
    ...Typography.caption,
    color: Colors.mist,
    fontSize: 12,
  },

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
  ctaBtn: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
  },
  ctaText: {
    ...Typography.bodyMedium,
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.3,
  },
});
