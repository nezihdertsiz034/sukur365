/**
 * İslami renk paleti
 * Yeşil, altın sarısı, koyu mavi, krem ve beyaz tonları
 */

export const ISLAMI_RENKLER = {
  // Ana yeşil tonları (İslam'ın sembol rengi)
  yesilKoyu: '#1B5E20',      // Koyu yeşil
  yesilOrta: '#2E7D32',      // Orta yeşil
  yesilAcik: '#4CAF50',      // Açık yeşil
  yesilCokAcik: '#81C784',   // Çok açık yeşil
  yesilParlak: '#66BB6A',    // Parlak yeşil

  // Altın sarısı tonları (değerli ve kutsal)
  altinKoyu: '#B8860B',      // Koyu altın
  altinOrta: '#DAA520',      // Orta altın
  altinAcik: '#FFD700',      // Açık altın
  altinParlak: '#FFE135',    // Parlak altın

  // Koyu mavi tonları (gökyüzü, sakinlik)
  maviKoyu: '#1565C0',       // Koyu mavi
  maviOrta: '#1976D2',       // Orta mavi
  maviAcik: '#42A5F5',       // Açık mavi
  maviCokAcik: '#90CAF9',    // Çok açık mavi

  // Nötr tonlar
  krem: '#F5F5DC',           // Krem
  beyaz: '#FFFFFF',          // Beyaz
  griAcik: '#F5F5F5',       // Açık gri
  griOrta: '#9E9E9E',       // Orta gri
  griKoyu: '#424242',       // Koyu gri

  // Vurgu renkleri
  kirmiziYumusak: '#C62828', // Yumuşak kırmızı (uyarı için)
  turuncuYumusak: '#E65100', // Yumuşak turuncu

  // Arka plan renkleri
  arkaPlanAcik: '#F8F9F5',   // Açık krem-yeşilimsi
  arkaPlanOrta: '#F1F8E9',   // Orta krem-yeşilimsi
  arkaPlanKoyu: '#E8F5E9',   // Koyu krem-yeşilimsi

  // Modern yeşil arka plan (ana tema) - Güncellenmiş modern tonlar
  arkaPlanYesil: '#0F4C3A',  // Daha koyu, modern yeşil arka plan
  arkaPlanYesilOrta: '#1A5F3F', // Orta yeşil arka plan (glassmorphism için)
  arkaPlanYesilAcik: '#2D7A5F', // Açık yeşil arka plan

  // Glassmorphism efektleri için
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassShadow: 'rgba(0, 0, 0, 0.1)',

  // Beyaz yazı renkleri
  yaziBeyaz: '#FFFFFF',      // Saf beyaz
  yaziBeyazYumusak: '#F5F5F5', // Yumuşak beyaz
  yaziBeyazAcik: '#E0E0E0',   // Açık beyaz
};

/**
 * Dinamik Tema Renkleri
 * Günün vaktine göre (Sabah, Gün, Akşam, Gece) değişen renk paletleri
 */
export const TEMA_RENKLERI = {
  SABAH: {
    ana: '#2E7D32', // Orta Yeşil
    ikincil: '#4CAF50', // Açık Yeşil
    arkaPlan: '#0F4C3A',
    vurgu: '#FFD700', // Altın
    isik: 'rgba(255, 255, 255, 0.15)',
  },
  GUN: {
    ana: '#1B5E20', // Koyu Yeşil
    ikincil: '#2E7D32',
    arkaPlan: '#0A3D2E',
    vurgu: '#DAA520',
    isik: 'rgba(255, 255, 255, 0.1)',
  },
  AKSAM: {
    ana: '#1565C0', // Koyu Mavi
    ikincil: '#1976D2',
    arkaPlan: '#0D2B45', // Gece Mavisi / Koyu Yeşil Karışımı
    vurgu: '#FFD700',
    isik: 'rgba(255, 223, 0, 0.1)', // Altın Işıltısı
  },
  GECE: {
    ana: '#1A237E', // İndigo / Çok Koyu Mavi
    ikincil: '#0D47A1',
    arkaPlan: '#05111A', // Siyaha Yakın
    vurgu: '#B8860B', // Mat Altın
    isik: 'rgba(255, 255, 255, 0.05)',
  }
};

/**
 * Kur'an-ı Kerim okuma için özel renk paleti
 */
export const KURAN_RENKLER = {
  // Arapça metin
  arapcaMetin: '#2C5F2D',      // Koyu yeşil
  arapcaMetinKoyu: '#1B5E20',  // Daha koyu yeşil

  // Türkçe meal
  turkceMeal: '#4A4A4A',       // Koyu gri
  turkceMealAcik: '#616161',   // Orta gri

  // Ayet numarası
  ayetNumarasi: '#DAA520',     // Altın
  ayetNumarasiAcik: '#FFD700', // Açık altın

  // İkonlar
  bookmark: '#FFD700',         // Altın
  bookmarkActive: '#FFA000',   // Koyu altın
  favorite: '#FF6B6B',         // Kırmızı
  favoriteActive: '#E53935',   // Koyu kırmızı
  share: '#42A5F5',           // Mavi

  // Arka planlar
  background: '#F5F5DC',       // Krem (göz yormayan)
  backgroundDark: '#2C2C2C',   // Koyu mod
  cardBackground: '#FFFFFF',   // Beyaz kart
  cardBackgroundDark: '#3C3C3C', // Koyu kart

  // Kenarlıklar
  border: '#E0E0E0',          // Açık gri
  borderDark: '#4A4A4A',      // Koyu gri

  // Vurgular
  highlight: '#FFF9C4',       // Açık sarı (seçili ayet)
  highlightDark: '#827717',   // Koyu sarı

  // Sure başlığı
  sureBaslik: '#1B5E20',      // Koyu yeşil
  sureBaslikAcik: '#4CAF50',  // Açık yeşil
};

