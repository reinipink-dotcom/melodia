import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import MascotIcon from '../../components/MascotIcon';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    Animated.timing(barAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => navigation.replace('Welcome'), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Ambient glow layers */}
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Mascot */}
        <MascotIcon size={88} animate />

        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.wordmark}>Melodia</Text>
          <Text style={styles.tagline}>SPANISH THROUGH SOUND</Text>
        </View>
      </Animated.View>

      {/* Loading bar */}
      <Animated.View style={styles.footer}>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              { width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
        <Text style={styles.tuning}>TUNING FREQUENCIES</Text>
      </Animated.View>

      <View style={styles.premiumRow}>
        <Text style={styles.premiumStar}>★</Text>
        <Text style={styles.premiumText}>PREMIUM AUDIO CURATION</Text>
        <Text style={styles.premiumStar}>★</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.coral,
    opacity: 0.06,
  },
  glowInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.coral,
    opacity: 0.1,
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  brand: {
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 52,
    color: Colors.coral,
    letterSpacing: -1.5,
  },
  tagline: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: Colors.mist,
    letterSpacing: 3,
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    gap: 10,
    width: 180,
  },
  barTrack: {
    width: 180,
    height: 2,
    backgroundColor: Colors.surfaceHighest,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: 999,
  },
  tuning: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: Colors.mist,
    letterSpacing: 3,
    opacity: 0.6,
  },
  premiumRow: {
    position: 'absolute',
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premiumStar: {
    color: Colors.amber,
    fontSize: 10,
  },
  premiumText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: Colors.mist,
    letterSpacing: 2,
    opacity: 0.7,
  },
});
