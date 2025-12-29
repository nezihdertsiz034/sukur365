/**
 * 2026 Ramazan ayı tarihlerini döndürür
 * 2026 Ramazan: 19 Şubat - 19 Mart (30 gün)
 */
export function getRamazan2026Tarihleri(): Date[] {
  const tarihler: Date[] = [];
  
  // 2026 Ramazan: 19 Şubat - 19 Mart
  const baslangic = new Date(2026, 1, 19); // Şubat = 1 (0-indexed)
  const bitis = new Date(2026, 2, 19); // Mart = 2 (0-indexed)
  
  const suankiTarih = new Date(baslangic);
  
  while (suankiTarih <= bitis) {
    tarihler.push(new Date(suankiTarih));
    suankiTarih.setDate(suankiTarih.getDate() + 1);
  }
  
  return tarihler;
}

/**
 * Tarihi YYYY-MM-DD formatında string'e çevirir
 */
export function tarihToString(tarih: Date): string {
  const yil = tarih.getFullYear();
  const ay = String(tarih.getMonth() + 1).padStart(2, '0');
  const gun = String(tarih.getDate()).padStart(2, '0');
  return `${yil}-${ay}-${gun}`;
}

/**
 * String tarihi Date objesine çevirir
 */
export function stringToTarih(tarihString: string): Date {
  return new Date(tarihString);
}

/**
 * Bugünün Ramazan günlerinden biri olup olmadığını kontrol eder
 */
export function bugunRamazanMi(): boolean {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  
  const ramazanTarihleri = getRamazan2026Tarihleri();
  return ramazanTarihleri.some(tarih => {
    const tarihKopya = new Date(tarih);
    tarihKopya.setHours(0, 0, 0, 0);
    return tarihKopya.getTime() === bugun.getTime();
  });
}

/**
 * Belirli bir tarihin Ramazan günlerinden biri olup olmadığını kontrol eder
 */
export function tarihRamazanMi(tarih: Date): boolean {
  const tarihKopya = new Date(tarih);
  tarihKopya.setHours(0, 0, 0, 0);
  
  const ramazanTarihleri = getRamazan2026Tarihleri();
  return ramazanTarihleri.some(ramazanTarih => {
    const ramazanKopya = new Date(ramazanTarih);
    ramazanKopya.setHours(0, 0, 0, 0);
    return ramazanKopya.getTime() === tarihKopya.getTime();
  });
}

