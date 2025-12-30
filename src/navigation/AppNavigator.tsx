import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import SplashWelcomeScreen from '../screens/SplashWelcomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import TabNavigator from './TabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SEHIR: '@sehir',
} as const;

/**
 * Ana navigasyon yapısı - Tab Navigator ile
 */
export default function AppNavigator() {
  const [yukleniyor, setYukleniyor] = useState(true);
  const [splashGosterildi, setSplashGosterildi] = useState(false);
  const [onboardingTamamlandi, setOnboardingTamamlandi] = useState(false);

  useEffect(() => {
    kontrolEtOnboarding();
  }, []);

  const kontrolEtOnboarding = async () => {
    try {
      // Şehir seçilip seçilmediğini kontrol et
      const sehirVeri = await AsyncStorage.getItem(STORAGE_KEYS.SEHIR);
      setOnboardingTamamlandi(!!sehirVeri);
    } catch (error) {
      console.error('Onboarding kontrolü hatası:', error);
      setOnboardingTamamlandi(false);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleSplashComplete = () => {
    setSplashGosterildi(true);
  };

  const handleOnboardingComplete = () => {
    setOnboardingTamamlandi(true);
  };

  if (yukleniyor) {
    return (
      <View style={styles.yukleniyorContainer}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
      </View>
    );
  }

  // Önce Splash Welcome ekranı göster (şehir seçilmemişse)
  if (!onboardingTamamlandi && !splashGosterildi) {
    return <SplashWelcomeScreen onContinue={handleSplashComplete} />;
  }

  return (
    <NavigationContainer>
      {!onboardingTamamlandi ? (
        <WelcomeScreen onComplete={handleOnboardingComplete} />
      ) : (
        <TabNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  yukleniyorContainer: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
