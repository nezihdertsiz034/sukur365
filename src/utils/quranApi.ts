/**
 * Kur'an-ı Kerim API Utility
 * 
 * Al-Quran Cloud API kullanarak Kur'an verilerini çeker
 * https://alquran.cloud/api
 */

import { QuranSurah, QuranAyah, QuranApiResponse, QuranSurahResponse } from '../types/quran';
import { logger } from './logger';
import { handleError } from './errorHandler';

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const ARABIC_EDITION = 'quran-uthmani'; // Osmanlı hattı
const TURKISH_EDITION = 'tr.diyanet';   // Diyanet İşleri meali

/**
 * Tüm surelerin listesini getirir
 */
export async function getAllSurahs(): Promise<QuranSurah[]> {
    try {
        logger.info('Tüm sureler getiriliyor...', undefined, 'quranApi');

        const response = await fetch(`${API_BASE_URL}/surah`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QuranApiResponse<QuranSurah[]> = await response.json();

        logger.info('Sureler başarıyla getirildi', { count: data.data.length }, 'quranApi');

        return data.data;
    } catch (error) {
        const appError = handleError(error, 'quranApi.getAllSurahs');
        throw new Error(appError.userMessage);
    }
}

/**
 * Belirli bir sureyi Arapça ve Türkçe olarak getirir
 */
export async function getSurah(surahNumber: number): Promise<{
    arabic: QuranSurahResponse;
    turkish: QuranSurahResponse;
}> {
    try {
        logger.info(`Sure getiriliyor: ${surahNumber}`, undefined, 'quranApi');

        // Arapça ve Türkçe'yi paralel olarak çek
        const [arabicResponse, turkishResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/surah/${surahNumber}/${ARABIC_EDITION}`),
            fetch(`${API_BASE_URL}/surah/${surahNumber}/${TURKISH_EDITION}`)
        ]);

        if (!arabicResponse.ok || !turkishResponse.ok) {
            throw new Error('Sure getirilemedi');
        }

        const arabicData: QuranApiResponse<QuranSurahResponse> = await arabicResponse.json();
        const turkishData: QuranApiResponse<QuranSurahResponse> = await turkishResponse.json();

        logger.info(`Sure başarıyla getirildi: ${surahNumber}`, {
            name: arabicData.data.englishName,
            ayahs: arabicData.data.numberOfAyahs
        }, 'quranApi');

        return {
            arabic: arabicData.data,
            turkish: turkishData.data
        };
    } catch (error) {
        const appError = handleError(error, 'quranApi.getSurah');
        throw new Error(appError.userMessage);
    }
}

/**
 * Belirli bir ayeti getirir
 */
export async function getAyah(ayahNumber: number): Promise<{
    arabic: QuranAyah;
    turkish: QuranAyah;
}> {
    try {
        logger.debug(`Ayet getiriliyor: ${ayahNumber}`, undefined, 'quranApi');

        const [arabicResponse, turkishResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/ayah/${ayahNumber}/${ARABIC_EDITION}`),
            fetch(`${API_BASE_URL}/ayah/${ayahNumber}/${TURKISH_EDITION}`)
        ]);

        if (!arabicResponse.ok || !turkishResponse.ok) {
            throw new Error('Ayet getirilemedi');
        }

        const arabicData: QuranApiResponse<QuranAyah> = await arabicResponse.json();
        const turkishData: QuranApiResponse<QuranAyah> = await turkishResponse.json();

        return {
            arabic: arabicData.data,
            turkish: turkishData.data
        };
    } catch (error) {
        const appError = handleError(error, 'quranApi.getAyah');
        throw new Error(appError.userMessage);
    }
}

/**
 * Tüm Kur'an'ı getirir (cache için)
 */
export async function getFullQuran(): Promise<{
    arabic: QuranSurahResponse[];
    turkish: QuranSurahResponse[];
}> {
    try {
        logger.info('Tüm Kur\'an getiriliyor...', undefined, 'quranApi');

        const [arabicResponse, turkishResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/quran/${ARABIC_EDITION}`),
            fetch(`${API_BASE_URL}/quran/${TURKISH_EDITION}`)
        ]);

        if (!arabicResponse.ok || !turkishResponse.ok) {
            throw new Error('Kur\'an getirilemedi');
        }

        const arabicData: QuranApiResponse<{ surahs: QuranSurahResponse[] }> = await arabicResponse.json();
        const turkishData: QuranApiResponse<{ surahs: QuranSurahResponse[] }> = await turkishResponse.json();

        logger.info('Tüm Kur\'an başarıyla getirildi', {
            surahs: arabicData.data.surahs.length
        }, 'quranApi');

        return {
            arabic: arabicData.data.surahs,
            turkish: turkishData.data.surahs
        };
    } catch (error) {
        const appError = handleError(error, 'quranApi.getFullQuran');
        throw new Error(appError.userMessage);
    }
}

/**
 * Kur'an'da arama yapar (Türkçe meal içinde)
 */
export async function searchQuran(query: string): Promise<QuranAyah[]> {
    try {
        logger.info(`Kur'an'da arama yapılıyor: "${query}"`, undefined, 'quranApi');

        const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}/all/${TURKISH_EDITION}`);

        if (!response.ok) {
            throw new Error('Arama yapılamadı');
        }

        const data: QuranApiResponse<{ matches: QuranAyah[] }> = await response.json();

        logger.info('Arama tamamlandı', { results: data.data.matches.length }, 'quranApi');

        return data.data.matches;
    } catch (error) {
        const appError = handleError(error, 'quranApi.searchQuran');
        throw new Error(appError.userMessage);
    }
}

/**
 * Sure isimlerini Türkçe'ye çevirir
 */
export function getSurahTurkishName(englishName: string): string {
    const surahNames: Record<string, string> = {
        'Al-Faatiha': 'Fatiha',
        'Al-Baqara': 'Bakara',
        'Aal-i-Imraan': 'Âl-i İmran',
        'An-Nisaa': 'Nisa',
        'Al-Maaida': 'Maide',
        'Al-An\'aam': 'En\'am',
        'Al-A\'raaf': 'A\'raf',
        'Al-Anfaal': 'Enfal',
        'At-Tawba': 'Tevbe',
        'Yunus': 'Yunus',
        'Hud': 'Hud',
        'Yusuf': 'Yusuf',
        'Ar-Ra\'d': 'Ra\'d',
        'Ibrahim': 'İbrahim',
        'Al-Hijr': 'Hicr',
        'An-Nahl': 'Nahl',
        'Al-Israa': 'İsra',
        'Al-Kahf': 'Kehf',
        'Maryam': 'Meryem',
        'Taa-Haa': 'Taha',
        'Al-Anbiyaa': 'Enbiya',
        'Al-Hajj': 'Hac',
        'Al-Mu\'minoon': 'Mü\'minun',
        'An-Noor': 'Nur',
        'Al-Furqaan': 'Furkan',
        'Ash-Shu\'araa': 'Şuara',
        'An-Naml': 'Neml',
        'Al-Qasas': 'Kasas',
        'Al-Ankaboot': 'Ankebut',
        'Ar-Room': 'Rum',
        'Luqman': 'Lokman',
        'As-Sajda': 'Secde',
        'Al-Ahzaab': 'Ahzab',
        'Saba': 'Sebe',
        'Faatir': 'Fatır',
        'Yaseen': 'Yasin',
        'As-Saaffaat': 'Saffat',
        'Saad': 'Sad',
        'Az-Zumar': 'Zümer',
        'Ghafir': 'Mü\'min (Gafir)',
        'Fussilat': 'Fussilet',
        'Ash-Shura': 'Şura',
        'Az-Zukhruf': 'Zuhruf',
        'Ad-Dukhaan': 'Duhan',
        'Al-Jaathiya': 'Casiye',
        'Al-Ahqaf': 'Ahkaf',
        'Muhammad': 'Muhammed',
        'Al-Fath': 'Fetih',
        'Al-Hujuraat': 'Hucurat',
        'Qaaf': 'Kaf',
        'Adh-Dhaariyat': 'Zariyat',
        'At-Toor': 'Tur',
        'An-Najm': 'Necm',
        'Al-Qamar': 'Kamer',
        'Ar-Rahman': 'Rahman',
        'Al-Waaqia': 'Vakıa',
        'Al-Hadeed': 'Hadid',
        'Al-Mujaadila': 'Mücadele',
        'Al-Hashr': 'Haşir',
        'Al-Mumtahina': 'Mümtehine',
        'As-Saff': 'Saf',
        'Al-Jumu\'a': 'Cuma',
        'Al-Munaafiqoon': 'Münafikun',
        'At-Taghaabun': 'Tegabun',
        'At-Talaaq': 'Talak',
        'At-Tahreem': 'Tahrim',
        'Al-Mulk': 'Mülk',
        'Al-Qalam': 'Kalem',
        'Al-Haaqqa': 'Hakka',
        'Al-Ma\'aarij': 'Mearic',
        'Nooh': 'Nuh',
        'Al-Jinn': 'Cin',
        'Al-Muzzammil': 'Müzzemmil',
        'Al-Muddaththir': 'Müddessir',
        'Al-Qiyaama': 'Kıyamet',
        'Al-Insaan': 'İnsan',
        'Al-Mursalaat': 'Mürselat',
        'An-Naba': 'Nebe',
        'An-Naazi\'aat': 'Naziat',
        'Abasa': 'Abese',
        'At-Takweer': 'Tekvir',
        'Al-Infitaar': 'İnfitar',
        'Al-Mutaffifeen': 'Mutaffifîn',
        'Al-Inshiqaaq': 'İnşikak',
        'Al-Burooj': 'Buruc',
        'At-Taariq': 'Tarık',
        'Al-A\'laa': 'A\'la',
        'Al-Ghaashiya': 'Gaşiye',
        'Al-Fajr': 'Fecr',
        'Al-Balad': 'Beled',
        'Ash-Shams': 'Şems',
        'Al-Layl': 'Leyl',
        'Ad-Duhaa': 'Duha',
        'Ash-Sharh': 'İnşirah',
        'At-Teen': 'Tin',
        'Al-Alaq': 'Alak',
        'Al-Qadr': 'Kadir',
        'Al-Bayyina': 'Beyyine',
        'Az-Zalzala': 'Zilzal',
        'Al-Aadiyaat': 'Adiyat',
        'Al-Qaari\'a': 'Karia',
        'At-Takaathur': 'Tekasür',
        'Al-Asr': 'Asr',
        'Al-Humaza': 'Hümeze',
        'Al-Feel': 'Fil',
        'Quraish': 'Kureyş',
        'Al-Maa\'oon': 'Maun',
        'Al-Kawthar': 'Kevser',
        'Al-Kaafiroon': 'Kafirun',
        'An-Nasr': 'Nasr',
        'Al-Masad': 'Tebbet',
        'Al-Ikhlaas': 'İhlas',
        'Al-Falaq': 'Felak',
        'An-Naas': 'Nas',
        // Kullanıcı bildirimleri ve alternatif yazımlar
        'AL-Naas': 'Nas',
        'AL-Falaq': 'Felak',
        'AL-Ikhlaas': 'İhlas',
        // ... diğer sureler (tamamı eklenecek)
    };

    return surahNames[englishName] || englishName;
}
