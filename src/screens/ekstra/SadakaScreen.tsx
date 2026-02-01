import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { Sadaka } from '../../types';
import { getirToplamSadaka, kaydetSadaka, yukleSadakalar } from '../../utils/storage';
import { tarihToString } from '../../utils/ramazanTarihleri';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { useTheme } from '../../hooks/useTheme';

interface SadakaScreenProps { }

export default function SadakaScreen(_props: SadakaScreenProps) {
  const [sadakalar, setSadakalar] = useState<Sadaka[]>([]);
  const [toplamSadaka, setToplamSadaka] = useState(0);
  const [sadakaModalVisible, setSadakaModalVisible] = useState(false);
  const [sadakaMiktar, setSadakaMiktar] = useState('');
  const [sadakaAciklama, setSadakaAciklama] = useState('');
  const tema = useTheme();

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
      <EkstraScreenLayout baslik="💝 Sadaka Kayıtları" geriDonHedef="AraclarMain">
        <View style={[ekstraStiller.bolum, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20`, borderWidth: 1 }]}>
          <View style={ekstraStiller.bolumHeader}>
            <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>Sadaka Kayıtları</Text>
            <TouchableOpacity
              style={[ekstraStiller.ekleButonu, { backgroundColor: tema.vurgu }]}
              onPress={() => setSadakaModalVisible(true)}
            >
              <Text style={[ekstraStiller.ekleButonuText, { color: '#000' }]}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={[ekstraStiller.istatistikKart, { backgroundColor: `${tema.vurgu}10`, borderColor: `${tema.vurgu}33` }]}>
            <Text style={[ekstraStiller.istatistikDeger, { color: tema.vurgu }]}>{toplamSadaka.toFixed(2)} ₺</Text>
            <Text style={[ekstraStiller.istatistikLabel, { color: tema.yaziRenkSoluk }]}>Toplam Sadaka</Text>
          </View>
          {sadakalar.length > 0 && (
            <View style={ekstraStiller.listeContainer}>
              {sadakalar.slice(0, 5).map((sadaka) => (
                <View key={sadaka.id} style={[ekstraStiller.listeItem, { borderBottomColor: `${tema.vurgu}20` }]}>
                  <View>
                    <Text style={[ekstraStiller.listeItemBaslik, { color: tema.yaziRenk }]}>
                      {sadaka.miktar.toFixed(2)} ₺
                    </Text>
                    <Text style={[ekstraStiller.listeItemTarih, { color: tema.yaziRenkSoluk }]}>
                      {formatTarih(sadaka.tarih)}
                    </Text>
                  </View>
                  {sadaka.aciklama && (
                    <Text style={[ekstraStiller.listeItemAciklama, { color: tema.yaziRenkSoluk }]}>{sadaka.aciklama}</Text>
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
