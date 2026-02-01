import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { ekstraStiller } from './ekstraStyles';
import { useTheme } from '../../hooks/useTheme';

interface FitreScreenProps { }

const FITRE_MIKTARI = 150;

export default function FitreScreen(_props: FitreScreenProps) {
  const [fitreKisiSayisi, setFitreKisiSayisi] = useState('1');
  const [fitreSonuc, setFitreSonuc] = useState<number | null>(null);
  const tema = useTheme();

  const hesaplaFitre = () => {
    const kisiSayisi = parseInt(fitreKisiSayisi, 10);
    if (Number.isNaN(kisiSayisi) || kisiSayisi <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir kişi sayısı girin.');
      return;
    }

    const toplam = FITRE_MIKTARI * kisiSayisi;
    setFitreSonuc(toplam);
  };

  return (
    <EkstraScreenLayout baslik="🌾 Fitre Hesaplayıcı" geriDonHedef="AraclarMain">
      <View style={[ekstraStiller.bolum, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20`, borderWidth: 1 }]}>
        <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>Fitre Hesaplama</Text>
        <Text style={[ekstraStiller.bilgiText, { color: tema.yaziRenkSoluk }]}>
          Fitre, Ramazan ayında verilmesi gereken sadakadır. Kişi başı yaklaşık {FITRE_MIKTARI} ₺ (2026).
        </Text>
        <TextInput
          style={[ekstraStiller.input, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)', borderColor: `${tema.vurgu}20`, color: tema.yaziRenk }]}
          placeholder="Kişi sayısı"
          placeholderTextColor={tema.yaziRenkSoluk}
          value={fitreKisiSayisi}
          onChangeText={setFitreKisiSayisi}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={[ekstraStiller.hesaplaButonu, { backgroundColor: tema.vurgu }]} onPress={hesaplaFitre}>
          <Text style={[ekstraStiller.hesaplaButonuText, { color: '#000' }]}>Hesapla</Text>
        </TouchableOpacity>
        {fitreSonuc !== null && (
          <View style={[ekstraStiller.sonucKart, { backgroundColor: `${tema.vurgu}10`, borderColor: `${tema.vurgu}33` }]}>
            <Text style={[ekstraStiller.sonucLabel, { color: tema.yaziRenkSoluk }]}>Toplam Fitre:</Text>
            <Text style={[ekstraStiller.sonucDeger, { color: tema.vurgu }]}>
              {fitreSonuc.toLocaleString('tr-TR')} ₺
            </Text>
            <Text style={[ekstraStiller.sonucAciklama, { color: tema.yaziRenkSoluk }]}>
              ({fitreKisiSayisi} kişi × {FITRE_MIKTARI} ₺)
            </Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}
