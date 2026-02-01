import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { ekstraStiller } from './ekstraStyles';
import { useTheme } from '../../hooks/useTheme';

interface ZekatScreenProps { }

const NISAB_TUTARI = 85000;
const ZEKAT_ORANI = 0.025;

export default function ZekatScreen(_props: ZekatScreenProps) {
  const [zekatMalVarligi, setZekatMalVarligi] = useState('');
  const [zekatSonuc, setZekatSonuc] = useState<number | null>(null);
  const tema = useTheme();

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
    <EkstraScreenLayout baslik="💰 Zekat Hesaplayıcı" geriDonHedef="AraclarMain">
      <View style={[ekstraStiller.bolum, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20`, borderWidth: 1 }]}>
        <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>Zekat Hesaplama</Text>
        <Text style={[ekstraStiller.bilgiText, { color: tema.yaziRenkSoluk }]}>
          Mal varlığınızın nisab miktarını (85 gr altın değeri) aşması durumunda zekat vermeniz gerekir.
        </Text>
        <TextInput
          style={[ekstraStiller.input, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)', borderColor: `${tema.vurgu}20`, color: tema.yaziRenk }]}
          placeholder="Mal varlığı (₺)"
          placeholderTextColor={tema.yaziRenkSoluk}
          value={zekatMalVarligi}
          onChangeText={setZekatMalVarligi}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity style={[ekstraStiller.hesaplaButonu, { backgroundColor: tema.vurgu }]} onPress={hesaplaZekat}>
          <Text style={[ekstraStiller.hesaplaButonuText, { color: '#000' }]}>Hesapla</Text>
        </TouchableOpacity>
        {zekatSonuc !== null && (
          <View style={[ekstraStiller.sonucKart, { backgroundColor: `${tema.vurgu}10`, borderColor: `${tema.vurgu}33` }]}>
            <Text style={[ekstraStiller.sonucLabel, { color: tema.yaziRenkSoluk }]}>Zekat Miktarı:</Text>
            <Text style={[ekstraStiller.sonucDeger, { color: tema.vurgu }]}>
              {zekatSonuc.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              ₺
            </Text>
            <Text style={[ekstraStiller.sonucAciklama, { color: tema.yaziRenkSoluk }]}>(Mal varlığınızın %2.5'i)</Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}

