import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { yukleBildirimAyarlari, kaydetBildirimAyarlari } from '../../utils/storage';
import { useBildirimler } from '../../hooks/useBildirimler';

interface SuHatirlaticiScreenProps {}

export default function SuHatirlaticiScreen(_props: SuHatirlaticiScreenProps) {
  const { bildirimleriAyarla } = useBildirimler();
  const [suHatirlatici, setSuHatirlatici] = useState(false);
  const [suIcmeAraligi, setSuIcmeAraligi] = useState('30');

  useEffect(() => {
    bildirimAyarlariniYukle();
  }, []);

  const bildirimAyarlariniYukle = async () => {
    try {
      const ayarlar = await yukleBildirimAyarlari();
      setSuHatirlatici(ayarlar.suIcmeHatirlaticiAktif || false);
      setSuIcmeAraligi(String(ayarlar.suIcmeAraligi || 30));
    } catch (error) {
      console.error('Bildirim ayarları yüklenirken hata:', error);
    }
  };

  const suHatirlaticiDegistir = async (aktif: boolean) => {
    try {
      setSuHatirlatici(aktif);
      const ayarlar = await yukleBildirimAyarlari();
      const guncellenmisAyarlar = {
        ...ayarlar,
        suIcmeHatirlaticiAktif: aktif,
        suIcmeAraligi: parseInt(suIcmeAraligi, 10) || 30,
      };
      await kaydetBildirimAyarlari(guncellenmisAyarlar);
      await bildirimleriAyarla();
      Alert.alert(
        'Başarılı',
        aktif ? 'Sahur su içme hatırlatıcısı aktif edildi.' : 'Sahur su içme hatırlatıcısı kapatıldı.'
      );
    } catch (error) {
      console.error('Bildirim ayarları kaydedilirken hata:', error);
      Alert.alert('Hata', 'Ayarlar kaydedilirken bir hata oluştu.');
    }
  };

  const suIcmeAraligiDegistir = async (aralik: string) => {
    try {
      const aralikNum = parseInt(aralik, 10);
      if (Number.isNaN(aralikNum) || aralikNum < 15 || aralikNum > 120) {
        Alert.alert('Hata', 'Aralık 15-120 dakika arasında olmalıdır.');
        return;
      }
      setSuIcmeAraligi(aralik);
      const ayarlar = await yukleBildirimAyarlari();
      const guncellenmisAyarlar = {
        ...ayarlar,
        suIcmeAraligi: aralikNum,
      };
      await kaydetBildirimAyarlari(guncellenmisAyarlar);
      if (suHatirlatici) {
        await bildirimleriAyarla();
      }
    } catch (error) {
      console.error('Bildirim ayarları kaydedilirken hata:', error);
    }
  };

  return (
    <EkstraScreenLayout baslik="💧 Su Hatırlatıcı">
      <View style={ekstraStiller.bolum}>
        <Text style={ekstraStiller.bolumBaslik}>Sahur Su İçme Hatırlatıcısı</Text>
        <Text style={ekstraStiller.bilgiText}>
          2026 Ramazan ayı için sahur saatlerinden önce su içme hatırlatıcıları. Sahur saatinden sonra hatırlatma yapılmaz.
        </Text>
        <View style={ekstraStiller.switchContainer}>
          <Text style={ekstraStiller.switchLabel}>Hatırlatıcıyı Aktif Et</Text>
          <Switch
            value={suHatirlatici}
            onValueChange={suHatirlaticiDegistir}
            trackColor={{
              false: 'rgba(255, 255, 255, 0.3)',
              true: ISLAMI_RENKLER.altinOrta,
            }}
            thumbColor={ISLAMI_RENKLER.yaziBeyaz}
          />
        </View>
        {suHatirlatici && (
          <View style={ekstraStiller.aralikContainer}>
            <Text style={ekstraStiller.switchLabel}>Hatırlatma Aralığı (dakika)</Text>
            <TextInput
              style={ekstraStiller.input}
              placeholder="30"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={suIcmeAraligi}
              onChangeText={setSuIcmeAraligi}
              onBlur={() => suIcmeAraligiDegistir(suIcmeAraligi)}
              keyboardType="number-pad"
            />
            <Text style={ekstraStiller.bilgiText}>
              Her {suIcmeAraligi} dakikada bir sahur saatinden önce hatırlatılacak (15-120 dakika arası).
            </Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}
