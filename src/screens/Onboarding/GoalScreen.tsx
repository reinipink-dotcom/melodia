import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { Colors } from '../../constants/colors';
import { useOnboardingStore, DailyGoal } from '../../store/onboardingStore';
import ProgressDots from './components/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import MascotIcon from '../../components/MascotIcon';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Goal'>;
};

type GoalItem = {
  value: DailyGoal;
  label: string;
  sub: string;
  tag: string;
};

const goals: GoalItem[] = [
  { value: 5, label: '5 min', sub: 'A small daily habit', tag: 'Casual' },
  { value: 10, label: '10 min', sub: 'A solid routine', tag: 'Regular' },
  { value: 15, label: '15 min', sub: 'Committed learner', tag: 'Serious' },
  { value: 20, label: '20+ min', sub: 'Full immersion mode', tag: 'Intense' },
];

export default function GoalScreen({ navigation }: Props) {
  const { dailyGoal, setDailyGoal } = useOnboardingStore();

  const handleSelect = (val: DailyGoal) => {
    setDailyGoal(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={6} current={3} label="DAILY RHYTHM" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.mascotRow}>
          <MascotIcon size={64} animate />
        </View>

        <Text style={styles.headline}>
          Find your <Text style={styles.accentItalic}>tempo.</Text>
        </Text>
        <Text style={styles.subtext}>
          Small daily sessions are the key to mastering a new culture. How much do you want to tune in today?
        </Text>

        <View style={styles.options}>
          {goals.map((item) => {
            const selected = dailyGoal === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.85}
              >
                <View style={styles.cardLeft}>
                  <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardSub}>{item.sub}</Text>
                </View>
                <View style={styles.cardRight}>
                  <View style={[styles.tag, selected && styles.tagSelected]}>
                    <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
                      {item.tag}
                    </Text>
                  </View>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quote */}
        <View style={styles.quoteBox}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.amber} style={{ marginBottom: 8 }} />
          <Text style={styles.quoteText}>
            "Learning a language is like practicing an instrument. Ten minutes of focused daily rhythm beats an hour once a week every time."
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, !dailyGoal && styles.ctaDisabled]}
          onPress={() => dailyGoal && navigation.navigate('Science')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Set Daily Goal</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Science')}>
          <Text style={styles.skipText}>You can change this anytime in settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
  },
  mascotRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headline: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 38,
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 44,
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
    marginBottom: 16,
  },
  options: { gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 18,
    padding: 20,
  },
  cardSelected: {
    backgroundColor: Colors.surfaceHigh,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLeft: { gap: 4 },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: Colors.white,
  },
  cardLabelSelected: { color: Colors.coral },
  cardSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.mist,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tag: {
    backgroundColor: Colors.surfaceHighest,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagSelected: { backgroundColor: Colors.coral + '33' },
  tagText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: Colors.mist,
  },
  tagTextSelected: { color: Colors.coral },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  radioSelected: { borderColor: Colors.coral, opacity: 1 },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.coral,
  },
  quoteBox: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  quoteText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.mist,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 12,
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
    fontSize: 13,
    color: Colors.mist,
    textAlign: 'center',
    opacity: 0.7,
  },
});
