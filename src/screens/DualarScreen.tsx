import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { Dua } from '../types';
import { DUALAR, getDualarByKategori } from '../constants/dualars';
import { DuaKart } from '../components/DuaKart';
import { BackgroundDecor } from '../components/BackgroundDecor';

type DuaKategori = 'sahur' | 'iftar' | 'oruc' | 'genel' | 'tumu';

export default function DualarScreen() {
  const [seciliKategori, setSeciliKategori] = useState<DuaKategori>('tumu');
  const [favoriDualar, setFavoriDualar] = useState<Set<string>>(new Set());

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

  const kategoriler: { key: DuaKategori; label: string; ikon: string }[] = [
    { key: 'tumu', label: 'Tümü', ikon: '📖' },
    { key: 'sahur', label: 'Sahur', ikon: '🌅' },
    { key: 'iftar', label: 'İftar', ikon: '🌇' },
    { key: 'oruc', label: 'Oruç', ikon: '📿' },
    { key: 'genel', label: 'Genel', ikon: '🤲' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🤲 Dualar</Text>

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
                seciliKategori === kategori.key && styles.kategoriButonAktif,
              ]}
              onPress={() => setSeciliKategori(kategori.key)}
            >
              <Text style={styles.kategoriIkon}>{kategori.ikon}</Text>
              <Text
                style={[
                  styles.kategoriText,
                  seciliKategori === kategori.key && styles.kategoriTextAktif,
                ]}
              >
                {kategori.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 80,
  },
  kategoriButonAktif: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  kategoriIkon: {
    fontSize: 24,
    marginBottom: 4,
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
});
