import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { KuranAyeti } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../hooks/useTheme';

interface KuranAyetiKartProps {
  ayet: KuranAyeti;
  onFavoriToggle?: (ayetId: string) => void;
}

/**
 * Kur'an ayeti kartı bileşeni
 */
export const KuranAyetiKart: React.FC<KuranAyetiKartProps> = ({
  ayet,
  onFavoriToggle,
}) => {
  const { yaziBoyutuCarpani } = useSettings();
  const tema = useTheme();

  const handlePaylas = async () => {
    try {
      const paylasMetni = `${ayet.sure} Suresi, ${ayet.ayetNumarasi}. Ayet\n\n${ayet.arapca}\n\n${ayet.turkceMeal}`;

      // Paylaşım için metin olarak paylaş
      await Share.share({
        message: paylasMetni,
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.glassBackground }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.sureBaslik, { fontSize: 20 * yaziBoyutuCarpani }]}>{ayet.sure} Suresi</Text>
          <Text style={[styles.ayetNumarasi, { fontSize: 14 * yaziBoyutuCarpani }]}>{ayet.ayetNumarasi}. Ayet</Text>
        </View>
        {onFavoriToggle && (
          <TouchableOpacity onPress={() => onFavoriToggle(ayet.id)}>
            <Text style={styles.favoriIcon}>
              {ayet.favori ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.arapcaContainer}>
        <Text style={[styles.arapca, { fontSize: 20 * yaziBoyutuCarpani }]}>{ayet.arapca}</Text>
      </View>

      <View style={styles.mealContainer}>
        <Text style={[styles.mealLabel, { fontSize: 14 * yaziBoyutuCarpani }]}>Türkçe Meali:</Text>
        <Text style={[styles.meal, { fontSize: 16 * yaziBoyutuCarpani, lineHeight: 16 * yaziBoyutuCarpani * 1.6 }]}>{ayet.turkceMeal}</Text>
      </View>

      <TouchableOpacity
        style={[styles.paylasButonu, { backgroundColor: `${tema.vurgu}15`, borderColor: `${tema.vurgu}33` }]}
        onPress={handlePaylas}
      >
        <Text style={[styles.paylasText, { color: tema.vurgu || ISLAMI_RENKLER.yaziBeyaz }]}>📤 Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  sureBaslik: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 6,
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.display,
  },
  ayetNumarasi: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  favoriIcon: {
    fontSize: 24,
  },
  arapcaContainer: {
    marginBottom: 18,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  arapca: {
    fontSize: 20,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'right',
    lineHeight: 36,
    writingDirection: 'rtl',
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.arabic,
  },
  mealContainer: {
    marginBottom: 16,
  },
  mealLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  meal: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'justify',
    fontFamily: TYPOGRAPHY.body,
  },
  paylasButonu: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paylasText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: TYPOGRAPHY.body,
  },
});

