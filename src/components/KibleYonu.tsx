import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { KibleYonu as KibleYonuType } from '../types';
import { ISLAMI_RENKLER, TEMA_RENKLERI } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { UygulamaAyarlari } from '../types';
import { yukleUygulamaAyarlari } from '../utils/storage';

const { width: EKRAN_GENISLIK } = Dimensions.get('window');
const PUSULA_BOYUT = Math.min(EKRAN_GENISLIK * 0.85, 320);

interface KibleYonuProps {
  kibleYonu: KibleYonuType | null;
  kibleOkAcisi?: number;
  pusulaAcisi?: number;
  yukleniyor?: boolean;
  hata?: string | null;
}

/**
 * Modern Kıble yönü göstergesi bileşeni - Gerçek zamanlı pusula ve titreşim destekli
 */
export const KibleYonu: React.FC<KibleYonuProps> = ({
  kibleYonu,
  kibleOkAcisi = 0,
  pusulaAcisi = 0,
  yukleniyor = false,
  hata = null,
}) => {
  const [sonTitresimZamani, setSonTitresimZamani] = useState(0);
  const [hizalandi, setHizalandi] = useState(false);
  const [uygulamaAyarlari, setUygulamaAyarlari] = useState<UygulamaAyarlari | null>(null);
  const parlamaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    yukleUygulamaAyarlari().then(setUygulamaAyarlari);
  }, []);

  const yonIsimleri: Record<KibleYonuType['yon'], string> = {
    K: 'Kuzey',
    KB: 'Kuzey-Batı',
    B: 'Batı',
    GB: 'Güney-Batı',
    G: 'Güney',
    GD: 'Güney-Doğu',
    D: 'Doğu',
    KD: 'Kuzey-Doğu',
  };

  // Dinamik Tema
  const tema = React.useMemo(() => {
    const saat = new Date().getHours();
    if (saat >= 5 && saat < 11) return TEMA_RENKLERI.SABAH;
    if (saat >= 11 && saat < 18) return TEMA_RENKLERI.GUN;
    if (saat >= 18 && saat < 22) return TEMA_RENKLERI.AKSAM;
    return TEMA_RENKLERI.GECE;
  }, []);

  // Kıble hizalama kontrolü ve titreşim
  useEffect(() => {
    const hizalamaToleransi = 5; // ±5 derece tolerans
    const mutlakFark = Math.abs(kibleOkAcisi);
    const kibleHizali = mutlakFark <= hizalamaToleransi || mutlakFark >= (360 - hizalamaToleransi);

    if (kibleHizali && !hizalandi) {
      setHizalandi(true);

      // Titreşim (1 saniyede bir)
      const simdi = Date.now();
      if (simdi - sonTitresimZamani > 1000 && uygulamaAyarlari?.kibleTitresimAktif !== false) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSonTitresimZamani(simdi);
      }

      // Parlama animasyonu
      Animated.loop(
        Animated.sequence([
          Animated.timing(parlamaAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(parlamaAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (!kibleHizali && hizalandi) {
      setHizalandi(false);
      parlamaAnim.stopAnimation();
      parlamaAnim.setValue(0);
    }
  }, [kibleOkAcisi, hizalandi, sonTitresimZamani, parlamaAnim, uygulamaAyarlari]);

  const parlamaOpacity = parlamaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
        <Text style={styles.yukleniyorText}>Kıble yönü hesaplanıyor...</Text>
      </View>
    );
  }

  if (hata) {
    return (
      <View style={styles.container}>
        <Text style={styles.hataText}>{hata}</Text>
      </View>
    );
  }

  if (!kibleYonu) {
    return null;
  }

  const merkez = PUSULA_BOYUT / 2;
  const disYaricap = PUSULA_BOYUT / 2 - 10;
  const icYaricap = PUSULA_BOYUT / 2 - 50;

  // Yön işaretlerini hesapla
  const yonlar = [
    { label: 'K', aci: 0, renk: ISLAMI_RENKLER.altinAcik },
    { label: 'KD', aci: 45, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
    { label: 'D', aci: 90, renk: ISLAMI_RENKLER.yaziBeyaz },
    { label: 'GD', aci: 135, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
    { label: 'G', aci: 180, renk: ISLAMI_RENKLER.yaziBeyaz },
    { label: 'GB', aci: 225, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
    { label: 'B', aci: 270, renk: ISLAMI_RENKLER.yaziBeyaz },
    { label: 'KB', aci: 315, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
  ];

  return (
    <View style={[styles.container, { backgroundColor: tema.arkaPlan, borderColor: `${tema.vurgu}20` }]}>
      <Text style={styles.baslik}>🕌 Kıble Yönü</Text>

      {/* Hizalama durumu */}
      {hizalandi && (
        <Animated.View style={[styles.hizalamaBildirim, { opacity: parlamaOpacity }]}>
          <Text style={styles.hizalamaBildirimText}>✅ Kıble Yönündesiniz!</Text>
        </Animated.View>
      )}

      <View style={styles.pusulaContainer}>
        {/* Parlama efekti */}
        {hizalandi && (
          <Animated.View
            style={[
              styles.parlamaHalkasi,
              {
                opacity: parlamaOpacity,
                transform: [{
                  scale: parlamaAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  })
                }]
              }
            ]}
          />
        )}

        <View style={[
          styles.pusulaWrapper,
          { transform: [{ rotate: `${-pusulaAcisi}deg` }] }
        ]}>
          <Svg width={PUSULA_BOYUT} height={PUSULA_BOYUT} viewBox={`0 0 ${PUSULA_BOYUT} ${PUSULA_BOYUT}`}>
            <Defs>
              <LinearGradient id="altinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#DFBD69" />
                <Stop offset="50%" stopColor="#926D37" />
                <Stop offset="100%" stopColor="#DFBD69" />
              </LinearGradient>
              <LinearGradient id="yesilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#1a4731" />
                <Stop offset="100%" stopColor="#0a2a1b" />
              </LinearGradient>
            </Defs>

            {/* Dış Halka */}
            <Circle cx={merkez} cy={merkez} r={disYaricap} fill="url(#yesilGrad)" stroke="url(#altinGrad)" strokeWidth="4" />
            <Circle cx={merkez} cy={merkez} r={disYaricap - 8} fill="transparent" stroke="url(#altinGrad)" strokeWidth="1" strokeDasharray="2,4" />

            {/* Süslemeler - Arabesque Motif */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((aci, i) => (
              <View key={i} style={{ position: 'absolute', transform: [{ rotate: `${aci}deg` }] }}>
                {/* SVG içinde transform kullanmak için g elementi daha iyidir ama burada basit tutuyoruz */}
              </View>
            ))}

            {/* Derece Çizgileri */}
            {Array.from({ length: 72 }).map((_, i) => {
              const aci = i * 5;
              const isMain = aci % 90 === 0;
              const isMid = aci % 45 === 0;
              const lineLen = isMain ? 15 : (isMid ? 10 : 5);
              const x1 = merkez + (disYaricap - 10) * Math.cos((aci - 90) * Math.PI / 180);
              const y1 = merkez + (disYaricap - 10) * Math.sin((aci - 90) * Math.PI / 180);
              const x2 = merkez + (disYaricap - 10 - lineLen) * Math.cos((aci - 90) * Math.PI / 180);
              const y2 = merkez + (disYaricap - 10 - lineLen) * Math.sin((aci - 90) * Math.PI / 180);
              return (
                <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#altinGrad)" strokeWidth={isMain ? 2 : 1} opacity={isMain ? 1 : 0.5} />
              );
            })}

            {/* Yön Harfleri */}
            {yonlar.map((yon, i) => {
              const rad = (yon.aci - 90) * Math.PI / 180;
              const tx = merkez + (disYaricap - 30) * Math.cos(rad);
              const ty = merkez + (disYaricap - 30) * Math.sin(rad);
              return (
                <SvgText
                  key={i}
                  x={tx}
                  y={ty}
                  fill={yon.renk}
                  fontSize={yon.aci % 90 === 0 ? "18" : "12"}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {yon.label}
                </SvgText>
              );
            })}

            {/* İç Desen */}
            <Circle cx={merkez} cy={merkez} r={icYaricap} fill="transparent" stroke="url(#altinGrad)" strokeWidth="0.5" opacity="0.3" />

            {/* Qibla / Makkah Yazıları */}
            <SvgText
              x={merkez}
              y={merkez - 60}
              fill="#DFBD69"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              letterSpacing="2"
            >
              QIBLA
            </SvgText>
            <SvgText
              x={merkez}
              y={merkez + 70}
              fill="#DFBD69"
              fontSize="12"
              fontWeight="normal"
              textAnchor="middle"
              letterSpacing="3"
              opacity="0.8"
            >
              MAKKAH
            </SvgText>
          </Svg>
        </View>

        {/* Kıble oku - Sabit, her zaman Kabe'yi gösterir */}
        <View style={[
          styles.kibleOkContainer,
          { transform: [{ rotate: `${kibleOkAcisi}deg` }] }
        ]}>
          <View style={[styles.kibleOk, hizalandi && styles.kibleOkHizali]}>
            {/* Yeni Modern Kabe Ikonu - Saf Emoji veya SVG kullanılabilir */}
            <View style={{ width: 60, height: 60, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#DFBD69' }}>
              <View style={{ width: '100%', height: 4, backgroundColor: '#DFBD69', marginTop: 15 }} />
              <Text style={{ fontSize: 30 }}>🕋</Text>
            </View>
          </View>
        </View>

        {/* Merkez İbre (Pusula İğnesi) */}
        <View style={styles.ibreContainer}>
          <Svg width={40} height={PUSULA_BOYUT * 0.7} viewBox="0 0 40 200">
            <Defs>
              <LinearGradient id="kirmiziGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#ef4444" />
                <Stop offset="100%" stopColor="#991b1b" />
              </LinearGradient>
              <LinearGradient id="gumusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#e5e7eb" />
                <Stop offset="100%" stopColor="#9ca3af" />
              </LinearGradient>
            </Defs>
            {/* Kuzey Ucu (Kırmızı) */}
            <Line x1="20" y1="100" x2="20" y2="10" stroke="url(#kirmiziGrad)" strokeWidth="4" strokeLinecap="round" />
            <SvgText x="20" y="40" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">N</SvgText>

            {/* Güney Ucu (Gümüş) */}
            <Line x1="20" y1="100" x2="20" y2="190" stroke="url(#gumusGrad)" strokeWidth="4" strokeLinecap="round" />

            {/* Orta Göbek */}
            <Circle cx="20" cy="100" r="8" fill="url(#altinGrad)" stroke="#926D37" strokeWidth="2" />
            <Circle cx="20" cy="100" r="3" fill="#DFBD69" />
          </Svg>
        </View>
      </View>

      {/* Bilgi kartı */}
      <View style={styles.bilgiContainer}>
        <View style={[styles.yonKart, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 0, 0, 0.25)', borderColor: `${tema.vurgu}30` }]}>
          <Text style={styles.yonLabel}>Kıble Yönü</Text>
          <Text style={[styles.yonText, { color: tema.vurgu }]}>{yonIsimleri[kibleYonu.yon]}</Text>
          <Text style={styles.aciText}>{Math.round(kibleYonu.aci)}° Kuzey'den</Text>
        </View>

        <View style={[styles.durumKart, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 0, 0, 0.25)', borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.durumLabel}>Cihaz Yönü</Text>
          <Text style={styles.durumDeger}>{Math.round(pusulaAcisi)}°</Text>
        </View>
      </View>

      {/* Talimatlar */}
      <View style={[styles.talimatKart, { backgroundColor: tema.arkaPlan + 'cc' }]}>
        <Text style={styles.talimatText}>
          📱 Telefonunuzu yere paralel tutun{'\n'}
          🔄 8 şekli çizerek kalibre edin{'\n'}
          ✅ Kıble yönüne hizalandığınızda titreşim alırsınız
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 24,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 16,
    fontFamily: TYPOGRAPHY.display,
  },
  hizalamaBildirim: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  hizalamaBildirimText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  pusulaContainer: {
    width: PUSULA_BOYUT,
    height: PUSULA_BOYUT,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  parlamaHalkasi: {
    position: 'absolute',
    width: PUSULA_BOYUT + 40,
    height: PUSULA_BOYUT + 40,
    borderRadius: (PUSULA_BOYUT + 40) / 2,
    borderWidth: 4,
    borderColor: '#22c55e',
    backgroundColor: 'transparent',
  },
  pusulaWrapper: {
    width: PUSULA_BOYUT,
    height: PUSULA_BOYUT,
  },
  kibleOkContainer: {
    position: 'absolute',
    width: PUSULA_BOYUT,
    height: PUSULA_BOYUT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  kibleOk: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  kabe3D: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  kibleOkHizali: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  okUcu: {
    position: 'absolute',
    top: -15,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ISLAMI_RENKLER.altinAcik,
  },
  kabeIconContainer: {
    position: 'absolute',
    top: 0,
  },
  kabeIcon: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  ibreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  merkezNokta: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 3,
    borderColor: ISLAMI_RENKLER.arkaPlanYesil,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  bilgiContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  yonKart: {
    flex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  yonLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  yonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  aciText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  durumKart: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  durumLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  durumDeger: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  talimatKart: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  talimatText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.kirmiziYumusak,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.body,
  },
});
