import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { ekstraStiller } from './ekstraStyles';

interface ZekatScreenProps {}

const NISAB_TUTARI = 85000;
const ZEKAT_ORANI = 0.025;

export default function ZekatScreen(_props: ZekatScreenProps) {
  const [zekatMalVarligi, setZekatMalVarligi] = useState('');
  const [zekatSonuc, setZekatSonuc] = useState<number | null>(null);

  const hesaplaZekat = () => {
    const malVarligi = parseFloat(zekatMalVarligi);
    if (Number.isNaN(malVarligi) || malVarligi <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir mal varlığı girin.');
      return;
    }

    if (malVarligi < NISAB_TUTARI) {
      Alert.alert(
        'Bilgi',
        `Mal varlığınız nisab miktarının (${NISAB_TUTARI.toLocaleString('tr-TR')} ₺) altında. Zekat vermeniz gerekmez.`
      );
      setZekatSonuc(0);
      return;
    }

    const zekat = malVarligi * ZEKAT_ORANI;
    setZekatSonuc(zekat);
  };

  return (
    <EkstraScreenLayout baslik="💰 Zekat Hesaplayıcı">
      <View style={ekstraStiller.bolum}>
        <Text style={ekstraStiller.bolumBaslik}>Zekat Hesaplama</Text>
        <Text style={ekstraStiller.bilgiText}>
          Mal varlığınızın nisab miktarını (85 gr altın değeri) aşması durumunda zekat vermeniz gerekir.
        </Text>
        <TextInput
          style={ekstraStiller.input}
          placeholder="Mal varlığı (₺)"
          placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
          value={zekatMalVarligi}
          onChangeText={setZekatMalVarligi}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity style={ekstraStiller.hesaplaButonu} onPress={hesaplaZekat}>
          <Text style={ekstraStiller.hesaplaButonuText}>Hesapla</Text>
        </TouchableOpacity>
        {zekatSonuc !== null && (
          <View style={ekstraStiller.sonucKart}>
            <Text style={ekstraStiller.sonucLabel}>Zekat Miktarı:</Text>
            <Text style={ekstraStiller.sonucDeger}>
              {zekatSonuc.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              ₺
            </Text>
            <Text style={ekstraStiller.sonucAciklama}>(Mal varlığınızın %2.5'i)</Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}
