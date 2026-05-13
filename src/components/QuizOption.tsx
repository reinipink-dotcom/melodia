import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'correct') {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.06, friction: 3, tension: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }),
      ]).start();
    } else if (state === 'incorrect') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [state]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.base, styles[state], style]}
      >
        <Text style={[styles.label, styles[`${state}Text`]]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
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
    fontFamily: 'BeVietnamPro_400Regular',
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
