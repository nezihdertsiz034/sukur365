import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import HomeScreen from '../screens/HomeScreen';
import IstatistiklerScreen from '../screens/IstatistiklerScreen';
import DualarScreen from '../screens/DualarScreen';
import KuranAyetleriScreen from '../screens/KuranAyetleriScreen';
import NotlarScreen from '../screens/NotlarScreen';
import EkstraScreen from '../screens/EkstraScreen';
import AyarlarScreen from '../screens/AyarlarScreen';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();

/**
 * Drawer menü özel içeriği
 */
function CustomDrawerContent(props: any) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>📿 Oruç Zinciri</Text>
        <Text style={styles.drawerSubtitle}>2026 Ramazan</Text>
      </View>
      
      <View style={styles.drawerMenu}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Ana Sayfa')}
        >
          <Text style={styles.drawerItemText}>🏠 Ana Sayfa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('İstatistikler')}
        >
          <Text style={styles.drawerItemText}>📊 İstatistikler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Dualar')}
        >
          <Text style={styles.drawerItemText}>🤲 Dualar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Kur\'an Ayetleri')}
        >
          <Text style={styles.drawerItemText}>📖 Kur'an Ayetleri</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Notlar')}
        >
          <Text style={styles.drawerItemText}>📝 Notlar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Ekstra Özellikler')}
        >
          <Text style={styles.drawerItemText}>✨ Ekstra Özellikler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Ayarlar')}
        >
          <Text style={styles.drawerItemText}>⚙️ Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Ana navigasyon yapısı
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        useLegacyImplementation={true}
        screenOptions={{
          headerStyle: {
            backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
          },
          headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
          },
          drawerActiveTintColor: ISLAMI_RENKLER.altinAcik,
          drawerInactiveTintColor: ISLAMI_RENKLER.yaziBeyaz,
          // Reanimated sorununu geçici olarak çözmek için
          drawerType: 'front',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Drawer.Screen 
          name="Ana Sayfa" 
          component={HomeScreen}
          options={{ title: 'Ana Sayfa' }}
        />
        <Drawer.Screen 
          name="İstatistikler" 
          component={IstatistiklerScreen}
          options={{ title: 'İstatistikler' }}
        />
        <Drawer.Screen 
          name="Dualar" 
          component={DualarScreen}
          options={{ title: 'Dualar' }}
        />
        <Drawer.Screen 
          name="Kur'an Ayetleri" 
          component={KuranAyetleriScreen}
          options={{ title: 'Kur\'an Ayetleri' }}
        />
        <Drawer.Screen 
          name="Notlar" 
          component={NotlarScreen}
          options={{ title: 'Notlar' }}
        />
        <Drawer.Screen 
          name="Ekstra Özellikler" 
          component={EkstraScreen}
          options={{ title: 'Ekstra Özellikler' }}
        />
        <Drawer.Screen 
          name="Ayarlar" 
          component={AyarlarScreen}
          options={{ title: 'Ayarlar' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  drawerMenu: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    padding: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerItemText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '500',
  },
});
