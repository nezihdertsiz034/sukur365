# Supabase Edge Functions Yayına Alma Rehberi ⚡

Hazırladığım `push-notification` fonksiyonunu Supabase dashboard'unuzda görebilmek ve çalıştırmak için şu adımları takip edin:

## 1. Hazırlık
Bir terminal açın ve projenizin ana dizininde olduğunuzdan emin olun.

## 2. Supabase Giriş ve Link
Supabase hesabınıza giriş yapın ve projenizi bağlayın:
```bash
npx supabase login
npx supabase link --project-ref fbhlufxcidabglgomvgd
```
*(Proje ID'niz ekran görüntünüzden alınmıştır)*

## 3. Firebase Anahtarlarını (Secrets) Tanımlama ✅
**Başarıyla tamamlandı!** (Ekran görüntünüzde `FIREBASE_SERVICE_ACCOUNT` değişkeninin başarıyla eklendiğini gördüm.)

## 4. Fonksiyonu Canlıya Alma (Deploy) 🚀
Şimdi yerelinizdeki kodu Supabase bulutuna göndermek için şu son komutu çalıştırın:

```bash
npx supabase functions deploy push-notification --no-verify-jwt
```
Kodu yazdığım dizindeki fonksiyonu Supabase sunucularına gönderin:
```bash
npx supabase functions deploy push-notification --no-verify-jwt
```
*Not: `--no-verify-jwt` bayrağını, bu fonksiyonu hem uygulama içinden hem de dış tetikleyicilerle kolayca test edebilmeniz için ekledik (Daha sonra güvenlik için açılabilir).*

---

### ✅ Sonuç
Bu adımlardan sonra ekran görüntünüzdeki "Edge Functions" sayfası artık boş olmayacak; `push-notification` fonksiyonunu orada göreceksiniz. 

Bu fonksiyon artık **Merkezi Bildirim Motorunuz** olarak çalışmaya hazır! İster manuel olarak, ister otomatik (Cron/Webhook) olarak tüm kullanıcılara bildirim göndermek için bu fonksiyonu kullanabileceğiz. 🚀🤲
