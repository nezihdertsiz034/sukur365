import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Alert } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ekstraStiller } from './ekstraStyles';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { yukleBildirimAyarlari, kaydetBildirimAyarlari } from '../../utils/storage';
import { useBildirimler } from '../../hooks/useBildirimler';
import { useTheme } from '../../hooks/useTheme';

interface SuHatirlaticiScreenProps { }

export default function SuHatirlaticiScreen(_props: SuHatirlaticiScreenProps) {
  const { bildirimleriAyarla } = useBildirimler();
  const [suHatirlatici, setSuHatirlatici] = useState(false);
  const [suIcmeAraligi, setSuIcmeAraligi] = useState('30');
  const tema = useTheme();

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
    <EkstraScreenLayout baslik="💧 Su Hatırlatıcı" geriDonHedef="AraclarMain">
      <View style={[ekstraStiller.bolum, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20`, borderWidth: 1 }]}>
        <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>Sahur Su İçme Hatırlatıcısı</Text>
        <Text style={[ekstraStiller.bilgiText, { color: tema.yaziRenkSoluk }]}>
          2026 Ramazan ayı için sahur saatlerinden önce su içme hatırlatıcıları. Sahur saatinden sonra hatırlatma yapılmaz.
        </Text>
        <View style={ekstraStiller.switchContainer}>
          <Text style={[ekstraStiller.switchLabel, { color: tema.yaziRenk }]}>Hatırlatıcıyı Aktif Et</Text>
          <Switch
            value={suHatirlatici}
            onValueChange={suHatirlaticiDegistir}
            trackColor={{
              false: 'rgba(255, 255, 255, 0.3)',
              true: tema.vurgu,
            }}
            thumbColor={tema.isik}
          />
        </View>
        {suHatirlatici && (
          <View style={ekstraStiller.aralikContainer}>
            <Text style={[ekstraStiller.switchLabel, { color: tema.yaziRenk }]}>Hatırlatma Aralığı (dakika)</Text>
            <TextInput
              style={[ekstraStiller.input, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)', borderColor: `${tema.vurgu}20`, color: tema.yaziRenk }]}
              placeholder="30"
              placeholderTextColor={tema.yaziRenkSoluk}
              value={suIcmeAraligi}
              onChangeText={setSuIcmeAraligi}
              onBlur={() => suIcmeAraligiDegistir(suIcmeAraligi)}
              keyboardType="number-pad"
            />
            <Text style={[ekstraStiller.bilgiText, { color: tema.yaziRenkSoluk }]}>
              Her {suIcmeAraligi} dakikada bir sahur saatinden önce hatırlatılacak (15-120 dakika arası).
            </Text>
          </View>
        )}
      </View>
    </EkstraScreenLayout>
  );
}
