import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { TYPOGRAPHY } from '../../constants/typography';
import { useKazaTakibi, KazaData } from '../../hooks/useKazaTakibi';
import { ekstraStiller } from './ekstraStyles';

const KazaItem = ({
    label,
    value,
    onIncrement,
    onDecrement,
    icon,
    tema,
}: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    icon: string;
    tema: any;
}) => (
    <View style={[stiller.kazaKart, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.08)' }]}>
        <View style={stiller.kazaSol}>
            <View style={[stiller.iconDaire, { backgroundColor: `${tema.vurgu}20` }]}>
                <Ionicons name={icon as any} size={22} color={tema.vurgu} />
            </View>
            <Text style={[stiller.kazaLabel, { color: tema.yaziRenk }]}>{label}</Text>
        </View>

        <View style={stiller.kazaSag}>
            <TouchableOpacity
                style={[stiller.buton, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.15)' }]}
                onPress={onDecrement}
                activeOpacity={0.7}
            >
                <Ionicons name="remove" size={24} color={tema.yaziRenk} />
            </TouchableOpacity>

            <View style={stiller.sayiKonteyner}>
                <Text style={[stiller.sayiText, { color: tema.yaziRenk }]}>{value}</Text>
            </View>

            <TouchableOpacity
                style={[stiller.buton, stiller.artirButon, { backgroundColor: tema.vurgu }]}
                onPress={onIncrement}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function KazaTakibiScreen() {
    const { data, updateKaza, resetAll } = useKazaTakibi();
    const tema = useTheme();

    const handleReset = () => {
        Alert.alert(
            'Sıfırla',
            'Tüm kaza verilerini sıfırlamak istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                { text: 'Sıfırla', style: 'destructive', onPress: resetAll },
            ]
        );
    };

    const kazaTipleri: { key: keyof KazaData; label: string; icon: string }[] = [
        { key: 'sabah', label: 'Sabah Namazı', icon: 'sunny-outline' },
        { key: 'ogle', label: 'Öğle Namazı', icon: 'partly-sunny-outline' },
        { key: 'ikindi', label: 'İkindi Namazı', icon: 'cloud-outline' },
        { key: 'aksam', label: 'Akşam Namazı', icon: 'moon-outline' },
        { key: 'yatsi', label: 'Yatsı Namazı', icon: 'star-outline' },
        { key: 'vitir', label: 'Vitir Namazı', icon: 'sparkles-outline' },
        { key: 'oruc', label: 'Kaza Orucu', icon: 'restaurant-outline' },
    ];

    return (
        <SafeAreaView style={[stiller.container, { backgroundColor: tema.arkaPlan }]}>
            <StatusBar barStyle={tema.isDark ? "light-content" : "dark-content"} />
            <ScrollView contentContainerStyle={stiller.scrollContent}>

                <View style={ekstraStiller.bolum}>
                    <View style={ekstraStiller.bolumHeader}>
                        <Text style={[ekstraStiller.bolumBaslik, { color: tema.yaziRenk }]}>İbadet Borçlarım</Text>
                        <TouchableOpacity onPress={handleReset} style={stiller.temizleButon}>
                            <Ionicons name="trash-outline" size={20} color={tema.yaziRenkSoluk} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[stiller.aciklama, { color: tema.yaziRenkSoluk }]}>
                        Kılamadığınız namazları ve tutamadığınız oruçları buradan takip edebilirsiniz.
                    </Text>

                    <View style={stiller.liste}>
                        {kazaTipleri.map((tip) => (
                            <KazaItem
                                key={tip.key}
                                label={tip.label}
                                value={data[tip.key]}
                                icon={tip.icon}
                                tema={tema}
                                onIncrement={() => updateKaza(tip.key, 1)}
                                onDecrement={() => updateKaza(tip.key, -1)}
                            />
                        ))}
                    </View>
                </View>

                <View style={[stiller.bilgiKutusu, { backgroundColor: `${tema.vurgu}10`, borderColor: `${tema.vurgu}33` }]}>
                    <Ionicons name="information-circle-outline" size={20} color={tema.vurgu} />
                    <Text style={[stiller.bilgiMetni, { color: tema.yaziRenkSoluk }]}>
                        "Namaz, müminin nuru, gözünün süruru ve gönlünün huzurudur." Kaza borçlarınızı bitirmek için günlük küçük hedefler koyabilirsiniz.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const stiller = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    aciklama: {
        color: ISLAMI_RENKLER.yaziBeyazAcik,
        fontSize: 14,
        fontFamily: TYPOGRAPHY.body,
        marginBottom: 20,
        lineHeight: 20,
    },
    liste: {
        gap: 12,
    },
    kazaKart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    kazaSol: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconDaire: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(218, 165, 32, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    kazaLabel: {
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontSize: 15,
        fontWeight: '600',
        fontFamily: TYPOGRAPHY.body,
    },
    kazaSag: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    artirButon: {
        backgroundColor: ISLAMI_RENKLER.altinOrta,
    },
    sayiKonteyner: {
        minWidth: 50,
        alignItems: 'center',
    },
    sayiText: {
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: TYPOGRAPHY.display,
    },
    temizleButon: {
        padding: 4,
    },
    bilgiKutusu: {
        flexDirection: 'row',
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.2)',
    },
    bilgiMetni: {
        flex: 1,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontSize: 13,
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 18,
        fontStyle: 'italic',
    }
});
