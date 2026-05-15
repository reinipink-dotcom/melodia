import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import { useOnboardingStore, Genre } from '../../store/onboardingStore';
import ProgressDots from './components/ProgressDots';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Genre'>;
};

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48 - 12) / 2;

type GenreItem = {
  value: Genre;
  label: string;
  gradient: [string, string];
};

const genres: GenreItem[] = [
  { value: 'pop', label: 'Pop', gradient: ['#4C1D7A', '#FF4E8A'] },
  { value: 'reggaeton', label: 'Reggaeton', gradient: ['#0D3A2A', '#FF6B4A'] },
  { value: 'rnb', label: 'R&B', gradient: ['#0D1B4B', '#6B2D8B'] },
  { value: 'regional-mexican', label: 'Regional Mexican', gradient: ['#3D1A00', '#C4701A'] },
];

export default function GenreScreen({ navigation }: Props) {
  const { genres: selected, toggleGenre } = useOnboardingStore();

  const handleToggle = (val: Genre) => {
    toggleGenre(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient glows */}
      <View style={styles.glowRight} />
      <View style={styles.glowLeft} />

      <ProgressDots total={6} current={1} label="YOUR RHYTHM" />

      <View style={styles.content}>
        <Text style={styles.headline}>
          What's your{'\n'}<Text style={styles.accentItalic}>rhythm</Text>?
        </Text>
        <Text style={styles.subtext}>
          Pick the genres that make you want to sing along.
        </Text>

        <View style={styles.grid}>
          {genres.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleToggle(item.value)}
                activeOpacity={0.9}
                style={[styles.cardWrap, isSelected && styles.cardWrapSelected]}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  {/* Overlay for depth */}
                  <View style={styles.cardOverlay} />

                  {/* Selected check */}
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}

                  {/* Bottom label */}
                  <View style={styles.cardBottom}>
                    {isSelected && (
                      <Text style={styles.selectedTag}>SELECTED</Text>
                    )}
                    <Text style={styles.cardLabel}>{item.label}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, selected.length === 0 && styles.ctaDisabled]}
          onPress={() => selected.length > 0 && navigation.navigate('Platform')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Platform')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  glowRight: {
    position: 'absolute',
    top: '25%',
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.coral,
    opacity: 0.07,
  },
  glowLeft: {
    position: 'absolute',
    bottom: '25%',
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.teal,
    opacity: 0.07,
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
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
    marginBottom: 24,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrap: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardWrapSelected: {
    borderWidth: 2,
    borderColor: Colors.coral,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 18,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottom: { gap: 2 },
  selectedTag: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: Colors.coral,
    letterSpacing: 2,
  },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
    color: '#fff',
    letterSpacing: -0.3,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 16,
    alignItems: 'center',
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
    width: '100%',
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
  skipText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.mist,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.mist,
  },
});
