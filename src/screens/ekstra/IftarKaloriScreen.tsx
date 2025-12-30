import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { ekstraStiller } from './ekstraStyles';

interface IftarKaloriScreenProps {}

interface KaloriMenu {
  isim: string;
  kalori: string;
}

export default function IftarKaloriScreen(_props: IftarKaloriScreenProps) {
  const [kaloriMenuler, setKaloriMenuler] = useState<KaloriMenu[]>([]);

  const toplamKalori = kaloriMenuler.reduce((sum, menu) => {
    const kalori = Number.parseFloat(menu.kalori);
    return sum + (Number.isFinite(kalori) ? kalori : 0);
  }, 0);

  const kaloriEkle = () => {
    setKaloriMenuler((onceki) => [...onceki, { isim: '', kalori: '' }]);
  };

  const kaloriGuncelle = (index: number, field: keyof KaloriMenu, value: string) => {
    setKaloriMenuler((onceki) => {
      const guncellenmis = [...onceki];
      guncellenmis[index] = { ...guncellenmis[index], [field]: value };
      return guncellenmis;
    });
  };

  const kaloriSil = (index: number) => {
    setKaloriMenuler((onceki) => onceki.filter((_, i) => i !== index));
  };

  return (
    <EkstraScreenLayout baslik="🍽️ İftar Kalori Takibi">
      <View style={ekstraStiller.bolum}>
        <View style={ekstraStiller.bolumHeader}>
          <Text style={ekstraStiller.bolumBaslik}>İftar Menüsü</Text>
          <TouchableOpacity style={ekstraStiller.ekleButonu} onPress={kaloriEkle}>
            <Text style={ekstraStiller.ekleButonuText}>+</Text>
          </TouchableOpacity>
        </View>

        {kaloriMenuler.length === 0 && (
          <Text style={ekstraStiller.bilgiText}>
            İftar menünüze eklemek için + butonuna dokunun.
          </Text>
        )}

        {kaloriMenuler.map((menu, index) => (
          <View key={`menu-${index}`} style={ekstraStiller.kaloriItem}>
            <TextInput
              style={[ekstraStiller.kaloriInput, styles.kaloriAd]}
              placeholder="Yemek adı"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={menu.isim}
              onChangeText={(value) => kaloriGuncelle(index, 'isim', value)}
            />
            <TextInput
              style={[ekstraStiller.kaloriInput, styles.kaloriDeger]}
              placeholder="Kalori"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={menu.kalori}
              onChangeText={(value) => kaloriGuncelle(index, 'kalori', value)}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={ekstraStiller.silButonu} onPress={() => kaloriSil(index)}>
              <Text style={ekstraStiller.silButonuText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        {toplamKalori > 0 && (
          <View style={ekstraStiller.toplamKaloriKart}>
            <Text style={ekstraStiller.toplamKaloriLabel}>Toplam Kalori:</Text>
            <Text style={ekstraStiller.toplamKaloriDeger}>
              {toplamKalori.toLocaleString('tr-TR')} kcal
            </Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}

const styles = StyleSheet.create({
  kaloriAd: {
    flex: 2,
  },
  kaloriDeger: {
    flex: 1,
  },
});
