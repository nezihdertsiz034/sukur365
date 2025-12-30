import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { NamazVakitleri } from '../types';
import { saatFarkiHesapla, saniyeToZaman } from '../utils/namazVakitleri';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { getSukurAyetiByGun, SukurAyeti } from '../constants/sukurAyetleri';
import { useOrucZinciri } from '../hooks/useOrucZinciri';

interface OrucSayaciProps {
  vakitler: NamazVakitleri | null;
  yukleniyor?: boolean;
}

/**
 * Sabah ezanı ile akşam namazı arasındaki süreyi gösteren sayaç bileşeni
 */
export const OrucSayaci: React.FC<OrucSayaciProps> = ({ vakitler, yukleniyor = false }) => {
  const { zincirHalkalari } = useOrucZinciri();
  const [kalanSure, setKalanSure] = useState<number | null>(null);
  const [durum, setDurum] = useState<'beklemede' | 'devam' | 'bitti'>('beklemede');
  const [gununAyeti, setGununAyeti] = useState<SukurAyeti | null>(null);

  useEffect(() => {
    if (!vakitler) return;

    const guncelleSayac = () => {
      const simdi = new Date();
      const simdiSaat = simdi.getHours();
      const simdiDakika = simdi.getMinutes();
      const simdiToplam = simdiSaat * 3600 + simdiDakika * 60 + simdi.getSeconds();

      // Sabah ezanı (imsak) ve akşam namazı saatlerini parse et
      const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
      const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);

      const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
      const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

      // Şu anki durumu belirle
      if (simdiToplam < imsakToplam) {
        // Henüz sabah ezanı olmadı
        setDurum('beklemede');
        const kalan = imsakToplam - simdiToplam;
        setKalanSure(kalan);
      } else if (simdiToplam >= imsakToplam && simdiToplam < aksamToplam) {
        // Oruç devam ediyor
        setDurum('devam');
        const kalan = aksamToplam - simdiToplam;
        setKalanSure(kalan);
      } else {
        // Akşam namazı geçti, oruç bitti
        setDurum('bitti');
        setKalanSure(0);
      }
    };

    // İlk güncelleme
    guncelleSayac();

    // Her saniye güncelle
    const timer = setInterval(guncelleSayac, 1000);

    return () => clearInterval(timer);
  }, [vakitler]);

  // Şükür ayetini yükle
  useEffect(() => {
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    const bugununHalkasi = zincirHalkalari.find(h => {
      const halkaTarih = new Date(h.tarih);
      halkaTarih.setHours(0, 0, 0, 0);
      return halkaTarih.getTime() === bugun.getTime();
    });
    const gunNumarasi = bugununHalkasi?.gunNumarasi || bugun.getDate();
    
    const ayet = getSukurAyetiByGun(gunNumarasi);
    setGununAyeti(ayet);
  }, [zincirHalkalari]);

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.yesilOrta} />
        <Text style={styles.yukleniyorText}>Namaz vakitleri yükleniyor...</Text>
      </View>
    );
  }

  if (!vakitler || kalanSure === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.hataText}>Vakit bilgisi alınamadı</Text>
      </View>
    );
  }

  const zaman = saniyeToZaman(kalanSure);
  const durumMetni = durum === 'beklemede' 
    ? '🌅 Sabah ezanına kalan süre' 
    : durum === 'devam' 
    ? '🌇 Akşam namazına kalan süre' 
    : '✨ Oruç tamamlandı! Allah kabul etsin! 🎉';

  // Toplam süreyi hesapla (imsak-akşam arası)
  const toplamSure = durum === 'beklemede' 
    ? (() => {
        const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
        const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);
        const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
        const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;
        return aksamToplam - imsakToplam;
      })()
    : (() => {
        const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
        const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);
        const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
        const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;
        return aksamToplam - imsakToplam;
      })();

  // Progress yüzdesi (0-100)
  const progressYuzde = toplamSure > 0 ? ((toplamSure - kalanSure) / toplamSure) * 100 : 0;
  
  // Kadran için açı hesaplama (0-360 derece)
  const kadranAcisi = (progressYuzde / 100) * 360;
  
  // SVG path için arc hesaplama
  const kadranYaricap = 100;
  const kadranMerkez = 120;
  const startAngle = -90; // 12 yönünden başla
  const endAngle = startAngle + kadranAcisi;
  
  const radToDeg = (rad: number) => rad * (180 / Math.PI);
  const degToRad = (deg: number) => deg * (Math.PI / 180);
  
  const startX = kadranMerkez + kadranYaricap * Math.cos(degToRad(startAngle));
  const startY = kadranMerkez + kadranYaricap * Math.sin(degToRad(startAngle));
  const endX = kadranMerkez + kadranYaricap * Math.cos(degToRad(endAngle));
  const endY = kadranMerkez + kadranYaricap * Math.sin(degToRad(endAngle));
  
  const largeArcFlag = kadranAcisi > 180 ? 1 : 0;
  const arcPath = `M ${kadranMerkez} ${kadranMerkez} L ${startX} ${startY} A ${kadranYaricap} ${kadranYaricap} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

  return (
    <View style={styles.container}>
      <Text style={styles.durumText}>{durumMetni}</Text>
      
      {durum !== 'bitti' && (
        <View style={styles.kadranContainer}>
          {/* Dairesel Kadran */}
          <View style={styles.kadranWrapper}>
            <Svg width={240} height={240} style={styles.kadranSvg}>
              {/* Arka plan dairesi */}
              <Circle
                cx={kadranMerkez}
                cy={kadranMerkez}
                r={kadranYaricap}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="3"
              />
              
              {/* Progress arc */}
              {kalanSure > 0 && (
                <Path
                  d={arcPath}
                  fill={durum === 'devam' ? ISLAMI_RENKLER.altinOrta : ISLAMI_RENKLER.yesilOrta}
                  opacity={0.3}
                />
              )}
              
              {/* İç dairesel desenler (dini motif) */}
              <Circle
                cx={kadranMerkez}
                cy={kadranMerkez}
                r={kadranYaricap - 15}
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              
              {/* Merkez nokta */}
              <Circle
                cx={kadranMerkez}
                cy={kadranMerkez}
                r={4}
                fill={ISLAMI_RENKLER.altinAcik}
              />
              
              {/* Saat işaretleri (12, 3, 6, 9) */}
              {[0, 90, 180, 270].map((angle, index) => {
                const x = kadranMerkez + (kadranYaricap - 5) * Math.cos(degToRad(angle - 90));
                const y = kadranMerkez + (kadranYaricap - 5) * Math.sin(degToRad(angle - 90));
                return (
                  <Circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={ISLAMI_RENKLER.yaziBeyaz}
                    opacity={0.6}
                  />
                );
              })}
            </Svg>
            
            {/* Merkezde zaman bilgisi */}
            <View style={styles.merkezBilgi}>
              <Text style={styles.merkezArapca}>الله</Text>
              <View style={styles.zamanSatir}>
                <Text style={styles.merkezSayi}>{String(zaman.saat).padStart(2, '0')}</Text>
                <Text style={styles.merkezIkiNokta}>:</Text>
                <Text style={styles.merkezSayi}>{String(zaman.dakika).padStart(2, '0')}</Text>
                <Text style={styles.merkezIkiNokta}>:</Text>
                <Text style={styles.merkezSayi}>{String(zaman.saniye).padStart(2, '0')}</Text>
              </View>
              <Text style={styles.merkezEtiket}>
                {durum === 'beklemede' ? 'İmsak\'a Kalan' : 'İftar\'a Kalan'}
              </Text>
            </View>
          </View>
          
          {/* Alt bilgi kartları */}
          <View style={styles.bilgiKartlari}>
            <View style={styles.bilgiKarti}>
              <Text style={styles.bilgiKartSayi}>{String(zaman.saat).padStart(2, '0')}</Text>
              <Text style={styles.bilgiKartEtiket}>Saat</Text>
            </View>
            <View style={styles.bilgiKarti}>
              <Text style={styles.bilgiKartSayi}>{String(zaman.dakika).padStart(2, '0')}</Text>
              <Text style={styles.bilgiKartEtiket}>Dakika</Text>
            </View>
            <View style={styles.bilgiKarti}>
              <Text style={styles.bilgiKartSayi}>{String(zaman.saniye).padStart(2, '0')}</Text>
              <Text style={styles.bilgiKartEtiket}>Saniye</Text>
            </View>
          </View>
        </View>
      )}

      {durum === 'bitti' && (
        <>
          <View style={styles.bittiContainer}>
            <Text style={styles.bittiText}>🎉</Text>
          </View>
          
          {gununAyeti && (
            <View style={styles.sukurAyetiContainer}>
              <View style={styles.ayetBilgisi}>
                <Text style={styles.sureBaslik}>{gununAyeti.sure} Suresi</Text>
                <Text style={styles.ayetNumarasi}>{gununAyeti.ayetNumarasi}. Ayet</Text>
              </View>
              
              <ScrollView style={styles.arapcaContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.arapca}>{gununAyeti.arapca}</Text>
              </ScrollView>
              
              <View style={styles.mealContainer}>
                <Text style={styles.mealLabel}>Türkçe Meali:</Text>
                <Text style={styles.meal}>{gununAyeti.turkceMeal}</Text>
              </View>
            </View>
          )}
        </>
      )}

      <View style={styles.vakitBilgisi}>
        <Text style={styles.vakitText}>
          🌅 Sabah Ezanı: <Text style={styles.vakitSaat}>{vakitler.imsak}</Text>
        </Text>
        <Text style={styles.vakitText}>
          🌇 Akşam Namazı: <Text style={styles.vakitSaat}>{vakitler.aksam}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 28,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 28,
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  durumText: {
    fontSize: 24,
    fontWeight: '900',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: TYPOGRAPHY.display,
  },
  kadranContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  kadranWrapper: {
    position: 'relative',
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  kadranSvg: {
    position: 'absolute',
  },
  merkezBilgi: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merkezArapca: {
    fontSize: 32,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.4,
    fontFamily: TYPOGRAPHY.arabic,
  },
  zamanSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  merkezSayi: {
    fontSize: 24,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 1,
    fontFamily: TYPOGRAPHY.display,
  },
  merkezIkiNokta: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginHorizontal: 2,
  },
  merkezEtiket: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.body,
  },
  bilgiKartlari: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
  },
  bilgiKarti: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  bilgiKartSayi: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
    letterSpacing: 1,
    fontFamily: TYPOGRAPHY.display,
  },
  bilgiKartEtiket: {
    fontSize: 9,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  bittiContainer: {
    padding: 24,
    marginBottom: 16,
  },
  bittiText: {
    fontSize: 48,
    textAlign: 'center',
  },
  sukurAyetiContainer: {
    width: '100%',
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  ayetBilgisi: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sureBaslik: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
  },
  ayetNumarasi: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  arapcaContainer: {
    maxHeight: 120,
    marginBottom: 16,
  },
  arapca: {
    fontSize: 20,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'right',
    lineHeight: 32,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.arabic,
  },
  mealContainer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mealLabel: {
    fontSize: 13,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.body,
  },
  meal: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'justify',
    fontFamily: TYPOGRAPHY.body,
  },
  vakitBilgisi: {
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  vakitText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginVertical: 6,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.body,
  },
  vakitSaat: {
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.display,
  },
});
