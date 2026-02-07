/**
 * Firebase Messaging manifest çakışmasını giderir.
 * default_notification_color meta-data'sına tools:replace ekleyerek
 * react-native-firebase_messaging ile birleştirme hatasını önler.
 */
const { withAndroidManifest } = require('expo/config-plugins');

const FIREBASE_NOTIFICATION_COLOR_META = 'com.google.firebase.messaging.default_notification_color';

function withAndroidFirebaseManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults?.manifest;
    if (!manifest) return config;

    // Manifest root'a xmlns:tools ekle (yoksa)
    if (!manifest.$) manifest.$ = {};
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    const application = manifest.application?.[0];
    if (!application) return config;

    const metaDataList = application['meta-data'];
    if (!Array.isArray(metaDataList)) return config;

    for (const meta of metaDataList) {
      const attrs = meta?.$;
      if (!attrs) continue;
      if (attrs['android:name'] === FIREBASE_NOTIFICATION_COLOR_META) {
        attrs['tools:replace'] = 'android:resource';
        break;
      }
    }

    return config;
  });
}

module.exports = withAndroidFirebaseManifest;
