export interface IftarMenuKategori {
  id: string;
  baslik: string;
  ikon: string;
  secenekler: string[];
}

export const IFTAR_MENU_KATEGORILERI: IftarMenuKategori[] = [
  {
    id: 'iftariye',
    baslik: 'İftariye',
    ikon: '🌙',
    secenekler: [
      'Hurma, zeytin ve ceviz tabağı',
      'Peynir tabağı ve taze hurma',
      'Hurma + kuru kayısı + badem',
      'Sıcak hurma-komposto ikilisi',
      'Zeytin ezmesi ve tam buğday ekmek',
    ],
  },
  {
    id: 'corba',
    baslik: 'Çorba',
    ikon: '🥣',
    secenekler: [
      'Mercimek çorbası',
      'Ezogelin çorbası',
      'Yayla çorbası',
      'Tarhana çorbası',
      'Sebze çorbası',
    ],
  },
  {
    id: 'ana-yemek',
    baslik: 'Ana Yemek',
    ikon: '🍲',
    secenekler: [
      'Etli nohut',
      'Fırında tavuk',
      'Izgara balık',
      'Tavuk güveç',
      'Kıymalı sebze yemeği',
    ],
  },
  {
    id: 'yan',
    baslik: 'Yan Lezzet',
    ikon: '🍚',
    secenekler: [
      'Bulgur pilavı',
      'Şehriyeli pirinç pilavı',
      'Fırın patates',
      'Sebzeli kuskus',
      'İç pilav',
    ],
  },
  {
    id: 'salata',
    baslik: 'Salata',
    ikon: '🥗',
    secenekler: [
      'Çoban salata',
      'Mevsim salata',
      'Roka salatası',
      'Gavurdağı salatası',
      'Yoğurtlu semizotu',
    ],
  },
  {
    id: 'tatli',
    baslik: 'Tatlı',
    ikon: '🍮',
    secenekler: [
      'Güllaç',
      'Sütlaç',
      'Revani',
      'Kemalpaşa tatlısı',
      'Baklava',
    ],
  },
  {
    id: 'icecek',
    baslik: 'İçecek',
    ikon: '🥤',
    secenekler: [
      'Ayran',
      'Ev yapımı komposto',
      'Şerbet',
      'Maden suyu ve su',
      'Taze nane limonata',
    ],
  },
];
