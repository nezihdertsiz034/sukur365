import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { yukleBildirimAyarlari } from '../utils/storage';
import { getNamazVakitleri } from '../utils/namazVakitleri';

// Bildirim handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Bildirimleri yöneten hook
 */
export function useBildirimler() {
  const bildirimleriAyarla = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:21',message:'bildirimleriAyarla çağrıldı',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
      // Bildirim izni iste
      const { status } = await Notifications.requestPermissionsAsync();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:25',message:'Bildirim izni durumu',data:{status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (status !== 'granted') {
        console.log('Bildirim izni verilmedi');
        return;
      }

      const ayarlar = await yukleBildirimAyarlari();
      const vakitler = await getNamazVakitleri();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:31',message:'Vakitler yüklendi',data:{vakitler:!!vakitler,hasVakitler:!!vakitler},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      // Mevcut bildirimleri temizle
      await Notifications.cancelAllScheduledNotificationsAsync();

      const bugun = new Date();
      const yarin = new Date(bugun);
      yarin.setDate(yarin.getDate() + 1);
      yarin.setHours(0, 0, 0, 0);

      // Sahur hatırlatıcısı
      if (ayarlar.sahurAktif) {
        const [sahurSaat, sahurDakika] = ayarlar.sahurSaat.split(':').map(Number);
        const sahurTarih = new Date(yarin);
        sahurTarih.setHours(sahurSaat, sahurDakika, 0, 0);

        // Her gün için 30 günlük bildirim
        for (let i = 0; i < 30; i++) {
          const bildirimTarih = new Date(sahurTarih);
          bildirimTarih.setDate(bildirimTarih.getDate() + i);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:50',message:'Sahur bildirimi oluşturuluyor',data:{i,bildirimTarih:bildirimTarih.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🌅 Sahur Vakti',
              body: 'Sahur vaktiniz geldi. Oruç için hazırlanın!',
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: bildirimTarih,
            },
          });
        }
      }

      // İftar hatırlatıcısı
      if (ayarlar.iftarAktif) {
        const [iftarSaat, iftarDakika] = ayarlar.iftarSaat.split(':').map(Number);
        const iftarTarih = new Date(yarin);
        iftarTarih.setHours(iftarSaat, iftarDakika, 0, 0);

        // Her gün için 30 günlük bildirim
        for (let i = 0; i < 30; i++) {
          const bildirimTarih = new Date(iftarTarih);
          bildirimTarih.setDate(bildirimTarih.getDate() + i);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:75',message:'İftar bildirimi oluşturuluyor',data:{i,bildirimTarih:bildirimTarih.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🌇 İftar Vakti',
              body: 'İftar vaktiniz geldi. Orucunuzu açabilirsiniz!',
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: bildirimTarih,
            },
          });
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
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:100',message:'Günlük hatırlatıcı bildirimi oluşturuluyor',data:{i,bildirimTarih:bildirimTarih.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

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

      // Namaz vakitleri bildirimleri
      if (ayarlar.namazVakitleriAktif && vakitler) {
        // Her namaz vakti için bildirim (basitleştirilmiş - sadece bugün)
        const namazVakitleri = [
          { isim: 'Sabah', saat: vakitler.imsak },
          { isim: 'Öğle', saat: vakitler.ogle },
          { isim: 'İkindi', saat: vakitler.ikindi },
          { isim: 'Akşam', saat: vakitler.aksam },
          { isim: 'Yatsı', saat: vakitler.yatsi },
        ];

        for (const vakit of namazVakitleri) {
          const [saat, dakika] = vakit.saat.split(':').map(Number);
          const vakitTarih = new Date(yarin);
          vakitTarih.setHours(saat, dakika, 0, 0);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: `🕌 ${vakit.isim} Namazı`,
              body: `${vakit.isim} namazı vakti geldi.`,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: vakitTarih,
            },
          });
        }
      }
    } catch (error) {
      console.error('Bildirimler ayarlanırken hata:', error);
    }
  }, []);

  const bildirimleriIptalEt = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Bildirimler iptal edilirken hata:', error);
    }
  }, []);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:158',message:'useEffect çalıştı - bildirimleriAyarla dependency arrayde',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    bildirimleriAyarla();

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useBildirimler.ts:162',message:'useEffect cleanup çalıştı',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // Cleanup - component unmount olduğunda
    };
  }, [bildirimleriAyarla]);

  return {
    bildirimleriAyarla,
    bildirimleriIptalEt,
  };
}


