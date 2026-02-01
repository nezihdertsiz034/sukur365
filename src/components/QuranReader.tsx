import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { QuranAyah } from '../types/quran';
import { KURAN_RENKLER, ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';

interface QuranReaderProps {
    arabicAyahs: QuranAyah[];
    turkishAyahs: QuranAyah[];
    currentSurahNumber: number;
    currentSurahName: string;
    onBookmark?: (ayahNumber: number, ayahNumberInSurah: number) => void;
    onFavorite?: (ayahNumber: number) => void;
    onShare?: (ayahNumber: number) => void;
    bookmarkedAyahs?: number[];
    favoriteAyahs?: number[];
    fontSize?: 'kucuk' | 'normal' | 'buyuk' | 'cokbuyuk' | 'dev' | 'yasli';
}

export function QuranReader({
    arabicAyahs,
    turkishAyahs,
    currentSurahNumber,
    currentSurahName,
    onBookmark,
    onFavorite,
    onShare,
    bookmarkedAyahs = [],
    favoriteAyahs = [],
    fontSize = 'normal',
}: QuranReaderProps) {

    const getFontSize = () => {
        switch (fontSize) {
            case 'kucuk':
                return { arabic: 22, turkish: 14, ayahNumber: 12, arabicLineHeight: 38, turkishLineHeight: 22 };
            case 'buyuk':
                return { arabic: 32, turkish: 18, ayahNumber: 14, arabicLineHeight: 52, turkishLineHeight: 28 };
            case 'cokbuyuk':
                return { arabic: 36, turkish: 22, ayahNumber: 16, arabicLineHeight: 58, turkishLineHeight: 34 };
            case 'dev':
                return { arabic: 44, turkish: 26, ayahNumber: 18, arabicLineHeight: 68, turkishLineHeight: 40 };
            case 'yasli':
                return { arabic: 52, turkish: 32, ayahNumber: 20, arabicLineHeight: 76, turkishLineHeight: 48 };
            case 'normal':
            default:
                return { arabic: 28, turkish: 16, ayahNumber: 13, arabicLineHeight: 46, turkishLineHeight: 26 };
        }
    };

    const fonts = getFontSize();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Sure Başlığı - Gradient Kart */}
            <LinearGradient
                colors={[ISLAMI_RENKLER.yesilKoyu, ISLAMI_RENKLER.yesilOrta]}
                style={styles.surahHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.surahHeaderOverlay}>
                    <Text style={styles.surahNumberText}>SURAH {currentSurahNumber}</Text>
                    <Text style={styles.surahNameLarge}>{currentSurahName}</Text>
                    <View style={styles.headerDivider} />
                </View>
            </LinearGradient>

            {/* Besmele Kartı */}
            {currentSurahNumber !== 9 && currentSurahNumber !== 1 && (
                <View style={[styles.card, styles.besmeleCard]}>
                    <Text style={[styles.arabicText, styles.besmeleText, { fontSize: fonts.arabic + 2 }]}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </Text>
                </View>
            )}

            {/* Ayetler - Kart Yapısı */}
            {arabicAyahs.map((arabicAyah, index) => {
                const turkishAyah = turkishAyahs[index];
                const isBookmarked = bookmarkedAyahs.includes(arabicAyah.number);
                const isFavorite = favoriteAyahs.includes(arabicAyah.number);

                return (
                    <View key={arabicAyah.number} style={styles.ayahCard}>
                        {/* Sol tarafta Ayet numarası ve Süslemesi */}
                        <View style={styles.cardHeader}>
                            <View style={styles.ayahBadge}>
                                <Text style={styles.ayahBadgeText}>{arabicAyah.numberInSurah}</Text>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    onPress={() => onBookmark?.(arabicAyah.number, arabicAyah.numberInSurah)}
                                    style={styles.actionButton}
                                >
                                    <Ionicons
                                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                        size={22}
                                        color={isBookmarked ? KURAN_RENKLER.bookmarkActive : KURAN_RENKLER.turkceMealAcik}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onFavorite?.(arabicAyah.number)}
                                    style={styles.actionButton}
                                >
                                    <Ionicons
                                        name={isFavorite ? "heart" : "heart-outline"}
                                        size={22}
                                        color={isFavorite ? KURAN_RENKLER.favoriteActive : KURAN_RENKLER.turkceMealAcik}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onShare?.(arabicAyah.number)}
                                    style={styles.actionButton}
                                >
                                    <Ionicons name="share-social-outline" size={22} color={KURAN_RENKLER.turkceMealAcik} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Arapça Metin - Modern Hat Ayarı */}
                        <Text style={[
                            styles.arabicText,
                            {
                                fontSize: fonts.arabic,
                                lineHeight: fonts.arabicLineHeight,
                                color: ISLAMI_RENKLER.yesilKoyu
                            }
                        ]}>
                            {arabicAyah.text}
                        </Text>

                        <View style={styles.cardDivider} />

                        {/* Türkçe Meal */}
                        <Text style={[styles.turkishText, { fontSize: fonts.turkish, lineHeight: fonts.turkishLineHeight }]}>
                            {turkishAyah.text}
                        </Text>
                    </View>
                );
            })}

            <View style={styles.surahEnd} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9F7', // Çok açık yeşilimsi gri
    },
    scrollContent: {
        paddingBottom: 40,
    },
    surahHeaderGradient: {
        margin: 16,
        borderRadius: 20,
        height: 120,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: ISLAMI_RENKLER.yesilKoyu,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    surahHeaderOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 20,
    },
    surahNumberText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    surahNameLarge: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginTop: 4,
    },
    headerDivider: {
        width: 40,
        height: 3,
        backgroundColor: ISLAMI_RENKLER.altinAcik,
        marginTop: 10,
        borderRadius: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    besmeleCard: {
        alignItems: 'center',
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: 'rgba(27, 94, 32, 0.1)',
    },
    besmeleText: {
        color: ISLAMI_RENKLER.yesilKoyu,
        textAlign: 'center',
    },
    ayahCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        borderLeftWidth: 4,
        borderLeftColor: ISLAMI_RENKLER.yesilOrta,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ayahBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(27, 94, 32, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(27, 94, 32, 0.2)',
    },
    ayahBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: ISLAMI_RENKLER.yesilKoyu,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8F9F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arabicText: {
        color: '#2D2D2D',
        textAlign: 'right',
        fontSize: 26,
        writingDirection: 'rtl',
        marginBottom: 16,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        width: '100%',
        marginBottom: 16,
    },
    turkishText: {
        color: '#444444',
        textAlign: 'left',
        lineHeight: 24,
        fontFamily: TYPOGRAPHY.body,
    },
    surahEnd: {
        height: 60,
    },
});
