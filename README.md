# Oruç Zinciri 📿

30 gün boyunca tutulan oruçları takip eden ve zincir görselleştirmesi sunan mobil uygulama.

## 📱 Özellikler

- ✅ 30 günlük oruç takibi
- 🔗 Günlük zincir işaretleme
- 📊 Görsel zincir gösterimi
- 💾 Yerel veri saklama (çevrimdışı çalışır)
- 🎨 Basit ve kullanıcı dostu arayüz
- 🕐 **Yerel saat gösterimi** - Gerçek zamanlı saat ve tarih
- ⏱️ **Oruç sayacı** - Sabah ezanı ile akşam namazı arasındaki süreç sayacı
- 🕌 **Namaz vakitleri** - Güncel namaz vakitleri bilgisi

## 🛠️ Teknoloji Stack

- **React Native** - Cross-platform mobil geliştirme
- **Expo** - Hızlı geliştirme ve test ortamı
- **TypeScript** - Tip güvenliği
- **React Navigation** - Ekran geçişleri
- **AsyncStorage** - Yerel veri saklama

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Expo ile başlatın:
```bash
npx expo start
```

3. iOS için:
```bash
npx expo start --ios
```

4. Android için:
```bash
npx expo start --android
```

## 📁 Proje Yapısı

```
oruc/
├── src/
│   ├── components/     # Yeniden kullanılabilir bileşenler
│   ├── screens/        # Ekran bileşenleri
│   ├── navigation/     # Navigasyon yapılandırması
│   ├── utils/          # Yardımcı fonksiyonlar
│   ├── types/          # TypeScript type tanımları
│   ├── hooks/          # Custom React hooks
│   └── constants/      # Sabitler ve konfigürasyonlar
├── .cursorrules        # Cursor AI kuralları
└── README.md           # Bu dosya
```

## 🎯 Kullanım

1. Uygulamayı açın
2. Üst kısımda yerel saati görüntüleyin
3. Oruç sayacı ile sabah ezanı-akşam namazı arasındaki süreyi takip edin
4. Her gün tuttuğunuz orucu işaretleyin
5. 30 günlük zincirinizi görselleştirin
6. İlerlemenizi takip edin

### Oruç Sayacı Özellikleri

- **Beklemede**: Sabah ezanından önce, ezana kalan süreyi gösterir
- **Devam Ediyor**: Oruç sırasında akşam namazına kalan süreyi gösterir
- **Tamamlandı**: Akşam namazı geçtikten sonra oruç tamamlandı mesajı gösterir

## 📝 Geliştirme Notları

- Uygulama basit ve odaklı tutulmalıdır
- Clean code prensiplerine uyulmalıdır
- Linter hataları çözülmelidir
- Tüm kod yorumları Türkçe olmalıdır

## 📄 Lisans

Bu proje kişisel kullanım içindir.

