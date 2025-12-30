import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface MenuKartProps {
  ikon: string;
  baslik: string;
  aciklama?: string;
  onPress: () => void;
  renk?: string;
}

/**
 * Modern menü kartı bileşeni
 */
export const MenuKart: React.FC<MenuKartProps> = ({
  ikon,
  baslik,
  aciklama,
  onPress,
  renk,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, renk && { borderColor: renk }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.ikonContainer}>
        <Text style={[styles.ikon, renk && { color: renk }]}>{ikon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.baslik}>{baslik}</Text>
        {aciklama && <Text style={styles.aciklama}>{aciklama}</Text>}
      </View>
      <View style={styles.okContainer}>
        <Text style={styles.ok}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  ikonContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ikon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  baslik: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  aciklama: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '500',
    lineHeight: 18,
  },
  okContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  ok: {
    fontSize: 24,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '300',
  },
});

