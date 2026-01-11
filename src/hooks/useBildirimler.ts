import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { yukleBildirimAyarlari, yukleSehir } from '../utils/storage';
import { getNamazVakitleri, getTarihNamazVakitleri, saattenDakikaCikar } from '../utils/namazVakitleri';
import { getSahurVakitleri2026, sahurSaatiGectiMi } from '../utils/sahurVakitleri';
import { getRamazan2026Tarihleri } from '../utils/ramazanTarihleri';
import { bildirimEzanSesiBaslat, bildirimEzanSesiTemizle } from '../utils/ezanSesi';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

// Bildirim handler - Expo Go'da bazı özellikler sınırlı olabilir
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  // Expo Go'da bazı bildirim özellikleri çalışmayabilir
  logger.warn('Bildirim handler ayarlanırken uyarı (Expo Go sınırlaması)', error, 'useBildirimler');
}

/**
 * Bildirimleri yöneten hook
 */
export function useBildirimler() {
  const bildirimleriAyarla = useCallback(async () => {
    logger.info('Bildirimler ayarlanıyor...', undefined, 'useBildirimler');

    try {
      // Bildirim izni iste (Expo Go'da local notifications çalışır)
      const { status } = await Notifications.requestPermissionsAsync();

      logger.debug('Bildirim izni durumu', { status }, 'useBildirimler');

      if (status !== 'granted') {
        logger.warn('Bildirim izni verilmedi', undefined, 'useBildirimler');
        return;
      }

      const ayarlar = await yukleBildirimAyarlari();
      const sehir = await yukleSehir();
      const sehirAdi = sehir?.isim || 'Istanbul';
      const vakitler = await getNamazVakitleri(sehirAdi);

      logger.debug('Bildirim ayarları ve vakitler yüklendi', { sehir: sehirAdi }, 'useBildirimler');

      // Mevcut bildirimleri temizle
      await Notifications.cancelAllScheduledNotificationsAsync();

      const bugun = new Date();
      const yarin = new Date(bugun);
      yarin.setDate(yarin.getDate() + 1);
      yarin.setHours(0, 0, 0, 0);

      // Sahur hatırlatıcısı - İmsak vaktinden 45 dakika önce
      if (ayarlar.sahurAktif) {
        const ramazanTarihleri = getRamazan2026Tarihleri();

        // Her Ramazan günü için bildirim oluştur
        for (let i = 0; i < ramazanTarihleri.length; i++) {
          const ramazanTarihi = ramazanTarihleri[i];

          // Bu günün namaz vakitlerini al
          const gununVakitleri = await getTarihNamazVakitleri(ramazanTarihi, sehirAdi);

          if (gununVakitleri) {
            // İmsak vaktinden 45 dakika önce sahur hatırlatıcısı
            const sahurHatirlaticiSaat = saattenDakikaCikar(gununVakitleri.imsak, 45);
            const [sahurSaat, sahurDakika] = sahurHatirlaticiSaat.split(':').map(Number);

            const bildirimTarih = new Date(ramazanTarihi);
            bildirimTarih.setHours(sahurSaat, sahurDakika, 0, 0);

            // Eğer tarih geçmişse atla
            if (bildirimTarih < bugun) {
              continue;
            }

            await Notifications.scheduleNotificationAsync({
              content: {
                title: '🌅 Sahur Hatırlatıcısı',
                body: `Sahur vaktiniz yaklaşıyor! İmsak: ${gununVakitleri.imsak}`,
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: bildirimTarih,
              },
            });
          }

          // API rate limit için kısa bekleme
          if (i < ramazanTarihleri.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      // İftar hatırlatıcısı - Akşam vaktinden 45 dakika önce
      if (ayarlar.iftarAktif) {
        const ramazanTarihleri = getRamazan2026Tarihleri();

        // Her Ramazan günü için bildirim oluştur
        for (let i = 0; i < ramazanTarihleri.length; i++) {
          const ramazanTarihi = ramazanTarihleri[i];

          // Bu günün namaz vakitlerini al
          const gununVakitleri = await getTarihNamazVakitleri(ramazanTarihi, sehirAdi);

          if (gununVakitleri) {
            // Akşam vaktinden 45 dakika önce iftar hatırlatıcısı
            const iftarHatirlaticiSaat = saattenDakikaCikar(gununVakitleri.aksam, 45);
            const [iftarSaat, iftarDakika] = iftarHatirlaticiSaat.split(':').map(Number);

            const bildirimTarih = new Date(ramazanTarihi);
            bildirimTarih.setHours(iftarSaat, iftarDakika, 0, 0);

            // Eğer tarih geçmişse atla
            if (bildirimTarih < bugun) {
              continue;
            }

            await Notifications.scheduleNotificationAsync({
              content: {
                title: '🌇 İftar Hatırlatıcısı',
                body: `İftar vaktiniz yaklaşıyor! Akşam: ${gununVakitleri.aksam}`,
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: bildirimTarih,
              },
            });
          }

          // API rate limit için kısa bekleme
          if (i < ramazanTarihleri.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      // Günlük oruç hatırlatıcısı
      if (ayarlar.gunlukHatirlaticiAktif) {
        const [hatirlaticiSaat, hatirlaticiDakika] = ayarlar.gunlukHatirlaticiSaat.split(':').map(Number);
        const hatirlaticiTarih = new Date(yarin);
        hatirlaticiTarih.setHours(hatirlaticiSaat, hatirlaticiDakika, 0, 0);

        // Her gün için 30 günlük bildirim
        for (let i = 0; i < 30; i++) {
          const bildirimTarih = new Date(hatirlaticiTarih);
          bildirimTarih.setDate(bildirimTarih.getDate() + i);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: '📿 Oruç Hatırlatıcısı',
              body: 'Bugünkü orucunuzu işaretlemeyi unutmayın!',
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: bildirimTarih,
            },
          });
        }
      }

      // Namaz vakitleri bildirimleri - Ramazan 2026 tarihleri için
      if (ayarlar.namazVakitleriAktif) {
        const ramazanTarihleri = getRamazan2026Tarihleri();

        // Her Ramazan günü için o günün namaz vakitlerini al
        for (let i = 0; i < ramazanTarihleri.length; i++) {
          const ramazanTarihi = ramazanTarihleri[i];

          // Bu günün namaz vakitlerini al
          const gununVakitleri = await getTarihNamazVakitleri(ramazanTarihi, sehirAdi);

          if (!gununVakitleri) {
            continue;
          }

          const namazVakitleri = [
            { isim: 'Sabah', saat: gununVakitleri.imsak },
            { isim: 'Öğle', saat: gununVakitleri.ogle },
            { isim: 'İkindi', saat: gununVakitleri.ikindi },
            { isim: 'Akşam', saat: gununVakitleri.aksam },
            { isim: 'Yatsı', saat: gununVakitleri.yatsi },
          ];

          // Her namaz vakti için bildirim oluştur
          for (const vakit of namazVakitleri) {
            const [saat, dakika] = vakit.saat.split(':').map(Number);
            const vakitTarih = new Date(ramazanTarihi);
            vakitTarih.setHours(saat, dakika, 0, 0);

            // Eğer tarih geçmişse atla
            if (vakitTarih < bugun) {
              continue;
            }

            await Notifications.scheduleNotificationAsync({
              content: {
                title: `🕌 ${vakit.isim} Namazı`,
                body: `${vakit.isim} namazı vakti geldi.`,
                sound: true,
                data: {
                  vakit: vakit.isim,
                  ezanSesi: ayarlar.ezanSesiAktif ?? true,
                },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: vakitTarih,
              },
            });
          }

          // API rate limit için kısa bekleme
          if (i < ramazanTarihleri.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      // Sahur Su İçme Hatırlatıcısı (2026 Ramazan ayı için)
      if (ayarlar.suIcmeHatirlaticiAktif) {
        try {
          const sahurVakitleri = await getSahurVakitleri2026();
          const ramazanTarihleri = getRamazan2026Tarihleri();
          const suIcmeAraligi = ayarlar.suIcmeAraligi || 30; // Dakika cinsinden

          for (let i = 0; i < sahurVakitleri.length; i++) {
            const sahurVakti = sahurVakitleri[i];
            const ramazanTarihi = ramazanTarihleri[i];

            // Sahur saatini parse et
            const [sahurSaat, sahurDakika] = sahurVakti.sahur.split(':').map(Number);
            const sahurTarih = new Date(ramazanTarihi);
            sahurTarih.setHours(sahurSaat, sahurDakika, 0, 0);

            // Sahur saatinden önce su içme hatırlatıcıları planla
            // Örnek: Sahur 03:30 ise, 02:00, 02:30, 03:00'da hatırlat
            // Sahur saatinden sonra hatırlatma!

            // Sahur saatinden 2 saat önce başla (örneğin sahur 03:30 ise, 01:30'dan başla)
            const baslangicTarih = new Date(sahurTarih);
            baslangicTarih.setMinutes(baslangicTarih.getMinutes() - 120); // 2 saat önce

            // Şu anki tarih ve saat
            const simdi = new Date();

            // Eğer bu Ramazan günü geçmişse (bugün değilse), atla
            const ramazanGunu = new Date(ramazanTarihi);
            ramazanGunu.setHours(0, 0, 0, 0);
            const bugun = new Date(simdi);
            bugun.setHours(0, 0, 0, 0);

            if (ramazanGunu < bugun) {
              continue;
            }

            // Sahur saatinden önceki her aralık için bildirim oluştur
            let hatirlaticiTarih = new Date(baslangicTarih);

            while (hatirlaticiTarih < sahurTarih) {
              // Eğer hatırlatıcı tarihi gelecekteyse, bildirim oluştur
              if (hatirlaticiTarih > simdi) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: '💧 Su İçme Hatırlatıcısı',
                    body: 'Sahur için su içmeyi unutmayın!',
                    sound: true,
                  },
                  trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: hatirlaticiTarih,
                  },
                });
              }

              // Bir sonraki hatırlatıcı zamanı
              hatirlaticiTarih = new Date(hatirlaticiTarih);
              hatirlaticiTarih.setMinutes(hatirlaticiTarih.getMinutes() + suIcmeAraligi);
            }
          }
        } catch (error) {
          handleError(error, 'useBildirimler.suIcmeHatirlatici');
        }
      }
    } catch (error) {
      // Expo Go'da remote push notifications çalışmaz, bu normal
      // Local notifications çalışmaya devam eder
      if (error instanceof Error && error.message.includes('remote notifications')) {
        logger.info('Expo Go\'da remote push notifications desteklenmiyor. Local notifications kullanılıyor.', undefined, 'useBildirimler');
      } else {
        handleError(error, 'useBildirimler.bildirimleriAyarla');
      }
    }
  }, []);

  const bildirimleriIptalEt = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      logger.info('Tüm bildirimler iptal edildi', undefined, 'useBildirimler');
    } catch (error) {
      handleError(error, 'useBildirimler.bildirimleriIptalEt');
    }
  }, []);

  useEffect(() => {
    logger.debug('useBildirimler hook başlatıldı', undefined, 'useBildirimler');

    bildirimleriAyarla();

    // Ezan sesi listener'ını başlat
    bildirimEzanSesiBaslat();

    return () => {
      logger.debug('useBildirimler cleanup çalıştırılıyor', undefined, 'useBildirimler');
      // Cleanup - component unmount olduğunda
      bildirimEzanSesiTemizle();
    };
  }, [bildirimleriAyarla]);

  return {
    bildirimleriAyarla,
    bildirimleriIptalEt,
  };
}


