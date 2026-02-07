/**
 * Firebase Messaging manifest çakışmasını giderir.
 * expo-notifications da aynı meta-data'yı eklediği için çakışma oluyor.
 * 
 * Yaklaşım: withAndroidManifest ile notification_color meta-data'sına
 * tools:replace ekle. Bu mod, expo-notifications'ın manifest değişikliklerinden
 * SONRA çalışır (plugin sırası sayesinde).
 */
const { withAndroidManifest } = require('expo/config-plugins');

function withAndroidFirebaseManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // xmlns:tools ekle
    if (!manifest.manifest.$) {
      manifest.manifest.$ = {};
    }
    manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Application içindeki meta-data'ları bul
    const application = manifest.manifest.application?.[0];
    if (!application) {
      console.warn('[android-firebase-manifest] Application bulunamadı');
      return config;
    }

    const metaDataList = application['meta-data'] || [];
    let found = false;

    for (const meta of metaDataList) {
      if (meta?.$?.['android:name'] === 'com.google.firebase.messaging.default_notification_color') {
        meta.$['tools:replace'] = 'android:resource';
        found = true;
        console.log('[android-firebase-manifest] tools:replace eklendi (withAndroidManifest)');
        break;
      }
    }

    if (!found) {
      // Meta-data yoksa ekle (tools:replace ile birlikte)
      metaDataList.push({
        $: {
          'android:name': 'com.google.firebase.messaging.default_notification_color',
          'android:resource': '@color/notification_icon_color',
          'tools:replace': 'android:resource',
        },
      });
      application['meta-data'] = metaDataList;
      console.log('[android-firebase-manifest] Meta-data + tools:replace eklendi');
    }

    return config;
  });
}

module.exports = withAndroidFirebaseManifest;
