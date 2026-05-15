import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import { useOnboardingStore, Platform } from '../../store/onboardingStore';
import ProgressDots from './components/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Platform'>;
};

type PlatformItem = {
  value: Platform;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const platforms: PlatformItem[] = [
  { value: 'spotify', label: 'Spotify', description: 'Premium Experience', icon: 'musical-notes', color: '#1DB954' },
  { value: 'apple-music', label: 'Apple Music', description: 'Studio Quality Audio', icon: 'musical-notes', color: '#FC3C44' },
  { value: 'youtube-music', label: 'YouTube Music', description: 'Infinite Catalog', icon: 'play-circle', color: '#FF0000' },
  { value: 'youtube', label: 'YouTube', description: 'Music Videos & More', icon: 'logo-youtube', color: '#FF0000' },
];

export default function PlatformScreen({ navigation }: Props) {
  const { platform, setPlatform } = useOnboardingStore();

  const handleSelect = (val: Platform) => {
    setPlatform(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={6} current={2} label="YOUR STAGE" />

      <View style={styles.content}>
        <Text style={styles.headline}>
          Choose your <Text style={styles.accentItalic}>stage.</Text>
        </Text>
        <Text style={styles.subtext}>
          Sync your favorite platform to transform every lyric into a language lesson.
        </Text>

        <View style={styles.options}>
          {platforms.map((item) => {
            const selected = platform === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, { backgroundColor: item.color + '22' }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={selected ? Colors.coral : Colors.mist}
                  style={{ opacity: selected ? 1 : 0.5 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.connectLater} onPress={() => navigation.navigate('Goal')}>
          <Text style={styles.connectLaterText}>Connect later</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, !platform && styles.ctaDisabled]}
          onPress={() => platform && navigation.navigate('Goal')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  headline: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 40,
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 8,
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
    marginBottom: 28,
  },
  options: { gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 18,
    padding: 18,
    gap: 16,
  },
  cardSelected: {
    backgroundColor: Colors.surfaceHigh,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: Colors.white,
  },
  cardLabelSelected: { color: Colors.coral },
  cardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: Colors.mist,
    marginTop: 2,
  },
  connectLater: {
    alignItems: 'center',
    marginTop: 20,
  },
  connectLaterText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.mist,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.mist,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 36 },
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
  ctaDisabled: { opacity: 0.4, shadowOpacity: 0 },
  ctaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: '#fff',
  },
});
