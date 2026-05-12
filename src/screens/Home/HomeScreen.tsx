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
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useProgressStore } from '../../store/progressStore';
import { MODULES } from '../../data/modules';
import { TabParamList } from '../../navigation/TabNavigator';

type HomeNavProp = BottomTabNavigationProp<TabParamList, 'Home'>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function levelColor(level: string): string {
  switch (level) {
    case 'A1': return Colors.teal;
    case 'A2': return Colors.coral;
    case 'B1': return Colors.amber;
    case 'B2': return Colors.lavender;
    default: return Colors.coral;
  }
}

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { currentModuleId, completedModuleIds, totalXP, streak } = useProgressStore();

  const currentModule = MODULES.find((m) => m.id === currentModuleId) ?? MODULES[0];
  const nextModule = MODULES.find((m) => m.id === currentModuleId + 1);
  const modulesCompleted = completedModuleIds.length;

  const xpToNextLevel = 500;
  const xpProgress = Math.min((totalXP % xpToNextLevel) / xpToNextLevel, 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Ambient glow */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.appName}>Melodia</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={18} color={Colors.coral} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="flame" size={18} color={Colors.amber} />
              <Text style={styles.statValue}>{streak}</Text>
            </View>
            <Text style={styles.statLabel}>DAY STREAK</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="star" size={16} color={Colors.coral} />
              <Text style={styles.statValue}>{totalXP}</Text>
            </View>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.teal} />
              <Text style={styles.statValue}>{modulesCompleted}</Text>
            </View>
            <Text style={styles.statLabel}>MODULES</Text>
          </View>
        </View>

        {/* Continue Learning card */}
        <Text style={styles.sectionLabel}>CONTINUE LEARNING</Text>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Modules')}
          style={styles.heroCardWrapper}
        >
          <LinearGradient
            colors={['#2A1A2E', '#1E1430']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroGlow} pointerEvents="none" />

            <View style={styles.heroTop}>
              <View style={[styles.levelBadge, { backgroundColor: levelColor(currentModule.level) + '33' }]}>
                <Text style={[styles.levelBadgeText, { color: levelColor(currentModule.level) }]}>
                  {currentModule.level}
                </Text>
              </View>
              <Text style={styles.moduleNumber}>Module {currentModule.id}</Text>
            </View>

            <Text style={styles.heroTitle}>{currentModule.title}</Text>
            <Text style={styles.heroConcept}>{currentModule.concept}</Text>

            <View style={styles.heroSongRow}>
              <Ionicons name="musical-note" size={14} color={Colors.coral} />
              <Text style={styles.heroSongText} numberOfLines={1}>
                {currentModule.song.title} — {currentModule.song.artist}
              </Text>
            </View>

            <View style={styles.heroCTA}>
              <Text style={styles.heroCTAText}>Start Lesson</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* XP Progress */}
        <Text style={styles.sectionLabel}>XP PROGRESS</Text>
        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpCurrent}>{totalXP} XP</Text>
            <Text style={styles.xpNext}>{xpToNextLevel} XP</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpProgress * 100}%` }]} />
          </View>
          <Text style={styles.xpCaption}>
            {Math.round(xpProgress * 100)}% to next level
          </Text>
        </View>

        {/* Up next */}
        {nextModule && (
          <>
            <Text style={styles.sectionLabel}>UP NEXT</Text>
            <TouchableOpacity
              style={styles.upNextCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Modules')}
            >
              <View style={styles.upNextLeft}>
                <View style={[styles.levelBadgeSmall, { backgroundColor: levelColor(nextModule.level) + '22' }]}>
                  <Text style={[styles.levelBadgeSmallText, { color: levelColor(nextModule.level) }]}>
                    {nextModule.level}
                  </Text>
                </View>
                <View style={styles.upNextInfo}>
                  <Text style={styles.upNextTitle}>{nextModule.title}</Text>
                  <Text style={styles.upNextSong} numberOfLines={1}>{nextModule.song.artist}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.mist} />
            </TouchableOpacity>
          </>
        )}

        {/* Browse all */}
        <TouchableOpacity
          style={styles.browseBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Modules')}
        >
          <Ionicons name="grid-outline" size={16} color={Colors.coral} />
          <Text style={styles.browseBtnText}>Browse all 60 modules</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.coral} />
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  ambientGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.coral,
    opacity: 0.04,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  greeting: {
    ...Typography.caption,
    color: Colors.mist,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  appName: {
    ...Typography.h1,
    fontSize: 28,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.h2,
    fontSize: 20,
  },
  statLabel: {
    ...Typography.label,
    fontSize: 9,
    letterSpacing: 1.5,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },

  heroCardWrapper: {
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroCard: {
    padding: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.coral,
    opacity: 0.08,
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
  moduleNumber: {
    ...Typography.caption,
    color: Colors.mist,
  },
  heroTitle: {
    ...Typography.h2,
    fontSize: 22,
    marginBottom: 4,
  },
  heroConcept: {
    ...Typography.body,
    color: Colors.mist,
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  heroSongRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  heroSongText: {
    ...Typography.caption,
    color: Colors.coralLight,
    fontSize: 12,
    flex: 1,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.coral,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  heroCTAText: {
    ...Typography.bodyMedium,
    fontSize: 14,
    color: '#fff',
  },

  xpCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpCurrent: {
    ...Typography.bodyMedium,
    color: Colors.coral,
    fontSize: 13,
  },
  xpNext: {
    ...Typography.caption,
    fontSize: 12,
  },
  xpTrack: {
    height: 4,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: 2,
  },
  xpCaption: {
    ...Typography.caption,
    fontSize: 11,
  },

  upNextCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  upNextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  levelBadgeSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeSmallText: {
    ...Typography.label,
    fontSize: 11,
    letterSpacing: 1,
  },
  upNextInfo: { flex: 1 },
  upNextTitle: {
    ...Typography.bodyMedium,
    fontSize: 14,
    marginBottom: 2,
  },
  upNextSong: {
    ...Typography.caption,
    fontSize: 12,
  },

  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
  },
  browseBtnText: {
    ...Typography.bodyMedium,
    color: Colors.coral,
    fontSize: 14,
  },
});
