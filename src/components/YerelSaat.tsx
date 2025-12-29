import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface YerelSaatProps {
  style?: any;
}

/**
 * Yerel saati gösteren bileşen
 */
export const YerelSaat: React.FC<YerelSaatProps> = ({ style }) => {
  const [saat, setSaat] = useState(new Date());

  useEffect(() => {
    // Her saniye güncelle
    const timer = setInterval(() => {
      setSaat(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatSaat = (date: Date): string => {
    const saat = String(date.getHours()).padStart(2, '0');
    const dakika = String(date.getMinutes()).padStart(2, '0');
    const saniye = String(date.getSeconds()).padStart(2, '0');
    return `${saat}:${dakika}:${saniye}`;
  };

  const formatTarih = (date: Date): string => {
    const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const aylar = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const gun = gunler[date.getDay()];
    const gunNumarasi = date.getDate();
    const ay = aylar[date.getMonth()];
    const yil = date.getFullYear();

    return `${gun}, ${gunNumarasi} ${ay} ${yil}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.saat}>{formatSaat(saat)}</Text>
      <Text style={styles.tarih}>{formatTarih(saat)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: ISLAMI_RENKLER.arkaPlanAcik,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.yesilAcik,
  },
  saat: {
    fontSize: 48,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yesilKoyu,
    marginBottom: 8,
  },
  tarih: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yesilOrta,
    fontWeight: '500',
  },
});

