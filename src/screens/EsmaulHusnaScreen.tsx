import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { ESMAUL_HUSNA, EsmaItem } from '../constants/esmaulHusna';
import { useTheme } from '../hooks/useTheme';

export default function EsmaulHusnaScreen() {
    const [aramaMetni, setAramaMetni] = useState('');
    const [seciliEsma, setSeciliEsma] = useState<EsmaItem | null>(null);
    const tema = useTheme();

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

    const renderEsmaItem = ({ item }: { item: EsmaItem }) => {
        const isSecili = seciliEsma?.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.esmaKart,
                    {
                        backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)',
                        borderColor: tema.vurgu + '20'
                    },
                    isSecili && { borderColor: tema.vurgu, backgroundColor: tema.vurgu + '26' }
                ]}
                onPress={() => setSeciliEsma(isSecili ? null : item)}
                activeOpacity={0.8}
            >
                <View style={[styles.numaraBadge, { backgroundColor: tema.vurgu + '20' }]}>
                    <Text style={[styles.numaraText, { color: tema.vurgu }]}>{item.id}</Text>
                </View>

                <View style={styles.esmaIcerik}>
                    <Text style={[styles.esmaArapca, { color: tema.vurgu }]}>{item.arapca}</Text>
                    <Text style={[styles.esmaOkunus, { color: tema.yaziRenk }]}>{item.okunusu}</Text>

                    {isSecili && (
                        <View style={styles.anlamContainer}>
                            <View style={[styles.anlamAyrac, { backgroundColor: tema.vurgu + '33' }]} />
                            <Text style={[styles.esmaAnlam, { color: tema.yaziRenkSoluk }]}>{item.anlami}</Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.acmaKapama, { color: tema.vurgu }]}>{isSecili ? '▲' : '▼'}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <BackgroundDecor />

            <View style={styles.baslikContainer}>
                <Text style={styles.baslikEmoji}>☪️</Text>
                <Text style={[styles.baslik, { color: tema.vurgu }]}>Esmaül Hüsna</Text>
                <Text style={[styles.altBaslik, { color: tema.yaziRenkSoluk }]}>Allah'ın 99 İsmi</Text>
            </View>

            <View style={styles.aramaContainer}>
                <View style={[styles.aramaInputWrapper, {
                    backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)',
                    borderColor: tema.vurgu + '33'
                }]}>
                    <Text style={styles.aramaIcon}>🔍</Text>
                    <TextInput
                        style={[styles.aramaInput, { color: tema.yaziRenk }]}
                        placeholder="İsim veya anlam ara..."
                        placeholderTextColor={tema.yaziRenkSoluk}
                        value={aramaMetni}
                        onChangeText={setAramaMetni}
                    />
                    {aramaMetni.length > 0 && (
                        <TouchableOpacity onPress={() => setAramaMetni('')}>
                            <Text style={[styles.temizleIcon, { color: tema.yaziRenkSoluk }]}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={[styles.sonucSayisi, { color: tema.yaziRenkSoluk }]}>
                    {filtrelenmisEsmalar.length} isim gösteriliyor
                </Text>
            </View>

            <FlatList
                data={filtrelenmisEsmalar}
                renderItem={renderEsmaItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.bosContainer}>
                        <Text style={styles.bosEmoji}>🔍</Text>
                        <Text style={[styles.bosText, { color: tema.yaziRenkSoluk }]}>Sonuç bulunamadı</Text>
                    </View>
                }
            />

            <View style={[styles.altDuaContainer, { backgroundColor: tema.vurgu + '10', borderTopColor: tema.vurgu + '33' }]}>
                <Text style={[styles.altDuaText, { color: tema.yaziRenk }]}>
                    "En güzel isimler Allah'ındır. O'na o isimlerle dua edin."
                </Text>
                <Text style={[styles.altDuaKaynak, { color: tema.vurgu }]}>— A'raf Suresi, 180</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontFamily: TYPOGRAPHY.display,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    altBaslik: {
        fontSize: 14,
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
        borderRadius: 14,
        borderWidth: 1,
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
        fontFamily: TYPOGRAPHY.body,
    },
    temizleIcon: {
        fontSize: 16,
        padding: 4,
    },
    sonucSayisi: {
        fontSize: 12,
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
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
    },
    numaraBadge: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    numaraText: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: TYPOGRAPHY.display,
    },
    esmaIcerik: {
        flex: 1,
    },
    esmaArapca: {
        fontSize: 24,
        marginBottom: 4,
        textAlign: 'left',
    },
    esmaOkunus: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: TYPOGRAPHY.display,
    },
    anlamContainer: {
        marginTop: 12,
    },
    anlamAyrac: {
        height: 1,
        marginBottom: 10,
    },
    esmaAnlam: {
        fontSize: 14,
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    acmaKapama: {
        fontSize: 12,
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
        fontFamily: TYPOGRAPHY.body,
    },
    altDuaContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
    },
    altDuaText: {
        fontSize: 13,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 20,
    },
    altDuaKaynak: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 6,
        fontFamily: TYPOGRAPHY.body,
    },
});
