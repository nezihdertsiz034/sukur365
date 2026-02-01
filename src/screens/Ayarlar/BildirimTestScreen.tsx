import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { TYPOGRAPHY } from '../../constants/typography';
import { useBildirimler } from '../../hooks/useBildirimler';
import { BackgroundDecor } from '../../components/BackgroundDecor';
import { logger } from '../../utils/logger';

export default function BildirimTestScreen() {
    const { sendTestNotification, getScheduledNotifications, bildirimleriAyarla, scheduleCustomNotification } = useBildirimler();
    const [scheduledList, setScheduledList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [customHour, setCustomHour] = useState('');
    const [customMinute, setCustomMinute] = useState('');
    const [customTitle, setCustomTitle] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Planlanmış Bildirimleri Al
            const list = await getScheduledNotifications();
            setScheduledList(list);
        } catch (error) {
            logger.error('Bildirim verileri alınamadı', { error }, 'BildirimPaneli');
        } finally {
            setLoading(false);
        }
    };

    const testHemen = async () => {
        const success = await sendTestNotification();
        if (success) {
            Alert.alert('✅ Başarılı', '3 saniye içinde test bildirimi planlandı.');
            setTimeout(fetchData, 4000);
        }
    };

    const handleOzelBildirimEkle = async () => {
        const hour = parseInt(customHour);
        const minute = parseInt(customMinute);

        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            Alert.alert('❌ Hata', 'Geçerli bir saat (0-23) ve dakika (0-59) giriniz.');
            return;
        }

        const success = await scheduleCustomNotification(
            hour,
            minute,
            customTitle.trim() || '⏰ Özel Hatırlatıcı'
        );
        if (success) {
            Alert.alert('✅ Başarılı', `"${customTitle.trim() || 'Özel Hatırlatıcı'}" her gün ${customHour.padStart(2, '0')}:${customMinute.padStart(2, '0')} için planlandı.`);
            setCustomHour('');
            setCustomMinute('');
            setCustomTitle('');
            await fetchData();
        } else {
            Alert.alert('❌ Hata', 'Bildirim planlanırken bir sorun oluştu.');
        }
    };

    const temizleVeYenidenKur = async () => {
        setLoading(true);
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await bildirimleriAyarla();
            Alert.alert('✅ Başarılı', 'Tüm bildirimler temizlendi ve ayarlara göre yeniden kuruldu.');
            await fetchData();
        } catch (error) {
            Alert.alert('❌ Hata', 'Yeniden kurma işlemi başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundDecor />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Bildirim Paneli</Text>

                {/* İşlemler */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ İşlemler</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={testHemen}>
                            <Text style={styles.buttonText}>Hemen Test Et</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#e67e22' }]} onPress={temizleVeYenidenKur}>
                            <Text style={styles.buttonText}>Yeniden Kur</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Özel Bildirim Planla */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⏰ Özel Hatırlatıcı Ekle</Text>
                    <View style={styles.card}>
                        <View style={styles.inputGroupFull}>
                            <Text style={styles.inputLabel}>Vakit İsmi (Opsiyonel)</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Örn: İlaç Vakti, Kitap Okuma..."
                                placeholderTextColor="#666"
                                value={customTitle}
                                onChangeText={setCustomTitle}
                            />
                        </View>

                        <View style={styles.timeInputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Saat</Text>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="00"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={customHour}
                                    onChangeText={setCustomHour}
                                />
                            </View>
                            <Text style={styles.timeSeparator}>:</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Dakika</Text>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="00"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={customMinute}
                                    onChangeText={setCustomMinute}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.addCustomButton} onPress={handleOzelBildirimEkle}>
                            <Text style={styles.addCustomButtonText}>Zamanlı Bildirim Ekle</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Planlanmış Bildirimler */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.sectionTitle}>📅 Zamanlanan Bildirimler</Text>
                        <TouchableOpacity onPress={fetchData}>
                            <Text style={styles.refreshText}>Yenile</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator color={ISLAMI_RENKLER.altinOrta} style={{ marginTop: 20 }} />
                    ) : scheduledList.length === 0 ? (
                        <Text style={styles.emptyText}>Planlanmış bildirim bulunmuyor.</Text>
                    ) : (
                        scheduledList.map((item, index) => {
                            const trigger = item.trigger as any;
                            let zaman = 'Bilinmiyor';
                            if (trigger.type === 'calendar') {
                                const h = trigger.hour ?? trigger.value?.hour;
                                const m = trigger.minute ?? trigger.value?.minute;
                                if (h !== undefined && m !== undefined) {
                                    zaman = `Her gün ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                                } else {
                                    zaman = 'Zamanlanmış (Her gün)';
                                }
                            } else if (trigger.type === 'timeInterval') {
                                const seconds = trigger.seconds ?? trigger.value;
                                zaman = seconds ? `${Math.floor(seconds / 60)} dk sonra` : 'Yakında';
                            } else if (trigger.type === 'date') {
                                const dateVal = trigger.date ?? trigger.value;
                                zaman = dateVal ? new Date(dateVal).toLocaleTimeString('tr-TR') : 'Belirli Tarih';
                            }

                            return (
                                <View key={index} style={styles.notificationCard}>
                                    <Text style={styles.notifTitle}>{item.content.title || 'Başlıksız'}</Text>
                                    <Text style={styles.notifBody}>{item.content.body}</Text>
                                    <Text style={styles.notifTime}>⏰ {zaman}</Text>
                                </View>
                            );
                        })
                    )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: TYPOGRAPHY.display,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        color: ISLAMI_RENKLER.altinParlak,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tokenText: {
        color: '#ccc',
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginBottom: 10,
    },
    copyButton: {
        alignSelf: 'flex-end',
        padding: 5,
    },
    copyButtonText: {
        color: ISLAMI_RENKLER.altinOrta,
        fontSize: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.yesilKoyu,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    refreshText: {
        color: ISLAMI_RENKLER.altinOrta,
        fontSize: 14,
    },
    notificationCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    notifTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    notifBody: {
        color: '#ddd',
        fontSize: 14,
        marginBottom: 8,
    },
    notifTime: {
        color: ISLAMI_RENKLER.altinOrta,
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    timeInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    inputGroup: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    inputLabel: {
        color: ISLAMI_RENKLER.altinAcik,
        fontSize: 12,
        marginBottom: 5,
    },
    timeInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        width: 60,
        height: 50,
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    timeSeparator: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    addCustomButton: {
        backgroundColor: ISLAMI_RENKLER.altinOrta,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addCustomButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputGroupFull: {
        width: '100%',
        marginBottom: 15,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});
