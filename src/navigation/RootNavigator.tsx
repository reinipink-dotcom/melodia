import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  MainTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
