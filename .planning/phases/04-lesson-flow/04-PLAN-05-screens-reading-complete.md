# Plan: ReadingScreen + LessonCompleteScreen
**Phase:** 4 — Lesson Flow
**Plan:** 5 of 5
**Deps:** 01 (infrastructure), 02 (content)

## Objective
Build the final two lesson screens. ReadingScreen renders the tokenized passage from `module.readingPassage`, with tappable Spanish words that open a centered Modal tooltip showing the English translation. LessonCompleteScreen celebrates completion, calls `progressStore.completeModule()` on mount (idempotent), clears the lesson store, previews the next module, and offers navigation back to MainTabs.

## Context
- Research §"Tappable Text": use nested `<Text onPress>` (NOT `<TouchableOpacity>`) for inline flow. Tooltip via centered `<Modal>` to avoid layout math.
- UI-SPEC: Spanish words render as chips (coral+22 bg, coral text, borderRadius 4). Tap → modal opens with Spanish word + English translation + optional phonetic.
- COMPLETE-03: progressStore update happens on `useEffect` mount, guarded by `completedModuleIds.includes(moduleId)` to be idempotent (no double-XP on re-mount).
- "Add to Playlist" is a stub for Phase 4 — shows toast/alert "Playlist sync coming soon!".

## Tasks

### Task 1: Build ReadingScreen
**Type:** feature
**Files modified:** `src/screens/Lesson/ReadingScreen.tsx`
**Blocking:** no

Replace the placeholder:

```typescript
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
    return () => sub.remove();
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
                  onPress={() => setActiveToken(token)}
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
        <TouchableWithoutFeedback onPress={() => setActiveToken(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipSpanish}>{activeToken?.text}</Text>
                <Text style={styles.tooltipEnglish}>{activeToken?.english}</Text>
                {activeToken?.phonetic && (
                  <Text style={styles.tooltipPhonetic}>{activeToken.phonetic}</Text>
                )}
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
});
```

**Critical detail:** the inline `<Text onPress>` pattern is REQUIRED for text flow. Do NOT switch to `<TouchableOpacity>` — that would break wrapping. The inner `TouchableWithoutFeedback` inside the modal prevents tap-through from dismissing when tapping inside the tooltip itself.

### Task 2: Build LessonCompleteScreen
**Type:** feature
**Files modified:** `src/screens/Lesson/LessonCompleteScreen.tsx`
**Blocking:** no

Replace the placeholder:

```typescript
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { MODULES } from '../../data/modules';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';
import { RootStackParamList } from '../../navigation/RootNavigator';
import MascotIcon from '../../components/MascotIcon';
import { useLessonStore } from '../../store/lessonStore';
import { useProgressStore } from '../../store/progressStore';

type Props = {
  route: RouteProp<ModulesStackParamList, 'LessonComplete'>;
};

export function LessonCompleteScreen({ route }: Props) {
  const { moduleId, xpEarned } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  const nextModule = MODULES.find((m) => m.id === moduleId + 1);

  const completeModule = useProgressStore((s) => s.completeModule);
  const completedModuleIds = useProgressStore((s) => s.completedModuleIds);
  const completeLesson = useLessonStore((s) => s.completeLesson);

  // Type the root navigator so we can cross navigator boundaries
  const rootNav = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Update progress store ONCE on mount, idempotent
  useEffect(() => {
    if (!completedModuleIds.includes(moduleId)) {
      completeModule(moduleId, xpEarned);
    }
    completeLesson();
  }, []);

  // Disable Android hardware back
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // Behave like "Continue to Modules"
      // @ts-expect-error nested screen typing
      rootNav.navigate('MainTabs', { screen: 'Modules' });
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!module) return null;

  function goToModules() {
    // @ts-expect-error nested screen typing
    rootNav.navigate('MainTabs', { screen: 'Modules' });
  }

  function goToHome() {
    // @ts-expect-error nested screen typing
    rootNav.navigate('MainTabs', { screen: 'Home' });
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
```

**Critical notes:**
- `completeModule(moduleId, xpEarned)` is called inside a `useEffect` that runs once on mount AND is guarded by `!completedModuleIds.includes(moduleId)`. This makes the update idempotent — re-rendering the screen never double-counts XP.
- `completeLesson()` clears the lessonStore so a fresh lesson can begin.
- `rootNav.navigate('MainTabs', { screen: ... })` requires importing `RootStackParamList` from `RootNavigator.tsx`. If that file does not export the type, add `export` to the existing param list type there. If types are still painful, the `@ts-expect-error` comment is acceptable for Phase 4.
- Confirm `RootStackParamList` is exported from `src/navigation/RootNavigator.tsx`. If not, add `export` to that type declaration (one-line fix).

### Task 3: Ensure RootStackParamList is exported
**Type:** fix
**Files modified:** `src/navigation/RootNavigator.tsx`
**Blocking:** no

Open `/Users/reinebadejoko/Desktop/app/melodia-app/src/navigation/RootNavigator.tsx`. Find the `RootStackParamList` type declaration. Ensure it has `export` modifier:

```typescript
export type RootStackParamList = {
  // ... existing entries (Onboarding, MainTabs, etc.)
};
```

If it's already exported, no change. If not, add `export`.

### Task 4: Smoke-test end-to-end
**Type:** fix
**Files modified:** none (verification step)
**Blocking:** no

Manual smoke test:
1. From Home, tap Modules tab → Module 1 → Start Lesson.
2. PreListen → Listen (tap "I'm done listening" to skip) → Quiz (answer all 5) → Results (verify XP) → Reading (tap a Spanish word, verify Modal opens with English, tap outside to dismiss) → LessonComplete.
3. On LessonComplete, verify XP card shows the same `xpEarned` value passed from QuizResults.
4. Tap "Continue to Modules" → returns to ModulesList (tab bar reappears).
5. Re-enter Module 1 → ModuleDetail. Confirm `progressStore.completedModuleIds` now includes 1, `totalXP` increased by `xpEarned`, and on the Home screen the streak/XP numbers reflect the change.
6. Repeat the full loop for Module 2 and Module 3 to confirm CONTENT-02/CONTENT-03.

## Verification

1. `npx tsc --noEmit` passes.
2. Reading screen renders Spanish words as coral chips inline with English text — no layout breaks, words flow naturally.
3. Tap any Spanish word → modal appears centered with Spanish word in coral + English translation in white. Tap outside → modal dismisses. Tap on the tooltip itself → modal stays open.
4. From Results → Reading uses `navigation.replace` so back-nav into Results is impossible.
5. LessonComplete → MainTabs returns to Modules. Tab bar is visible again.
6. On Home screen, `totalXP` reflects the XP from this lesson. Streak unchanged (Phase 4 doesn't touch streak — that's Phase 8).
7. Re-completing Module 1 (which is already marked complete in default state) does NOT double-count XP — the `completedModuleIds.includes` guard fires.
8. iOS swipe-back disabled on all 6 lesson screens. Android hardware back: confirm dialog on PreListen/Listen/Quiz/Reading; direct return-to-modules on LessonComplete.
9. Verify all 3 modules (1, 2, 3) complete end-to-end without crashes.

## Requirements Coverage
- READ-01 (passage 100–200 words about artist / cultural context)
- READ-02 (Spanish words tappable → English translation modal)
- READ-03 (English/Spanish ratio baked into pre-authored passage from Plan 02)
- READ-04 ("Continue" advances to LessonComplete)
- COMPLETE-01 (celebration screen with XP)
- COMPLETE-02 (next module preview via `nextModule`)
- COMPLETE-03 (progress store updates — currentModuleId, completedModuleIds, totalXP)
- COMPLETE-04 ("Add to Playlist" stub button visible with toast)
- COMPLETE-05 (user can navigate to Home or Modules)
- NAV-03 (back nav disabled / handled on both screens)
