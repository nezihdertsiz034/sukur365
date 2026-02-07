/**
 * Firebase Messaging manifest çakışmasını giderir.
 *
 * expo-notifications "color" seçeneği ve react-native-firebase_messaging
 * aynı meta-data'yı farklı değerlerle eklediğinde çakışma oluyor.
 * Bu plugin, olası çakışan meta-data'ları temizler.
 */
const { withAndroidManifest } = require('expo/config-plugins');

function withAndroidFirebaseManifest(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];
    if (!application || !application['meta-data']) {
      return config;
    }

    const metaDataList = application['meta-data'];
    const before = metaDataList.length;

    // Çakışan firebase notification color meta-data'sını kaldır
    application['meta-data'] = metaDataList.filter((meta) => {
      return meta?.$?.['android:name'] !== 'com.google.firebase.messaging.default_notification_color';
    });

    const removed = before - application['meta-data'].length;
    if (removed > 0) {
      console.log(`[android-firebase-manifest] ${removed} çakışan meta-data kaldırıldı`);
    }

    return config;
  });
}

module.exports = withAndroidFirebaseManifest;
