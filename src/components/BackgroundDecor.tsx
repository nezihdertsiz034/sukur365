import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

export const BackgroundDecor: React.FC = () => {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowMid} />
      <View style={styles.glowBottom} />
      <View style={styles.ring} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  glowMid: {
    position: 'absolute',
    top: 140,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${ISLAMI_RENKLER.altinAcik}1A`,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -120,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  ring: {
    position: 'absolute',
    top: 60,
    right: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});
