import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Share,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';

import { generateAIDua } from '../services/aiService';

export default function AIDuaScreen() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedDua, setGeneratedDua] = useState<null | { arabic?: string; turkish: string }>(null);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const generateDua = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setGeneratedDua(null);
        setError(null);
        fadeAnim.setValue(0);

        try {
            const result = await generateAIDua(prompt);
            setGeneratedDua(result);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } catch (err: any) {
            setError(err.message || 'Dua üretilirken bir sorun oluştu.');
            console.error('Dua üretilirken hata:', err);
        } finally {
            setLoading(false);
        }
    };

    const shareDua = async () => {
        if (!generatedDua) return;
        try {
            await Share.share({
                message: `${generatedDua.turkish}\n\n(Şükür365 AI Dua Asistanı ile hazırlandı)`,
            });
        } catch (error) {
            console.error('Paylaşım hatası:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundDecor />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="sparkles" size={40} color={ISLAMI_RENKLER.altinAcik} />
                        </View>
                        <Text style={styles.title}>AI Dua Asistanı</Text>
                        <Text style={styles.subtitle}>
                            Gönlünüzden geçenleri yazın, sizin için samimi bir dua hazırlayalım.
                        </Text>
                    </View>

                    <View style={styles.inputCard}>
                        <TextInput
                            style={styles.input}
                            placeholder="Örn: Sınavım için başarı diliyorum, hastayım şifa istiyorum..."
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            multiline
                            numberOfLines={4}
                            value={prompt}
                            onChangeText={setPrompt}
                        />
                        <TouchableOpacity
                            style={[styles.generateButton, !prompt.trim() && styles.disabledButton]}
                            onPress={generateDua}
                            disabled={loading || !prompt.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color={ISLAMI_RENKLER.yaziBeyaz} />
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>Duayı Hazırla</Text>
                                    <Ionicons name="send" size={20} color={ISLAMI_RENKLER.yaziBeyaz} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {error && (
                        <View style={styles.errorCard}>
                            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {generatedDua && (
                        <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
                            <LinearGradient
                                colors={['rgba(218, 165, 32, 0.15)', 'rgba(218, 165, 32, 0.05)']}
                                style={styles.gradient}
                            >
                                {generatedDua.arabic && (
                                    <Text style={styles.arabicText}>{generatedDua.arabic}</Text>
                                )}
                                <Text style={styles.turkishText}>{generatedDua.turkish}</Text>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity style={styles.actionButton} onPress={shareDua}>
                                        <Ionicons name="share-social" size={24} color={ISLAMI_RENKLER.altinAcik} />
                                        <Text style={styles.actionText}>Paylaş</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton} onPress={() => setGeneratedDua(null)}>
                                        <Ionicons name="refresh" size={24} color={ISLAMI_RENKLER.altinAcik} />
                                        <Text style={styles.actionText}>Yeni Dua</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.3)',
    },
    title: {
        fontSize: 28,
        fontFamily: TYPOGRAPHY.display,
        color: ISLAMI_RENKLER.yaziBeyaz,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: TYPOGRAPHY.body,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        textAlign: 'center',
        lineHeight: 22,
    },
    inputCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 24,
    },
    input: {
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontSize: 16,
        fontFamily: TYPOGRAPHY.body,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    generateButton: {
        backgroundColor: ISLAMI_RENKLER.altinOrta,
        borderRadius: 15,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontSize: 18,
        fontFamily: TYPOGRAPHY.display,
        fontWeight: 'bold',
    },
    resultCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.3)',
        marginBottom: 40,
    },
    gradient: {
        padding: 24,
    },
    arabicText: {
        fontSize: 24,
        color: ISLAMI_RENKLER.altinAcik,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: Platform.OS === 'ios' ? 'Traditional Arabic' : 'serif',
        lineHeight: 40,
    },
    turkishText: {
        fontSize: 18,
        color: ISLAMI_RENKLER.yaziBeyaz,
        textAlign: 'center',
        lineHeight: 28,
        fontFamily: TYPOGRAPHY.body,
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: 20,
    },
    actionButton: {
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        color: ISLAMI_RENKLER.altinAcik,
        fontSize: 12,
        fontFamily: TYPOGRAPHY.body,
    },
    errorCard: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        fontFamily: TYPOGRAPHY.body,
        flex: 1,
    },
});
