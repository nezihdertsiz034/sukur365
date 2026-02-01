import { Audio } from 'expo-av';

/**
 * Ezan sesi çalma yardımcı fonksiyonları
 * 
 * NOT: Bildirim geldiğinde ezan sesi artık OS notification sound olarak çalıyor
 * (Android: notification channel sound, iOS: notification sound)
 * Bu fonksiyonlar sadece in-app preview/test için kullanılıyor.
 */

let sound: Audio.Sound | null = null;

/**
 * Ezan sesini çalar (in-app preview/test için)
 * Bildirim geldiğinde otomatik çalmaz - OS notification sound kullanılıyor
 */
export async function ezanSesiCal(): Promise<void> {
  try {
    // Önceki ses varsa durdur
    if (sound) {
      await ezanSesiDurdur();
    }

    // Ses modunu ayarla
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    // Yerel ezan sesi dosyasını yükle
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../../assets/yunus_emre.mp3'),
      { shouldPlay: true, volume: 1.0, positionMillis: 9000 }
    );

    sound = newSound;

    // Ses bittiğinde otomatik temizle
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        ezanSesiDurdur();
      }
    });
  } catch (error) {
    console.error('Ezan sesi çalınırken hata:', error);
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (e) {
        // Ignore
      }
      sound = null;
    }
  }
}

/**
 * Çalan ezan sesini durdurur
 */
export async function ezanSesiDurdur(): Promise<void> {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error('Ezan sesi durdurulurken hata:', error);
    sound = null;
  }
}

// NOT: bildirimEzanSesiBaslat ve bildirimEzanSesiTemizle fonksiyonları kaldırıldı
// Çünkü artık OS notification sound kullanılıyor (app kapalıyken de çalışır)
