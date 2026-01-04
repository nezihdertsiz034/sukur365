import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';

/**
 * Ezan sesi çalma yardımcı fonksiyonları
 */

let audioPlayer: AudioPlayer | null = null;
let listener: Notifications.Subscription | null = null;
let playbackCheckInterval: NodeJS.Timeout | null = null;

/**
 * Ezan sesini çalar
 * @param sesUrl Ezan sesi URL'i (opsiyonel, varsayılan online ses kullanır)
 */
export async function ezanSesiCal(sesUrl?: string): Promise<void> {
  try {
    // Önceki ses varsa durdur ve temizle
    if (audioPlayer) {
      await ezanSesiDurdur();
    }

    // Ezan sesi URL'i (online kaynak - güvenilir bir kaynak)
    // Not: Gerçek uygulamada yerel dosya kullanılması önerilir
    const ezanUrl = sesUrl || 'https://www.islamicfinder.org/prayer-times/assets/audio/azan.mp3';
    
    // Alternatif: Yerel dosya kullanmak isterseniz
    // const ezanUrl = require('../assets/ezan.mp3');

    // AudioPlayer oluştur ve kaynağı yükle
    audioPlayer = createAudioPlayer(ezanUrl);
    
    // Ses bittiğinde otomatik temizleme için interval başlat
    playbackCheckInterval = setInterval(() => {
      if (audioPlayer && audioPlayer.duration && audioPlayer.currentTime) {
        // Ses bittiğinde (currentTime >= duration - küçük tolerans)
        if (audioPlayer.currentTime >= audioPlayer.duration - 0.2) {
          ezanSesiDurdur();
        }
      }
    }, 500); // Her 500ms'de bir kontrol et

    // Ses çalmayı başlat
    audioPlayer.play();
  } catch (error) {
    console.error('Ezan sesi çalınırken hata:', error);
    // Hata durumunda sessiz devam et
    if (audioPlayer) {
      try {
        audioPlayer.release();
      } catch (e) {
        // Release hatası görmezden gel
      }
      audioPlayer = null;
    }
    if (playbackCheckInterval) {
      clearInterval(playbackCheckInterval);
      playbackCheckInterval = null;
    }
  }
}

/**
 * Çalan ezan sesini durdurur
 */
export async function ezanSesiDurdur(): Promise<void> {
  try {
    if (playbackCheckInterval) {
      clearInterval(playbackCheckInterval);
      playbackCheckInterval = null;
    }
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.release();
      audioPlayer = null;
    }
  } catch (error) {
    console.error('Ezan sesi durdurulurken hata:', error);
    audioPlayer = null;
    if (playbackCheckInterval) {
      clearInterval(playbackCheckInterval);
      playbackCheckInterval = null;
    }
  }
}

/**
 * Bildirim geldiğinde ezan sesi çal
 */
export function bildirimEzanSesiBaslat(): void {
  // Önceki listener varsa kaldır
  if (listener) {
    listener.remove();
    listener = null;
  }

  // Bildirim listener'ı ekle
  listener = Notifications.addNotificationReceivedListener(async (notification) => {
    const ezanSesi = notification.request.content.data?.ezanSesi;
    
    // Eğer bu bir namaz vakti bildirimi ve ezan sesi aktifse
    if (ezanSesi && notification.request.content.title?.includes('Namazı')) {
      await ezanSesiCal();
    }
  });
}

/**
 * Ezan sesi listener'ını temizle
 */
export function bildirimEzanSesiTemizle(): void {
  if (listener) {
    listener.remove();
    listener = null;
  }
  ezanSesiDurdur();
}

