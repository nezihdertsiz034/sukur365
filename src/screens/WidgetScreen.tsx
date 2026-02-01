import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';
import { saniyeToZaman } from '../utils/namazVakitleri';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WidgetScreen() {
  const { vakitler } = useNamazVakitleri();
  const [kalanSure, setKalanSure] = useState<number | null>(null);
  const [kalanEtiket, setKalanEtiket] = useState('İftara kalan');
  const [seciliBoyut, setSeciliBoyut] = useState<'K' | 'O' | 'B'>('O'); // Küçük, Orta, Büyük
  const [isSyncing, setIsSyncing] = useState(false);

  const bugunMetni = useMemo(() => {
    const bugun = new Date();
    return bugun.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  useEffect(() => {
    if (!vakitler) return;

    const guncelleKalanSure = () => {
      const simdi = new Date();
      const simdiToplam = simdi.getHours() * 3600 + simdi.getMinutes() * 60 + simdi.getSeconds();

      const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
      const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);

      const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
      const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

      if (simdiToplam < imsakToplam) {
        setKalanEtiket('Sahura kalan');
        setKalanSure(imsakToplam - simdiToplam);
        return;
      }

      if (simdiToplam < aksamToplam) {
        setKalanEtiket('İftara kalan');
        setKalanSure(aksamToplam - simdiToplam);
        return;
      }

      setKalanEtiket('Yarın için hazır');
      setKalanSure(null);
    };

    guncelleKalanSure();
    const timer = setInterval(guncelleKalanSure, 1000);

    return () => clearInterval(timer);
  }, [vakitler]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const formatKalanSure = (sure: number | null) => {
    if (sure === null) return '--:--:--';
    const zaman = saniyeToZaman(Math.max(0, sure));
    return `${String(zaman.saat).padStart(2, '0')}:${String(zaman.dakika).padStart(2, '0')}:${String(zaman.saniye).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🧩 Ana Ekran Widget</Text>

        <View style={styles.bolum}>
          <View style={styles.bolumHeader}>
            <Text style={styles.bolumBaslik}>🔎 Widget Önizleme</Text>
            <TouchableOpacity onPress={handleSync} disabled={isSyncing}>
              <Ionicons
                name={isSyncing ? "sync" : "refresh-circle"}
                size={24}
                color={ISLAMI_RENKLER.altinAcik}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.boyutSecici}>
            {(['K', 'O', 'B'] as const).map(boyut => (
              <TouchableOpacity
                key={boyut}
                style={[styles.boyutButon, seciliBoyut === boyut && styles.boyutButonAktif]}
                onPress={() => setSeciliBoyut(boyut)}
              >
                <Text style={[styles.boyutButonText, seciliBoyut === boyut && styles.boyutButonTextAktif]}>
                  {boyut === 'K' ? 'Küçük' : boyut === 'O' ? 'Orta' : 'Büyük'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[
            styles.widgetKart,
            seciliBoyut === 'K' && styles.widgetKüçük,
            seciliBoyut === 'B' && styles.widgetBüyük
          ]}>
            <LinearGradient
              colors={[ISLAMI_RENKLER.yesilOrta, ISLAMI_RENKLER.arkaPlanYesil]}
              style={styles.widgetGradient}
            >
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetBaslik}>Şükür365</Text>
                <Ionicons name="moon" size={16} color={ISLAMI_RENKLER.altinAcik} />
              </View>

              <Text style={styles.widgetTarih}>{bugunMetni}</Text>

              <View style={styles.widgetGrid}>
                <View style={styles.widgetVakitItem}>
                  <Text style={styles.widgetVakitLabel}>İmsak</Text>
                  <Text style={styles.widgetVakitDeger}>{vakitler?.imsak || '--:--'}</Text>
                </View>
                <View style={styles.widgetVakitDivider} />
                <View style={styles.widgetVakitItem}>
                  <Text style={styles.widgetVakitLabel}>İftar</Text>
                  <Text style={styles.widgetVakitDeger}>{vakitler?.aksam || '--:--'}</Text>
                </View>
              </View>

              <View style={styles.widgetKalanContainer}>
                <Text style={styles.widgetKalanEtiket}>{kalanEtiket}</Text>
                <Text style={styles.widgetKalanZaman}>{formatKalanSure(kalanSure)}</Text>
              </View>

              {isSyncing && (
                <View style={styles.syncOverlay}>
                  <Text style={styles.syncText}>Eşitleniyor...</Text>
                </View>
              )}
            </LinearGradient>
          </View>
        </View>

        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>📱 Ana Ekrana Ekleme</Text>
          <Text style={styles.adimText}>
            iOS: Ana ekranda boş bir alana basılı tutun {'>'} "+" {'>'} "Şükür365" widgetını seçin.
          </Text>
          <Text style={styles.adimText}>
            Android: Ana ekranda boş bir alana basılı tutun {'>'} "Widget'lar" {'>'} "Şükür365" widgetını seçin.
          </Text>
          <Text style={styles.bilgiText}>
            Widget için gösterilen içerik (imsak, iftar, kalan süre) bu ekrandaki önizleme ile aynıdır.
          </Text>
        </View>
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
  bolum: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bolumBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.display,
  },
  widgetKart: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: '100%',
    aspectRatio: 2.1,
    marginTop: 10,
  },
  widgetKüçük: {
    aspectRatio: 1,
    width: '50%',
    alignSelf: 'center',
  },
  widgetBüyük: {
    aspectRatio: 1,
    width: '100%',
  },
  widgetGradient: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  widgetBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: TYPOGRAPHY.display,
  },
  widgetTarih: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: TYPOGRAPHY.body,
    marginBottom: 12,
  },
  widgetGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  widgetVakitItem: {
    flex: 1,
    alignItems: 'center',
  },
  widgetVakitDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  widgetVakitLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: TYPOGRAPHY.body,
    marginBottom: 2,
  },
  widgetVakitDeger: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: TYPOGRAPHY.display,
  },
  widgetKalanContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  widgetKalanEtiket: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: TYPOGRAPHY.body,
  },
  widgetKalanZaman: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  bolumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  boyutSecici: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
  },
  boyutButon: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  boyutButonAktif: {
    backgroundColor: ISLAMI_RENKLER.yesilAcik,
  },
  boyutButonText: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
  },
  boyutButonTextAktif: {
    color: '#FFF',
    fontWeight: '800',
  },
  syncOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  syncText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: TYPOGRAPHY.display,
  },
  widgetBilgi: {
    marginTop: 10,
    textAlign: 'center',
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.body,
  },
  adimText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 10,
    lineHeight: 20,
    fontFamily: TYPOGRAPHY.body,
  },
  bilgiText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 6,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.body,
  },
});
