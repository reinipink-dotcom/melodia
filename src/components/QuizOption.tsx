import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../constants';

type QuizState = 'default' | 'selected' | 'correct' | 'incorrect';

interface QuizOptionProps {
  label: string;
  state?: QuizState;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function QuizOption({
  label,
  state = 'default',
  onPress,
  disabled = false,
  style,
}: QuizOptionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.base, styles[state], style]}
    >
      <Text style={[styles.label, styles[`${state}Text`]]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: Spacing.sm,
  },
  default: {
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.coral,
  },
  correct: {
    borderColor: Colors.teal,
    backgroundColor: `${Colors.teal}20`,
  },
  incorrect: {
    borderColor: Colors.coral,
    backgroundColor: `${Colors.coral}20`,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.white,
  },
  defaultText: {
    color: Colors.white,
  },
  selectedText: {
    color: Colors.white,
  },
  correctText: {
    color: Colors.teal,
  },
  incorrectText: {
    color: Colors.coral,
  },
});
