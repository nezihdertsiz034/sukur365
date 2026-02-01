import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useTheme } from '../hooks/useTheme';
import { Dua } from '../types';
import { DUALAR, getDualarByKategori } from '../constants/dualars';
import { DuaKart } from '../components/DuaKart';
import { BackgroundDecor } from '../components/BackgroundDecor';

type DuaKategori = 'sahur' | 'iftar' | 'oruc' | 'genel' | 'tumu';

const KATEGORI_RESIMLERI: { [key: string]: any } = {
  'tumu': require('../../assets/icons/kuran.png'),
  'sahur': require('../../assets/icons/iftar_sahur.png'),
  'iftar': require('../../assets/icons/iftar_sahur.png'),
  'oruc': require('../../assets/icons/tesbih.png'),
  'genel': require('../../assets/icons/dualar.png'),
};

export default function DualarScreen() {
  const navigation = useNavigation<any>();
  const [seciliKategori, setSeciliKategori] = useState<DuaKategori>('tumu');
  const [favoriDualar, setFavoriDualar] = useState<Set<string>>(new Set());
  const tema = useTheme();

  const getGosterilecekDualar = (): Dua[] => {
    if (seciliKategori === 'tumu') {
      return DUALAR.map(dua => ({
        ...dua,
        favori: favoriDualar.has(dua.id),
      }));
    }
    return getDualarByKategori(seciliKategori).map(dua => ({
      ...dua,
      favori: favoriDualar.has(dua.id),
    }));
  };

  const handleFavoriToggle = (duaId: string) => {
    const yeniFavoriler = new Set(favoriDualar);
    if (yeniFavoriler.has(duaId)) {
      yeniFavoriler.delete(duaId);
    } else {
      yeniFavoriler.add(duaId);
    }
    setFavoriDualar(yeniFavoriler);
  };

  const kategoriler: { key: DuaKategori; label: string }[] = [
    { key: 'tumu', label: 'Tümü' },
    { key: 'sahur', label: 'Sahur' },
    { key: 'iftar', label: 'İftar' },
    { key: 'oruc', label: 'Oruç' },
    { key: 'genel', label: 'Genel' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dualar</Text>

        {/* Kategori Seçimi */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.kategoriContainer}
          contentContainerStyle={styles.kategoriContent}
        >
          {kategoriler.map((kategori) => (
            <TouchableOpacity
              key={kategori.key}
              style={[
                styles.kategoriButon,
                { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta },
                seciliKategori === kategori.key && { backgroundColor: `${tema.vurgu}20`, borderColor: tema.vurgu }
              ]}
              onPress={() => setSeciliKategori(kategori.key)}
            >
              <View style={styles.kategoriIkonContainer}>
                <Image
                  source={KATEGORI_RESIMLERI[kategori.key]}
                  style={styles.kategoriResim}
                  resizeMode="cover"
                />
              </View>
              <Text
                style={[
                  styles.kategoriText,
                  seciliKategori === kategori.key && { color: tema.vurgu, fontWeight: 'bold' },
                ]}
              >
                {kategori.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Dua Asistanı Tanıtım Kartı */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => navigation.navigate('AIDua')}
        >
          <LinearGradient
            colors={[tema.ana, tema.arkaPlan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiGradient}
          >
            <View style={styles.aiInfo}>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>YENİ</Text>
              </View>
              <Text style={styles.aiTitle}>AI Dua Asistanı</Text>
              <Text style={styles.aiSubtitle}>Size özel dualar hazırlar</Text>
            </View>
            <View style={styles.aiIconCircle}>
              <Ionicons name="sparkles" size={24} color={ISLAMI_RENKLER.yesilOrta} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Dualar Listesi */}
        <View style={styles.dualarlistContainer}>
          {getGosterilecekDualar().map((dua) => (
            <DuaKart
              key={dua.id}
              dua={dua}
              onFavoriToggle={handleFavoriToggle}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.4,
  },
  kategoriContainer: {
    marginBottom: 24,
  },
  kategoriContent: {
    gap: 12,
  },
  kategoriButon: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 70,
  },
  kategoriButonAktif: {
    backgroundColor: ISLAMI_RENKLER.altinOrta + '20',
    borderColor: ISLAMI_RENKLER.altinOrta,
  },
  kategoriIkonContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    marginBottom: 6,
    overflow: 'hidden',
  },
  kategoriResim: {
    width: '100%',
    height: '100%',
  },
  kategoriText: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  kategoriTextAktif: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontFamily: TYPOGRAPHY.display,
  },
  dualarlistContainer: {
    gap: 16,
  },
  aiCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  aiGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiInfo: {
    flex: 1,
  },
  aiBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  aiBadgeText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 10,
    fontWeight: '800',
  },
  aiTitle: {
    fontSize: 22,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  aiSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: TYPOGRAPHY.body,
  },
  aiIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ISLAMI_RENKLER.yaziBeyaz,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});
