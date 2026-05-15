import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/Onboarding/SplashScreen';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import LevelScreen from '../screens/Onboarding/LevelScreen';
import GenreScreen from '../screens/Onboarding/GenreScreen';
import PlatformScreen from '../screens/Onboarding/PlatformScreen';
import GoalScreen from '../screens/Onboarding/GoalScreen';
import ScienceScreen from '../screens/Onboarding/ScienceScreen';
import CommitmentScreen from '../screens/Onboarding/CommitmentScreen';
import CreateAccountScreen from '../screens/Onboarding/CreateAccountScreen';

export type OnboardingStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Level: undefined;
  Genre: undefined;
  Platform: undefined;
  Goal: undefined;
  Science: undefined;
  Commitment: undefined;
  CreateAccount: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Level" component={LevelScreen} />
      <Stack.Screen name="Genre" component={GenreScreen} />
      <Stack.Screen name="Platform" component={PlatformScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="Science" component={ScienceScreen} />
      <Stack.Screen name="Commitment" component={CommitmentScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </Stack.Navigator>
  );
}
