import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface BildirimAyarKartProps {
  baslik: string;
  aciklama?: string;
  aktif: boolean;
  onValueChange: (value: boolean) => void;
  ikon?: string;
}

/**
 * Bildirim ayar kartı bileşeni
 */
export const BildirimAyarKart: React.FC<BildirimAyarKartProps> = ({
  baslik,
  aciklama,
  aktif,
  onValueChange,
  ikon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {ikon && <Text style={styles.ikon}>{ikon}</Text>}
        <View style={styles.textContainer}>
          <Text style={styles.baslik}>{baslik}</Text>
          {aciklama && <Text style={styles.aciklama}>{aciklama}</Text>}
        </View>
      </View>
      <Switch
        value={aktif}
        onValueChange={onValueChange}
        trackColor={{
          false: 'rgba(255, 255, 255, 0.3)',
          true: ISLAMI_RENKLER.altinOrta,
        }}
        thumbColor={ISLAMI_RENKLER.yaziBeyaz}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ikon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  baslik: {
    fontSize: 16,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  aciklama: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
});


