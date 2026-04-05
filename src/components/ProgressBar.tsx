import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../constants';

interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
}

export function ProgressBar({ progress, style }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.track, style]}>
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: Radius.full,
  },
});
