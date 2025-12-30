# Diyanet İşleri Başkanlığı API Kurulumu

Bu uygulama, namaz vakitlerini Türkiye Diyanet İşleri Başkanlığı'nın resmi API'sinden çeker.

## API Erişimi İçin Başvuru

1. **Başvuru Yapın:**
   - https://awqatsalah.diyanet.gov.tr adresinden başvuru yapın
   - Başvuru formunu doldurun ve gönderin
   - Onaylandıktan sonra size kullanıcı adı ve şifre verilecektir

2. **Dokümantasyon:**
   - API kullanım örneği: https://github.com/DinIsleriYuksekKurulu/AwqatSalah
   - Her endpoint için 5 istek hakkınız bulunmaktadır

## Yapılandırma

### Yöntem 1: app.json (Önerilen)

`app.json` dosyasındaki `extra` bölümüne kullanıcı adı ve şifrenizi ekleyin:

```json
{
  "expo": {
    "extra": {
      "diyanetUsername": "sizin_kullanici_adiniz",
      "diyanetPassword": "sizin_sifreniz"
    }
  }
}
```

### Yöntem 2: Environment Variables

`.env` dosyası oluşturun (proje kök dizininde):

```env
DIYANET_USERNAME=sizin_kullanici_adiniz
DIYANET_PASSWORD=sizin_sifreniz
```

**Not:** `.env` dosyasını `.gitignore`'a eklemeyi unutmayın!

## API Özellikleri

- ✅ Token bazlı authentication
- ✅ Otomatik token yenileme
- ✅ Token cache mekanizması (45 dakika)
- ✅ Diyanet'in resmi ve güncel verileri
- ✅ Tüm Türkiye şehirleri için destek

## Fallback Mekanizması

Eğer Diyanet API'sine erişim yoksa veya kullanıcı adı/şifre ayarlanmamışsa, uygulama otomatik olarak alternatif API'leri kullanır:

1. **EzanVakti API** - Diyanet verilerini kullanır
2. **Aladhan API** - Method 13 (Diyanet hesaplama yöntemi)

## Sorun Giderme

### "Kullanıcı adı ve şifre ayarlanmamış" hatası

- `app.json` dosyasındaki `extra` bölümünü kontrol edin
- Kullanıcı adı ve şifrenin doğru olduğundan emin olun
- Uygulamayı yeniden başlatın

### "Token alınamadı" hatası

- İnternet bağlantınızı kontrol edin
- Kullanıcı adı ve şifrenin doğru olduğundan emin olun
- API limitinizi kontrol edin (her endpoint için 5 istek)

### API Limit Aşımı

- Her endpoint için 5 istek hakkınız var
- Limit aşıldığında alternatif API'ler otomatik kullanılır
- 24 saat sonra limit sıfırlanır

## Güvenlik

⚠️ **ÖNEMLİ:** Kullanıcı adı ve şifrenizi asla public repository'lere commit etmeyin!

- `.env` dosyasını `.gitignore`'a ekleyin
- `app.json`'daki bilgileri production build'de environment variable olarak kullanın

