import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from './BackgroundDecor';
import { useTheme } from '../hooks/useTheme';

interface EkstraScreenLayoutProps {
  baslik?: string;
  gosterBaslik?: boolean;
  children: React.ReactNode;
  geriDonHedef?: string; // İsteğe bağlı geri dönülecek ekran
}

export function EkstraScreenLayout({
  baslik,
  gosterBaslik = true,
  children,
  geriDonHedef,
}: EkstraScreenLayoutProps) {
  const navigation = useNavigation<any>();
  const canGoBack = navigation.canGoBack();
  const tema = useTheme();

  const handleGeriDon = () => {
    if (geriDonHedef) {
      navigation.navigate(geriDonHedef);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <BackgroundDecor />

      {/* Geri Dön Butonu - Minimal ve Şık */}
      {canGoBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGeriDon}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: tema.vurgu }]}>← Geri Dön</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {gosterBaslik && baslik ? (
          <Text style={[styles.title, { color: tema.yaziRenk }]}>{baslik}</Text>
        ) : (
          <View style={styles.baslikBosluk} />
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    overflow: 'hidden',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButtonText: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.4,
  },
  baslikBosluk: {
    height: 12,
  },
});
