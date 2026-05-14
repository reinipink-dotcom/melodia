import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { MODULES } from '../../data/modules';
import { getEnrichment } from '../../data/curriculum-enrichment';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import MascotIcon from '../../components/MascotIcon';
import { useLessonStore } from '../../store/lessonStore';
import { useProgressStore } from '../../store/progressStore';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'LessonComplete'>;
  route: RouteProp<ModulesStackParamList, 'LessonComplete'>;
};

export function LessonCompleteScreen({ navigation, route }: Props) {
  const { moduleId, xpEarned } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const nextModule = MODULES.find((m) => m.id === moduleId + 1);

  const enrichment = getEnrichment(moduleId);
  const completeModule = useProgressStore((s) => s.completeModule);
  const completedModuleIds = useProgressStore((s) => s.completedModuleIds);
  const completeLesson = useLessonStore((s) => s.completeLesson);

  // Update progress store ONCE on mount, idempotent
  useEffect(() => {
    if (!completedModuleIds.includes(moduleId)) {
      completeModule(moduleId, xpEarned);
    }
    completeLesson();
  }, []);

  // Disable Android hardware back — pop to module list
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.popToTop();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!module) return null;

  function goToModules() {
    // Pop the entire lesson stack — lands on ModulesList inside the Modules tab
    navigation.popToTop();
  }

  function goToHome() {
    // Pop lesson stack first, then switch to Home tab via parent tab navigator
    navigation.popToTop();
    navigation.getParent()?.navigate('Home' as never);
  }

  function handleAddToPlaylist() {
    Alert.alert('Playlist sync coming soon!', 'This feature unlocks in a future update.');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Top */}
        <View style={{ alignItems: 'center', marginTop: Spacing['2xl'] }}>
          <MascotIcon size={100} />
          <Text style={styles.title}>Lesson Complete!</Text>
          <Text style={styles.subtitle}>{module.level} · {module.title}</Text>
        </View>

        {/* Middle */}
        <View style={styles.middle}>
          <View style={styles.xpCard}>
            <Ionicons name="star" size={20} color={Colors.amber} />
            <Text style={styles.xpLabel}>XP Earned</Text>
            <Text style={styles.xpNumber}>+{xpEarned}</Text>
          </View>

          {enrichment && (
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Ionicons name="mic-outline" size={15} color={Colors.coral} />
                <Text style={styles.challengeLabel}>SPEAKING CHALLENGE</Text>
              </View>
              <Text style={styles.challengeText}>{enrichment.speakingPrompts.miniChallenge}</Text>
            </View>
          )}

          {nextModule && (
            <View style={styles.nextCard}>
              <Ionicons name="lock-open-outline" size={16} color={Colors.coral} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nextLabel}>Up Next</Text>
                <Text style={styles.nextTitle}>{nextModule.title}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.playlistBtn}
            activeOpacity={0.75}
            onPress={handleAddToPlaylist}
          >
            <Ionicons name="musical-note" size={16} color={Colors.mist} />
            <Text style={styles.playlistText}>Add to Playlist</Text>
          </TouchableOpacity>
          <Text style={styles.playlistSubtitle}>Playlist sync coming soon</Text>
        </View>

        {/* Bottom CTAs */}
        <View style={{ gap: Spacing.sm }}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={goToModules}>
            <Text style={styles.primaryBtnText}>Continue to Modules</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.75} onPress={goToHome}>
            <Text style={styles.secondaryBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 36, color: Colors.white, marginTop: Spacing.md, textAlign: 'center',
  },
  subtitle: { ...Typography.caption, color: Colors.mist, marginTop: 6, textAlign: 'center' },
  middle: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  xpCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16, padding: Spacing.lg,
  },
  xpLabel: { ...Typography.caption, color: Colors.mist, fontSize: 13, flex: 1 },
  xpNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28, color: Colors.amber,
  },
  challengeCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.coral,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  challengeLabel: { ...Typography.label, fontSize: 10, letterSpacing: 2, color: Colors.coral },
  challengeText: { ...Typography.body, fontSize: 13, color: Colors.white, lineHeight: 19 },
  nextCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12, padding: Spacing.md,
  },
  nextLabel: { ...Typography.label, fontSize: 10, letterSpacing: 2, color: Colors.mist },
  nextTitle: { ...Typography.body, fontSize: 14, color: Colors.white, marginTop: 2 },
  playlistBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.outlineVariant,
    paddingVertical: 12, borderRadius: 24,
  },
  playlistText: { ...Typography.bodyMedium, fontSize: 14, color: Colors.mist },
  playlistSubtitle: { ...Typography.caption, fontSize: 11, color: Colors.mist, textAlign: 'center' },
  primaryBtn: {
    backgroundColor: Colors.coral, paddingVertical: 16, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
  secondaryBtn: {
    paddingVertical: 12, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { ...Typography.body, fontSize: 14, color: Colors.mist },
});
