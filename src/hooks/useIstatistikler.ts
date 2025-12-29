import { useState, useEffect, useCallback } from 'react';
import { Istatistikler } from '../types';
import { getirIstatistikler } from '../utils/storage';

/**
 * İstatistikleri yöneten hook
 */
export function useIstatistikler() {
  const [istatistikler, setIstatistikler] = useState<Istatistikler | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const verileriYukle = useCallback(async () => {
    try {
      setYukleniyor(true);
      setHata(null);
      const data = await getirIstatistikler();
      
      // Rozetleri hesapla
      const rozetler: string[] = [];
      if (data.toplamOruc === 30) {
        rozetler.push('30/30 Tamamlandı');
      }
      if (data.kesintisizZincir >= 15) {
        rozetler.push('15 Gün Kesintisiz');
      }
      if (data.kesintisizZincir >= 30) {
        rozetler.push('30 Gün Kesintisiz');
      }
      if (data.toplamOruc >= 10) {
        rozetler.push('10 Gün Tamamlandı');
      }
      
      setIstatistikler({
        ...data,
        rozetler,
      });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('İstatistikler yüklenirken hata:', err);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    verileriYukle();
  }, [verileriYukle]);

  return {
    istatistikler,
    yukleniyor,
    hata,
    yenidenYukle: verileriYukle,
  };
}


