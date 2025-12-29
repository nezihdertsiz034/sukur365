import AsyncStorage from '@react-native-async-storage/async-storage';
import { tarihToString } from './ramazanTarihleri';

const STORAGE_KEY = '@oruc_zinciri_2026';

/**
 * Tüm oruç verilerini yükler
 */
export async function yukleOrucVerileri(): Promise<Record<string, boolean>> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEY);
    if (veri) {
      return JSON.parse(veri);
    }
    return {};
  } catch (error) {
    console.error('Oruç verileri yüklenirken hata:', error);
    return {};
  }
}

/**
 * Belirli bir günün oruç durumunu kaydeder
 */
export async function kaydetOrucGunu(
  tarih: Date,
  isaretli: boolean
): Promise<void> {
  try {
    const mevcutVeri = await yukleOrucVerileri();
    const tarihString = tarihToString(tarih);
    mevcutVeri[tarihString] = isaretli;
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mevcutVeri));
  } catch (error) {
    console.error('Oruç günü kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir günün oruç durumunu getirir
 */
export async function getirOrucGunu(tarih: Date): Promise<boolean> {
  try {
    const veri = await yukleOrucVerileri();
    const tarihString = tarihToString(tarih);
    return veri[tarihString] === true;
  } catch (error) {
    console.error('Oruç günü getirilirken hata:', error);
    return false;
  }
}

/**
 * Tüm oruç verilerini temizler (reset)
 */
export async function temizleOrucVerileri(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Oruç verileri temizlenirken hata:', error);
    throw error;
  }
}

/**
 * Toplam işaretlenmiş gün sayısını getirir
 */
export async function getirToplamIsaretliGun(): Promise<number> {
  try {
    const veri = await yukleOrucVerileri();
    return Object.values(veri).filter(Boolean).length;
  } catch (error) {
    console.error('Toplam işaretli gün getirilirken hata:', error);
    return 0;
  }
}
