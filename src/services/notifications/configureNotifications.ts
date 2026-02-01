import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { logger } from '../../utils/logger';

/**
 * Bildirim kanalı ID'leri
 */
export const CHANNEL_EZAN = 'ezan';
export const CHANNEL_NAMAZ = 'namaz-vakitleri-v2';
export const CHANNEL_HATIRLATICI = 'hatirlaticilar-v2';

/**
 * Bildirim handler ayarla
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

/**
 * Android için bildirim kanallarını oluştur
 * App açılışında çağrılmalı
 */
export async function configureNotifications(): Promise<void> {
  if (Platform.OS !== 'android') {
    logger.info('iOS platform - notification channels gerekli değil', undefined, 'configureNotifications');
    return;
  }

  try {
    // Ezan kanalı (Yunus Emre sesi ile - OS notification sound)
    await Notifications.setNotificationChannelAsync(CHANNEL_EZAN, {
      name: 'Ezan',
      description: 'Namaz vakti ezan sesi bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1a5f3f',
      sound: 'yunus_emre', // Android raw resource - uzantı olmadan
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    // Namaz vakitleri kanalı (eski kanal - geriye dönük uyumluluk için)
    await Notifications.setNotificationChannelAsync(CHANNEL_NAMAZ, {
      name: 'Namaz Vakitleri',
      description: 'Günlük namaz vakti bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 1000, 500, 1000, 500, 1000, 500, 1000],
      lightColor: '#1a5f3f',
      sound: 'yunus_emre', // Android raw resource - uzantı olmadan
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    // Hatırlatıcılar kanalı
    await Notifications.setNotificationChannelAsync(CHANNEL_HATIRLATICI, {
      name: 'Hatırlatıcılar',
      description: 'Sahur, iftar ve diğer hatırlatıcılar',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 1000, 500, 1000, 500, 1000, 500, 1000],
      lightColor: '#1a5f3f',
      sound: 'yunus_emre', // Hatırlatıcılar için Yunus Emre sesi
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    logger.info('Bildirim kanalları yapılandırıldı', undefined, 'configureNotifications');
  } catch (error) {
    logger.error('Bildirim kanalları yapılandırılırken hata', { error }, 'configureNotifications');
  }
}
