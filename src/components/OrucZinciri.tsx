import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ZincirHalkasi } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface OrucZinciriProps {
  halkalar: ZincirHalkasi[];
  yukleniyor?: boolean;
  onHalkaPress: (tarih: Date, mevcutDurum: boolean) => void;
}

/**
 * 2026 Ramazan oruç zinciri görselleştirme bileşeni
 */
export const OrucZinciri: React.FC<OrucZinciriProps> = ({
  halkalar,
  yukleniyor = false,
  onHalkaPress,
}) => {
  const formatTarih = (tarih: Date): string => {
    const gun = String(tarih.getDate()).padStart(2, '0');
    const ay = String(tarih.getMonth() + 1).padStart(2, '0');
    return `${gun}.${ay}`;
  };

  const formatGunAdi = (tarih: Date): string => {
    const gunler = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return gunler[tarih.getDay()];
  };

  const isaretliSayisi = halkalar.filter(h => h.isaretli).length;
  const toplamGun = halkalar.length;

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.yesilOrta} />
        <Text style={styles.yukleniyorText}>Zincir yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.baslikContainer}>
        <Text style={styles.baslik}>📿 2026 Ramazan Oruç Zinciri</Text>
        <Text style={styles.istatistik}>
          {isaretliSayisi} / {toplamGun} gün
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.zincirContainer}
      >
        {halkalar.map((halka, index) => (
          <TouchableOpacity
            key={`${halka.tarih.getTime()}-${index}`}
            style={[
              styles.halka,
              halka.isaretli && styles.halkaIsaretli,
              halka.bugunMu && styles.halkaBugun,
            ]}
            onPress={() => onHalkaPress(halka.tarih, halka.isaretli)}
            activeOpacity={0.7}
          >
            <Text style={styles.halkaGunNumarasi}>{halka.gunNumarasi}</Text>
            <Text
              style={[
                styles.halkaTarih,
                halka.isaretli && styles.halkaTarihIsaretli,
              ]}
            >
              {formatTarih(halka.tarih)}
            </Text>
            <Text
              style={[
                styles.halkaGunAdi,
                halka.isaretli && styles.halkaGunAdiIsaretli,
              ]}
            >
              {formatGunAdi(halka.tarih)}
            </Text>
            {halka.isaretli && (
              <Text style={styles.halkaIsaret}>✓</Text>
            )}
            {halka.bugunMu && (
              <View style={styles.bugunGostergesi}>
                <Text style={styles.bugunText}>BUGÜN</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.aciklama}>
        💡 Günlere dokunarak oruç tuttuğunuz günleri işaretleyin
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  baslikContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 6,
  },
  istatistik: {
    fontSize: 18,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '700',
  },
  zincirContainer: {
    paddingVertical: 8,
  },
  halka: {
    width: 75,
    height: 95,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    marginRight: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  halkaIsaretli: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 2,
  },
  halkaBugun: {
    borderColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  halkaGunNumarasi: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  halkaTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 2,
    fontWeight: '500',
  },
  halkaTarihIsaretli: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
  },
  halkaGunAdi: {
    fontSize: 10,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  halkaGunAdiIsaretli: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
  },
  halkaIsaret: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: 18,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: 'bold',
  },
  bugunGostergesi: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bugunText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  aciklama: {
    marginTop: 20,
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

