import React, { useMemo } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export const BackgroundDecor: React.FC = () => {
  const tema = useTheme();

  // Tema durumuna göre arka plan görselini seç (Daha kesin çözüm)
  const arkaPlanGorseli = useMemo(() => {
    // hooks/useTheme içinden gelen isDark özelliğini kullan
    if (tema.isDark) {
      return require('../../assets/images/bg_night.png');
    }
    return require('../../assets/images/bg_day.png');
  }, [tema.isDark]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={arkaPlanGorseli}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Metin okunabilirliği için hafif bir karartma/yumuşatma katmanı */}
        <View
          style={[
            styles.overlay,
            { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }
          ]}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  imageBackground: {
    width: width,
    height: height,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
