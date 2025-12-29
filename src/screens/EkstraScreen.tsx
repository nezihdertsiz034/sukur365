import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { KibleYonu as KibleYonuComponent } from '../components/KibleYonu';
import { useKibleYonu } from '../hooks/useKibleYonu';
import {
  yukleTeravihler,
  kaydetTeravih,
  getirTarihTeravih,
  yukleSadakalar,
  kaydetSadaka,
  getirToplamSadaka,
} from '../utils/storage';
import { Teravih, Sadaka } from '../types';
import { tarihToString } from '../utils/ramazanTarihleri';

export default function EkstraScreen() {
  const { kibleYonu, yukleniyor: kibleYukleniyor, hata: kibleHata } = useKibleYonu();
  const [teravihler, setTeravihler] = useState<Teravih[]>([]);
  const [sadakalar, setSadakalar] = useState<Sadaka[]>([]);
  const [toplamSadaka, setToplamSadaka] = useState(0);
  const [suHatirlatici, setSuHatirlatici] = useState(false);
  const [teravihModalVisible, setTeravihModalVisible] = useState(false);
  const [sadakaModalVisible, setSadakaModalVisible] = useState(false);
  const [seciliTeravih, setSeciliTeravih] = useState<Teravih | null>(null);
  const [sadakaMiktar, setSadakaMiktar] = useState('');
  const [sadakaAciklama, setSadakaAciklama] = useState('');

  useEffect(() => {
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    try {
      const [teravihVerileri, sadakaVerileri, toplam] = await Promise.all([
        yukleTeravihler(),
        yukleSadakalar(),
        getirToplamSadaka(),
      ]);
      setTeravihler(teravihVerileri);
      setSadakalar(sadakaVerileri);
      setToplamSadaka(toplam);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
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

  const tamamlananTeravihSayisi = teravihler.filter(t => t.tamamlandi).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>✨ Ekstra Özellikler</Text>

        {/* Kıble Yönü */}
        <KibleYonuComponent
          kibleYonu={kibleYonu}
          yukleniyor={kibleYukleniyor}
          hata={kibleHata}
        />

        {/* Teravih Takibi */}
        <View style={styles.bolum}>
          <View style={styles.bolumHeader}>
            <Text style={styles.bolumBaslik}>🕌 Teravih Namazı Takibi</Text>
            <TouchableOpacity
              style={styles.ekleButonu}
              onPress={() => setTeravihModalVisible(true)}
            >
              <Text style={styles.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{tamamlananTeravihSayisi}</Text>
            <Text style={styles.istatistikLabel}>Tamamlanan Teravih</Text>
          </View>
        </View>

        {/* Sadaka Takibi */}
        <View style={styles.bolum}>
          <View style={styles.bolumHeader}>
            <Text style={styles.bolumBaslik}>💝 Sadaka Takibi</Text>
            <TouchableOpacity
              style={styles.ekleButonu}
              onPress={() => setSadakaModalVisible(true)}
            >
              <Text style={styles.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{toplamSadaka.toFixed(2)} ₺</Text>
            <Text style={styles.istatistikLabel}>Toplam Sadaka</Text>
          </View>
          {sadakalar.length > 0 && (
            <View style={styles.listeContainer}>
              {sadakalar.slice(0, 5).map((sadaka) => (
                <View key={sadaka.id} style={styles.listeItem}>
                  <View>
                    <Text style={styles.listeItemBaslik}>
                      {sadaka.miktar.toFixed(2)} ₺
                    </Text>
                    <Text style={styles.listeItemTarih}>
                      {formatTarih(sadaka.tarih)}
                    </Text>
                  </View>
                  {sadaka.aciklama && (
                    <Text style={styles.listeItemAciklama}>{sadaka.aciklama}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Su İçme Hatırlatıcısı */}
        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>💧 Su İçme Hatırlatıcısı</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Hatırlatıcıyı Aktif Et</Text>
            <Switch
              value={suHatirlatici}
              onValueChange={setSuHatirlatici}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.altinOrta,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>
          {suHatirlatici && (
            <Text style={styles.bilgiText}>
              Su içme hatırlatıcısı yakında eklenecek.
            </Text>
          )}
        </View>

        {/* İftar Menüsü Önerileri */}
        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>🍽️ İftar Menüsü Önerileri</Text>
          <View style={styles.menuListContainer}>
            {[
              'Çorba (Mercimek, Yayla, Tarhana)',
              'Ana Yemek (Etli yemek, Tavuk, Balık)',
              'Pilav veya Makarna',
              'Salata',
              'Tatlı (Güllaç, Baklava, Sütlaç)',
              'Hurma ve Su',
            ].map((menu, index) => (
              <View key={index} style={styles.menuItem}>
                <Text style={styles.menuItemText}>• {menu}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Teravih Modal */}
      <Modal
        visible={teravihModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTeravihModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalBaslik}>Teravih Namazı</Text>
            <Text style={styles.modalAciklama}>
              Bugünkü teravih namazını tamamladınız mı?
            </Text>
            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButonu, styles.iptalButonu]}
                onPress={() => setTeravihModalVisible(false)}
              >
                <Text style={styles.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButonu, styles.kaydetButonu]}
                onPress={handleTeravihEkle}
              >
                <Text style={styles.modalButonuText}>Tamamlandı</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sadaka Modal */}
      <Modal
        visible={sadakaModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSadakaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalBaslik}>Sadaka Ekle</Text>
            <TextInput
              style={styles.input}
              placeholder="Miktar (₺)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={sadakaMiktar}
              onChangeText={setSadakaMiktar}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Açıklama (opsiyonel)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={sadakaAciklama}
              onChangeText={setSadakaAciklama}
              multiline
            />
            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButonu, styles.iptalButonu]}
                onPress={() => {
                  setSadakaModalVisible(false);
                  setSadakaMiktar('');
                  setSadakaAciklama('');
                }}
              >
                <Text style={styles.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButonu, styles.kaydetButonu]}
                onPress={handleSadakaEkle}
              >
                <Text style={styles.modalButonuText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
  },
  bolum: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bolumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bolumBaslik: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  ekleButonu: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ekleButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 24,
    fontWeight: 'bold',
  },
  istatistikKart: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  istatistikDeger: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 8,
  },
  istatistikLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  listeContainer: {
    marginTop: 16,
    gap: 8,
  },
  listeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  listeItemBaslik: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  listeItemTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  listeItemAciklama: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  bilgiText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 12,
    fontStyle: 'italic',
  },
  menuListContainer: {
    marginTop: 12,
    gap: 8,
  },
  menuItem: {
    padding: 8,
  },
  menuItemText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalAciklama: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButonlar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButonu: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  iptalButonu: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  kaydetButonu: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
  },
  modalButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

