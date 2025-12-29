import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { useIstatistikler } from '../hooks/useIstatistikler';
import { IstatistikKart } from '../components/IstatistikKart';
import { ProgressBar } from '../components/ProgressBar';
import { Rozet } from '../components/Rozet';
import { PaylasButonu } from '../components/PaylasButonu';

export default function IstatistiklerScreen() {
  const { istatistikler, yukleniyor, hata } = useIstatistikler();

  if (yukleniyor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
          <Text style={styles.yukleniyorText}>İstatistikler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hata) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.hataText}>{hata}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!istatistikler) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📊 İstatistikler</Text>

        {/* Ana İstatistikler */}
        <View style={styles.kartlarContainer}>
          <IstatistikKart
            baslik="Toplam Oruç"
            deger={istatistikler.toplamOruc}
            altBaslik={`/ ${istatistikler.toplamGun} gün`}
            ikon="📿"
          />
          <IstatistikKart
            baslik="Kesintisiz Zincir"
            deger={istatistikler.kesintisizZincir}
            altBaslik="gün"
            ikon="🔗"
          />
        </View>

        {/* İlerleme Çubuğu */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressBaslik}>Genel İlerleme</Text>
          <ProgressBar yuzdelik={istatistikler.yuzdelik} yukseklik={24} />
        </View>

        {/* Haftalık İstatistikler */}
        <View style={styles.haftalikContainer}>
          <Text style={styles.sectionBaslik}>Haftalık Oruç Sayıları</Text>
          <View style={styles.haftalikKartlar}>
            {istatistikler.haftalikOruc.map((haftaOruc, index) => (
              <View key={index} style={styles.haftalikKart}>
                <Text style={styles.haftalikBaslik}>{index + 1}. Hafta</Text>
                <Text style={styles.haftalikDeger}>{haftaOruc} gün</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rozetler */}
        {istatistikler.rozetler.length > 0 && (
          <View style={styles.rozetlerContainer}>
            <Text style={styles.sectionBaslik}>🏆 Başarı Rozetleri</Text>
            <View style={styles.rozetlerGrid}>
              {istatistikler.rozetler.map((rozet, index) => (
                <Rozet key={index} baslik={rozet} />
              ))}
            </View>
          </View>
        )}

        {istatistikler.rozetler.length === 0 && (
          <View style={styles.rozetlerContainer}>
            <Text style={styles.sectionBaslik}>🏆 Başarı Rozetleri</Text>
            <Text style={styles.rozetYokText}>
              Henüz rozet kazanmadınız. Oruç tutmaya devam edin! 💪
            </Text>
          </View>
        )}

        {/* Paylaşım Butonu */}
        <View style={styles.paylasContainer}>
          <PaylasButonu istatistikler={istatistikler} />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  hataText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.kirmiziYumusak,
    textAlign: 'center',
  },
  kartlarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    gap: 16,
  },
  progressContainer: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  progressBaslik: {
    fontSize: 18,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
  },
  haftalikContainer: {
    marginBottom: 24,
  },
  sectionBaslik: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 16,
  },
  haftalikKartlar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  haftalikKart: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  haftalikBaslik: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
  },
  haftalikDeger: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
  },
  rozetlerContainer: {
    marginBottom: 24,
  },
  rozetlerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rozetYokText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  paylasContainer: {
    marginTop: 24,
  },
});

