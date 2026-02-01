import { useState, useEffect } from 'react';
import { NamazVakitleri } from '../types';
import { getNamazVakitleri } from '../utils/namazVakitleri';
import { useSettings } from '../context/SettingsContext';
import { senkronizeWidgetVerileri } from '../utils/storage';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

/**
 * Namaz vakitlerini yükleyen ve yöneten hook
 * 
 * @returns {Object} Namaz vakitleri, yükleniyor durumu ve hata mesajı
 */
export function useNamazVakitleri() {
  const { sehir } = useSettings();
  const [vakitler, setVakitler] = useState<NamazVakitleri | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const yenile = async () => {
    logger.info('Namaz vakitleri manuel olarak yenileniyor...', undefined, 'useNamazVakitleri');

    try {
      setYukleniyor(true);
      setHata(null);

      const sehirAdi = sehir?.isim || 'İstanbul';
      logger.debug('Manual yenileme için şehir', { sehir: sehirAdi }, 'useNamazVakitleri');

      const vakitlerData = await getNamazVakitleri(sehirAdi);
      setVakitler(vakitlerData);

      if (vakitlerData) {
        await senkronizeWidgetVerileri(sehirAdi, vakitlerData);
      }

      logger.info('Manuel yenileme başarılı', { sehir: sehirAdi }, 'useNamazVakitleri');
    } catch (err) {
      const appError = handleError(err, 'useNamazVakitleri.yenile');
      setHata(appError.userMessage);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    logger.debug('useNamazVakitleri hook başlatıldı', undefined, 'useNamazVakitleri');

    async function yukleVakitler() {
      logger.info('Namaz vakitleri yükleniyor...', undefined, 'useNamazVakitleri');

      try {
        setYukleniyor(true);
        setHata(null);

        const sehirAdi = sehir?.isim || 'İstanbul';

        console.log('[useNamazVakitleri] Vakitler çekiliyor. Şehir:', sehirAdi);
        logger.debug('Namaz vakitleri için şehir bilgisi kullanılıyor', { sehir: sehirAdi }, 'useNamazVakitleri');

        const vakitlerData = await getNamazVakitleri(sehirAdi);
        setVakitler(vakitlerData);

        if (vakitlerData) {
          await senkronizeWidgetVerileri(sehirAdi, vakitlerData);
        }

        logger.info('Namaz vakitleri başarıyla yüklendi', { sehir: sehirAdi }, 'useNamazVakitleri');
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
  }, [sehir?.isim]);

  return { vakitler, yukleniyor, hata, yenile };
}
