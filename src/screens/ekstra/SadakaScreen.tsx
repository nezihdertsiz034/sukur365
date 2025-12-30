import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { Sadaka } from '../../types';
import { getirToplamSadaka, kaydetSadaka, yukleSadakalar } from '../../utils/storage';
import { tarihToString } from '../../utils/ramazanTarihleri';
import { ISLAMI_RENKLER } from '../../constants/renkler';

interface SadakaScreenProps {}

export default function SadakaScreen(_props: SadakaScreenProps) {
  const [sadakalar, setSadakalar] = useState<Sadaka[]>([]);
  const [toplamSadaka, setToplamSadaka] = useState(0);
  const [sadakaModalVisible, setSadakaModalVisible] = useState(false);
  const [sadakaMiktar, setSadakaMiktar] = useState('');
  const [sadakaAciklama, setSadakaAciklama] = useState('');

  useEffect(() => {
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    try {
      const [sadakaVerileri, toplam] = await Promise.all([
        yukleSadakalar(),
        getirToplamSadaka(),
      ]);
      setSadakalar(sadakaVerileri);
      setToplamSadaka(toplam);
    } catch (error) {
      console.error('Sadaka verileri yüklenirken hata:', error);
    }
  };

  const handleSadakaEkle = async () => {
    if (!sadakaMiktar.trim()) {
      Alert.alert('Hata', 'Lütfen miktar girin.');
      return;
    }

    try {
      const bugun = new Date();
      const yeniSadaka: Sadaka = {
        id: `sadaka-${Date.now()}`,
        tarih: tarihToString(bugun),
        miktar: parseFloat(sadakaMiktar),
        aciklama: sadakaAciklama.trim() || undefined,
        olusturmaTarihi: Date.now(),
      };
      await kaydetSadaka(yeniSadaka);
      setSadakaMiktar('');
      setSadakaAciklama('');
      setSadakaModalVisible(false);
      await verileriYukle();
    } catch (error) {
      Alert.alert('Hata', 'Sadaka kaydedilirken bir hata oluştu.');
    }
  };

  const formatTarih = (tarihString: string): string => {
    const [yil, ay, gun] = tarihString.split('-');
    return `${gun}.${ay}.${yil}`;
  };

  return (
    <>
      <EkstraScreenLayout baslik="💝 Sadaka Takibi">
        <View style={ekstraStiller.bolum}>
          <View style={ekstraStiller.bolumHeader}>
            <Text style={ekstraStiller.bolumBaslik}>Sadaka Kayıtları</Text>
            <TouchableOpacity
              style={ekstraStiller.ekleButonu}
              onPress={() => setSadakaModalVisible(true)}
            >
              <Text style={ekstraStiller.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={ekstraStiller.istatistikKart}>
            <Text style={ekstraStiller.istatistikDeger}>{toplamSadaka.toFixed(2)} ₺</Text>
            <Text style={ekstraStiller.istatistikLabel}>Toplam Sadaka</Text>
          </View>
          {sadakalar.length > 0 && (
            <View style={ekstraStiller.listeContainer}>
              {sadakalar.slice(0, 5).map((sadaka) => (
                <View key={sadaka.id} style={ekstraStiller.listeItem}>
                  <View>
                    <Text style={ekstraStiller.listeItemBaslik}>
                      {sadaka.miktar.toFixed(2)} ₺
                    </Text>
                    <Text style={ekstraStiller.listeItemTarih}>
                      {formatTarih(sadaka.tarih)}
                    </Text>
                  </View>
                  {sadaka.aciklama && (
                    <Text style={ekstraStiller.listeItemAciklama}>{sadaka.aciklama}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </EkstraScreenLayout>

      <Modal
        visible={sadakaModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSadakaModalVisible(false)}
      >
        <View style={ekstraStiller.modalOverlay}>
          <View style={ekstraStiller.modalContent}>
            <Text style={ekstraStiller.modalBaslik}>Sadaka Ekle</Text>
            <TextInput
              style={ekstraStiller.input}
              placeholder="Miktar (₺)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={sadakaMiktar}
              onChangeText={setSadakaMiktar}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[ekstraStiller.input, ekstraStiller.textArea]}
              placeholder="Açıklama (opsiyonel)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={sadakaAciklama}
              onChangeText={setSadakaAciklama}
              multiline
            />
            <View style={ekstraStiller.modalButonlar}>
              <TouchableOpacity
                style={[ekstraStiller.modalButonu, ekstraStiller.iptalButonu]}
                onPress={() => {
                  setSadakaModalVisible(false);
                  setSadakaMiktar('');
                  setSadakaAciklama('');
                }}
              >
                <Text style={ekstraStiller.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[ekstraStiller.modalButonu, ekstraStiller.kaydetButonu]}
                onPress={handleSadakaEkle}
              >
                <Text style={ekstraStiller.modalButonuText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
