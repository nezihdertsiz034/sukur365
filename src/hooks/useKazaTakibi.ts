import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = 'sukur365_kaza_data';

export interface KazaData {
    sabah: number;
    ogle: number;
    ikindi: number;
    aksam: number;
    yatsi: number;
    vitir: number;
    oruc: number;
}

const initialData: KazaData = {
    sabah: 0,
    ogle: 0,
    ikindi: 0,
    aksam: 0,
    yatsi: 0,
    vitir: 0,
    oruc: 0,
};

export const useKazaTakibi = () => {
    const [data, setData] = useState<KazaData>(initialData);
    const [loading, setLoading] = useState(true);

    // Verileri yükle
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedData) {
                setData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error('Kaza verileri yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (newData: KazaData) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (error) {
            console.error('Kaza verileri kaydedilirken hata:', error);
        }
    };

    const updateKaza = (type: keyof KazaData, amount: number) => {
        const newValue = Math.max(0, data[type] + amount);
        const newData = { ...data, [type]: newValue };
        setData(newData);
        saveData(newData);

        // Titreşim geribildirimi
        if (amount > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (amount < 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const resetAll = () => {
        setData(initialData);
        saveData(initialData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const setKazaValue = (type: keyof KazaData, value: number) => {
        const newData = { ...data, [type]: Math.max(0, value) };
        setData(newData);
        saveData(newData);
    };

    return {
        data,
        loading,
        updateKaza,
        setKazaValue,
        resetAll,
    };
};
