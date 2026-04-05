import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ModulesScreen } from '../screens/Modules/ModulesScreen';
import { PlaylistScreen } from '../screens/Playlist/PlaylistScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { Colors } from '../constants';

const Tab = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Modules: { active: 'grid', inactive: 'grid-outline' },
  Playlist: { active: 'musical-notes', inactive: 'musical-notes-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.coral,
        tabBarInactiveTintColor: Colors.mist,
        tabBarIcon: ({ focused, color, size }) => {
          const icon = ICONS[route.name];
          const name = focused ? icon.active : icon.inactive;
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_400Regular',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Modules" component={ModulesScreen} />
      <Tab.Screen name="Playlist" component={PlaylistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
