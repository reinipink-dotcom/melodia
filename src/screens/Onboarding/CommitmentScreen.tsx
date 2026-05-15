import React, { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import ProgressDots from './components/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import MascotIcon from '../../components/MascotIcon';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Commitment'>;
};

export default function CommitmentScreen({ navigation }: Props) {
  const holdProgress = useRef(new Animated.Value(0)).current;
  const holdAnim = useRef<Animated.CompositeAnimation | null>(null);
  const hapticInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const isNavigating = useRef(false);

  // Continuous ripple animation while holding
  const startRipples = () => {
    const rippleSeq = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ]),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    rippleSeq(ripple1, 0).start();
    rippleSeq(ripple2, 333).start();
    rippleSeq(ripple3, 666).start();
  };

  const stopRipples = () => {
    [ripple1, ripple2, ripple3].forEach((r) => {
      r.stopAnimation();
      r.setValue(0);
    });
  };

  const handlePressIn = () => {
    if (isNavigating.current) return;

    startRipples();

    // Haptic pulse every 600ms while holding
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    hapticInterval.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 600);

    holdAnim.current = Animated.timing(holdProgress, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    });

    holdAnim.current.start(({ finished }) => {
      if (finished && !isNavigating.current) {
        isNavigating.current = true;
        if (hapticInterval.current) clearInterval(hapticInterval.current);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate('CreateAccount');
      }
    });
  };

  const handlePressOut = () => {
    if (isNavigating.current) return;
    if (hapticInterval.current) clearInterval(hapticInterval.current);
    holdAnim.current?.stop();
    stopRipples();
    Animated.spring(holdProgress, { toValue: 0, useNativeDriver: false, friction: 8 }).start();
  };

  const fillWidth = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const buttonScale = holdProgress.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [1, 0.97, 0.97],
  });

  const rippleStyle = (anim: Animated.Value) => ({
    position: 'absolute' as const,
    width: 260,
    height: 72,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.coral,
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.5, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) }],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={6} current={5} label="NEW MILESTONE" />

      {/* Ambient glow */}
      <View style={styles.ambientGlow} />

      {/* Mascot */}
      <View style={styles.mascotContainer}>
        <MascotIcon size={80} animate />
      </View>

      {/* Commitment text */}
      <View style={styles.textContainer}>
        <Text style={styles.headline}>
          I'm going to learn{'\n'}Spanish through{'\n'}music,{' '}
          <Text style={styles.accentItalic}>one song{'\n'}at a time.</Text>
        </Text>
      </View>

      {/* Feature bullets */}
      <View style={styles.features}>
        {[
          { icon: 'disc-outline' as const, title: 'Curated Setlists', desc: 'Daily lessons built into tracks from Shakira, Bad Bunny & more.' },
          { icon: 'headset-outline' as const, title: 'Sonic Immersion', desc: 'Retain 4x more vocabulary through rhythm and emotional resonance.' },
        ].map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={18} color={Colors.amber} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Hold to Lock In */}
      <View style={styles.footer}>
        <Text style={styles.holdHint}>Hold to lock in</Text>

        <View style={styles.buttonWrapper}>
          {/* Ripple rings */}
          <Animated.View style={rippleStyle(ripple1)} />
          <Animated.View style={rippleStyle(ripple2)} />
          <Animated.View style={rippleStyle(ripple3)} />

          {/* Button */}
          <Animated.View style={[styles.lockButton, { transform: [{ scale: buttonScale }] }]}>
            {/* Fill layer */}
            <Animated.View style={[styles.lockFill, { width: fillWidth }]} />
            {/* Content */}
            <View style={styles.lockContent}>
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={styles.lockText}>Lock In</Text>
            </View>
            {/* Press area */}
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            />
          </Animated.View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.laterText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  ambientGlow: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.coral,
    opacity: 0.06,
  },
  mascotContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  textContainer: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headline: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 26,
    color: Colors.white,
    lineHeight: 36,
  },
  accentItalic: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.coral,
    fontStyle: 'italic',
  },
  features: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: 2 },
  featureTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: Colors.white,
  },
  featureDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: Colors.mist,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
    marginTop: 'auto',
  },
  holdHint: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.mist,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    width: 240,
  },
  lockButton: {
    width: 240,
    height: 60,
    borderRadius: 999,
    backgroundColor: Colors.surfaceHigh,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.coral + '66',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  lockFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.coral,
    borderRadius: 999,
  },
  lockContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  lockText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: '#fff',
    letterSpacing: 0.3,
  },
  laterText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.mist,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.mist,
    opacity: 0.7,
  },
});
