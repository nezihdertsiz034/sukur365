import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { KURAN_AYETLERI, getAyetByGun } from '../constants/kuranAyetleri';
import { KuranAyetiKart } from '../components/KuranAyetiKart';
import { useOrucZinciri } from '../hooks/useOrucZinciri';
import { BackgroundDecor } from '../components/BackgroundDecor';

export default function KuranAyetleriScreen() {
  const { zincirHalkalari } = useOrucZinciri();
  const [favoriAyetler, setFavoriAyetler] = useState<Set<string>>(new Set());
  const [gosterimModu, setGosterimModu] = useState<'gunluk' | 'tumu'>('gunluk');

  // Bugünün gün numarasını bul
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const bugununHalkasi = zincirHalkalari.find(h => {
    const halkaTarih = new Date(h.tarih);
    halkaTarih.setHours(0, 0, 0, 0);
    return halkaTarih.getTime() === bugun.getTime();
  });
  const bugununGunNumarasi = bugununHalkasi?.gunNumarasi || 1;

  const handleFavoriToggle = (ayetId: string) => {
    const yeniFavoriler = new Set(favoriAyetler);
    if (yeniFavoriler.has(ayetId)) {
      yeniFavoriler.delete(ayetId);
    } else {
      yeniFavoriler.add(ayetId);
    }
    setFavoriAyetler(yeniFavoriler);
  };

  const gosterilecekAyetler =
    gosterimModu === 'gunluk'
      ? [getAyetByGun(bugununGunNumarasi)]
      : KURAN_AYETLERI;

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📖 Kur'an Ayetleri</Text>

        {/* Görünüm Modu */}
        <View style={styles.modButonlari}>
          <TouchableOpacity
            style={[
              styles.modButonu,
              gosterimModu === 'gunluk' && styles.modButonuAktif,
            ]}
            onPress={() => setGosterimModu('gunluk')}
          >
            <Text
              style={[
                styles.modButonuText,
                gosterimModu === 'gunluk' && styles.modButonuTextAktif,
              ]}
            >
              📅 Günlük Ayet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modButonu,
              gosterimModu === 'tumu' && styles.modButonuAktif,
            ]}
            onPress={() => setGosterimModu('tumu')}
          >
            <Text
              style={[
                styles.modButonuText,
                gosterimModu === 'tumu' && styles.modButonuTextAktif,
              ]}
            >
              📚 Tüm Ayetler
            </Text>
          </TouchableOpacity>
        </View>

        {gosterimModu === 'gunluk' && (
          <View style={styles.gunlukBilgi}>
            <Text style={styles.gunlukBilgiText}>
              🌙 {bugununGunNumarasi}. Gün Ayeti
            </Text>
          </View>
        )}

        {/* Ayetler Listesi */}
        <View style={styles.ayetlerListContainer}>
          {gosterilecekAyetler.map((ayet) => (
            <KuranAyetiKart
              key={ayet.id}
              ayet={{
                ...ayet,
                favori: favoriAyetler.has(ayet.id),
              }}
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
  modButonlari: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modButonu: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modButonuAktif: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  modButonuText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  modButonuTextAktif: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontFamily: TYPOGRAPHY.display,
  },
  gunlukBilgi: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  gunlukBilgiText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.2,
  },
  ayetlerListContainer: {
    gap: 16,
  },
});
