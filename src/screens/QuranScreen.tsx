import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList,
    Share as RNShare,
    StatusBar,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuran } from '../hooks/useQuran';
import { QuranReader } from '../components/QuranReader';
import { QuranBookmark } from '../types/quran';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useTheme } from '../hooks/useTheme';
import { getSurahTurkishName } from '../utils/quranApi';
import { useSettings } from '../context/SettingsContext';

export default function QuranScreen() {
    const {
        surahs,
        currentSurah,
        loading,
        error,
        progress,
        bookmarks,
        favorites,
        loadSurah,
        addBookmark,
        removeBookmark,
        addFavorite,
        removeFavorite,
    } = useQuran();

    const [showSurahList, setShowSurahList] = useState(false);
    const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const { uygulamaAyarlari, guncelleUygulamaAyarlari } = useSettings();
    const tema = useTheme();


    useEffect(() => {
        if (isInitialized || !progress) return;

        if (progress.lastReadSurah > 0) {
            loadSurah(progress.lastReadSurah);
            setCurrentSurahIndex(progress.lastReadSurah - 1);
        } else {
            loadSurah(1);
            setCurrentSurahIndex(0);
        }

        setIsInitialized(true);
    }, [progress, isInitialized, loadSurah]);

    const goToNextSurah = useCallback(() => {
        if (currentSurahIndex < 113) {
            const nextIndex = currentSurahIndex + 1;
            setCurrentSurahIndex(nextIndex);
            loadSurah(nextIndex + 1);
        } else {
            Alert.alert('Hatim Tamamlandı', 'Kur\'an-ı Kerim\'i tamamladınız! 🎉');
        }
    }, [currentSurahIndex, loadSurah]);

    const goToPreviousSurah = useCallback(() => {
        if (currentSurahIndex > 0) {
            const prevIndex = currentSurahIndex - 1;
            setCurrentSurahIndex(prevIndex);
            loadSurah(prevIndex + 1);
        }
    }, [currentSurahIndex, loadSurah]);

    const goToSurah = useCallback((surahNumber: number) => {
        setCurrentSurahIndex(surahNumber - 1);
        loadSurah(surahNumber);
        setShowSurahList(false);
    }, [loadSurah]);

    const handleBookmark = useCallback((ayahNumber: number, ayahNumberInSurah: number) => {
        if (!currentSurah) return;

        const existingBookmark = bookmarks.find(
            b => b.surahNumber === currentSurah.arabic.number && b.ayahNumberInSurah === ayahNumberInSurah
        );

        if (existingBookmark) {
            removeBookmark(existingBookmark.id);
        } else {
            const bookmark: QuranBookmark = {
                id: `${currentSurah.arabic.number}-${ayahNumberInSurah}-${Date.now()}`,
                surahNumber: currentSurah.arabic.number,
                surahName: currentSurah.arabic.englishName,
                ayahNumber,
                ayahNumberInSurah,
                timestamp: Date.now(),
            };
            addBookmark(bookmark);
        }
    }, [currentSurah, bookmarks, addBookmark, removeBookmark]);

    const handleFavorite = useCallback((ayahNumber: number) => {
        if (favorites.includes(ayahNumber)) {
            removeFavorite(ayahNumber);
        } else {
            addFavorite(ayahNumber);
        }
    }, [favorites, addFavorite, removeFavorite]);

    const handleShare = useCallback(async (ayahNumber: number) => {
        if (!currentSurah) return;

        const ayahIndex = currentSurah.arabic.ayahs.findIndex(a => a.number === ayahNumber);
        if (ayahIndex === -1) return;

        const arabicText = currentSurah.arabic.ayahs[ayahIndex].text;
        const turkishText = currentSurah.turkish.ayahs[ayahIndex].text;
        const ayahNumberInSurah = currentSurah.arabic.ayahs[ayahIndex].numberInSurah;

        const shareText = `${currentSurah.arabic.englishName} Suresi, Ayet ${ayahNumberInSurah}\n\n${arabicText}\n\n${turkishText}\n\n- Şükür365`;

        try {
            await RNShare.share({ message: shareText });
        } catch (error) {
            console.error('Paylaşım hatası:', error);
        }
    }, [currentSurah]);

    const toggleFontSize = useCallback(async () => {
        if (!uygulamaAyarlari) return;

        const sizes: ('kucuk' | 'normal' | 'buyuk' | 'cokbuyuk' | 'dev' | 'yasli')[] = ['kucuk', 'normal', 'buyuk', 'cokbuyuk', 'dev', 'yasli'];
        const currentIndex = sizes.indexOf(uygulamaAyarlari.yaziBoyutu);
        const nextIndex = (currentIndex + 1) % sizes.length;
        const nextSize = sizes[nextIndex];

        await guncelleUygulamaAyarlari({ yaziBoyutu: nextSize });
    }, [uygulamaAyarlari, guncelleUygulamaAyarlari]);

    const renderSurahListModal = () => (
        <Modal
            visible={showSurahList}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSurahList(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Sure Seçin</Text>
                        <TouchableOpacity
                            onPress={() => setShowSurahList(false)}
                            style={styles.modalCloseButton}
                        >
                            <Ionicons name="close" size={24} color={ISLAMI_RENKLER.yesilKoyu} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={surahs}
                        keyExtractor={(item) => item.number.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.surahItem,
                                    item.number === currentSurahIndex + 1 && styles.surahItemActive
                                ]}
                                onPress={() => goToSurah(item.number)}
                            >
                                <View style={styles.surahItemLeft}>
                                    <View style={[
                                        styles.surahNumberBadge,
                                        item.number === currentSurahIndex + 1 && styles.surahNumberBadgeActive
                                    ]}>
                                        <Text style={[
                                            styles.surahNumberTextModal,
                                            item.number === currentSurahIndex + 1 && styles.surahNumberTextActive
                                        ]}>{item.number}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.surahItemName}>{getSurahTurkishName(item.englishName)}</Text>
                                        <Text style={styles.surahItemInfo}>
                                            {item.numberOfAyahs} ayet • {item.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.surahItemArabic}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );

    if (loading && !currentSurah) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={ISLAMI_RENKLER.yesilOrta} />
                    <Text style={styles.loadingText}>Kur'an-ı Kerim yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={ISLAMI_RENKLER.yesilOrta} />
                    <Text style={styles.errorText}>❌ {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => loadSurah(currentSurahIndex + 1)}>
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]} edges={['top']}>
            <StatusBar barStyle="light-content" />

            {/* Modern Header */}
            <LinearGradient
                colors={[tema.ana, tema.ikincil]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity onPress={() => setShowSurahList(true)} style={styles.headerButton}>
                    <Ionicons name="list" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Şükür365</Text>
                    <Text style={styles.headerSubtitle}>Kur'an-ı Kerim</Text>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={toggleFontSize} style={styles.fontSizeButton}>
                        <Ionicons name="text" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Kur'an Reader */}
            {currentSurah && (
                <View style={{ flex: 1 }}>
                    <QuranReader
                        arabicAyahs={currentSurah.arabic.ayahs}
                        turkishAyahs={currentSurah.turkish.ayahs}
                        currentSurahNumber={currentSurah.arabic.number}
                        currentSurahName={getSurahTurkishName(currentSurah.arabic.englishName)}
                        onBookmark={handleBookmark}
                        onFavorite={handleFavorite}
                        onShare={handleShare}
                        bookmarkedAyahs={bookmarks.map(b => b.ayahNumber)}
                        favoriteAyahs={favorites}
                        fontSize={uygulamaAyarlari?.yaziBoyutu}
                    />

                    {/* Loading Overlay */}
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="large" color={ISLAMI_RENKLER.yesilOrta} />
                                <Text style={styles.loadingOverlayText}>Sure yükleniyor...</Text>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Modern Navigation Footer */}
            <View style={[styles.footer, { backgroundColor: tema.arkaPlan, borderTopColor: `${tema.vurgu}33` }]}>
                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: tema.ana }, currentSurahIndex === 0 && styles.navButtonDisabled]}
                    onPress={goToPreviousSurah}
                    disabled={currentSurahIndex === 0}
                >
                    <Ionicons name="chevron-back" size={20} color={currentSurahIndex === 0 ? "#999" : "#FFF"} />
                    <Text style={[styles.navButtonText, currentSurahIndex === 0 && styles.navButtonTextDisabled]}>Önceki</Text>
                </TouchableOpacity>

                <View style={[styles.surahProgressContainer, { backgroundColor: `${tema.vurgu}15` }]}>
                    <Text style={[styles.surahProgressText, { color: tema.vurgu }]}>{currentSurahIndex + 1} / 114</Text>
                </View>

                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: tema.ana }, currentSurahIndex === 113 && styles.navButtonDisabled]}
                    onPress={goToNextSurah}
                    disabled={currentSurahIndex === 113}
                >
                    <Text style={[styles.navButtonText, currentSurahIndex === 113 && styles.navButtonTextDisabled]}>Sonraki</Text>
                    <Ionicons name="chevron-forward" size={20} color={currentSurahIndex === 113 ? "#999" : "#FFF"} />
                </TouchableOpacity>
            </View>

            {renderSurahListModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: ISLAMI_RENKLER.yesilKoyu,
        fontFamily: TYPOGRAPHY.body,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: ISLAMI_RENKLER.yesilKoyu,
        textAlign: 'center',
        marginVertical: 20,
    },
    retryButton: {
        backgroundColor: ISLAMI_RENKLER.yesilOrta,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fontSizeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ISLAMI_RENKLER.yesilOrta,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 100,
        justifyContent: 'center',
    },
    navButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    navButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 4,
    },
    navButtonTextDisabled: {
        color: '#999',
    },
    surahProgressContainer: {
        backgroundColor: 'rgba(27, 94, 32, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    surahProgressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: ISLAMI_RENKLER.yesilKoyu,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: '85%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: ISLAMI_RENKLER.yesilKoyu,
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8F9F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    surahItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    surahItemActive: {
        backgroundColor: 'rgba(27, 94, 32, 0.05)',
    },
    surahItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    surahNumberBadge: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#F0F4F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    surahNumberBadgeActive: {
        backgroundColor: ISLAMI_RENKLER.yesilOrta,
    },
    surahNumberTextModal: {
        color: ISLAMI_RENKLER.yesilKoyu,
        fontSize: 15,
        fontWeight: 'bold',
    },
    surahNumberTextActive: {
        color: '#FFF',
    },
    surahItemName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: ISLAMI_RENKLER.yesilKoyu,
        marginBottom: 3,
    },
    surahItemInfo: {
        fontSize: 12,
        color: '#777',
    },
    surahItemArabic: {
        fontSize: 20,
        color: ISLAMI_RENKLER.yesilKoyu,
        fontWeight: '600',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingBox: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    loadingOverlayText: {
        marginTop: 15,
        fontSize: 16,
        color: ISLAMI_RENKLER.yesilKoyu,
        fontWeight: '600',
    },
});
