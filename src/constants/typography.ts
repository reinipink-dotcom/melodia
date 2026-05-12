import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography = {
  h1: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.white,
  } as TextStyle,

  h2: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.white,
  } as TextStyle,

  body: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.white,
  } as TextStyle,

  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'BeVietnamPro_500Medium',
    color: Colors.white,
  } as TextStyle,

  bodyLight: {
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.white,
  } as TextStyle,

  label: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.mist,
  } as TextStyle,
};
