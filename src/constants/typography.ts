import { Platform } from 'react-native';

export const TYPOGRAPHY = {
  display: Platform.select({
    ios: 'Avenir Next',
    android: 'serif',
    default: 'serif',
  }) as string,
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'serif',
    default: 'serif',
  }) as string,
  arabic: Platform.select({
    ios: 'Geeza Pro',
    android: 'serif',
    default: 'serif',
  }) as string,
};
