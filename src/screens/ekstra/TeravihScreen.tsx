import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { Teravih } from '../../types';
import { getirTarihTeravih, kaydetTeravih, yukleTeravihler } from '../../utils/storage';
import { tarihToString } from '../../utils/ramazanTarihleri';

interface TeravihScreenProps {}

export default function TeravihScreen(_props: TeravihScreenProps) {
  const [teravihler, setTeravihler] = useState<Teravih[]>([]);
  const [teravihModalVisible, setTeravihModalVisible] = useState(false);

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
      <EkstraScreenLayout baslik="🕌 Teravih Takibi">
        <View style={ekstraStiller.bolum}>
          <View style={ekstraStiller.bolumHeader}>
            <Text style={ekstraStiller.bolumBaslik}>Teravih Namazı</Text>
            <TouchableOpacity
              style={ekstraStiller.ekleButonu}
              onPress={() => setTeravihModalVisible(true)}
            >
              <Text style={ekstraStiller.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={ekstraStiller.istatistikKart}>
            <Text style={ekstraStiller.istatistikDeger}>{tamamlananTeravihSayisi}</Text>
            <Text style={ekstraStiller.istatistikLabel}>Tamamlanan Teravih</Text>
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
