import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface AracKarti {
    id: string;
    baslik: string;
    ikon: string;
    aciklama: string;
    ekran: string;
    renk: string;
}

const ARACLAR: AracKarti[] = [
    {
        id: 'zekat',
        baslik: 'Zekat',
        ikon: '💰',
        aciklama: 'Zekat hesaplama',
        ekran: 'Zekat',
        renk: '#FFD700',
    },
    {
        id: 'fitre',
        baslik: 'Fitre',
        ikon: '🌾',
        aciklama: 'Fitre hesaplama',
        ekran: 'Fitre',
        renk: '#90EE90',
    },
    {
        id: 'kible',
        baslik: 'Kıble',
        ikon: '🧭',
        aciklama: 'Kıble yönü bulma',
        ekran: 'Kıble',
        renk: '#87CEEB',
    },
    {
        id: 'kalori',
        baslik: 'İftar Kalori',
        ikon: '🍽️',
        aciklama: 'Kalori hesaplama',
        ekran: 'İftar Kalori',
        renk: '#FFA07A',
    },
    {
        id: 'su',
        baslik: 'Su Hatırlatıcı',
        ikon: '💧',
        aciklama: 'Su içme hatırlatması',
        ekran: 'Su Hatırlatıcı',
        renk: '#00CED1',
    },
    {
        id: 'menu',
        baslik: 'Menü Önerileri',
        ikon: '💡',
        aciklama: 'İftar menü fikirleri',
        ekran: 'İftar Menü Önerileri',
        renk: '#DDA0DD',
    },
    {
        id: 'teravih',
        baslik: 'Teravih',
        ikon: '🕌',
        aciklama: 'Teravih takibi',
        ekran: 'Teravih',
        renk: '#98FB98',
    },
    {
        id: 'sadaka',
        baslik: 'Sadaka',
        ikon: '💝',
        aciklama: 'Sadaka kayıtları',
        ekran: 'Sadaka',
        renk: '#FFB6C1',
    },
    {
        id: 'notlar',
        baslik: 'Notlar',
        ikon: '📝',
        aciklama: 'Kişisel notlar',
        ekran: 'Notlar',
        renk: '#F0E68C',
    },
    {
        id: 'widget',
        baslik: 'Widget',
        ikon: '🧩',
        aciklama: 'Ana ekran widget',
        ekran: 'Ana Ekran Widget',
        renk: '#B0C4DE',
    },
];

export default function AraclarScreen() {
    const navigation = useNavigation();

    const handleAracTikla = (ekran: string) => {
        navigation.navigate(ekran as never);
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <BackgroundDecor />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Başlık */}
                <View style={styles.baslikContainer}>
                    <Text style={styles.baslik}>🛠️ Araçlar</Text>
                    <Text style={styles.altBaslik}>Faydalı hesaplayıcılar ve araçlar</Text>
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                    {ARACLAR.map((arac) => (
                        <TouchableOpacity
                            key={arac.id}
                            style={styles.kart}
                            onPress={() => handleAracTikla(arac.ekran)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.ikonContainer, { backgroundColor: `${arac.renk}20` }]}>
                                <Text style={styles.ikon}>{arac.ikon}</Text>
                            </View>
                            <Text style={styles.kartBaslik}>{arac.baslik}</Text>
                            <Text style={styles.kartAciklama}>{arac.aciklama}</Text>
                            <View style={[styles.kartAltCizgi, { backgroundColor: arac.renk }]} />
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
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
    },
    ikonContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    ikon: {
        fontSize: 28,
    },
    kartBaslik: {
        fontSize: 16,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
        marginBottom: 4,
    },
    kartAciklama: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    kartAltCizgi: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
});
