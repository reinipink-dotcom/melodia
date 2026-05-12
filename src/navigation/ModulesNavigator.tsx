import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModulesScreen } from '../screens/Modules/ModulesScreen';
import { ModuleDetailScreen } from '../screens/Modules/ModuleDetailScreen';
import { PreListenScreen } from '../screens/Lesson/PreListenScreen';
import { ListenScreen } from '../screens/Lesson/ListenScreen';
import { QuizScreen } from '../screens/Lesson/QuizScreen';
import { QuizResultsScreen } from '../screens/Lesson/QuizResultsScreen';
import { ReadingScreen } from '../screens/Lesson/ReadingScreen';
import { LessonCompleteScreen } from '../screens/Lesson/LessonCompleteScreen';

export type ModulesStackParamList = {
  ModulesList: undefined;
  ModuleDetail: { moduleId: number };
  PreListen: { moduleId: number };
  Listen: { moduleId: number };
  Quiz: { moduleId: number };
  QuizResults: { moduleId: number; score: number; total: number; xpEarned: number };
  Reading: { moduleId: number; xpEarned: number };
  LessonComplete: { moduleId: number; xpEarned: number };
};

const Stack = createStackNavigator<ModulesStackParamList>();

const lessonScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
  tabBarStyle: { display: 'none' as const },
};

export function ModulesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ModulesList" component={ModulesScreen} />
      <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
      <Stack.Screen name="PreListen" component={PreListenScreen} options={lessonScreenOptions} />
      <Stack.Screen name="Listen" component={ListenScreen} options={lessonScreenOptions} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={lessonScreenOptions} />
      <Stack.Screen name="QuizResults" component={QuizResultsScreen} options={lessonScreenOptions} />
      <Stack.Screen name="Reading" component={ReadingScreen} options={lessonScreenOptions} />
      <Stack.Screen name="LessonComplete" component={LessonCompleteScreen} options={lessonScreenOptions} />
    </Stack.Navigator>
  );
}
