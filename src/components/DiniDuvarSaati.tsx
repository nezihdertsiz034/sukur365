import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

/**
 * Dini motifli duvar saati bileşeni
 */
export const DiniDuvarSaati: React.FC = () => {
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
    return `${saat}:${dakika}`;
  };

  const formatSaniye = (date: Date): string => {
    return String(date.getSeconds()).padStart(2, '0');
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

  // Hicri tarih için yaklaşık hesaplama (basitleştirilmiş)
  const getHicriTarih = (date: Date): string => {
    // Basit bir yaklaşık hesaplama (tam doğru değil ama gösterim için)
    const miladiYil = date.getFullYear();
    const hicriYil = Math.floor((miladiYil - 622) * 1.0307);
    return `Hicri: ${hicriYil}`;
  };

  return (
    <View style={styles.container}>
      {/* Üst dekoratif çizgi */}
      <View style={styles.dekoratifCizgi} />
      
      {/* Ana saat çerçevesi */}
      <View style={styles.saatCercevesi}>
        {/* Arka plan Arapça motif - Allah */}
        <View style={styles.arapcaMotifContainer}>
          <Text style={styles.arapcaMotifBuyuk}>الله</Text>
          <Text style={styles.arapcaMotifKucuk1}>الله</Text>
          <Text style={styles.arapcaMotifKucuk2}>الله</Text>
        </View>
        
        {/* Köşe süslemeleri */}
        <View style={[styles.koseSusleme, styles.solUst]} />
        <View style={[styles.koseSusleme, styles.sagUst]} />
        <View style={[styles.koseSusleme, styles.solAlt]} />
        <View style={[styles.koseSusleme, styles.sagAlt]} />
        
        {/* Merkez saat */}
        <View style={styles.saatContainer}>
          <Text style={styles.saatMetin}>{formatSaat(saat)}</Text>
          <View style={styles.saniyeContainer}>
            <Text style={styles.saniyeMetin}>{formatSaniye(saat)}</Text>
          </View>
        </View>
        
        {/* Alt kısım - Tarih bilgisi */}
        <View style={styles.tarihContainer}>
          <Text style={styles.tarihMetin}>{formatTarih(saat)}</Text>
          <Text style={styles.hicriMetin}>{getHicriTarih(saat)}</Text>
        </View>
      </View>

      {/* Alt dekoratif çizgi */}
      <View style={styles.dekoratifCizgi} />
      
      {/* Dini motifler */}
      <View style={styles.motifContainer}>
        <Text style={styles.motifText}>☪️ 🌙 ✨</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  dekoratifCizgi: {
    width: '60%',
    height: 2,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    marginVertical: 8,
    borderRadius: 1,
  },
  saatCercevesi: {
    width: '100%',
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 24,
    padding: 24,
    borderWidth: 3,
    borderColor: ISLAMI_RENKLER.altinOrta,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    minHeight: 200,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arapcaMotifContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  arapcaMotifBuyuk: {
    fontSize: 90,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    opacity: 0.12,
    writingDirection: 'rtl',
  },
  arapcaMotifKucuk1: {
    fontSize: 45,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '8%',
    right: '8%',
    opacity: 0.08,
    writingDirection: 'rtl',
  },
  arapcaMotifKucuk2: {
    fontSize: 45,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: '8%',
    left: '8%',
    opacity: 0.08,
    writingDirection: 'rtl',
  },
  koseSusleme: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  solUst: {
    top: 12,
    left: 12,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  sagUst: {
    top: 12,
    right: 12,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  solAlt: {
    bottom: 12,
    left: 12,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  sagAlt: {
    bottom: 12,
    right: 12,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  saatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  saatMetin: {
    fontSize: 64,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  saniyeContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saniyeMetin: {
    fontSize: 20,
    fontWeight: '600',
    color: ISLAMI_RENKLER.altinAcik,
    letterSpacing: 1,
  },
  tarihContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  tarihMetin: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '500',
    marginBottom: 4,
  },
  hicriMetin: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  motifContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  motifText: {
    fontSize: 24,
    letterSpacing: 8,
  },
});

