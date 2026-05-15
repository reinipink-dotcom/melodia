import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import { useOnboardingStore, SpanishLevel } from '../../store/onboardingStore';
import ProgressDots from './components/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Level'>;
};

type LevelItem = {
  value: SpanishLevel;
  label: string;
  description: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const levels: LevelItem[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to Spanish',
    subtitle: 'Start Tuning In',
    icon: 'musical-note-outline',
  },
  {
    value: 'some-basics',
    label: 'Some Basics',
    description: 'A bit of practice',
    subtitle: 'Find Your Rhythm',
    icon: 'pulse-outline',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Can hold simple conversations',
    subtitle: 'Master the Melody',
    icon: 'mic-outline',
  },
];

export default function LevelScreen({ navigation }: Props) {
  const { level, setLevel } = useOnboardingStore();

  const handleSelect = (val: SpanishLevel) => {
    setLevel(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={6} current={0} label="SET YOUR STAGE" />

      <View style={styles.content}>
        <Text style={styles.headline}>
          Set your <Text style={styles.accentItalic}>stage.</Text>
        </Text>
        <Text style={styles.subtext}>We'll personalize your first modules around your level.</Text>

        <View style={styles.options}>
          {levels.map((item) => {
            const selected = level === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
                  <Ionicons name={item.icon} size={22} color={selected ? '#fff' : Colors.mist} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
                <Text style={[styles.cardSubtitle, selected && styles.cardSubtitleSelected]}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.placementLink} onPress={() => {}}>
          <Text style={styles.placementText}>Not sure? Take a quick placement test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, !level && styles.ctaDisabled]}
          onPress={() => level && navigation.navigate('Genre')}
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
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 8 },
  headline: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 40,
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 4,
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
    marginBottom: 20,
  },
  options: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  cardSelected: {
    backgroundColor: Colors.surfaceHigh,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: Colors.coral,
  },
  cardText: { flex: 1 },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: Colors.white,
  },
  cardLabelSelected: { color: Colors.coral },
  cardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.mist,
    marginTop: 2,
  },
  cardSubtitle: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 11,
    color: Colors.mist,
    opacity: 0.6,
  },
  cardSubtitleSelected: {
    color: Colors.coral,
    opacity: 1,
  },
  placementLink: {
    alignItems: 'center',
    paddingTop: 12,
  },
  placementText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
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
