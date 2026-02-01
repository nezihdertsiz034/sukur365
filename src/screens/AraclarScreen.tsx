import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useTheme } from '../hooks/useTheme';
import { BackgroundDecor } from '../components/BackgroundDecor';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface AracKarti {
    id: string;
    baslik: string;
    resim: string;
    aciklama: string;
    ekran: string;
    renk: string;
}

const ARAC_RESIMLERI: { [key: string]: any } = {
    'zekat.png': require('../../assets/icons/zekat.png'),
    'fitre.png': require('../../assets/icons/fitre.png'),
    'kible.png': require('../../assets/icons/kible.png'),
    'iftar_sahur.png': require('../../assets/icons/iftar_sahur.png'),
    'su.png': require('../../assets/icons/su.png'),
    'menu.png': require('../../assets/icons/menu.png'),
    'teravih.png': require('../../assets/icons/teravih.png'),
    'sadaka.png': require('../../assets/icons/sadaka.png'),
    'notlar.png': require('../../assets/icons/notlar.png'),
    'widget.png': require('../../assets/icons/widget.png'),
    'stats.png': require('../../assets/icons/stats.png'),
};

const ARACLAR: AracKarti[] = [
    {
        id: 'zekat',
        baslik: 'Zekat',
        resim: 'zekat.png',
        aciklama: 'Zekat hesaplama',
        ekran: 'Zekat',
        renk: '#FFD700',
    },
    {
        id: 'fitre',
        baslik: 'Fitre',
        resim: 'fitre.png',
        aciklama: 'Fitre hesaplama',
        ekran: 'Fitre',
        renk: '#90EE90',
    },
    {
        id: 'kible',
        baslik: 'Kıble',
        resim: 'kible.png',
        aciklama: 'Kıble yönü bulma',
        ekran: 'Kıble',
        renk: '#87CEEB',
    },
    {
        id: 'kalori',
        baslik: 'İftar Kalori',
        resim: 'iftar_sahur.png',
        aciklama: 'Kalori hesaplama',
        ekran: 'İftar Kalori',
        renk: '#FFA07A',
    },
    {
        id: 'su',
        baslik: 'Su Hatırlatıcı',
        resim: 'su.png',
        aciklama: 'Su içme hatırlatması',
        ekran: 'Su Hatırlatıcı',
        renk: '#00CED1',
    },
    {
        id: 'menu',
        baslik: 'Menü Önerileri',
        resim: 'menu.png',
        aciklama: 'İftar menü fikirleri',
        ekran: 'İftar Menü Önerileri',
        renk: '#DDA0DD',
    },
    {
        id: 'teravih',
        baslik: 'Teravih',
        resim: 'teravih.png',
        aciklama: 'Teravih takibi',
        ekran: 'Teravih',
        renk: '#98FB98',
    },
    {
        id: 'sadaka',
        baslik: 'Sadaka',
        resim: 'sadaka.png',
        aciklama: 'Sadaka kayıtları',
        ekran: 'Sadaka',
        renk: '#FFB6C1',
    },
    {
        id: 'notlar',
        baslik: 'Notlar',
        resim: 'notlar.png',
        aciklama: 'Kişisel notlar',
        ekran: 'Notlar',
        renk: '#F0E68C',
    },
    {
        id: 'widget',
        baslik: 'Widget',
        resim: 'widget.png',
        aciklama: 'Ana ekran widget',
        ekran: 'Ana Ekran Widget',
        renk: '#B0C4DE',
    },
    {
        id: 'kaza',
        baslik: 'Kaza Takibi',
        resim: 'stats.png',
        aciklama: 'Eksik ibadet takibi',
        ekran: 'Kaza Takibi',
        renk: '#20B2AA',
    },
];

export default function AraclarScreen() {
    const navigation = useNavigation();
    const tema = useTheme();

    const handleAracTikla = (ekran: string) => {
        navigation.navigate(ekran as never);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]} edges={['left', 'right']}>
            <BackgroundDecor />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Başlık */}
                <View style={styles.baslikContainer}>
                    <Text style={[styles.baslik, { color: ISLAMI_RENKLER.yaziBeyaz }]}>Araçlar</Text>
                    <Text style={[styles.altBaslik, { color: ISLAMI_RENKLER.yaziBeyazYumusak }]}>Faydalı hesaplayıcılar ve araçlar</Text>
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                    {ARACLAR.map((arac) => (
                        <TouchableOpacity
                            key={arac.id}
                            style={[
                                styles.kart,
                                {
                                    backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta,
                                    borderColor: `${tema.vurgu}20`
                                }
                            ]}
                            onPress={() => handleAracTikla(arac.ekran)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.ikonContainer, { backgroundColor: `${arac.renk}15` }]}>
                                <Image
                                    source={ARAC_RESIMLERI[arac.resim]}
                                    style={styles.resim}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text style={styles.kartBaslik}>{arac.baslik}</Text>
                            <Text style={styles.kartAciklama}>{arac.aciklama}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
        padding: 20,
        paddingBottom: 40,
    },
    baslikContainer: {
        marginBottom: 24,
    },
    baslik: {
        fontSize: 28,
        fontWeight: '800',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
        marginBottom: 4,
    },
    altBaslik: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    kart: {
        width: CARD_WIDTH,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta, // Daha verimli gölge hesaplaması için solid arka plan
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    ikonContainer: {
        width: 64,
        height: 64,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    resim: {
        width: '100%',
        height: '100%',
    },
    kartBaslik: {
        fontSize: 17,
        fontWeight: '800',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
        marginBottom: 6,
    },
    kartAciklama: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 18,
        opacity: 0.8,
    },
});
