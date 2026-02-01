import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import SplashWelcomeScreen from '../screens/SplashWelcomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import TabNavigator from './TabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SEHIR: '@sehir',
  ONBOARDING_TAMAMLANDI: '@onboarding_tamamlandi_v1',
} as const;

/**
 * Ana navigasyon yapısı - Tab Navigator ile
 */
export default function AppNavigator() {
  const [yukleniyor, setYukleniyor] = useState(true);
  const [splashGosterildi, setSplashGosterildi] = useState(false);
  const [sehirSecildi, setSehirSecildi] = useState(false);
  const [onboardingTamamlandi, setOnboardingTamamlandi] = useState(false);

  useEffect(() => {
    kontrolEtOnboarding();
  }, []);

  const kontrolEtOnboarding = async () => {
    try {
      // Şehir ve Onboarding durumlarını kontrol et
      const [sehirVeri, onboardingVeri] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SEHIR),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_TAMAMLANDI),
      ]);
      setSehirSecildi(!!sehirVeri);
      setOnboardingTamamlandi(!!onboardingVeri);
    } catch (error) {
      console.error('Onboarding kontrolü hatası:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleSplashComplete = () => {
    setSplashGosterildi(true);
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_TAMAMLANDI, 'true');
      setOnboardingTamamlandi(true);
    } catch (error) {
      console.error('Onboarding kaydetme hatası:', error);
    }
  };

  const handleSehirComplete = () => {
    setSehirSecildi(true);
  };

  if (yukleniyor) {
    return (
      <View style={styles.yukleniyorContainer}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
      </View>
    );
  }

  // Önce Splash Welcome ekranı göster (şehir seçilmemişse)
  if (!sehirSecildi && !splashGosterildi) {
    return <SplashWelcomeScreen onContinue={handleSplashComplete} />;
  }

  // Eğer şehir seçilmemişse WelcomeScreen (Şehir seçimi)
  if (!sehirSecildi) {
    return (
      <NavigationContainer>
        <WelcomeScreen onComplete={handleSehirComplete} />
      </NavigationContainer>
    );
  }

  // Şehir seçilmiş ama onboarding tamamlanmamışsa
  if (!onboardingTamamlandi) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <NavigationContainer>
      <TabNavigator />
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
