import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { DiniDuvarSaati } from '../components/DiniDuvarSaati';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { HadisGosterici } from '../components/HadisGosterici';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';
import { useOrucZinciri } from '../hooks/useOrucZinciri';
import { useBildirimler } from '../hooks/useBildirimler';
import { ISLAMI_RENKLER } from '../constants/renkler';

export default function HomeScreen() {
  const navigation = useNavigation();
  // Bildirimleri başlat
  useBildirimler();
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();
  const { zincirHalkalari, yukleniyor: zincirYukleniyor, toplamIsaretli, gunuIsaretle } = useOrucZinciri();
  
  // Bugünün gün numarasını bul
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const bugununHalkasi = zincirHalkalari.find(h => {
    const halkaTarih = new Date(h.tarih);
    halkaTarih.setHours(0, 0, 0, 0);
    return halkaTarih.getTime() === bugun.getTime();
  });
  const bugununGunNumarasi = bugununHalkasi?.gunNumarasi || 1;

  const handleHalkaPress = async (tarih: Date, mevcutDurum: boolean) => {
    try {
      const yeniDurum = !mevcutDurum;
      await gunuIsaretle(tarih, yeniDurum);
    } catch (error) {
      Alert.alert('Hata', 'Gün işaretlenirken bir hata oluştu.');
      console.error('Halka işaretlenirken hata:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DiniDuvarSaati />
        
        <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        <OrucZinciri
          halkalar={zincirHalkalari}
          yukleniyor={zincirYukleniyor}
          onHalkaPress={handleHalkaPress}
        />

        {hata && (
          <View style={styles.hataContainer}>
            <Text style={styles.hataText}>{hata}</Text>
          </View>
        )}

        {/* Hadis gösterici en altta */}
        <View style={styles.hadisContainer}>
          <HadisGosterici gunNumarasi={bugununGunNumarasi} />
        </View>

        {/* Menü butonları */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('İstatistikler' as never)}
          >
            <Text style={styles.menuButtonText}>📊 İstatistikler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Dualar' as never)}
          >
            <Text style={styles.menuButtonText}>🤲 Dualar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Kur\'an Ayetleri' as never)}
          >
            <Text style={styles.menuButtonText}>📖 Kur'an</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Notlar' as never)}
          >
            <Text style={styles.menuButtonText}>📝 Notlar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Ekstra Özellikler' as never)}
          >
            <Text style={styles.menuButtonText}>✨ Ekstra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Ayarlar' as never)}
          >
            <Text style={styles.menuButtonText}>⚙️ Ayarlar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  hataContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.kirmiziYumusak,
  },
  hataText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
  },
  hadisContainer: {
    marginTop: 8,
  },
  menuContainer: {
    margin: 16,
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuButton: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuButtonText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 14,
    fontWeight: '600',
  },
});

