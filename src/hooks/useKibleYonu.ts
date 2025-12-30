import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { KibleYonu } from '../types';

/**
 * Kıble yönünü hesaplayan hook
 * Mekke'nin koordinatları: 21.4225° N, 39.8262° E
 */
export function useKibleYonu() {
  const [kibleYonu, setKibleYonu] = useState<KibleYonu | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    async function kibleHesapla() {
      try {
        setYukleniyor(true);
        setHata(null);

        // Konum izni iste
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Konum izni verilmedi');
        }

        // Mevcut konumu al
        const konum = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = konum.coords;

        // Kabe koordinatları
        const kabeLat = 21.4225;
        const kabeLon = 39.8262;

        // Derece -> Radyan dönüşümü
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;

        // Kullanıcı ve Kabe koordinatlarını radyana çevir
        const lat1 = toRad(latitude);
        const lon1 = toRad(longitude);
        const lat2 = toRad(kabeLat);
        const lon2 = toRad(kabeLon);

        // Doğru Qibla bearing formülü
        // bearing = atan2(sin(Δλ), cos(φ1)·tan(φ2) − sin(φ1)·cos(Δλ))
        const dLon = lon2 - lon1;

        const x = Math.sin(dLon);
        const y = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);

        let aci = toDeg(Math.atan2(x, y));

        // Açıyı 0-360 aralığına normalize et
        if (aci < 0) aci += 360;

        console.log(`[Kıble] Konum: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        console.log(`[Kıble] Hesaplanan açı: ${aci.toFixed(2)}°`);

        // Yön belirleme
        let yon: KibleYonu['yon'] = 'G';
        if (aci >= 337.5 || aci < 22.5) yon = 'K';
        else if (aci >= 22.5 && aci < 67.5) yon = 'KD';
        else if (aci >= 67.5 && aci < 112.5) yon = 'D';
        else if (aci >= 112.5 && aci < 157.5) yon = 'GD';
        else if (aci >= 157.5 && aci < 202.5) yon = 'G';
        else if (aci >= 202.5 && aci < 247.5) yon = 'GB';
        else if (aci >= 247.5 && aci < 292.5) yon = 'B';
        else if (aci >= 292.5 && aci < 337.5) yon = 'KB';

        setKibleYonu({ aci, yon });
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Kıble yönü hesaplanamadı');
        console.error('Kıble yönü hesaplanırken hata:', err);
        // Varsayılan değer (Türkiye için yaklaşık - İstanbul bazlı)
        setKibleYonu({ aci: 152, yon: 'GD' });
      } finally {
        setYukleniyor(false);
      }
    }

    kibleHesapla();
  }, []);

  return { kibleYonu, yukleniyor, hata };
}






