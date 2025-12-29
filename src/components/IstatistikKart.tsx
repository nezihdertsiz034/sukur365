import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface IstatistikKartProps {
  baslik: string;
  deger: string | number;
  altBaslik?: string;
  ikon?: string;
}

/**
 * Tek bir istatistik kartı bileşeni
 */
export const IstatistikKart: React.FC<IstatistikKartProps> = ({
  baslik,
  deger,
  altBaslik,
  ikon,
}) => {
  return (
    <View style={styles.container}>
      {ikon && <Text style={styles.ikon}>{ikon}</Text>}
      <Text style={styles.baslik}>{baslik}</Text>
      <Text style={styles.deger}>{deger}</Text>
      {altBaslik && <Text style={styles.altBaslik}>{altBaslik}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ikon: {
    fontSize: 32,
    marginBottom: 8,
  },
  baslik: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
    textAlign: 'center',
  },
  deger: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  altBaslik: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
  },
});

