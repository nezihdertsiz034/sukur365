import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Manevi Huzura Yolculuk',
        description: 'İbadetlerini modern ve huzurlu bir tasarım eşliğinde takip et, maneviyatını güçlendir.',
        icon: '🕌',
        image: require('../../assets/icons/medine.png'),
    },
    {
        id: '2',
        title: "Duygu Analizi (Mood Tracker)",
        description: "Ruh halinize uygun ayet, dua ve esmalar keşfedin. Maneviyatınızı güncel tutun.",
        icon: '✨',
        image: require('../../assets/icons/mood_peaceful.png'),
    },
    {
        id: '3',
        title: '3D Kıble Pusulası',
        description: 'Gelişmiş pusula ile Kıbleyi en hassas şekilde bulun. Görsel derinlikle ibadetinizi kolaylaştırın.',
        icon: '🧭',
        image: require('../../assets/icons/kible.png'),
    },
    {
        id: '4',
        title: 'Her An Yanınızda',
        description: 'Notlar, hatim takibi ve zikirmatik gibi ihtiyacınız olan tüm araçlar tek bir noktada.',
        icon: '🛠️',
        image: require('../../assets/icons/menu.png'),
    },
];

interface OnboardingScreenProps {
    onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            onComplete();
        }
    };

    const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                    <View style={styles.iconCircle}>
                        <Text style={styles.icon}>{item.icon}</Text>
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <BackgroundDecor />

            <SafeAreaView style={styles.safeArea}>
                <FlatList
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />

                <View style={styles.footer}>
                    <View style={styles.paginator}>
                        {ONBOARDING_DATA.map((_, i) => {
                            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [10, 20, 10],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });
                            return (
                                <Animated.View
                                    style={[styles.dot, { width: dotWidth, opacity }]}
                                    key={i.toString()}
                                />
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Başlayalım' : 'Sonraki'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    slide: {
        width: width,
        flex: 1,
        alignItems: 'center',
        padding: 40,
        justifyContent: 'center',
    },
    imageContainer: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: (width * 0.7) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    image: {
        width: '60%',
        height: '60%',
    },
    iconCircle: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#DAA520',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1B5E20',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    icon: {
        fontSize: 30,
    },
    textContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
        borderRadius: 20,
        width: width * 0.85,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: TYPOGRAPHY.display,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowRadius: 10,
    },
    description: {
        fontSize: 16,
        color: '#F5F5F5',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: TYPOGRAPHY.body,
    },
    footer: {
        paddingHorizontal: 40,
        paddingBottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paginator: {
        flexDirection: 'row',
        height: 64,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DAA520',
        marginHorizontal: 4,
        marginTop: 27,
    },
    button: {
        backgroundColor: '#DAA520',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#0A3D2E',
        fontSize: 18,
        fontWeight: '700',
    },
});
