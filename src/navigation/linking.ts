import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';

const parseNumber = (value: string): number => Number(value);

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'melodia://'],
  config: {
    screens: {
      MainTabs: {
        path: '',
        screens: {
          Modules: {
            path: 'modules',
            screens: {
              ModulesList: '',
              ModuleDetail: {
                path: 'module/:moduleId',
                parse: { moduleId: parseNumber },
              },
              PreListen: {
                path: 'module/:moduleId/prelisten',
                parse: { moduleId: parseNumber },
              },
              Listen: {
                path: 'module/:moduleId/listen',
                parse: { moduleId: parseNumber },
              },
              Quiz: {
                path: 'module/:moduleId/quiz',
                parse: { moduleId: parseNumber },
              },
              QuizResults: {
                path: 'module/:moduleId/results/:score/:total/:xpEarned',
                parse: {
                  moduleId: parseNumber,
                  score: parseNumber,
                  total: parseNumber,
                  xpEarned: parseNumber,
                },
              },
              Reading: {
                path: 'module/:moduleId/reading/:xpEarned',
                parse: {
                  moduleId: parseNumber,
                  xpEarned: parseNumber,
                },
              },
              LessonComplete: {
                path: 'module/:moduleId/complete/:xpEarned',
                parse: {
                  moduleId: parseNumber,
                  xpEarned: parseNumber,
                },
              },
            },
          },
        },
      },
    },
  },
};
