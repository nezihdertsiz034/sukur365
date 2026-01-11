/**
 * Kur'an-ı Kerim için TypeScript tip tanımları
 */

export interface QuranSurah {
    number: number;
    name: string;              // Arapça isim
    englishName: string;       // İngilizce isim
    englishNameTranslation: string;
    revelationType: 'Meccan' | 'Medinan';
    numberOfAyahs: number;
    ayahs?: QuranAyah[];
}

export interface QuranAyah {
    number: number;            // Global ayet numarası (1-6236)
    numberInSurah: number;     // Sure içindeki ayet numarası
    text: string;              // Arapça veya Türkçe metin
    surah: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: string;
        numberOfAyahs: number;
    };
    juz?: number;              // Cüz numarası
    manzil?: number;
    page?: number;             // Mushaf sayfası
    ruku?: number;
    hizbQuarter?: number;
    sajda?: boolean;
}

export interface QuranEdition {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: 'text' | 'audio';
    type: 'translation' | 'tafsir' | 'quran';
}

export interface QuranBookmark {
    id: string;
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    ayahNumberInSurah: number;
    timestamp: number;
    note?: string;
}

export interface QuranProgress {
    lastReadSurah: number;
    lastReadAyah: number;
    lastReadDate: number;
    totalAyahsRead: number;
    favoriteAyahs: number[];
    bookmarks: QuranBookmark[];
    readingStreak: number;      // Kesintisiz okuma günü
    totalReadingTime: number;   // Toplam okuma süresi (dakika)
}

export interface QuranSettings {
    translationEdition: string;  // 'tr.diyanet', 'tr.yazir' vb.
    arabicEdition: string;        // 'quran-uthmani', 'quran-simple' vb.
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark';
    autoSave: boolean;
    showTransliteration: boolean;
}

export interface QuranSearchResult {
    ayah: QuranAyah;
    surahName: string;
    highlightedText: string;
}

// API Response Types
export interface QuranApiResponse<T> {
    code: number;
    status: string;
    data: T;
}

export interface QuranSurahResponse {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: QuranAyah[];
    edition: QuranEdition;
}
