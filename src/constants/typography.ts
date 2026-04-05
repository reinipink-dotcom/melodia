import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography = {
  h1: {
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    color: Colors.white,
  } as TextStyle,

  h2: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    color: Colors.white,
  } as TextStyle,

  body: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    color: Colors.white,
  } as TextStyle,

  bodyLight: {
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Inter_300Light',
    color: Colors.white,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    color: Colors.mist,
  } as TextStyle,
};
