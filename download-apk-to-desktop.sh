#!/bin/bash
# APK'yı EAS'dan indirip Masaüstüne kaydeder.
# Build tamamlandıktan sonra çalıştır: ./download-apk-to-desktop.sh

export PATH="/Users/nezih/.local/node/bin:$PATH"
cd "$(dirname "$0")"

echo "Son Android (preview/APK) build indiriliyor..."
eas build:download --platform android --latest --output "$HOME/Desktop/Sukur365.apk"

if [ -f "$HOME/Desktop/Sukur365.apk" ]; then
  echo "✅ APK masaüstüne kaydedildi: $HOME/Desktop/Sukur365.apk"
else
  echo "❌ İndirme başarısız veya build henüz tamamlanmadı."
  echo "   Build durumu: https://expo.dev/accounts/nezihdertsiz/projects/musluman-plus/builds"
  echo "   Tamamlandıktan sonra bu scripti tekrar çalıştır."
fi
