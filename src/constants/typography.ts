import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography = {
  display: {
    fontSize: 48,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 52,
  } as TextStyle,

  h1: {
    fontSize: 36,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.white,
    letterSpacing: -0.5,
    lineHeight: 42,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.white,
    letterSpacing: -0.3,
  } as TextStyle,

  label: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.mist,
    letterSpacing: 2,
  } as TextStyle,

  body: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.white,
    lineHeight: 22,
  } as TextStyle,

  bodyMedium: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro_500Medium',
    color: Colors.white,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.mist,
    lineHeight: 18,
  } as TextStyle,
};
