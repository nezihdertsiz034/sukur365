import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { IFTAR_MENU_KATEGORILERI } from '../../constants/iftarMenuleri';

interface IftarMenuOnerileriScreenProps {}

interface IftarMenuSecimi {
  id: string;
  baslik: string;
  ikon: string;
  secim: string;
}

export default function IftarMenuOnerileriScreen(_props: IftarMenuOnerileriScreenProps) {
  const menuSecimleriOlustur = (): IftarMenuSecimi[] =>
    IFTAR_MENU_KATEGORILERI.map((kategori) => ({
      id: kategori.id,
      baslik: kategori.baslik,
      ikon: kategori.ikon,
      secim: kategori.secenekler[Math.floor(Math.random() * kategori.secenekler.length)],
    }));

  const [iftarMenuSecimleri, setIftarMenuSecimleri] = useState<IftarMenuSecimi[]>(
    menuSecimleriOlustur
  );

  const menuOnerileriniYenile = () => {
    setIftarMenuSecimleri(menuSecimleriOlustur());
  };

  return (
    <EkstraScreenLayout baslik="💡 İftar Menü Önerileri">
      <View style={ekstraStiller.bolum}>
        <View style={ekstraStiller.bolumHeader}>
          <Text style={ekstraStiller.bolumBaslik}>Günlük Öneriler</Text>
          <TouchableOpacity style={ekstraStiller.yenileButonu} onPress={menuOnerileriniYenile}>
            <Text style={ekstraStiller.yenileButonuText}>Yenile</Text>
          </TouchableOpacity>
        </View>
        <View style={ekstraStiller.menuListContainer}>
          {iftarMenuSecimleri.map((menu) => (
            <View key={menu.id} style={ekstraStiller.menuItem}>
              <Text style={ekstraStiller.menuItemText}>
                {menu.ikon} {menu.baslik}: {menu.secim}
              </Text>
            </View>
          ))}
        </View>
        <Text style={ekstraStiller.bilgiText}>
          Farklı seçenekler için yenile butonuna dokunabilirsiniz.
        </Text>
      </View>
    </EkstraScreenLayout>
  );
}
