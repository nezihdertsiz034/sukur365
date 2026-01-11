# Production Build Rehberi

Bu dosya uygulamayı Google Play Store ve App Store için build etme adımlarını içerir.

## Ön Hazırlık

### 1. EAS CLI Kurulumu

```bash
npm install -g eas-cli
```

### 2. Expo Hesabına Giriş

```bash
eas login
```

### 3. Proje Yapılandırması

```bash
eas build:configure
```

Bu komut:
- `eas.json` dosyasını kontrol eder
- Expo project ID oluşturur
- `app.json`'daki `extra.eas.projectId` alanını günceller

---

## Android Build

### Test Build (APK)

Önce test için APK oluşturun:

```bash
eas build --platform android --profile preview
```

**Çıktı:** `.apk` dosyası (test için cihaza yüklenebilir)

### Production Build (AAB)

Google Play Store için:

```bash
eas build --platform android --profile production
```

**Çıktı:** `.aab` dosyası (Google Play Console'a yüklenecek)

**Süre:** ~15-20 dakika

---

## iOS Build

> **Gerekli:** Apple Developer hesabı ($99/yıl)

### Credentials Ayarlama

```bash
eas credentials
```

Seçenekler:
- iOS Distribution Certificate
- iOS Provisioning Profile

### Production Build

```bash
eas build --platform ios --profile production
```

**Çıktı:** `.ipa` dosyası (App Store Connect'e yüklenecek)

**Süre:** ~20-25 dakika

---

## Her İki Platform Birlikte

```bash
eas build --platform all --profile production
```

---

## Build Durumunu Kontrol Etme

```bash
eas build:list
```

veya web'de:
```
https://expo.dev/accounts/[username]/projects/oruc-zinciri-ramazan-rehberi/builds
```

---

## Build İndirme

Build tamamlandığında:

1. **Web'den:**
   - Expo dashboard'a git
   - Build'i bul
   - "Download" tıkla

2. **CLI'dan:**
```bash
eas build:download --latest
```

---

## Google Play Store'a Yükleme

### 1. Google Play Console

https://play.google.com/console

### 2. Uygulama Oluştur

- "Create app" tıkla
- App name: "Oruç Zinciri - Ramazan Rehberi 2026"
- Default language: Turkish
- App type: App
- Category: Lifestyle

### 3. AAB Yükle

- Production → Releases
- "Create new release"
- AAB dosyasını yükle
- Release notes yaz

### 4. Store Listing

`STORE_LISTING.md` dosyasındaki bilgileri kullan:
- App name
- Short description
- Full description
- Screenshots
- App icon
- Feature graphic

### 5. Content Rating

- Questionnaire doldur
- "Religion" seç
- PEGI 3 / Everyone alacaksınız

### 6. Privacy Policy

- Privacy policy URL ekle
- `PRIVACY_POLICY.md` dosyasını GitHub'da yayınla
- URL: `https://github.com/[username]/oruczinciri/blob/main/PRIVACY_POLICY.md`

### 7. Review & Publish

- "Send for review"
- ~1-3 gün sürer

---

## App Store'a Yükleme

### 1. App Store Connect

https://appstoreconnect.apple.com

### 2. App Oluştur

- "My Apps" → "+" → "New App"
- Name: "Oruç Zinciri - Ramazan 2026"
- Primary Language: Turkish
- Bundle ID: `com.nezihdertsiz.oruczinciri`
- SKU: `oruc-zinciri-2026`

### 3. IPA Yükle

```bash
eas submit --platform ios
```

veya manuel:
- Xcode → Organizer
- IPA'yı yükle

### 4. App Information

`STORE_LISTING.md` dosyasındaki bilgileri kullan:
- Name
- Subtitle
- Description
- Screenshots
- Privacy policy URL

### 5. Pricing

- Price: Free

### 6. App Review Information

- Contact email
- Phone number (opsiyonel)
- Review notes (opsiyonel)

### 7. Submit for Review

- "Submit for Review"
- ~1-3 gün sürer

---

## Güncelleme Yayınlama

### Version Güncelleme

`app.json`:
```json
{
  "version": "1.0.1",
  "ios": {
    "buildNumber": "2"
  },
  "android": {
    "versionCode": 2
  }
}
```

### Build & Submit

```bash
# Build
eas build --platform all --profile production

# Submit
eas submit --platform android
eas submit --platform ios
```

---

## Sorun Giderme

### Build Başarısız

```bash
# Log'ları görüntüle
eas build:view [BUILD_ID]

# Tekrar dene
eas build --platform [android|ios] --profile production --clear-cache
```

### Credentials Sorunu

```bash
# Credentials'ı sıfırla
eas credentials

# iOS için
eas credentials --platform ios

# Android için
eas credentials --platform android
```

### Bundle Identifier Değiştirme

1. `app.json`'da değiştir
2. Credentials'ı sıfırla
3. Yeni build al

---

## Önemli Notlar

> **WARNING:** İlk build uzun sürebilir (~30 dakika)

> **IMPORTANT:** Bundle identifier değiştirdikten sonra yeni credentials gerekir

> **TIP:** Preview build ile önce test edin

> **CAUTION:** Production build'i store'a yüklemeden önce test edin

---

## Checklist

### Android
- [ ] `eas.json` oluşturuldu
- [ ] `app.json` güncellendi
- [ ] Preview build test edildi
- [ ] Production build alındı
- [ ] Google Play Console'da uygulama oluşturuldu
- [ ] AAB yüklendi
- [ ] Store listing dolduruldu
- [ ] Screenshots eklendi
- [ ] Content rating alındı
- [ ] Privacy policy eklendi
- [ ] Review'a gönderildi

### iOS
- [ ] Apple Developer hesabı var
- [ ] App ID oluşturuldu
- [ ] Credentials ayarlandı
- [ ] Production build alındı
- [ ] App Store Connect'te uygulama oluşturuldu
- [ ] IPA yüklendi
- [ ] Store listing dolduruldu
- [ ] Screenshots eklendi
- [ ] Privacy policy eklendi
- [ ] Review'a gönderildi

---

**Yardım için:**
- Expo Docs: https://docs.expo.dev/build/introduction/
- EAS Build: https://docs.expo.dev/build/setup/
- Submit: https://docs.expo.dev/submit/introduction/
