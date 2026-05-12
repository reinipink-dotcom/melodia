import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

type Props = {
  size?: number;
  animate?: boolean;
};

export default function MascotIcon({ size = 80, animate = true }: Props) {
  const bounce = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    // Continuous bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -10, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // Staggered pulse rings
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          ]),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );

    pulse(ring1, 0).start();
    pulse(ring2, 600).start();
    pulse(ring3, 1200).start();
  }, [animate]);

  const iconSize = size * 0.42;

  return (
    <View style={{ width: size * 2.5, height: size * 2.5, alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulse rings */}
      {[ring1, ring2, ring3].map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ring,
            {
              width: size * (1.6 + i * 0.4),
              height: size * (1.6 + i * 0.4),
              borderRadius: size,
              opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.3, 0] }),
              transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] }) }],
            },
          ]}
        />
      ))}

      {/* Mascot — bouncing coral circle with music note */}
      <Animated.View
        style={[
          styles.mascotCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ translateY: bounce }],
            shadowColor: Colors.coral,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: size * 0.4,
            elevation: 20,
          },
        ]}
      >
        <Ionicons name="musical-note" size={iconSize} color="#fff" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: Colors.coral,
  },
  mascotCircle: {
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
