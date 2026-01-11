import { useState, useEffect } from 'react';
import { NamazVakitleri } from '../types';
import { getNamazVakitleri } from '../utils/namazVakitleri';
import { yukleSehir } from '../utils/storage';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

/**
 * Namaz vakitlerini yükleyen ve yöneten hook
 * 
 * @returns {Object} Namaz vakitleri, yükleniyor durumu ve hata mesajı
 */
export function useNamazVakitleri() {
  const [vakitler, setVakitler] = useState<NamazVakitleri | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    logger.debug('useNamazVakitleri hook başlatıldı', undefined, 'useNamazVakitleri');

    async function yukleVakitler() {
      logger.info('Namaz vakitleri yükleniyor...', undefined, 'useNamazVakitleri');

      try {
        setYukleniyor(true);
        setHata(null);

        // Şehir bilgisini yükle ve namaz vakitlerini şehre göre çek
        const sehir = await yukleSehir();
        const sehirAdi = sehir?.isim || 'Istanbul';

        logger.debug('Şehir bilgisi alındı', { sehir: sehirAdi }, 'useNamazVakitleri');

        const vakitlerData = await getNamazVakitleri(sehirAdi);

        logger.info('Namaz vakitleri başarıyla yüklendi', { sehir: sehirAdi }, 'useNamazVakitleri');

        setVakitler(vakitlerData);
      } catch (err) {
        const appError = handleError(err, 'useNamazVakitleri.yukleVakitler');
        setHata(appError.userMessage);
      } finally {
        setYukleniyor(false);
      }
    }

    yukleVakitler();

    // Her gün saat 00:00'da güncelle
    const bugun = new Date();
    const yarin = new Date(bugun);
    yarin.setDate(yarin.getDate() + 1);
    yarin.setHours(0, 0, 0, 0);

    const gecenSure = yarin.getTime() - bugun.getTime();

    logger.debug('Otomatik güncelleme planlandı', { gecenSure }, 'useNamazVakitleri');

    let intervalId: NodeJS.Timeout | null = null;
    const timer = setTimeout(() => {
      logger.info('Günlük otomatik güncelleme başlatıldı', undefined, 'useNamazVakitleri');
      yukleVakitler();
      // Her 24 saatte bir güncelle
      intervalId = setInterval(yukleVakitler, 24 * 60 * 60 * 1000);
    }, gecenSure);

    return () => {
      logger.debug('useNamazVakitleri cleanup çalıştırılıyor', undefined, 'useNamazVakitleri');
      clearTimeout(timer);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { vakitler, yukleniyor, hata };
}
