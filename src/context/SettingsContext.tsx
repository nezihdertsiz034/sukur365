import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UygulamaAyarlari, Sehir } from '../types';
import { yukleUygulamaAyarlari, kaydetUygulamaAyarlari, yukleSehir, kaydetSehir } from '../utils/storage';

interface SettingsContextType {
    uygulamaAyarlari: UygulamaAyarlari | null;
    sehir: Sehir | null;
    guncelleUygulamaAyarlari: (ayarlar: Partial<UygulamaAyarlari>) => Promise<void>;
    guncelleSehir: (sehir: Sehir) => Promise<void>;
    yaziBoyutuCarpani: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uygulamaAyarlari, setUygulamaAyarlari] = useState<UygulamaAyarlari | null>(null);
    const [sehir, setSehir] = useState<Sehir | null>(null);

    const verileriYukle = useCallback(async () => {
        try {
            const [ayarlar, sehirData] = await Promise.all([
                yukleUygulamaAyarlari(),
                yukleSehir()
            ]);
            setUygulamaAyarlari(ayarlar);
            setSehir(sehirData);
        } catch (error) {
            console.error('SettingsContext: Veriler yüklenirken hata:', error);
        }
    }, []);

    useEffect(() => {
        verileriYukle();
    }, [verileriYukle]);

    const guncelleUygulamaAyarlari = async (yeniAyarlar: Partial<UygulamaAyarlari>) => {
        if (!uygulamaAyarlari) return;
        try {
            const guncelAyarlar = { ...uygulamaAyarlari, ...yeniAyarlar };
            setUygulamaAyarlari(guncelAyarlar);
            await kaydetUygulamaAyarlari(guncelAyarlar);
        } catch (error) {
            console.error('SettingsContext: Ayarlar güncellenirken hata:', error);
        }
    };

    const guncelleSehir = async (yeniSehir: Sehir) => {
        try {
            setSehir(yeniSehir);
            await kaydetSehir(yeniSehir);
        } catch (error) {
            console.error('SettingsContext: Şehir güncellenirken hata:', error);
        }
    };

    // Yazı boyutu çarpanını hesapla
    const getCarpan = () => {
        if (!uygulamaAyarlari) return 1;
        switch (uygulamaAyarlari.yaziBoyutu) {
            case 'kucuk': return 0.85;
            case 'normal': return 1;
            case 'buyuk': return 1.15;
            case 'cokbuyuk': return 1.3;
            case 'dev': return 1.5;
            case 'yasli': return 1.8;
            default: return 1;
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                uygulamaAyarlari,
                sehir,
                guncelleUygulamaAyarlari,
                guncelleSehir,
                yaziBoyutuCarpani: getCarpan(),
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
