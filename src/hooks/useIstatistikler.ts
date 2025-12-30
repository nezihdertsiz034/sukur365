import { useCallback, useEffect, useState } from 'react';
import type { Istatistikler } from '../types';
import { getirIstatistikler } from '../utils/storage';

type IstatistikTemel = Omit<Istatistikler, 'rozetler'>;

function rozetleriHesapla(istatistikler: IstatistikTemel): string[] {
  const rozetler: string[] = [];
  const { toplamOruc, toplamGun, kesintisizZincir, yuzdelik } = istatistikler;

  if (toplamOruc >= 1) rozetler.push('İlk Oruç');
  if (toplamOruc >= 7) rozetler.push('1 Hafta');
  if (toplamOruc >= 15) rozetler.push('Yarı Ramazan');
  if (toplamOruc >= toplamGun) rozetler.push('Tam Ramazan');

  if (kesintisizZincir >= 3) rozetler.push('3 Gün Zincir');
  if (kesintisizZincir >= 7) rozetler.push('7 Gün Zincir');
  if (kesintisizZincir >= 14) rozetler.push('14 Gün Zincir');

  if (yuzdelik >= 50) rozetler.push('%50 İlerleme');
  if (yuzdelik >= 100) rozetler.push('%100 İlerleme');

  return rozetler;
}

/**
 * İstatistikleri yükleyen hook
 */
export function useIstatistikler() {
  const [istatistikler, setIstatistikler] = useState<Istatistikler | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const verileriYukle = useCallback(async () => {
    try {
      setYukleniyor(true);
      setHata(null);
      const temelIstatistikler = await getirIstatistikler();
      const rozetler = rozetleriHesapla(temelIstatistikler);
      setIstatistikler({ ...temelIstatistikler, rozetler });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('İstatistikler yüklenirken hata:', err);
      setIstatistikler(null);
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

export default useIstatistikler;
