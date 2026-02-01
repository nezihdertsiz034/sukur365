import { useMemo } from 'react';
import { TEMA_RENKLERI } from '../constants/renkler';
import { useSettings } from '../context/SettingsContext';

/**
 * Günün vaktine göre veya kullanıcı tercihine göre dinamik tema sağlayan hook
 */
export const useTheme = (testSaat?: number | null) => {
    const { uygulamaAyarlari } = useSettings();

    const tema = useMemo(() => {
        const temaTercih = uygulamaAyarlari?.temaTercih || 'otomatik';
        const saat = testSaat !== null && testSaat !== undefined ? testSaat : new Date().getHours();

        let currentTheme;
        let isDark = false;

        // Manuel tercih kontrolü
        if (temaTercih === 'gece') {
            currentTheme = TEMA_RENKLERI.GECE;
            isDark = true;
        } else if (temaTercih === 'gunduz') {
            currentTheme = TEMA_RENKLERI.GUN;
            isDark = false;
        } else {
            // Otomatik (Saat bazlı) mantık
            if (saat >= 6 && saat < 11) currentTheme = TEMA_RENKLERI.SABAH;
            else if (saat >= 11 && saat < 18) currentTheme = TEMA_RENKLERI.GUN;
            else if (saat >= 18 && saat < 22) currentTheme = TEMA_RENKLERI.AKSAM;
            else currentTheme = TEMA_RENKLERI.GECE;

            isDark = saat >= 18 || saat < 6;
        }

        return {
            ...currentTheme,
            yaziRenk: isDark ? '#FFFFFF' : '#042C21',
            yaziRenkSoluk: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(4, 44, 33, 0.7)',
            isDark
        };
    }, [testSaat, uygulamaAyarlari?.temaTercih]);

    return tema;
};
