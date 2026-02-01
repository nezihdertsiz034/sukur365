/**
 * HomeScreen için sabit veriler
 */

// Günün ayetleri
export const GUNUN_AYETLERI = [
    { ayet: '"Ey iman edenler! Oruç, sizden öncekilere farz kılındığı gibi size de farz kılındı."', kaynak: 'Bakara, 183' },
    { ayet: '"Şüphesiz Allah sabredenlerle beraberdir."', kaynak: 'Bakara, 153' },
    { ayet: '"Kim Allah\'a tevekkül ederse, O ona yeter."', kaynak: 'Talak, 3' },
    { ayet: '"Rabbinizden mağfiret dileyin. Çünkü O çok bağışlayandır."', kaynak: 'Nuh, 10' },
    { ayet: '"Allah\'ı çok zikredin ki kurtuluşa eresiniz."', kaynak: 'Cuma, 10' },
    { ayet: '"Ve Rabbine sabret. Çünkü sen gözlerimizin önündesin."', kaynak: 'Tur, 48' },
    { ayet: '"Namazı dosdoğru kılın, zekatı verin."', kaynak: 'Bakara, 43' },
];

// Hadis-i Şerifler
export const HADISLER = [
    { hadis: '"Oruç bir kalkandır. Oruçlu kötü söz söylemesin."', kaynak: 'Buhari' },
    { hadis: '"Sizin en hayırlınız, ahlakı en güzel olanınızdır."', kaynak: 'Buhari' },
    { hadis: '"Kolaylaştırın, zorlaştırmayın. Müjdeleyin, nefret ettirmeyin."', kaynak: 'Buhari' },
    { hadis: '"Güzel söz sadakadır."', kaynak: 'Buhari' },
    { hadis: '"Temizlik imanın yarısıdır."', kaynak: 'Müslim' },
];

// Hızlı erişim kartları - Satır 1 (4 adet)
export const HIZLI_ERISIM_1 = [
    { id: 'tesbih', baslik: 'Tesbih', resim: 'tesbih.png', tab: 'Takip', screen: 'TesbihSayaci', renk: '#FFD700' },
    { id: 'dualar', baslik: 'Dualar', resim: 'dualar.png', tab: 'Kur\'an', screen: 'Dualar', renk: '#90EE90' },
    { id: 'kible', baslik: 'Kıble', resim: 'kible.png', tab: 'Araçlar', screen: 'Kıble', renk: '#87CEEB' },
    { id: 'esma', baslik: 'Esmaül Hüsna', resim: 'dualar.png', tab: 'Kur\'an', screen: 'EsmaulHusna', renk: '#DDA0DD' },
];

// Hızlı erişim kartları - Satır 2 (4 adet) 
export const HIZLI_ERISIM_2 = [
    { id: 'peygamber', baslik: 'Hz. Muhammed (S.A.V.)', resim: 'medine.png', tab: 'Kur\'an', screen: 'PeygamberHayati', renk: '#98FB98' },
    { id: 'kuran', baslik: 'Kur\'an-ı Kerim', resim: 'kuran.png', tab: 'Kur\'an', screen: 'KuranMain', renk: '#2C5F2D' },
    { id: 'zekat', baslik: 'Zekat', resim: 'zekat.png', tab: 'Araçlar', screen: 'Zekat', renk: '#F0E68C' },
    { id: 'istatistik', baslik: 'İstatistikler', resim: 'stats.png', tab: 'Takip', screen: 'IstatistiklerMain', renk: '#B0C4DE' },
];

export const MOOD_VERILERI = [
    {
        id: 'peaceful',
        etiket: 'Huzurlu',
        ikon: require('../../assets/icons/mood_peaceful.png'),
        ayet: '“Bilesiniz ki, kalpler ancak Allah’ı anmakla huzur bulur.” (Ra’d, 28)',
        dua: 'Allah’ım, gönlüme inşirah ver, işimi kolaylaştır.',
        renk: '#4CAF50'
    },
    {
        id: 'sad',
        etiket: 'Üzgün',
        ikon: require('../../assets/icons/mood_sad.png'),
        ayet: '“Gevşemeyin, hüzünlenmeyin; eğer inanmışsanız en üstün olan sizsiniz.” (Âl-i İmrân, 139)',
        dua: 'Ya Rabbi, kederimi ve hüznümü sana arz ediyorum, bana ferahlık ver.',
        renk: '#2196F3'
    },
    {
        id: 'stressed',
        etiket: 'Stresli',
        ikon: require('../../assets/icons/mood_stressed.png'),
        ayet: '“Allah, hiç kimseye gücünün üstünde bir şey yüklemez.” (Bakara, 286)',
        dua: 'Allah’ım, sabrımı artır ve kalbime sükunet indir.',
        renk: '#FF9800'
    },
    {
        id: 'grateful',
        etiket: 'Şükür Dolu',
        ikon: require('../../assets/icons/mood_grateful.png'),
        ayet: '“Eğer şükrederseniz, elbette size (nimetimi) artırırım.” (İbrâhim, 7)',
        dua: 'Verdiğin nimetler için sana sonsuz şükürler olsun ya Rabbi.',
        renk: '#FFD700'
    }
];
