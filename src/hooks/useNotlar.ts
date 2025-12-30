import { useState, useEffect, useCallback } from 'react';
import { Not } from '../types';
import { yukleNotlar, kaydetNot, silNot, getirTarihNotu } from '../utils/storage';

/**
 * Notları yöneten hook
 */
export function useNotlar() {
  const [notlar, setNotlar] = useState<Not[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const verileriYukle = useCallback(async () => {
    try {
      setYukleniyor(true);
      setHata(null);
      const yuklenenNotlar = await yukleNotlar();
      // Tarihe göre sırala (en yeni önce)
      yuklenenNotlar.sort((a, b) => b.olusturmaTarihi - a.olusturmaTarihi);
      setNotlar(yuklenenNotlar);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('Notlar yüklenirken hata:', err);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  const notKaydet = useCallback(async (not: Not) => {
    try {
      await kaydetNot(not);
      await verileriYukle();
    } catch (err) {
      console.error('Not kaydedilirken hata:', err);
      throw err;
    }
  }, [verileriYukle]);

  const notSil = useCallback(async (notId: string) => {
    try {
      await silNot(notId);
      await verileriYukle();
    } catch (err) {
      console.error('Not silinirken hata:', err);
      throw err;
    }
  }, [verileriYukle]);

  const tarihNotuGetir = useCallback(async (tarih: string) => {
    try {
      return await getirTarihNotu(tarih);
    } catch (err) {
      console.error('Tarih notu getirilirken hata:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    verileriYukle();
  }, [verileriYukle]);

  return {
    notlar,
    yukleniyor,
    hata,
    notKaydet,
    notSil,
    tarihNotuGetir,
    yenidenYukle: verileriYukle,
  };
}
