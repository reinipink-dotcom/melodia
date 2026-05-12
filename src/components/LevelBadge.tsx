import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../constants';

type Level = 'A1' | 'A2' | 'B1' | 'B2';

const LEVEL_COLORS: Record<Level, string> = {
  A1: Colors.teal,
  A2: Colors.teal,
  B1: Colors.amber,
  B2: Colors.lavender,
};

interface LevelBadgeProps {
  level: Level;
  style?: ViewStyle;
}

export function LevelBadge({ level, style }: LevelBadgeProps) {
  const color = LEVEL_COLORS[level] ?? Colors.mist;

  return (
    <View style={[styles.badge, { borderColor: color }, style]}>
      <Text style={[styles.label, { color }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'BeVietnamPro_500Medium',
    letterSpacing: 0.5,
  },
});
