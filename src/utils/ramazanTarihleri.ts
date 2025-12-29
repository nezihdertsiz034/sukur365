/**
 * 2026 Ramazan ayi tarihleri ve yardimci fonksiyonlar
 * 
 * 2026 Ramazan ayi: 27 Subat 2026 - 28 Mart 2026 (30 gun)
 */

/**
 * 2026 Ramazan ayinin tum gunlerini Date array olarak dondurur
 * @returns 30 gunluk Ramazan tarihleri dizisi
 */
export function getRamazan2026Tarihleri(): Date[] {
  const ramazanTarihleri: Date[] = [];
  
  // 2026 Ramazan ayi baslangici: 27 Subat 2026
  const baslangicTarihi = new Date(2026, 1, 27);
  
  // 30 gunluk Ramazan ayi
  for (let i = 0; i < 30; i++) {
    const tarih = new Date(baslangicTarihi);
    tarih.setDate(baslangicTarihi.getDate() + i);
    tarih.setHours(0, 0, 0, 0);
    ramazanTarihleri.push(tarih);
  }
  
  return ramazanTarihleri;
}

/**
 * Date objesini YYYY-MM-DD formatinda string'e cevirir
 * @param tarih - Cevrilecek Date objesi
 * @returns YYYY-MM-DD formatinda tarih string'i
 */
export function tarihToString(tarih: Date): string {
  const yil = tarih.getFullYear();
  const ay = String(tarih.getMonth() + 1).padStart(2, '0');
  const gun = String(tarih.getDate()).padStart(2, '0');
  
  return yil + '-' + ay + '-' + gun;
}
