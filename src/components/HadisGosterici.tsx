import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getHadisByGun, Hadis } from '../constants/hadisler';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface HadisGostericiProps {
  gunNumarasi: number;
}

/**
 * Günlük hadis-i şerif gösterici bileşeni
 */
export const HadisGosterici: React.FC<HadisGostericiProps> = ({
  gunNumarasi,
}) => {
  const [hadis, setHadis] = useState<Hadis | null>(null);

  useEffect(() => {
    const hadisData = getHadisByGun(gunNumarasi);
    setHadis(hadisData);
  }, [gunNumarasi]);

  if (!hadis) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.baslikContainer}>
        <Text style={styles.baslik}>📖 {gunNumarasi}. Gün Hadis-i Şerif</Text>
      </View>
      
      <ScrollView style={styles.hadisContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.hadisMetin}>"{hadis.metin}"</Text>
        {hadis.kaynak && (
          <Text style={styles.hadisKaynak}>— {hadis.kaynak}</Text>
        )}
      </ScrollView>
      
      <View style={styles.altBilgi}>
        <Text style={styles.altBilgiText}>
          🌙 Ramazan ayının {gunNumarasi}. günü
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 8,
    padding: 24,
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  baslik: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
  },
  hadisContainer: {
    minHeight: 120,
    marginBottom: 16,
  },
  hadisMetin: {
    fontSize: 17,
    lineHeight: 28,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'justify',
    fontStyle: 'italic',
    marginBottom: 16,
    fontWeight: '400',
  },
  hadisKaynak: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 12,
  },
  altBilgi: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  altBilgiText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontWeight: '500',
  },
});

