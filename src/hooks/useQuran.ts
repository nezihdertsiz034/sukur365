/**
 * Kur'an-ı Kerim Hook
 * 
 * Kur'an verilerini yönetir, cache'ler ve kullanıcı ilerlemesini takip eder
 */

import { useState, useEffect, useCallback } from 'react';
import { QuranSurah, QuranSurahResponse, QuranProgress, QuranBookmark } from '../types/quran';
import { getAllSurahs, getSurah, getFullQuran } from '../utils/quranApi';
import {
    getCachedQuranData,
    cacheQuranData,
    getQuranProgress,
    updateLastRead,
    getBookmarks,
    addBookmark as addBookmarkStorage,
    removeBookmark as removeBookmarkStorage,
    getFavoriteAyahs,
    addFavoriteAyah as addFavoriteStorage,
    removeFavoriteAyah as removeFavoriteStorage,
} from '../utils/quranStorage';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

export function useQuran() {
    const [surahs, setSurahs] = useState<QuranSurah[]>([]);
    const [currentSurah, setCurrentSurah] = useState<{
        arabic: QuranSurahResponse;
        turkish: QuranSurahResponse;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<QuranProgress | null>(null);
    const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    /**
     * Sure listesini yükler
     */
    const loadSurahs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            logger.info('Sure listesi yükleniyor...', undefined, 'useQuran');

            const surahList = await getAllSurahs();
            setSurahs(surahList);

            logger.info('Sure listesi yüklendi', { count: surahList.length }, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.loadSurahs');
            setError(appError.userMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Belirli bir sureyi yükler
     */
    const loadSurah = useCallback(async (surahNumber: number) => {
        try {
            setLoading(true);
            setError(null);

            logger.info(`Sure yükleniyor: ${surahNumber}`, undefined, 'useQuran');

            const surahData = await getSurah(surahNumber);
            setCurrentSurah(surahData);

            // Son okunan pozisyonu güncelle
            await updateLastRead(surahNumber, 1);

            logger.info(`Sure yüklendi: ${surahNumber}`, undefined, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.loadSurah');
            setError(appError.userMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Tüm Kur'an'ı cache'e indirir (offline kullanım için)
     */
    const downloadQuranForOffline = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            logger.info('Kur\'an offline için indiriliyor...', undefined, 'useQuran');

            // Önce cache'i kontrol et
            const cached = await getCachedQuranData();
            if (cached) {
                logger.info('Kur\'an zaten cache\'de', undefined, 'useQuran');
                return;
            }

            // Cache yoksa API'den çek
            const quranData = await getFullQuran();
            await cacheQuranData(quranData.arabic, quranData.turkish);

            logger.info('Kur\'an offline için indirildi', undefined, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.downloadQuranForOffline');
            setError(appError.userMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * İlerlemeyi yükler
     */
    const loadProgress = useCallback(async () => {
        try {
            const progressData = await getQuranProgress();
            setProgress(progressData);
        } catch (err) {
            handleError(err, 'useQuran.loadProgress');
        }
    }, []);

    /**
     * Bookmark'ları yükler
     */
    const loadBookmarks = useCallback(async () => {
        try {
            const bookmarkData = await getBookmarks();
            setBookmarks(bookmarkData);
        } catch (err) {
            handleError(err, 'useQuran.loadBookmarks');
        }
    }, []);

    /**
     * Favori ayetleri yükler
     */
    const loadFavorites = useCallback(async () => {
        try {
            const favoriteData = await getFavoriteAyahs();
            setFavorites(favoriteData);
        } catch (err) {
            handleError(err, 'useQuran.loadFavorites');
        }
    }, []);

    /**
     * Bookmark ekler
     */
    const addBookmark = useCallback(async (bookmark: QuranBookmark) => {
        try {
            await addBookmarkStorage(bookmark);
            await loadBookmarks();
            logger.info('Bookmark eklendi', undefined, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.addBookmark');
            setError(appError.userMessage);
        }
    }, [loadBookmarks]);

    /**
     * Bookmark siler
     */
    const removeBookmark = useCallback(async (bookmarkId: string) => {
        try {
            await removeBookmarkStorage(bookmarkId);
            await loadBookmarks();
            logger.info('Bookmark silindi', undefined, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.removeBookmark');
            setError(appError.userMessage);
        }
    }, [loadBookmarks]);

    /**
     * Favori ayet ekler
     */
    const addFavorite = useCallback(async (ayahNumber: number) => {
        try {
            await addFavoriteStorage(ayahNumber);
            await loadFavorites();
            logger.info('Favori eklendi', { ayah: ayahNumber }, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.addFavorite');
            setError(appError.userMessage);
        }
    }, [loadFavorites]);

    /**
     * Favori ayeti kaldırır
     */
    const removeFavorite = useCallback(async (ayahNumber: number) => {
        try {
            await removeFavoriteStorage(ayahNumber);
            await loadFavorites();
            logger.info('Favori kaldırıldı', { ayah: ayahNumber }, 'useQuran');
        } catch (err) {
            const appError = handleError(err, 'useQuran.removeFavorite');
            setError(appError.userMessage);
        }
    }, [loadFavorites]);

    /**
     * Kaldığı yerden devam et
     */
    const continueReading = useCallback(async () => {
        if (progress) {
            await loadSurah(progress.lastReadSurah);
        }
    }, [progress, loadSurah]);

    /**
     * İlk yükleme
     */
    useEffect(() => {
        loadSurahs();
        loadProgress();
        loadBookmarks();
        loadFavorites();
    }, [loadSurahs, loadProgress, loadBookmarks, loadFavorites]);

    return {
        // State
        surahs,
        currentSurah,
        loading,
        error,
        progress,
        bookmarks,
        favorites,

        // Functions
        loadSurah,
        downloadQuranForOffline,
        addBookmark,
        removeBookmark,
        addFavorite,
        removeFavorite,
        continueReading,
        updateLastRead,
    };
}
