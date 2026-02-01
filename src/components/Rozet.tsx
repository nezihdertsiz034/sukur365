import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { useTheme } from '../hooks/useTheme';

interface RozetProps {
  baslik: string;
  ikon?: string;
}

/**
 * Başarı rozeti bileşeni
 */
export const Rozet: React.FC<RozetProps> = ({ baslik, ikon = '🏆' }) => {
  const tema = useTheme();
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderColor: tema.vurgu,
        shadowColor: tema.vurgu
      }
    ]}>
      <Text style={styles.ikon}>{ikon}</Text>
      <Text style={styles.baslik}>{baslik}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.altinAcik,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ikon: {
    fontSize: 40,
    marginBottom: 8,
  },
  baslik: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    fontWeight: '600',
  },
});

