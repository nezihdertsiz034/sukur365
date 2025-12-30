import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from './BackgroundDecor';

interface EkstraScreenLayoutProps {
  baslik?: string;
  gosterBaslik?: boolean;
  children: React.ReactNode;
}

export function EkstraScreenLayout({
  baslik,
  gosterBaslik = true,
  children,
}: EkstraScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {gosterBaslik && baslik ? (
          <Text style={styles.title}>{baslik}</Text>
        ) : (
          <View style={styles.baslikBosluk} />
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.4,
  },
  baslikBosluk: {
    height: 12,
  },
});
