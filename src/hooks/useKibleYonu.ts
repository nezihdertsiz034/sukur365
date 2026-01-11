import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { KibleYonu } from '../types';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

/**
 * Kıble yönünü hesaplayan ve yöneten hook
 * 
 * @returns {Object} Kıble yönü, yükleniyor durumu ve hata mesajı
 */
export function useKibleYonu() {
  const [kibleYonu, setKibleYonu] = useState<KibleYonu | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    async function hesaplaKibleYonu() {
      try {
        setYukleniyor(true);
        setHata(null);

        // Konum izni iste
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHata('Konum izni verilmedi. Lütfen ayarlardan izin verin.');
          logger.warn('Konum izni verilmedi', undefined, 'useKibleYonu');
          return;
        }

        // Mevcut konumu al
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Kabe'nin koordinatları
        const kabeLatitude = 21.4225;
        const kabeLongitude = 39.8262;

        // Kıble açısını hesapla
        const lat1 = (latitude * Math.PI) / 180;
        const lat2 = (kabeLatitude * Math.PI) / 180;
        const dLon = ((kabeLongitude - longitude) * Math.PI) / 180;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x =
          Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let aci = (Math.atan2(y, x) * 180) / Math.PI;
        aci = (aci + 360) % 360; // 0-360 arası normalize et

        // Yön belirle
        const yonlar: Array<KibleYonu['yon']> = ['K', 'KB', 'B', 'GB', 'G', 'GD', 'D', 'KD'];
        const yonIndex = Math.round(aci / 45) % 8;
        const yon = yonlar[yonIndex];

        logger.debug('Kıble yönü hesaplandı', {
          latitude: latitude.toFixed(4),
          longitude: longitude.toFixed(4),
          aci: aci.toFixed(2),
          yon
        }, 'useKibleYonu');

        setKibleYonu({ aci, yon });
      } catch (err) {
        const appError = handleError(err, 'useKibleYonu.hesaplaKibleYonu');
        setHata(appError.userMessage);
        // Varsayılan değer (Türkiye için yaklaşık - İstanbul bazlı)
        setKibleYonu({ aci: 152, yon: 'GD' });
      } finally {
        setYukleniyor(false);
      }
    }

    hesaplaKibleYonu();
  }, []);

  return { kibleYonu, yukleniyor, hata };
}
