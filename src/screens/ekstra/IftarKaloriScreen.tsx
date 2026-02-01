import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { TYPOGRAPHY } from '../../constants/typography';
import { ekstraStiller } from './ekstraStyles';
import { YEMEK_VERILERI, YemekVerisi } from '../../constants/yemekVerileri';
import { useTheme } from '../../hooks/useTheme';

interface KaloriMenu {
  id: string;
  isim: string;
  kalori: string;
}

export default function IftarKaloriScreen() {
  const [kaloriMenuler, setKaloriMenuler] = useState<KaloriMenu[]>([]);
  const [modalGorunur, setModalGorunur] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const tema = useTheme();

  const toplamKalori = kaloriMenuler.reduce((sum, menu) => {
    const kalori = Number.parseFloat(menu.kalori);
    return sum + (Number.isFinite(kalori) ? kalori : 0);
  }, 0);

  const manuelEkle = () => {
    setKaloriMenuler((onceki) => [
      ...onceki,
      { id: Date.now().toString(), isim: '', kalori: '' }
    ]);
  };

  const listedenEkle = (yemek: YemekVerisi) => {
    setKaloriMenuler((onceki) => [
      ...onceki,
      { id: Date.now().toString(), isim: yemek.isim, kalori: yemek.kalori.toString() }
    ]);
    setModalGorunur(false);
    setAramaMetni('');
  };

  const kaloriGuncelle = (id: string, field: keyof KaloriMenu, value: string) => {
    setKaloriMenuler((onceki) =>
      onceki.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const kaloriSil = (id: string) => {
    setKaloriMenuler((onceki) => onceki.filter((item) => item.id !== id));
  };

  const filtrelenmişYemekler = YEMEK_VERILERI.filter((y) =>
    y.isim.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <EkstraScreenLayout baslik="🍽️ İftar Kalori Takibi" geriDonHedef="AraclarMain">
      <View style={[ekstraStiller.bolum, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20`, borderWidth: 1 }]}>
        <View style={ekstraStiller.bolumHeader}>
          <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>İftar Menüsü</Text>
          <View style={styles.butonGrup}>
            <TouchableOpacity
              style={[ekstraStiller.ekleButonu, { marginRight: 8, backgroundColor: `${tema.vurgu}20` }]}
              onPress={() => setModalGorunur(true)}
            >
              <Text style={styles.butonEmoji}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ekstraStiller.ekleButonu, { backgroundColor: tema.vurgu }]} onPress={manuelEkle}>
              <Text style={[ekstraStiller.ekleButonuText, { color: '#000' }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {kaloriMenuler.length === 0 && (
          <Text style={[ekstraStiller.bilgiText, { color: tema.yaziRenkSoluk }]}>
            Yemek seçmek için 🔍, kendi yemeğinizi eklemek için + butonuna dokunun.
          </Text>
        )}

        <ScrollView style={styles.liste}>
          {kaloriMenuler.map((menu) => (
            <View key={menu.id} style={ekstraStiller.kaloriItem}>
              <TextInput
                style={[ekstraStiller.kaloriInput, styles.kaloriAd, { color: tema.yaziRenk, borderColor: tema.vurgu }]}
                placeholder="Yemek adı"
                placeholderTextColor={tema.yaziRenkSoluk}
                value={menu.isim}
                onChangeText={(value) => kaloriGuncelle(menu.id, 'isim', value)}
              />
              <TextInput
                style={[ekstraStiller.kaloriInput, styles.kaloriDeger, { color: tema.yaziRenk, borderColor: tema.vurgu }]}
                placeholder="kcal"
                placeholderTextColor={tema.yaziRenkSoluk}
                value={menu.kalori}
                onChangeText={(value) => kaloriGuncelle(menu.id, 'kalori', value)}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity style={[ekstraStiller.silButonu, { backgroundColor: tema.vurgu }]} onPress={() => kaloriSil(menu.id)}>
                <Text style={[ekstraStiller.silButonuText, { color: '#000' }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {toplamKalori > 0 && (
          <View style={[ekstraStiller.toplamKaloriKart, { backgroundColor: `${tema.vurgu}20`, borderColor: tema.vurgu }]}>
            <Text style={[ekstraStiller.toplamKaloriLabel, { color: tema.yaziRenk }]}>Toplam Kalori:</Text>
            <Text style={[ekstraStiller.toplamKaloriDeger, { color: tema.vurgu }]}>
              {toplamKalori.toLocaleString('tr-TR')} kcal
            </Text>
          </View>
        )}
      </View>

      {/* Yemek Seçme Modalı */}
      <Modal
        visible={modalGorunur}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGorunur(false)}
      >
        <View style={ekstraStiller.modalOverlay}>
          <View style={[ekstraStiller.modalContent, { maxHeight: '80%', backgroundColor: tema.arkaPlan, borderColor: tema.vurgu }]}>
            <Text style={[ekstraStiller.modalBaslik, { color: tema.yaziRenk }]}>Yemek Seçin</Text>

            <TextInput
              style={[ekstraStiller.input, { color: tema.yaziRenk, borderColor: tema.vurgu }]}
              placeholder="Yemek ara..."
              placeholderTextColor={tema.yaziRenkSoluk}
              value={aramaMetni}
              onChangeText={setAramaMetni}
            />

            <FlatList
              data={filtrelenmişYemekler}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.yemekSecenek, { borderBottomColor: `${tema.vurgu}20` }]}
                  onPress={() => listedenEkle(item)}
                >
                  <Text style={[styles.yemekSecenekAd, { color: tema.yaziRenk }]}>{item.isim}</Text>
                  <Text style={[styles.yemekSecenekKalori, { color: tema.vurgu }]}>{item.kalori} kcal</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.bosListeText, { color: tema.yaziRenkSoluk }]}>Yemek bulunamadı.</Text>
              }
            />

            <View style={ekstraStiller.modalButonlar}>
              <TouchableOpacity
                style={[ekstraStiller.modalButonu, ekstraStiller.iptalButonu, { backgroundColor: tema.vurgu }]}
                onPress={() => setModalGorunur(false)}
              >
                <Text style={[ekstraStiller.modalButonuText, { color: '#000' }]}>Çık</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </EkstraScreenLayout>
  );
}

const styles = StyleSheet.create({
  kaloriAd: {
    flex: 2,
  },
  kaloriDeger: {
    flex: 1,
    textAlign: 'center',
  },
  liste: {
    maxHeight: 400,
  },
  butonGrup: {
    flexDirection: 'row',
  },
  butonEmoji: {
    fontSize: 18,
  },
  yemekSecenek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  yemekSecenekAd: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.body,
  },
  yemekSecenekKalori: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.display,
  },
  bosListeText: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});
