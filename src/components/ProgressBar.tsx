import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface ProgressBarProps {
  yuzdelik: number;
  yukseklik?: number;
  gosterYuzde?: boolean;
}

/**
 * İlerleme çubuğu bileşeni (basit animasyon)
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  yuzdelik,
  yukseklik = 20,
  gosterYuzde = true,
}) => {
  const clampedYuzde = Math.min(100, Math.max(0, yuzdelik));
  const [gosterilenYuzde, setGosterilenYuzde] = useState(0);

  useEffect(() => {
    // Basit sayı animasyonu
    const interval = setInterval(() => {
      setGosterilenYuzde((prev) => {
        if (prev < clampedYuzde) {
          return Math.min(prev + 2, clampedYuzde);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [clampedYuzde]);

  return (
    <View style={styles.container}>
      <View style={[styles.barContainer, { height: yukseklik }]}>
        <View
          style={[
            styles.bar,
            {
              width: `${clampedYuzde}%`,
              height: yukseklik,
            },
          ]}
        />
      </View>
      {gosterYuzde && (
        <Text style={styles.yuzdeText}>{Math.round(gosterilenYuzde)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bar: {
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    borderRadius: 10,
  },
  yuzdeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
  },
});

