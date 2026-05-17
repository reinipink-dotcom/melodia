import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity,
  Modal, TouchableWithoutFeedback, BackHandler, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { MODULES, ReadingPassageToken } from '../../data/modules';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import { useLessonStore } from '../../store/lessonStore';
import { speakSpanish, stopSpeech } from '../../utils/speech';
import { playTrigger, stopAudio } from '../../utils/audioPlayer';
import { findReadingTrigger, hasGeneratedAudio } from '../../utils/ttsTriggers';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Reading'>;
  route: RouteProp<ModulesStackParamList, 'Reading'>;
};

export function ReadingScreen({ navigation, route }: Props) {
  const { moduleId, xpEarned } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const updatePhase = useLessonStore((s) => s.updatePhase);
  const completeLesson = useLessonStore((s) => s.completeLesson);
  const [activeToken, setActiveToken] = useState<ReadingPassageToken | null>(null);

  function handleTokenTap(token: ReadingPassageToken): void {
    const trigger = findReadingTrigger(module, token.text);
    if (trigger) playTrigger(trigger);
    else if (!hasGeneratedAudio(module)) speakSpanish(token.text);
  }

  useEffect(() => {
    updatePhase('reading');
  }, []);

  // No back nav — but Android hardware back must still be handled
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Exit lesson?',
        "Your XP from the quiz will be lost.",
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Exit', style: 'destructive',
            onPress: async () => {
              await completeLesson();
              navigation.popToTop();
            },
          },
        ],
      );
      return true;
    });
    return () => { sub.remove(); stopAudio(); };
  }, []);

  if (!module || !module.readingPassage) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={[Typography.body, { color: Colors.mist, padding: Spacing.md }]}>
          No reading passage available for this module yet.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.navBar}>
        <View style={{ width: 36 }} />
        <Text style={styles.navTitle}>Reading</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.chipWrap}>
        <View style={styles.topicChip}>
          <Ionicons name="musical-note" size={12} color={Colors.lavender} />
          <Text style={styles.topicText}>{module.readingTopic}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.passageCard}>
          <Text style={styles.passageText}>
            {module.readingPassage.map((token, i) =>
              token.isSpanish ? (
                <Text
                  key={i}
                  onPress={() => { setActiveToken(token); handleTokenTap(token); }}
                  style={styles.spanishWord}
                >
                  {token.text}
                </Text>
              ) : (
                <Text key={i} style={styles.englishText}>{token.text}</Text>
              )
            )}
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.replace('LessonComplete', { moduleId, xpEarned })}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* Tooltip modal */}
      <Modal
        visible={!!activeToken}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveToken(null)}
      >
        <TouchableWithoutFeedback onPress={() => { setActiveToken(null); stopSpeech(); stopAudio(); }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipSpanish}>{activeToken?.text}</Text>
                <Text style={styles.tooltipEnglish}>{activeToken?.english}</Text>
                {activeToken?.phonetic && (
                  <Text style={styles.tooltipPhonetic}>{activeToken.phonetic}</Text>
                )}
                <TouchableOpacity
                  onPress={() => activeToken && handleTokenTap(activeToken)}
                  style={styles.tooltipSpeaker}
                  activeOpacity={0.7}
                >
                  <Ionicons name="volume-high-outline" size={18} color={Colors.mist} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.midnight },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  navTitle: { ...Typography.bodyMedium, fontSize: 15, color: Colors.mist },
  chipWrap: { alignItems: 'center', paddingBottom: Spacing.sm },
  topicChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceHighest,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  topicText: { ...Typography.caption, fontSize: 12, color: Colors.white },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  passageCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16, padding: Spacing.lg,
  },
  passageText: {
    ...Typography.body, fontSize: 15, lineHeight: 24, color: Colors.white,
  },
  englishText: { color: Colors.white },
  spanishWord: {
    backgroundColor: Colors.coral + '22',
    color: Colors.coral,
    fontFamily: 'BeVietnamPro_500Medium',
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4,
  },
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
  primaryBtnText: { ...Typography.bodyMedium, fontSize: 16, color: '#fff' },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000099',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg,
  },
  tooltip: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 12, padding: Spacing.lg,
    maxWidth: 320, alignItems: 'center',
  },
  tooltipSpanish: {
    ...Typography.bodyMedium, fontSize: 20, color: Colors.coral, marginBottom: 6,
  },
  tooltipEnglish: { ...Typography.body, fontSize: 15, color: Colors.white },
  tooltipPhonetic: { ...Typography.caption, color: Colors.mist, marginTop: 4 },
  tooltipSpeaker: { marginTop: 10, padding: 4 },
});
