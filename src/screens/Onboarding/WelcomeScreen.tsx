import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import MascotIcon from '../../components/MascotIcon';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient top glow */}
      <View style={styles.ambientGlow} />

      {/* Mascot hero */}
      <View style={styles.mascotContainer}>
        <MascotIcon size={100} animate />
      </View>

      {/* Text block */}
      <View style={styles.textContainer}>
        <Text style={styles.headline}>
          <Text style={styles.headlineBold}>Melodia:{'\n'}</Text>
          <Text style={styles.headlineBody}>Learn through{'\n'}</Text>
          <Text style={styles.headlineAccent}>music.</Text>
        </Text>
        <Text style={styles.subtext}>
          Tuning into culture through the world's most beautiful tracks. Experience the rhythm of language.
        </Text>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Level')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  ambientGlow: {
    position: 'absolute',
    top: -60,
    left: '50%',
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.coral,
    opacity: 0.08,
  },
  mascotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    paddingHorizontal: 28,
    paddingBottom: 24,
    gap: 14,
  },
  headline: {
    lineHeight: 52,
  },
  headlineBold: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 44,
    color: Colors.white,
    letterSpacing: -1,
  },
  headlineBody: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 44,
    color: Colors.white,
    letterSpacing: -1,
  },
  headlineAccent: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 44,
    color: Colors.coral,
    letterSpacing: -1,
    fontStyle: 'italic',
  },
  subtext: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 15,
    color: Colors.mist,
    lineHeight: 23,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 20,
  },
  ctaButton: {
    backgroundColor: Colors.coral,
    borderRadius: 999,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.mist,
  },
  signInLink: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 14,
    color: Colors.coral,
  },
});
