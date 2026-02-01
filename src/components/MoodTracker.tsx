import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, Platform } from 'react-native';
import { ISLAMI_RENKLER, TEMA_RENKLERI } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { MOOD_VERILERI } from '../constants/homeScreenConstants';
import { MOOD_HAVUZU } from '../constants/moodContents';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const MoodTracker: React.FC = () => {
    const [seciliMood, setSeciliMood] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const tema = React.useMemo(() => {
        const saat = new Date().getHours();
        if (saat >= 5 && saat < 11) return TEMA_RENKLERI.SABAH;
        if (saat >= 11 && saat < 18) return TEMA_RENKLERI.GUN;
        if (saat >= 18 && saat < 22) return TEMA_RENKLERI.AKSAM;
        return TEMA_RENKLERI.GECE;
    }, []);

    const handleMoodSelect = (mood: any) => {
        const todayIndex = (new Date().getDate() - 1) % 30;
        const gunlukIcerik = MOOD_HAVUZU[mood.id] ? MOOD_HAVUZU[mood.id][todayIndex] : { ayet: mood.ayet, dua: mood.dua };

        setSeciliMood({
            ...mood,
            ayet: gunlukIcerik.ayet,
            dua: gunlukIcerik.dua
        });
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bugün Nasıl Hissediyorsun?</Text>
            <View style={styles.moodList}>
                {MOOD_VERILERI.map((mood) => (
                    <TouchableOpacity
                        key={mood.id}
                        style={styles.moodItem}
                        onPress={() => handleMoodSelect(mood)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: `${mood.renk}15` }]}>
                            <Image source={mood.ikon} style={styles.moodIcon} />
                        </View>
                        <Text style={styles.moodLabel}>{mood.etiket}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
                    <View style={[styles.modalContent, { backgroundColor: tema.arkaPlan, borderColor: tema.vurgu + '33' }]}>
                        {seciliMood && (
                            <>
                                <View style={styles.modalHeader}>
                                    <View style={[styles.modalIconBox, { backgroundColor: `${seciliMood.renk}20` }]}>
                                        <Image source={seciliMood.ikon} style={styles.modalIcon} />
                                    </View>
                                    <Text style={[styles.modalTitle, { color: tema.vurgu }]}>{seciliMood.etiket}</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.contentSection}>
                                    <View style={styles.sectionTitleRow}>
                                        <Ionicons name="book" size={18} color={tema.vurgu} />
                                        <Text style={styles.sectionHeader}>Senin İçin Bir Ayet</Text>
                                    </View>
                                    <Text style={styles.contentText}>{seciliMood.ayet}</Text>
                                </View>

                                <View style={[styles.contentSection, { marginTop: 20 }]}>
                                    <View style={styles.sectionTitleRow}>
                                        <Ionicons name="heart" size={18} color={tema.vurgu} />
                                        <Text style={styles.sectionHeader}>Günün Duası</Text>
                                    </View>
                                    <Text style={styles.contentText}>{seciliMood.dua}</Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.closeButton, { backgroundColor: tema.vurgu }]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Anladım</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
        marginBottom: 15,
    },
    moodList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    moodItem: {
        alignItems: 'center',
        width: (width - 70) / 4,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    moodIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    moodLabel: {
        fontSize: 11,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 5,
    },
    modalIconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        fontFamily: TYPOGRAPHY.display,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 20,
    },
    contentSection: {
        width: '100%',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyazAcik,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    contentText: {
        fontSize: 16,
        color: ISLAMI_RENKLER.yaziBeyaz,
        lineHeight: 24,
        fontFamily: TYPOGRAPHY.body,
        fontStyle: 'italic',
    },
    closeButton: {
        marginTop: 30,
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
