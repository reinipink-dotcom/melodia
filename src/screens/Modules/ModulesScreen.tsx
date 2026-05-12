import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useProgressStore } from '../../store/progressStore';
import { MODULES, LEVEL_SECTIONS, FREE_MODULE_LIMIT, DisplayLevel, Module, getDisplayLevel } from '../../data/modules';
import { ModulesStackParamList } from '../../navigation/ModulesNavigator';

type NavProp = StackNavigationProp<ModulesStackParamList, 'ModulesList'>;

function levelColor(level: string): string {
  switch (level) {
    case 'A1': return Colors.teal;
    case 'A2': return Colors.coral;
    case 'B1': return Colors.amber;
    case 'B2': return Colors.lavender;
    default: return Colors.coral;
  }
}

function resolveStatus(module: Module, completedIds: number[], currentId: number): Module['status'] {
  if (completedIds.includes(module.id)) return 'completed';
  if (module.id === currentId) return 'active';
  if (module.id <= FREE_MODULE_LIMIT && module.id <= currentId + 1) return 'unlocked';
  return 'locked';
}

export function ModulesScreen() {
  const navigation = useNavigation<NavProp>();
  const { completedModuleIds, currentModuleId } = useProgressStore();
  const [activeLevel, setActiveLevel] = useState<DisplayLevel>('A1');

  const filtered = MODULES.filter((m) => getDisplayLevel(m.level) === activeLevel);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>60 MODULES</Text>
          <Text style={styles.headerTitle}>Your Curriculum</Text>
        </View>
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.teal} />
          <Text style={styles.completedText}>{completedModuleIds.length} done</Text>
        </View>
      </View>

      {/* CEFR level tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        style={styles.tabsScroll}
      >
        {LEVEL_SECTIONS.map((section) => {
          const active = activeLevel === section.level;
          const color = levelColor(section.level as string);
          return (
            <TouchableOpacity
              key={section.level}
              style={[styles.tab, active && { borderColor: color }]}
              onPress={() => setActiveLevel(section.level as DisplayLevel)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLevel, active && { color }]}>
                {section.level}
              </Text>
              <Text style={[styles.tabDesc, active && { color: Colors.white }]}>
                {section.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Module list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pro upsell for premium levels */}
        {(activeLevel === 'B1' || activeLevel === 'B2') && (
          <View style={styles.paywallBanner}>
            <Ionicons name="lock-closed" size={16} color={Colors.lavender} />
            <View style={styles.paywallText}>
              <Text style={styles.paywallTitle}>Melodia Pro</Text>
              <Text style={styles.paywallSub}>Unlock all 60 modules with a subscription</Text>
            </View>
            <TouchableOpacity style={styles.paywallBtn} activeOpacity={0.8}>
              <Text style={styles.paywallBtnText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        )}

        {filtered.map((module) => {
          const status = resolveStatus(module, completedModuleIds, currentModuleId);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';
          const isActive = status === 'active';
          const accent = levelColor(module.level);

          return (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, isActive && styles.moduleCardActive]}
              activeOpacity={isLocked ? 1 : 0.8}
              onPress={() => {
                if (!isLocked) {
                  navigation.navigate('ModuleDetail', { moduleId: module.id });
                }
              }}
            >
              {/* Number / status */}
              <View style={[
                styles.moduleNumBox,
                isCompleted && { backgroundColor: Colors.teal + '22' },
              ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color={Colors.teal} />
                ) : isLocked ? (
                  <Ionicons name="lock-closed" size={13} color={Colors.mist} style={{ opacity: 0.4 }} />
                ) : (
                  <Text style={[styles.moduleNumText, isActive && { color: accent }]}>
                    {module.id}
                  </Text>
                )}
              </View>

              {/* Info */}
              <View style={styles.moduleInfo}>
                <View style={styles.moduleInfoTop}>
                  <View style={[styles.levelChip, { backgroundColor: accent + '22' }]}>
                    <Text style={[styles.levelChipText, { color: accent }]}>{module.level}</Text>
                  </View>
                  {isActive && (
                    <View style={styles.activeChip}>
                      <Text style={styles.activeChipText}>IN PROGRESS</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.moduleTitle, isLocked && styles.moduleTitleLocked]}>
                  {module.title}
                </Text>
                <View style={styles.songRow}>
                  <Ionicons
                    name="musical-note"
                    size={11}
                    color={isLocked ? Colors.mist : Colors.coral}
                    style={{ opacity: isLocked ? 0.3 : 1 }}
                  />
                  <Text style={[styles.songText, isLocked && styles.songTextLocked]} numberOfLines={1}>
                    {module.song.artist}
                  </Text>
                </View>
              </View>

              {!isLocked && (
                <Ionicons name="chevron-forward" size={18} color={Colors.mist} />
              )}
            </TouchableOpacity>
          );
        })}

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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerLabel: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.teal + '22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  completedText: {
    ...Typography.caption,
    color: Colors.teal,
    fontSize: 12,
  },

  tabsScroll: { flexGrow: 0 },
  tabsRow: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  tab: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 110,
  },
  tabLevel: {
    ...Typography.label,
    fontSize: 13,
    letterSpacing: 1,
    color: Colors.mist,
    marginBottom: 2,
  },
  tabDesc: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.mist,
  },

  list: { flex: 1 },
  listContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },

  paywallBanner: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.xs,
  },
  paywallText: { flex: 1 },
  paywallTitle: {
    ...Typography.bodyMedium,
    fontSize: 13,
    marginBottom: 2,
  },
  paywallSub: {
    ...Typography.caption,
    fontSize: 11,
  },
  paywallBtn: {
    backgroundColor: Colors.lavender,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  paywallBtnText: {
    ...Typography.bodyMedium,
    fontSize: 12,
    color: '#fff',
  },

  moduleCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moduleCardActive: {
    borderColor: Colors.coral + '44',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleNumBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleNumText: {
    ...Typography.bodyMedium,
    fontSize: 14,
    color: Colors.white,
  },
  moduleInfo: { flex: 1 },
  moduleInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  levelChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  levelChipText: {
    ...Typography.label,
    fontSize: 9,
    letterSpacing: 1,
  },
  activeChip: {
    backgroundColor: Colors.coral + '22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  activeChipText: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.coral,
    letterSpacing: 1,
  },
  moduleTitle: {
    ...Typography.bodyMedium,
    fontSize: 14,
    marginBottom: 3,
  },
  moduleTitleLocked: {
    color: Colors.mist,
    opacity: 0.5,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  songText: {
    ...Typography.caption,
    fontSize: 11,
    flex: 1,
  },
  songTextLocked: {
    opacity: 0.35,
  },
});
