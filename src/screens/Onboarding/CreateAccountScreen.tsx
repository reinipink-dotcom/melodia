import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'CreateAccount'>;
};

export default function CreateAccountScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const { completeOnboarding } = useOnboardingStore();

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient */}
      <View style={styles.ambientGlow} />

      <View style={styles.skipRow}>
        <TouchableOpacity onPress={handleComplete}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headline}>
              Start Your <Text style={styles.accentItalic}>Rhythm.</Text>
            </Text>
            <Text style={styles.subtext}>
              Save your progress to never miss a beat.
            </Text>
          </View>

          {/* Email CTA — primary */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text style={styles.emailButtonText}>Continue with Email</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social options */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton} onPress={handleComplete} activeOpacity={0.85}>
              <Text style={styles.socialLabel}>G  Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={handleComplete} activeOpacity={0.85}>
              <Ionicons name="logo-apple" size={16} color={Colors.white} />
              <Text style={styles.socialLabel}>Apple ID</Text>
            </TouchableOpacity>
          </View>

          {/* Email input (inline alternative) */}
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={Colors.mist}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {email.includes('@') && (
            <TouchableOpacity style={styles.ctaButton} onPress={handleComplete} activeOpacity={0.85}>
              <Text style={styles.ctaText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}

          {/* Social proof */}
          <View style={styles.proofBadge}>
            <View style={styles.proofDot} />
            <Text style={styles.proofText}>
              <Text style={styles.proofHighlight}>LIVE LEARNING  </Text>
              Join 40k+ students learning Spanish through the power of music.
            </Text>
          </View>

          {/* Final CTA */}
          <TouchableOpacity style={styles.startLearning} onPress={handleComplete}>
            <Text style={styles.startLearningText}>Start Learning</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            By continuing, you agree to Melodia's Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  ambientGlow: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.coral,
    opacity: 0.07,
  },
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skipText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.mist,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 16,
  },
  header: { gap: 8, marginBottom: 8 },
  headline: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 40,
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 46,
  },
  accentItalic: {
    color: Colors.coral,
    fontStyle: 'italic',
  },
  subtext: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 15,
    color: Colors.mist,
    lineHeight: 22,
  },
  emailButton: {
    backgroundColor: Colors.coral,
    borderRadius: 999,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  emailButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.surfaceHigh },
  dividerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.mist,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 999,
    paddingVertical: 14,
  },
  socialLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
    color: Colors.white,
  },
  ctaButton: {
    backgroundColor: Colors.coral,
    borderRadius: 999,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  proofBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 14,
    padding: 16,
  },
  proofDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
    marginTop: 4,
  },
  proofText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.mist,
    lineHeight: 19,
  },
  proofHighlight: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.white,
    fontSize: 11,
    letterSpacing: 1,
  },
  startLearning: {
    alignItems: 'center',
  },
  startLearningText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: Colors.coral,
  },
  legal: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 11,
    color: Colors.mist,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.6,
  },
});
