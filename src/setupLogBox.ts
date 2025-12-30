import { LogBox, Platform } from 'react-native';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

if (isExpoGo && Platform.OS === 'android') {
  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53.',
  ]);
}
