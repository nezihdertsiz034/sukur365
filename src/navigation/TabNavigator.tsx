import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useTheme } from '../hooks/useTheme';

// Ekranlar
import HomeScreen from '../screens/HomeScreen';
import IstatistiklerScreen from '../screens/IstatistiklerScreen';
import TesbihScreen from '../screens/TesbihScreen';
import DualarScreen from '../screens/DualarScreen';
import KuranAyetleriScreen from '../screens/KuranAyetleriScreen';
import PeygamberHayatiScreen from '../screens/PeygamberHayatiScreen';
import EsmaulHusnaScreen from '../screens/EsmaulHusnaScreen';
import AraclarScreen from '../screens/AraclarScreen';
import AyarlarScreen from '../screens/AyarlarScreen';
import NotlarScreen from '../screens/NotlarScreen';
import WidgetScreen from '../screens/WidgetScreen';
import QuranScreen from '../screens/QuranScreen';
import AIDuaScreen from '../screens/AIDuaScreen';
import BildirimTestScreen from '../screens/Ayarlar/BildirimTestScreen';

// Ekstra ekranlar
import ZekatScreen from '../screens/ekstra/ZekatScreen';
import FitreScreen from '../screens/ekstra/FitreScreen';
import IftarKaloriScreen from '../screens/ekstra/IftarKaloriScreen';
import KibleScreen from '../screens/ekstra/KibleScreen';
import TeravihScreen from '../screens/ekstra/TeravihScreen';
import SadakaScreen from '../screens/ekstra/SadakaScreen';
import SuHatirlaticiScreen from '../screens/ekstra/SuHatirlaticiScreen';
import IftarMenuOnerileriScreen from '../screens/ekstra/IftarMenuOnerileriScreen';
import KazaTakibiScreen from '../screens/ekstra/KazaTakibiScreen';

// Ionicons İsimleri
const TAB_ICONS = {
    ana: { active: 'home', inactive: 'home-outline' },
    takip: { active: 'stats-chart', inactive: 'stats-chart-outline' },
    kuran: { active: 'book', inactive: 'book-outline' },
    araclar: { active: 'grid', inactive: 'grid-outline' },
    ayarlar: { active: 'settings', inactive: 'settings-outline' },
} as const;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab ikonu component
interface TabIconProps {
    name: any;
    focused: boolean;
}

const TabIcon = ({ name, focused }: TabIconProps) => {
    const tema = useTheme();
    const iconName = focused ? TAB_ICONS[name as keyof typeof TAB_ICONS].active : TAB_ICONS[name as keyof typeof TAB_ICONS].inactive;

    return (
        <View style={styles.tabIconContainer}>
            <Ionicons
                name={iconName as any}
                size={26}
                color={focused ? tema.vurgu : ISLAMI_RENKLER.yaziBeyazYumusak}
            />
            {focused && (
                <View style={[styles.activeDot, { backgroundColor: tema.vurgu }]} />
            )}
        </View>
    );
};

// Ana Sayfa Stack
function AnaSayfaStack() {
    const tema = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: tema.arkaPlan },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="AnaSayfaMain"
                component={HomeScreen}
                options={{ title: '📿 Şükür365' }}
            />
        </Stack.Navigator>
    );
}

// Takip Stack
function TakipStack() {
    const tema = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: tema.arkaPlan },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="IstatistiklerMain"
                component={IstatistiklerScreen}
                options={{ title: '📊 İstatistikler' }}
            />
            <Stack.Screen
                name="TesbihSayaci"
                component={TesbihScreen}
                options={{ title: '📿 Tesbih Sayacı' }}
            />
        </Stack.Navigator>
    );
}

// Kur'an Stack
function KuranStack() {
    const tema = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: tema.arkaPlan },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="KuranMain"
                component={QuranScreen}
                options={{ title: '📖 Kur\'an-ı Kerim', headerShown: false }}
            />
            <Stack.Screen
                name="Dualar"
                component={DualarScreen}
                options={{ title: '🤲 Dualar' }}
            />
            <Stack.Screen
                name="AIDua"
                component={AIDuaScreen}
                options={{ title: '✨ AI Dua Asistanı' }}
            />
            <Stack.Screen
                name="KuranAyetleri"
                component={KuranAyetleriScreen}
                options={{ title: '📖 Kur\'an Ayetleri' }}
            />
            <Stack.Screen
                name="PeygamberHayati"
                component={PeygamberHayatiScreen}
                options={{ title: '☪️ Hz. Muhammed (S.A.V.)' }}
            />
            <Stack.Screen
                name="EsmaulHusna"
                component={EsmaulHusnaScreen}
                options={{ title: '☪️ Esmaül Hüsna' }}
            />
            <Stack.Screen
                name="TesbihSayaciIbadet"
                component={TesbihScreen}
                options={{ title: '📿 Tesbih Sayacı' }}
            />
        </Stack.Navigator>
    );
}

// Araçlar Stack
function AraclarStack() {
    const tema = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: tema.arkaPlan },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="AraclarMain"
                component={AraclarScreen}
                options={{ title: '🛠️ Araçlar' }}
            />
            <Stack.Screen name="Zekat" component={ZekatScreen} options={{ title: '💰 Zekat' }} />
            <Stack.Screen name="Fitre" component={FitreScreen} options={{ title: '🌾 Fitre' }} />
            <Stack.Screen name="İftar Kalori" component={IftarKaloriScreen} options={{ title: '🍽️ İftar Kalori' }} />
            <Stack.Screen name="Kıble" component={KibleScreen} options={{ title: '🧭 Kıble' }} />
            <Stack.Screen name="Teravih" component={TeravihScreen} options={{ title: '🕌 Teravih' }} />
            <Stack.Screen name="Sadaka" component={SadakaScreen} options={{ title: '💝 Sadaka' }} />
            <Stack.Screen name="Su Hatırlatıcı" component={SuHatirlaticiScreen} options={{ title: '💧 Su Hatırlatıcı' }} />
            <Stack.Screen name="İftar Menü Önerileri" component={IftarMenuOnerileriScreen} options={{ title: '💡 Menü Önerileri' }} />
            <Stack.Screen name="Kaza Takibi" component={KazaTakibiScreen} options={{ title: '📊 Kaza Takibi' }} />
            <Stack.Screen name="Notlar" component={NotlarScreen} options={{ title: '📝 Notlar' }} />
            <Stack.Screen name="Ana Ekran Widget" component={WidgetScreen} options={{ title: '🧩 Widget' }} />
        </Stack.Navigator>
    );
}

// Daha Fazla Stack
function DahaFazlaStack() {
    const tema = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: tema.arkaPlan },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="AyarlarMain"
                component={AyarlarScreen}
                options={{ title: '⚙️ Ayarlar' }}
            />
            <Stack.Screen
                name="BildirimTest"
                component={BildirimTestScreen}
                options={{ title: '🔔 Bildirim Testi' }}
            />
        </Stack.Navigator>
    );
}

// Ana Tab Navigator
export default function TabNavigator() {
    const insets = useSafeAreaInsets();
    const tema = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: Platform.OS === 'ios' ? 88 : 70 + insets.bottom,
                        paddingBottom: Platform.OS === 'ios' ? 32 : insets.bottom + 10,
                        backgroundColor: tema.arkaPlan,
                        borderTopColor: `${tema.vurgu}33`,
                    }
                ],
                tabBarActiveTintColor: tema.vurgu,
                tabBarInactiveTintColor: ISLAMI_RENKLER.yaziBeyazYumusak,
                tabBarLabelStyle: styles.tabLabel,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name="Ana"
                component={AnaSayfaStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="ana" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Takip"
                component={TakipStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="takip" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Kur'an"
                component={KuranStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="kuran" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Araçlar"
                component={AraclarStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="araclar" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Ayarlar"
                component={DahaFazlaStack}
                options={{
                    tabBarLabel: 'Ayarlar',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="ayarlar" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4, // Daha düşük ve verimli bir elevation
            },
        }),
    },
    tabLabel: {
        fontSize: 11,
        fontFamily: TYPOGRAPHY.body,
        fontWeight: '600',
        marginTop: -4,
    },
    tabIconContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDot: {
        position: 'absolute',
        bottom: -2,
        width: 4,
        height: 4,
        borderRadius: 2,
    }
});
