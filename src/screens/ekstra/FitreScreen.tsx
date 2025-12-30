import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { ekstraStiller } from './ekstraStyles';

interface FitreScreenProps {}

const FITRE_MIKTARI = 150;

export default function FitreScreen(_props: FitreScreenProps) {
  const [fitreKisiSayisi, setFitreKisiSayisi] = useState('1');
  const [fitreSonuc, setFitreSonuc] = useState<number | null>(null);

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
    <EkstraScreenLayout baslik="🌾 Fitre Hesaplayıcı">
      <View style={ekstraStiller.bolum}>
        <Text style={ekstraStiller.bolumBaslik}>Fitre Hesaplama</Text>
        <Text style={ekstraStiller.bilgiText}>
          Fitre, Ramazan ayında verilmesi gereken sadakadır. Kişi başı yaklaşık {FITRE_MIKTARI} ₺ (2026).
        </Text>
        <TextInput
          style={ekstraStiller.input}
          placeholder="Kişi sayısı"
          placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
          value={fitreKisiSayisi}
          onChangeText={setFitreKisiSayisi}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={ekstraStiller.hesaplaButonu} onPress={hesaplaFitre}>
          <Text style={ekstraStiller.hesaplaButonuText}>Hesapla</Text>
        </TouchableOpacity>
        {fitreSonuc !== null && (
          <View style={ekstraStiller.sonucKart}>
            <Text style={ekstraStiller.sonucLabel}>Toplam Fitre:</Text>
            <Text style={ekstraStiller.sonucDeger}>
              {fitreSonuc.toLocaleString('tr-TR')} ₺
            </Text>
            <Text style={ekstraStiller.sonucAciklama}>
              ({fitreKisiSayisi} kişi × {FITRE_MIKTARI} ₺)
            </Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}
