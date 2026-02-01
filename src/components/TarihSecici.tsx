import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';

interface TarihSeciciProps {
    visible: boolean;
    mevcutTarih: Date;
    onClose: () => void;
    onTarihSec: (tarih: Date) => void;
    baslik: string;
}

/**
 * Tarih seçici modal bileşeni
 */
export const TarihSecici: React.FC<TarihSeciciProps> = ({
    visible,
    mevcutTarih,
    onClose,
    onTarihSec,
    baslik,
}) => {
    const bugun = new Date();
    const [seciliTarih, setSeciliTarih] = useState({
        gun: mevcutTarih.getDate(),
        ay: mevcutTarih.getMonth(),
        yil: mevcutTarih.getFullYear(),
    });

    const gunler = Array.from({ length: 31 }, (_, i) => i + 1);
    const aylar = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const yillar = Array.from({ length: 3 }, (_, i) => bugun.getFullYear() + i);

    const handleKaydet = () => {
        const yeniTarih = new Date(seciliTarih.yil, seciliTarih.ay, seciliTarih.gun);
        onTarihSec(yeniTarih);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalBaslik}>{baslik}</Text>

                    <View style={styles.seciliciContainer}>
                        {/* Gün Seçici */}
                        <View style={styles.secilici}>
                            <Text style={styles.seciliciLabel}>Gün</Text>
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {gunler.map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[
                                            styles.seciliciItem,
                                            seciliTarih.gun === g && styles.seciliciItemSecili,
                                        ]}
                                        onPress={() => setSeciliTarih({ ...seciliTarih, gun: g })}
                                    >
                                        <Text
                                            style={[
                                                styles.seciliciItemText,
                                                seciliTarih.gun === g && styles.seciliciItemTextSecili,
                                            ]}
                                        >
                                            {String(g).padStart(2, '0')}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Ay Seçici */}
                        <View style={styles.secilici}>
                            <Text style={styles.seciliciLabel}>Ay</Text>
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {aylar.map((a, index) => (
                                    <TouchableOpacity
                                        key={a}
                                        style={[
                                            styles.seciliciItem,
                                            seciliTarih.ay === index && styles.seciliciItemSecili,
                                        ]}
                                        onPress={() => setSeciliTarih({ ...seciliTarih, ay: index })}
                                    >
                                        <Text
                                            style={[
                                                styles.seciliciItemText,
                                                seciliTarih.ay === index && styles.seciliciItemTextSecili,
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {a}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Yıl Seçici */}
                        <View style={styles.secilici}>
                            <Text style={styles.seciliciLabel}>Yıl</Text>
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {yillar.map((y) => (
                                    <TouchableOpacity
                                        key={y}
                                        style={[
                                            styles.seciliciItem,
                                            seciliTarih.yil === y && styles.seciliciItemSecili,
                                        ]}
                                        onPress={() => setSeciliTarih({ ...seciliTarih, yil: y })}
                                    >
                                        <Text
                                            style={[
                                                styles.seciliciItemText,
                                                seciliTarih.yil === y && styles.seciliciItemTextSecili,
                                            ]}
                                        >
                                            {y}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.seciliTarihContainer}>
                        <Text style={styles.seciliTarihLabel}>Seçili Tarih:</Text>
                        <Text style={styles.seciliTarih}>
                            {String(seciliTarih.gun).padStart(2, '0')} {aylar[seciliTarih.ay]} {seciliTarih.yil}
                        </Text>
                    </View>

                    <View style={styles.butonlar}>
                        <TouchableOpacity style={styles.iptalButonu} onPress={onClose}>
                            <Text style={styles.iptalButonuText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.kaydetButonu} onPress={handleKaydet}>
                            <Text style={styles.kaydetButonuText}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalBaslik: {
        fontSize: 22,
        fontWeight: 'bold',
        color: ISLAMI_RENKLER.yaziBeyaz,
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: TYPOGRAPHY.display,
    },
    seciliciContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 8,
    },
    secilici: {
        flex: 1,
        alignItems: 'center',
    },
    seciliciLabel: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        marginBottom: 8,
        fontWeight: '600',
        fontFamily: TYPOGRAPHY.body,
    },
    scrollView: {
        maxHeight: 200,
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
    },
    seciliciItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 2,
        borderRadius: 8,
        minWidth: 50,
        alignItems: 'center',
    },
    seciliciItemSecili: {
        backgroundColor: ISLAMI_RENKLER.altinOrta,
    },
    seciliciItemText: {
        fontSize: 16,
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontWeight: '500',
        fontFamily: TYPOGRAPHY.body,
    },
    seciliciItemTextSecili: {
        fontWeight: 'bold',
        color: '#000',
    },
    seciliTarihContainer: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    seciliTarihLabel: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        marginBottom: 8,
        fontFamily: TYPOGRAPHY.body,
    },
    seciliTarih: {
        fontSize: 24,
        fontWeight: 'bold',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
    },
    butonlar: {
        flexDirection: 'row',
        gap: 12,
    },
    iptalButonu: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    iptalButonuText: {
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: TYPOGRAPHY.body,
    },
    kaydetButonu: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.altinOrta,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    kaydetButonuText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: TYPOGRAPHY.body,
    },
});
