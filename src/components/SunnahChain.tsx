import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ISLAMI_RENKLER, TEMA_RENKLERI } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const SUNNET_HAVUZU = [
    'Birine tebessüm etmek',
    'Yemeğe besmele ile başlamak',
    'Suyu üç yudumda oturarak içmek',
    'Birine selam vermek',
    'Yemekten önce ve sonra elleri yıkamak',
    'Sağ tarafa yatmak',
    'Birine iyilik yapmak',
    'Kuşlara/hayvanlara su/yem vermek',
    'Bir sünneti birine öğretmek',
    'Abdestli uyumak'
];

export const SunnahChain: React.FC = () => {
    const [gorevler, setGorevler] = useState<{ gorev: string, tamam: boolean }[]>([]);
    const [yukleniyor, setYukleniyor] = useState(true);

    const tema = useMemo(() => {
        const saat = new Date().getHours();
        if (saat >= 5 && saat < 11) return TEMA_RENKLERI.SABAH;
        if (saat >= 11 && saat < 18) return TEMA_RENKLERI.GUN;
        if (saat >= 18 && saat < 22) return TEMA_RENKLERI.AKSAM;
        return TEMA_RENKLERI.GECE;
    }, []);

    useEffect(() => {
        loadDailySunnah();
    }, []);

    const loadDailySunnah = async () => {
        try {
            const today = new Date().toLocaleDateString('tr-TR');
            const savedData = await AsyncStorage.getItem(`@sunnah_${today}`);

            if (savedData) {
                setGorevler(JSON.parse(savedData));
            } else {
                // Yeni gün için 3 rastgele sünnet seç
                const shuffled = [...SUNNET_HAVUZU].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3).map(s => ({ gorev: s, tamam: false }));
                setGorevler(selected);
                await AsyncStorage.setItem(`@sunnah_${today}`, JSON.stringify(selected));
            }
        } catch (e) {
            console.error('Sunnah load error:', e);
        } finally {
            setYukleniyor(false);
        }
    };

    const toggleGorev = async (index: number) => {
        const newGorevler = [...gorevler];
        newGorevler[index].tamam = !newGorevler[index].tamam;

        if (newGorevler[index].tamam) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        setGorevler(newGorevler);
        const today = new Date().toLocaleDateString('tr-TR');
        await AsyncStorage.setItem(`@sunnah_${today}`, JSON.stringify(newGorevler));
    };

    const tamamlananSayisi = gorevler.filter(g => g.tamam).length;
    const progress = gorevler.length > 0 ? (tamamlananSayisi / gorevler.length) * 100 : 0;

    if (yukleniyor || gorevler.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Günün Sünnet Zinciri</Text>
                    <Text style={styles.subtitle}>Sünnetleri yaşat, zinciri tamabla</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: tema.vurgu + '26' }]}>
                    <Text style={[styles.badgeText, { color: tema.vurgu }]}>{tamamlananSayisi}/3</Text>
                </View>
            </View>

            <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: tema.vurgu }]} />
            </View>

            <View style={styles.list}>
                {gorevler.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.item,
                            item.tamam && { borderColor: tema.vurgu + '66', backgroundColor: tema.vurgu + '12' }
                        ]}
                        onPress={() => toggleGorev(index)}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.checkbox,
                            item.tamam && { backgroundColor: tema.vurgu, borderColor: tema.vurgu }
                        ]}>
                            {item.tamam && <Ionicons name="checkmark" size={16} color="#000" />}
                        </View>
                        <Text style={[
                            styles.itemText,
                            item.tamam && styles.itemTextDone
                        ]}>{item.gorev}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
    },
    subtitle: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        opacity: 0.6,
        fontFamily: TYPOGRAPHY.body,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontWeight: '900',
        fontSize: 12,
    },
    progressBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 3,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    list: {
        gap: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemText: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.body,
        fontWeight: '500',
        flex: 1,
    },
    itemTextDone: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    }
});
