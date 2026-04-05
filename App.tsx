import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/constants';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.midnight, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.coral} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
