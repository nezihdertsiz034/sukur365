import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { Teravih } from '../../types';
import { getirTarihTeravih, kaydetTeravih, yukleTeravihler } from '../../utils/storage';
import { tarihToString } from '../../utils/ramazanTarihleri';
import { useTheme } from '../../hooks/useTheme';
import { ISLAMI_RENKLER } from '../../constants/renkler';

interface TeravihScreenProps { }

export default function TeravihScreen(_props: TeravihScreenProps) {
  const [teravihler, setTeravihler] = useState<Teravih[]>([]);
  const [teravihModalVisible, setTeravihModalVisible] = useState(false);
  const tema = useTheme();

  useEffect(() => {
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    try {
      const teravihVerileri = await yukleTeravihler();
      setTeravihler(teravihVerileri);
    } catch (error) {
      console.error('Teravih verileri yüklenirken hata:', error);
    }
  };

  const handleTeravihEkle = async () => {
    try {
      const bugun = new Date();
      const tarih = tarihToString(bugun);
      const mevcutTeravih = await getirTarihTeravih(tarih);

      if (mevcutTeravih) {
        const guncellenmis: Teravih = {
          ...mevcutTeravih,
          tamamlandi: !mevcutTeravih.tamamlandi,
        };
        await kaydetTeravih(guncellenmis);
      } else {
        const yeniTeravih: Teravih = {
          id: `teravih-${Date.now()}`,
          tarih,
          rekatSayisi: 20,
          tamamlandi: true,
          olusturmaTarihi: Date.now(),
        };
        await kaydetTeravih(yeniTeravih);
      }
      await verileriYukle();
      setTeravihModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Teravih kaydedilirken bir hata oluştu.');
    }
  };

  const tamamlananTeravihSayisi = teravihler.filter((t) => t.tamamlandi).length;

  return (
    <>
      <EkstraScreenLayout baslik="🕌 Teravih Takibi" geriDonHedef="AraclarMain">
        <View style={[ekstraStiller.bolum, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20`, borderWidth: 1 }]}>
          <View style={ekstraStiller.bolumHeader}>
            <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>Teravih Namazı</Text>
            <TouchableOpacity
              style={[ekstraStiller.ekleButonu, { backgroundColor: tema.vurgu }]}
              onPress={() => setTeravihModalVisible(true)}
            >
              <Text style={[ekstraStiller.ekleButonuText, { color: '#000' }]}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={[ekstraStiller.istatistikKart, { backgroundColor: `${tema.vurgu}10`, borderColor: `${tema.vurgu}33` }]}>
            <Text style={[ekstraStiller.istatistikDeger, { color: tema.vurgu }]}>{tamamlananTeravihSayisi}</Text>
            <Text style={[ekstraStiller.istatistikLabel, { color: tema.yaziRenkSoluk }]}>Tamamlanan Teravih</Text>
          </View>
        </View>
      </EkstraScreenLayout>

      <Modal
        visible={teravihModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTeravihModalVisible(false)}
      >
        <View style={ekstraStiller.modalOverlay}>
          <View style={ekstraStiller.modalContent}>
            <Text style={ekstraStiller.modalBaslik}>Teravih Namazı</Text>
            <Text style={ekstraStiller.modalAciklama}>
              Bugünkü teravih namazını tamamladınız mı?
            </Text>
            <View style={ekstraStiller.modalButonlar}>
              <TouchableOpacity
                style={[ekstraStiller.modalButonu, ekstraStiller.iptalButonu]}
                onPress={() => setTeravihModalVisible(false)}
              >
                <Text style={ekstraStiller.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[ekstraStiller.modalButonu, ekstraStiller.kaydetButonu]}
                onPress={handleTeravihEkle}
              >
                <Text style={ekstraStiller.modalButonuText}>Tamamlandı</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
