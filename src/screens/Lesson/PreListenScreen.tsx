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
import { MODULES, Module, TtsTrigger } from '../../data/modules';
import { getEnrichment } from '../../data/curriculum-enrichment';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import { useLessonStore } from '../../store/lessonStore';
import { speakSpanish, stopSpeech } from '../../utils/speech';
import { playTrigger, stopAudio } from '../../utils/audioPlayer';

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

function findPhraseTrigger(module: Module, phraseChunk: string): TtsTrigger | undefined {
  const triggers = module.ttsTriggers ?? [];
  return (
    triggers.find((t) => t.screen === 'preListen' && t.text === phraseChunk) ??
    triggers.find((t) => t.screen === 'preListen' && t.id === 'phrase-cafe-con-leche') ??
    triggers.find((t) => t.screen === 'preListen' && t.id.startsWith('phrase-'))
  );
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
    return () => {
      sub.remove();
      stopSpeech();
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!module) return null;
  const accent = levelColor(module.level);
  const enrichment = getEnrichment(moduleId);

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
          {enrichment && (
            <View style={styles.goalRow}>
              <Ionicons name="flag-outline" size={12} color={Colors.mist} />
              <Text style={styles.goalText}>{enrichment.speakingGoal}</Text>
            </View>
          )}
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
              <TouchableOpacity
                onPress={() => {
                  const trigger = module.ttsTriggers?.find(
                    t => t.screen === 'preListen' && t.text === word.spanish && t.normalVersion,
                  );
                  trigger ? playTrigger(trigger) : speakSpanish(word.spanish);
                }}
                style={styles.speakerBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="volume-high-outline" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {enrichment && (
          <>
            <View style={styles.tipBox}>
              <Ionicons name="ear-outline" size={16} color={accent} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.tipLabel}>LISTENING TIP</Text>
                <Text style={styles.tipText}>{enrichment.listeningSkill}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>KEY PHRASE</Text>
            <View style={styles.phraseBox}>
              <View style={styles.phraseRow}>
                <Text style={[styles.phraseChunk, { color: accent, flex: 1 }]}>{enrichment.vocabPack.phraseChunk}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const trigger = findPhraseTrigger(module, enrichment.vocabPack.phraseChunk);
                    trigger ? playTrigger(trigger) : speakSpanish(enrichment.vocabPack.phraseChunk);
                  }}
                  style={styles.speakerBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="volume-high-outline" size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.phrasePattern}>{enrichment.vocabPack.speakingPattern}</Text>
            </View>

            {enrichment.survivalPhrases && enrichment.survivalPhrases.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>SURVIVAL PHRASES</Text>
                <View style={styles.survivalBox}>
                  {enrichment.survivalPhrases.map((phrase, i) => (
                    <Text key={i} style={styles.survivalPhrase}>· {phrase}</Text>
                  ))}
                </View>
              </>
            )}
          </>
        )}

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
  speakerBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.coral + '33',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  goalText: { ...Typography.caption, fontSize: 12, color: Colors.mist, flex: 1, lineHeight: 17 },
  tipBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tipLabel: { ...Typography.label, fontSize: 9, letterSpacing: 2, color: Colors.mist, marginBottom: 4 },
  tipText: { ...Typography.body, fontSize: 13, color: Colors.white, lineHeight: 19 },
  phraseBox: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  phraseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  phraseChunk: { ...Typography.bodyMedium, fontSize: 18 },
  phrasePattern: { ...Typography.caption, fontSize: 12, color: Colors.mist, lineHeight: 18 },
  survivalBox: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  survivalPhrase: { ...Typography.body, fontSize: 13, color: Colors.white, lineHeight: 19 },
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
