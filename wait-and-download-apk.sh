#!/bin/bash
# Build tamamlanana kadar bekler, sonra APK'yı masaüstüne indirir.
export PATH="/Users/nezih/.local/node/bin:$PATH"
cd "$(dirname "$0")"
BUILD_ID="f5812f51-fb32-4429-9d53-dda1b2de5953"
DESKTOP_APK="$HOME/Desktop/Sukur365.apk"
echo "Build tamamlanması bekleniyor (en fazla ~20 dk)..."
for i in $(seq 1 25); do
  VIEW_JSON=$(eas build:view "$BUILD_ID" --json 2>/dev/null)
  STATUS=$(echo "$VIEW_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status',''))" 2>/dev/null)
  echo "[$i/25] status=$STATUS"
  if [ "$STATUS" = "FINISHED" ]; then
    echo "Build tamamlandı, indiriliyor..."
    # artifacts.buildUrl veya applicationArchiveUrl
    URL=$(echo "$VIEW_JSON" | python3 -c "
import sys, json
d = json.load(sys.stdin)
a = d.get('artifacts') or {}
url = a.get('buildUrl') or a.get('applicationArchiveUrl') or ''
print(url)
" 2>/dev/null)
    if [ -n "$URL" ]; then
      if curl -sL -o "$DESKTOP_APK" "$URL"; then
        echo "✅ APK masaüstüne kaydedildi: $DESKTOP_APK"
      else
        echo "❌ curl indirme hatası. Tarayıcıdan indir: https://expo.dev/accounts/nezihdertsiz/projects/musluman-plus/builds/$BUILD_ID"
      fi
    else
      echo "❌ İndirme URL'si alınamadı. Lütfen buradan indir:"
      echo "https://expo.dev/accounts/nezihdertsiz/projects/musluman-plus/builds/$BUILD_ID"
    fi
    exit 0
  fi
  if [ "$STATUS" = "ERRORED" ]; then
    echo "❌ Build hata verdi."
    exit 1
  fi
  sleep 45
done
echo "⏱️ Zaman aşımı. Build: https://expo.dev/accounts/nezihdertsiz/projects/musluman-plus/builds/$BUILD_ID"
