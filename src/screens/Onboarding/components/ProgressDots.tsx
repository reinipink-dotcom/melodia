import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';

type Props = {
  total: number;
  current: number; // 0-indexed
  label?: string;
};

export default function ProgressDots({ total, current, label }: Props) {
  const percent = Math.round(((current) / total) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.stepLabel}>{label ?? `STEP ${String(current + 1).padStart(2, '0')}`}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.mist,
    textTransform: 'uppercase',
  },
  percent: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.coral,
  },
  track: {
    height: 2,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: 999,
  },
});
