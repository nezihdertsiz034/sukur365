/**
 * Kur'an Storage Utility
 * 
 * Kur'an verilerini cache'ler, bookmark ve ilerleme takibi yapar
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuranProgress, QuranBookmark, QuranSettings, QuranSurahResponse } from '../types/quran';
import { logger } from './logger';
import { handleError } from './errorHandler';

const STORAGE_KEYS = {
    QURAN_CACHE_ARABIC: '@quran_cache_arabic',
    QURAN_CACHE_TURKISH: '@quran_cache_turkish',
    QURAN_CACHE_TIMESTAMP: '@quran_cache_timestamp',
    QURAN_PROGRESS: '@quran_progress',
    QURAN_BOOKMARKS: '@quran_bookmarks',
    QURAN_FAVORITES: '@quran_favorites',
    QURAN_SETTINGS: '@quran_settings',
} as const;

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 hafta

// ========== CACHE YÖNETİMİ ==========

/**
 * Kur'an verilerini cache'e kaydeder
 */
export async function cacheQuranData(
    arabic: QuranSurahResponse[],
    turkish: QuranSurahResponse[]
): Promise<void> {
    try {
        logger.info('Kur\'an verileri cache\'e kaydediliyor...', undefined, 'quranStorage');

        await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.QURAN_CACHE_ARABIC, JSON.stringify(arabic)),
            AsyncStorage.setItem(STORAGE_KEYS.QURAN_CACHE_TURKISH, JSON.stringify(turkish)),
            AsyncStorage.setItem(STORAGE_KEYS.QURAN_CACHE_TIMESTAMP, Date.now().toString())
        ]);

        logger.info('Kur\'an verileri başarıyla cache\'e kaydedildi', undefined, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.cacheQuranData');
        throw error;
    }
}

/**
 * Cache'lenmiş Kur'an verilerini getirir
 */
export async function getCachedQuranData(): Promise<{
    arabic: QuranSurahResponse[];
    turkish: QuranSurahResponse[];
} | null> {
    try {
        const [arabicData, turkishData, timestamp] = await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.QURAN_CACHE_ARABIC),
            AsyncStorage.getItem(STORAGE_KEYS.QURAN_CACHE_TURKISH),
            AsyncStorage.getItem(STORAGE_KEYS.QURAN_CACHE_TIMESTAMP)
        ]);

        if (!arabicData || !turkishData || !timestamp) {
            logger.debug('Cache\'de Kur\'an verisi bulunamadı', undefined, 'quranStorage');
            return null;
        }

        // Cache süresi kontrolü
        const cacheAge = Date.now() - parseInt(timestamp, 10);
        if (cacheAge > CACHE_DURATION) {
            logger.info('Cache süresi dolmuş, yeni veri gerekiyor', undefined, 'quranStorage');
            return null;
        }

        logger.info('Kur\'an verileri cache\'den alındı', undefined, 'quranStorage');

        return {
            arabic: JSON.parse(arabicData),
            turkish: JSON.parse(turkishData)
        };
    } catch (error) {
        handleError(error, 'quranStorage.getCachedQuranData');
        return null;
    }
}

/**
 * Cache'i temizler
 */
export async function clearQuranCache(): Promise<void> {
    try {
        await Promise.all([
            AsyncStorage.removeItem(STORAGE_KEYS.QURAN_CACHE_ARABIC),
            AsyncStorage.removeItem(STORAGE_KEYS.QURAN_CACHE_TURKISH),
            AsyncStorage.removeItem(STORAGE_KEYS.QURAN_CACHE_TIMESTAMP)
        ]);

        logger.info('Kur\'an cache\'i temizlendi', undefined, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.clearQuranCache');
    }
}

// ========== İLERLEME TAKİBİ ==========

/**
 * Kur'an okuma ilerlemesini getirir
 */
export async function getQuranProgress(): Promise<QuranProgress> {
    const defaultProgress: QuranProgress = {
        lastReadSurah: 1,
        lastReadAyah: 1,
        lastReadDate: Date.now(),
        totalAyahsRead: 0,
        favoriteAyahs: [],
        bookmarks: [],
        readingStreak: 0,
        totalReadingTime: 0,
    };

    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.QURAN_PROGRESS);

        if (!data) {
            return defaultProgress;
        }

        return JSON.parse(data);
    } catch (error) {
        handleError(error, 'quranStorage.getQuranProgress');
        return defaultProgress;
    }
}

/**
 * Kur'an okuma ilerlemesini kaydeder
 */
export async function saveQuranProgress(progress: QuranProgress): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.QURAN_PROGRESS, JSON.stringify(progress));
        logger.debug('Kur\'an ilerlemesi kaydedildi', {
            surah: progress.lastReadSurah,
            ayah: progress.lastReadAyah
        }, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.saveQuranProgress');
        throw error;
    }
}

/**
 * Son okunan pozisyonu günceller
 */
export async function updateLastRead(surahNumber: number, ayahNumber: number): Promise<void> {
    try {
        const progress = await getQuranProgress();

        progress.lastReadSurah = surahNumber;
        progress.lastReadAyah = ayahNumber;
        progress.lastReadDate = Date.now();

        await saveQuranProgress(progress);
    } catch (error) {
        handleError(error, 'quranStorage.updateLastRead');
    }
}

// ========== BOOKMARK YÖNETİMİ ==========

/**
 * Tüm bookmark'ları getirir
 */
export async function getBookmarks(): Promise<QuranBookmark[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.QURAN_BOOKMARKS);

        if (!data) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        handleError(error, 'quranStorage.getBookmarks');
        return [];
    }
}

/**
 * Bookmark ekler
 */
export async function addBookmark(bookmark: QuranBookmark): Promise<void> {
    try {
        const bookmarks = await getBookmarks();

        // Aynı ayet için bookmark varsa güncelle
        const existingIndex = bookmarks.findIndex(
            b => b.surahNumber === bookmark.surahNumber && b.ayahNumberInSurah === bookmark.ayahNumberInSurah
        );

        if (existingIndex >= 0) {
            bookmarks[existingIndex] = bookmark;
        } else {
            bookmarks.push(bookmark);
        }

        await AsyncStorage.setItem(STORAGE_KEYS.QURAN_BOOKMARKS, JSON.stringify(bookmarks));
        logger.info('Bookmark eklendi', { surah: bookmark.surahNumber, ayah: bookmark.ayahNumberInSurah }, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.addBookmark');
        throw error;
    }
}

/**
 * Bookmark siler
 */
export async function removeBookmark(bookmarkId: string): Promise<void> {
    try {
        const bookmarks = await getBookmarks();
        const filtered = bookmarks.filter(b => b.id !== bookmarkId);

        await AsyncStorage.setItem(STORAGE_KEYS.QURAN_BOOKMARKS, JSON.stringify(filtered));
        logger.info('Bookmark silindi', { id: bookmarkId }, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.removeBookmark');
        throw error;
    }
}

// ========== FAVORİ AYETLER ==========

/**
 * Favori ayetleri getirir
 */
export async function getFavoriteAyahs(): Promise<number[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.QURAN_FAVORITES);

        if (!data) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        handleError(error, 'quranStorage.getFavoriteAyahs');
        return [];
    }
}

/**
 * Favori ayet ekler
 */
export async function addFavoriteAyah(ayahNumber: number): Promise<void> {
    try {
        const favorites = await getFavoriteAyahs();

        if (!favorites.includes(ayahNumber)) {
            favorites.push(ayahNumber);
            await AsyncStorage.setItem(STORAGE_KEYS.QURAN_FAVORITES, JSON.stringify(favorites));
            logger.info('Favori ayet eklendi', { ayah: ayahNumber }, 'quranStorage');
        }
    } catch (error) {
        handleError(error, 'quranStorage.addFavoriteAyah');
        throw error;
    }
}

/**
 * Favori ayeti kaldırır
 */
export async function removeFavoriteAyah(ayahNumber: number): Promise<void> {
    try {
        const favorites = await getFavoriteAyahs();
        const filtered = favorites.filter(a => a !== ayahNumber);

        await AsyncStorage.setItem(STORAGE_KEYS.QURAN_FAVORITES, JSON.stringify(filtered));
        logger.info('Favori ayet kaldırıldı', { ayah: ayahNumber }, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.removeFavoriteAyah');
        throw error;
    }
}

// ========== AYARLAR ==========

/**
 * Kur'an ayarlarını getirir
 */
export async function getQuranSettings(): Promise<QuranSettings> {
    const defaultSettings: QuranSettings = {
        translationEdition: 'tr.diyanet',
        arabicEdition: 'quran-uthmani',
        fontSize: 'medium',
        theme: 'light',
        autoSave: true,
        showTransliteration: false,
    };

    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.QURAN_SETTINGS);

        if (!data) {
            return defaultSettings;
        }

        return { ...defaultSettings, ...JSON.parse(data) };
    } catch (error) {
        handleError(error, 'quranStorage.getQuranSettings');
        return defaultSettings;
    }
}

/**
 * Kur'an ayarlarını kaydeder
 */
export async function saveQuranSettings(settings: Partial<QuranSettings>): Promise<void> {
    try {
        const currentSettings = await getQuranSettings();
        const newSettings = { ...currentSettings, ...settings };

        await AsyncStorage.setItem(STORAGE_KEYS.QURAN_SETTINGS, JSON.stringify(newSettings));
        logger.info('Kur\'an ayarları kaydedildi', settings, 'quranStorage');
    } catch (error) {
        handleError(error, 'quranStorage.saveQuranSettings');
        throw error;
    }
}
