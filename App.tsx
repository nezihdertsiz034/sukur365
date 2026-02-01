import 'react-native-gesture-handler';
import './src/setupLogBox';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './src/navigation/AppNavigator';
import { configureNotifications } from './src/services/notifications/configureNotifications';
import { SettingsProvider } from './src/context/SettingsContext';

// Arka plan mesaj işleyicisi (App kapalıyken çalışır)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Arka planda mesaj geldi:', remoteMessage);
});

export default function App() {
  useEffect(() => {
    // App açılışında bildirim kanallarını yapılandır
    configureNotifications().catch((error) => {
      console.error('Bildirim yapılandırması hatası:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
