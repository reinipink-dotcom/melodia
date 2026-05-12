import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';
import { useOnboardingStore } from '../../store/onboardingStore';

export function ProfileScreen() {
  const { resetOnboarding } = useOnboardingStore();

  const handleReset = () => {
    Alert.alert('Reset Onboarding', 'This will clear your onboarding data and restart the flow.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => resetOnboarding(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={Typography.h1}>Profile</Text>
        <Text style={[Typography.body, styles.sub]}>Stats and settings.</Text>

        {/* DEV ONLY */}
        <TouchableOpacity style={styles.devButton} onPress={handleReset}>
          <Text style={styles.devButtonText}>🔄 Reset Onboarding (Dev)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  sub: {
    color: Colors.mist,
    marginTop: Spacing.sm,
  },
  devButton: {
    marginTop: 40,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A5C',
  },
  devButtonText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.mist,
  },
});
