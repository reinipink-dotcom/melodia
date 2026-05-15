import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import ProgressDots from './components/ProgressDots';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Science'>;
};

const CARDS = [
  {
    icon: 'flash' as const,
    color: Colors.amber,
    stat: '2–4×',
    title: 'Better retention',
    body: 'Vocabulary tied to an emotional or musical experience is stored 2–4× more durably than rote memorization. The brain tags emotional moments as "worth keeping."',
    source: 'Cahill et al., UC Irvine (1994)',
  },
  {
    icon: 'repeat' as const,
    color: Colors.teal,
    stat: 'Free replay',
    title: 'The earworm effect',
    body: "Songs get stuck in your head involuntarily. That loop isn't annoying — it's rehearsal. Every time a melody replays, the words replay with it.",
    source: 'Williamson et al., Journal of Psychology of Music (2012)',
  },
  {
    icon: 'git-network' as const,
    color: Colors.lavender,
    stat: 'Both hemispheres',
    title: 'More brain, more memory',
    body: 'Music activates more brain regions simultaneously than almost any other activity — language, emotion, motor, and memory centers all fire at once. More activation = stronger encoding.',
    source: 'Peretz & Coltheart, Nature Neuroscience (2003)',
  },
];

export default function ScienceScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={6} current={4} label="THE SCIENCE" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>WHY IT WORKS</Text>
          <Text style={styles.headline}>
            Music isn't just{'\n'}
            <Text style={styles.accentItalic}>fun.</Text>
            {' '}It's{' '}
            <Text style={styles.accentCoral}>science.</Text>
          </Text>
          <Text style={styles.subtext}>
            Researchers have studied music-based language learning for decades. Here's what they found.
          </Text>
        </View>

        {/* Stat cards */}
        <View style={styles.cards}>
          {CARDS.map((card, i) => (
            <View key={i} style={styles.card}>
              <LinearGradient
                colors={[card.color + '18', 'transparent']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={[styles.iconBox, { backgroundColor: card.color + '22' }]}>
                <Ionicons name={card.icon} size={20} color={card.color} />
              </View>
              <Text style={[styles.cardStat, { color: card.color }]}>{card.stat}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardBody}>{card.body}</Text>
              <Text style={styles.cardSource}>{card.source}</Text>
            </View>
          ))}
        </View>

        {/* Bottom quote */}
        <View style={styles.quoteBlock}>
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.coral} style={{ marginBottom: 10 }} />
          <Text style={styles.quoteText}>
            "The relationship between music and language is not metaphorical. They share neural resources, and training one strengthens the other."
          </Text>
          <Text style={styles.quoteAuthor}>— Dr. Nina Kraus, Northwestern University Auditory Neuroscience Lab</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Commitment')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>I'm ready to lock in</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  ambientGlow: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.lavender,
    opacity: 0.04,
  },

  headerBlock: {
    marginBottom: 24,
    gap: 8,
  },
  eyebrow: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.mist,
  },
  headline: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 42,
  },
  accentItalic: {
    color: Colors.white,
    fontStyle: 'italic',
  },
  accentCoral: {
    color: Colors.coral,
  },
  subtext: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 15,
    color: Colors.mist,
    lineHeight: 22,
  },

  cards: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    gap: 6,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardStat: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 26,
    letterSpacing: -0.5,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: Colors.white,
  },
  cardBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.mist,
    lineHeight: 20,
  },
  cardSource: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 11,
    color: Colors.mist,
    opacity: 0.5,
    marginTop: 2,
    fontStyle: 'italic',
  },

  quoteBlock: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: 20,
  },
  quoteText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: Colors.white,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12,
    color: Colors.coral,
    opacity: 0.85,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
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
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: '#fff',
  },
});
