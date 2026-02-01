import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useTheme } from '../hooks/useTheme';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { MoodTracker } from '../components/MoodTracker';
import { SunnahChain } from '../components/SunnahChain';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { SonrakiNamazSayaci } from '../components/SonrakiNamazSayaci';
import { RamazanTakvimi } from '../components/RamazanTakvimi';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';
import { useBildirimler } from '../hooks/useBildirimler';
import { useSettings } from '../context/SettingsContext';
import { GUNUN_AYETLERI, HADISLER, HIZLI_ERISIM_1, HIZLI_ERISIM_2 } from '../constants/homeScreenConstants';
import { yukleUygulamaAyarlari } from '../utils/storage';
import { KullaniciProfili } from '../types';
import { tarihToString } from '../utils/ramazanTarihleri';

const tumHizliErisim = [...HIZLI_ERISIM_1, ...HIZLI_ERISIM_2];

const IKON_RESIMLERI: { [key: string]: any } = {
  'tesbih.png': require('../../assets/icons/tesbih.png'),
  'dualar.png': require('../../assets/icons/dualar.png'),
  'kible.png': require('../../assets/icons/kible.png'),
  'medine.png': require('../../assets/icons/medine.png'),
  'kuran.png': require('../../assets/icons/kuran.png'),
  'zekat.png': require('../../assets/icons/zekat.png'),
  'stats.png': require('../../assets/icons/stats.png'),
};

export default function HomeScreen() {
  const { vakitler, yukleniyor, hata, yenile } = useNamazVakitleri();
  const { yaziBoyutuCarpani, sehir } = useSettings();
  useBildirimler(); // Bildirimleri otomatik ayarla
  const navigation = useNavigation<any>();
  const [profil, setProfil] = useState<KullaniciProfili | null>(null);

  // Marquee Animasyonu
  const translateX = useRef(new Animated.Value(0)).current;
  const marqueeItems = useMemo(() => [...tumHizliErisim, ...tumHizliErisim, ...tumHizliErisim], []);

  useEffect(() => {
    const startAnimation = () => {
      translateX.setValue(0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -776, // 8 item * (85 + 12) = 776
          duration: 35000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [translateX]);

  // Animasyon Değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Verileri yükle
    Promise.all([
      yukleUygulamaAyarlari()
    ]).then(([ayarlar]) => {
      setProfil(ayarlar.kullaniciProfil);
    });

    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Günün sözlerini hesapla ve Tema belirle
  const tema = useTheme();
  const { gununAyeti, gununHadisi, selamlama } = useMemo(() => {
    const bugun = new Date();
    const gun = bugun.getDate();
    const saat = bugun.getHours();

    let mesaj = 'Hayırlı Günler';

    if (saat >= 5 && saat < 11) {
      mesaj = 'Hayırlı Sabahlar';
    } else if (saat >= 11 && saat < 17) {
      mesaj = 'Hayırlı Günler';
    } else if (saat >= 17 && saat < 21) {
      mesaj = 'Hayırlı Akşamlar';
    } else {
      mesaj = 'Hayırlı Geceler';
    }

    return {
      gununAyeti: GUNUN_AYETLERI[gun % GUNUN_AYETLERI.length],
      gununHadisi: HADISLER[gun % HADISLER.length],
      selamlama: mesaj,
    };
  }, []);

  const handleHizliErisim = (tab: string, screen?: string) => {
    if (screen) {
      navigation.navigate(tab, { screen });
    } else {
      navigation.navigate(tab);
    }
  };

  const handleGunSec = (tarih: Date) => {
    const tarihStr = tarihToString(tarih);
    navigation.navigate('Araçlar', {
      screen: 'Notlar',
      params: { date: tarihStr }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]} edges={['left', 'right']}>
      <BackgroundDecor />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header Section */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={[styles.selamText, { fontSize: 14 * yaziBoyutuCarpani }]}>Selamun Aleyküm{profil?.isim ? `, ${profil.isim} ${profil.unvan}` : ''}</Text>
            <Text style={[styles.vakitSelamText, { fontSize: 22 * yaziBoyutuCarpani }]}>{selamlama} ✨</Text>
          </View>
          <View style={styles.konumContainer}>
            <View style={[styles.konumBadge, { borderColor: `${tema.vurgu}33`, backgroundColor: `${tema.vurgu}15` }]}>
              <Text style={[styles.konumText, { color: tema.vurgu }]}>📍 {sehir?.isim || 'İstanbul'}</Text>
            </View>
            <View style={styles.headerRightActions}>
              <Text style={styles.tarihText}>
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </Text>
              <TouchableOpacity
                onPress={yenile}
                style={[styles.refreshButton, { backgroundColor: `${tema.vurgu}20` }]}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={18} color={tema.vurgu} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Premium Marquee Quick Access Bar - EN ÜSTTE */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: 17 * yaziBoyutuCarpani }]}>⚡ Hızlı Erişim</Text>
        </View>
        <View style={styles.hizliScroll}>
          <Animated.View
            style={[
              styles.marqueeInner,
              { transform: [{ translateX }] }
            ]}
          >
            {marqueeItems.map((item, index) => (
              <TouchableOpacity
                key={`${item.id}-${index}`}
                style={[
                  styles.hizliKartYeni,
                  {
                    marginLeft: index === 0 ? 0 : 12,
                    backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta,
                    borderColor: `${tema.vurgu}20`
                  }
                ]}
                onPress={() => handleHizliErisim(item.tab, item.screen)}
                activeOpacity={0.8}
              >
                <View style={[styles.hizliIkonYeni, { backgroundColor: `${item.renk}15` }]}>
                  {item.resim ? (
                    <Image
                      source={IKON_RESIMLERI[item.resim]}
                      style={styles.hizliResim}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.hizliIkonTextYeni}>{(item as any).ikon || '✨'}</Text>
                  )}
                </View>
                <Text style={[styles.hizliBaslikYeni, { fontSize: 11 * yaziBoyutuCarpani }]}>
                  {item.baslik}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>

        {/* Dashboard Components (Namaz Vakitleri / Saat) - HIZLI ERİŞİMİN ALTINDA */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />
          <SonrakiNamazSayaci vakitler={vakitler} yukleniyor={yukleniyor} />
          <RamazanTakvimi onGunSec={handleGunSec} />
          <OrucZinciri />
        </Animated.View>

        {/* AI Dua Assistant Hero Card - SAATİN ALTINDA */}
        <TouchableOpacity
          style={styles.aiHeroCard}
          onPress={() => navigation.navigate('Kur\'an', { screen: 'AIDua' })}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[tema.ana, tema.arkaPlan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.aiHeroGradient, { borderRadius: 24, overflow: 'hidden' }]}
          >
            <View style={styles.aiHeroContent}>
              <View style={styles.aiHeroTextSection}>
                <View style={[styles.aiHeroBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Ionicons name="sparkles" size={12} color={ISLAMI_RENKLER.altinAcik} />
                  <Text style={[styles.aiHeroBadgeText, { fontSize: 10 * yaziBoyutuCarpani }]}>AI TEKNOLOJİSİ</Text>
                </View>
                <Text style={[styles.aiHeroTitle, { fontSize: 20 * yaziBoyutuCarpani }]}>Kişisel Dua Asistanı</Text>
                <Text style={[styles.aiHeroSubtitle, { fontSize: 13 * yaziBoyutuCarpani }]}>Halini anlat, sana özel dua hazırlayalım</Text>
              </View>
              <View style={styles.aiHeroIconCircle}>
                <Ionicons name="chatbubble-ellipses" size={28} color={ISLAMI_RENKLER.yesilOrta} />
              </View>
            </View>
          </LinearGradient>
          <View style={styles.aiHeroGlow} />
        </TouchableOpacity>

        {/* Mood Tracker Section */}
        <MoodTracker />

        {/* Sunnah Chain Section */}
        <SunnahChain />

        {/* Günün Ayeti - Premium Card */}
        <View style={[styles.premiumKart, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(25, 60, 45, 0.65)', borderColor: `${tema.vurgu}33` }]}>
          <View style={[styles.kartSüs, { backgroundColor: `${tema.vurgu}15` }]} />
          <View style={styles.ayetHeader}>
            <Text style={[styles.ayetBaslik, { fontSize: 16 * yaziBoyutuCarpani, color: tema.vurgu }]}>📖 Günün Ayeti</Text>
            <View style={[styles.ayetBadge, { backgroundColor: `${tema.vurgu}15` }]}>
              <Text style={[styles.ayetBadgeText, { fontSize: 10 * yaziBoyutuCarpani, color: tema.vurgu }]}>Kutsal Kur'an</Text>
            </View>
          </View>
          <View style={styles.ayetIcerik}>
            <Text style={[styles.ayetText, { fontSize: 15 * yaziBoyutuCarpani }]}>{gununAyeti.ayet}</Text>
            <Text style={[styles.ayetKaynak, { fontSize: 12 * yaziBoyutuCarpani }]}>— {gununAyeti.kaynak}</Text>
          </View>
        </View>

        {/* Günün Hadisi - Premium Card */}
        <View style={[styles.premiumKart, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(25, 60, 45, 0.65)', borderColor: `${tema.vurgu}33` }]}>
          <View style={[styles.kartSüs, { backgroundColor: `${tema.vurgu}15` }]} />
          <View style={styles.hadisHeader}>
            <Text style={[styles.hadisBaslik, { fontSize: 16 * yaziBoyutuCarpani, color: ISLAMI_RENKLER.yaziBeyaz }]}>📿 Günün Hadisi</Text>
          </View>
          <Text style={[styles.hadisText, { fontSize: 14 * yaziBoyutuCarpani }]}>{gununHadisi.hadis}</Text>
          <Text style={[styles.hadisKaynak, { fontSize: 12 * yaziBoyutuCarpani, color: tema.vurgu }]}>— {gununHadisi.kaynak}</Text>
        </View>

        {/* Motivasyon - Modern Glass */}
        <View style={styles.motivasyonGlass}>
          <Text style={styles.motivasyonEmoji}>⭐</Text>
          <Text style={[styles.motivasyonText, { fontSize: 14 * yaziBoyutuCarpani }]}>
            "Sabredenlere mükafatları hesapsız ödenecektir." (Zümer, 10)
          </Text>
        </View>

        {/* Hata Mesajı */}
        {hata && (
          <View style={styles.hataContainer}>
            <Text style={styles.hataText}>⚠️ {hata}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  content: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 5,
  },
  selamText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    opacity: 0.8,
  },
  vakitSelamText: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
    marginTop: 2,
  },
  konumContainer: {
    alignItems: 'flex-end',
  },
  konumBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  konumText: {
    fontSize: 12,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.body,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarihText: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  // Sections
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  // Hızlı Erişim Yeni
  hizliScroll: {
    marginBottom: 20,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  marqueeInner: {
    flexDirection: 'row',
  },
  hizliKartYeni: {
    width: 85,
    height: 100,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  hizliIkonYeni: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  hizliResim: {
    width: '100%',
    height: '100%',
  },
  hizliIkonTextYeni: {
    fontSize: 24,
  },
  // AI Hero Card
  aiHeroCard: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 24,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    ...Platform.select({
      ios: {
        shadowColor: ISLAMI_RENKLER.altinOrta,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  aiHeroGradient: {
    padding: 24,
  },
  aiHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiHeroTextSection: {
    flex: 1,
    marginRight: 15,
  },
  aiHeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 5,
  },
  aiHeroBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  aiHeroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    fontFamily: TYPOGRAPHY.display,
    marginBottom: 4,
  },
  aiHeroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: TYPOGRAPHY.body,
    lineHeight: 18,
  },
  aiHeroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  aiHeroGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: -1,
  },
  hizliBaslikYeni: {
    fontSize: 11,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  // Premium Cards (Ayet/Hadis)
  premiumKart: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  kartSüs: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    backgroundColor: ISLAMI_RENKLER.altinOrta + '15',
    borderBottomLeftRadius: 60,
  },
  ayetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  ayetBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  ayetBadge: {
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ayetBadgeText: {
    fontSize: 10,
    color: ISLAMI_RENKLER.altinOrta,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ayetIcerik: {
    borderLeftWidth: 2,
    borderLeftColor: ISLAMI_RENKLER.altinOrta,
    paddingLeft: 15,
  },
  ayetText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 25,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.body,
  },
  ayetKaynak: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinOrta,
    marginTop: 12,
    fontWeight: '600',
  },
  hadisHeader: {
    marginBottom: 12,
  },
  hadisBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  hadisText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazAcik,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  hadisKaynak: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 10,
    opacity: 0.7,
  },
  // Motivasyon Glass
  motivasyonGlass: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  motivasyonEmoji: {
    fontSize: 28,
    marginBottom: 12,
  },
  motivasyonText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.9,
  },
  // Hata
  hataContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.kirmiziYumusak,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    fontWeight: '600',
  },
});
