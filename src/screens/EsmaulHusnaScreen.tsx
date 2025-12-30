import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { ESMAUL_HUSNA, EsmaItem } from '../constants/esmaulHusna';

const { width } = Dimensions.get('window');

export default function EsmaulHusnaScreen() {
    const [aramaMetni, setAramaMetni] = useState('');
    const [seciliEsma, setSeciliEsma] = useState<EsmaItem | null>(null);

    const filtrelenmisEsmalar = useMemo(() => {
        if (!aramaMetni.trim()) {
            return ESMAUL_HUSNA;
        }
        const aranan = aramaMetni.toLowerCase();
        return ESMAUL_HUSNA.filter(
            (esma) =>
                esma.okunusu.toLowerCase().includes(aranan) ||
                esma.anlami.toLowerCase().includes(aranan) ||
                esma.id.toString() === aranan
        );
    }, [aramaMetni]);

    const renderEsmaItem = ({ item, index }: { item: EsmaItem; index: number }) => {
        const isSecili = seciliEsma?.id === item.id;

        return (
            <TouchableOpacity
                style={[styles.esmaKart, isSecili && styles.esmaKartSecili]}
                onPress={() => setSeciliEsma(isSecili ? null : item)}
                activeOpacity={0.8}
            >
                {/* Numara badge */}
                <View style={styles.numaraBadge}>
                    <Text style={styles.numaraText}>{item.id}</Text>
                </View>

                {/* İçerik */}
                <View style={styles.esmaIcerik}>
                    <Text style={styles.esmaArapca}>{item.arapca}</Text>
                    <Text style={styles.esmaOkunus}>{item.okunusu}</Text>

                    {isSecili && (
                        <View style={styles.anlamContainer}>
                            <View style={styles.anlamAyrac} />
                            <Text style={styles.esmaAnlam}>{item.anlami}</Text>
                        </View>
                    )}
                </View>

                {/* Açma/Kapama göstergesi */}
                <Text style={styles.acmaKapama}>{isSecili ? '▲' : '▼'}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <BackgroundDecor />

            {/* Başlık */}
            <View style={styles.baslikContainer}>
                <Text style={styles.baslikEmoji}>☪️</Text>
                <Text style={styles.baslik}>Esmaül Hüsna</Text>
                <Text style={styles.altBaslik}>Allah'ın 99 Güzel İsmi</Text>
            </View>

            {/* Arama */}
            <View style={styles.aramaContainer}>
                <View style={styles.aramaInputWrapper}>
                    <Text style={styles.aramaIcon}>🔍</Text>
                    <TextInput
                        style={styles.aramaInput}
                        placeholder="İsim veya anlam ara..."
                        placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                        value={aramaMetni}
                        onChangeText={setAramaMetni}
                    />
                    {aramaMetni.length > 0 && (
                        <TouchableOpacity onPress={() => setAramaMetni('')}>
                            <Text style={styles.temizleIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.sonucSayisi}>
                    {filtrelenmisEsmalar.length} isim gösteriliyor
                </Text>
            </View>

            {/* Liste */}
            <FlatList
                data={filtrelenmisEsmalar}
                renderItem={renderEsmaItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.bosContainer}>
                        <Text style={styles.bosEmoji}>🔍</Text>
                        <Text style={styles.bosText}>Sonuç bulunamadı</Text>
                    </View>
                }
            />

            {/* Alt Dua */}
            <View style={styles.altDuaContainer}>
                <Text style={styles.altDuaText}>
                    "En güzel isimler Allah'ındır. O'na o isimlerle dua edin."
                </Text>
                <Text style={styles.altDuaKaynak}>— A'raf Suresi, 180</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    },
    baslikContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    baslikEmoji: {
        fontSize: 36,
        marginBottom: 8,
    },
    baslik: {
        fontSize: 26,
        fontWeight: '800',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
        textShadowColor: 'rgba(218, 165, 32, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    altBaslik: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        marginTop: 4,
    },
    aramaContainer: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    aramaInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ISLAMI_RENKLER.glassBackground,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: ISLAMI_RENKLER.glassBorder,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    aramaIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    aramaInput: {
        flex: 1,
        fontSize: 15,
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.body,
    },
    temizleIcon: {
        fontSize: 16,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        padding: 4,
    },
    sonucSayisi: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        marginTop: 8,
        textAlign: 'center',
        fontFamily: TYPOGRAPHY.body,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    esmaKart: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    esmaKartSecili: {
        borderColor: ISLAMI_RENKLER.altinOrta,
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
    },
    numaraBadge: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(218, 165, 32, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    numaraText: {
        fontSize: 14,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
    },
    esmaIcerik: {
        flex: 1,
    },
    esmaArapca: {
        fontSize: 24,
        color: ISLAMI_RENKLER.altinAcik,
        marginBottom: 4,
        textAlign: 'left',
    },
    esmaOkunus: {
        fontSize: 16,
        fontWeight: '600',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
    },
    anlamContainer: {
        marginTop: 12,
    },
    anlamAyrac: {
        height: 1,
        backgroundColor: 'rgba(218, 165, 32, 0.3)',
        marginBottom: 10,
    },
    esmaAnlam: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    acmaKapama: {
        fontSize: 12,
        color: ISLAMI_RENKLER.altinOrta,
        marginLeft: 8,
    },
    bosContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    bosEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    bosText: {
        fontSize: 16,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    altDuaContainer: {
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(218, 165, 32, 0.2)',
    },
    altDuaText: {
        fontSize: 13,
        color: ISLAMI_RENKLER.yaziBeyaz,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 20,
    },
    altDuaKaynak: {
        fontSize: 11,
        color: ISLAMI_RENKLER.altinOrta,
        textAlign: 'center',
        marginTop: 6,
        fontFamily: TYPOGRAPHY.body,
    },
});
