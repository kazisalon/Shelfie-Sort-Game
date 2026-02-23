import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    withRepeat,
    withTiming,
    withSequence,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    emoji: string;
    color: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Welcome to Shelfie Sort!',
        description: 'Organize items on shelves and match 3 identical items to clear them. Simple, fun, and addictive!',
        emoji: '🎮',
        color: '#1A1A2E',
    },
    {
        id: '2',
        title: 'Drag & Drop',
        description: 'Drag items between shelves to organize them. Group 3 identical items together to make them disappear!',
        emoji: '🎯',
        color: '#16213E',
    },
    {
        id: '3',
        title: 'Earn Rewards',
        description: 'Complete levels to earn coins! Use coins to unlock beautiful themes and decorations.',
        emoji: '💰',
        color: '#2C2C54',
    },
    {
        id: '4',
        title: 'Ready to Play?',
        description: "Each level gets progressively harder. Can you master all the themes? Let's get started!",
        emoji: '🚀',
        color: '#1A1A2E',
    },
];

interface OnboardingScreenProps {
    onComplete: () => void;
}

const BackgroundParticle = ({ delay = 0, size = 100, x = 0, y = 0 }) => {
    const translateY = useSharedValue(y);
    const translateX = useSharedValue(x);
    const opacity = useSharedValue(0.1);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(y - 50, { duration: 4000 + Math.random() * 2000 }),
                withTiming(y + 50, { duration: 4000 + Math.random() * 2000 })
            ),
            -1,
            true
        );
        translateX.value = withRepeat(
            withSequence(
                withTiming(x + 30, { duration: 3000 + Math.random() * 2000 }),
                withTiming(x - 30, { duration: 3000 + Math.random() * 2000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                { width: size, height: size, borderRadius: size / 2 },
                animatedStyle
            ]}
        />
    );
};

const VIEW_AREA_COVERAGE_THRESHOLD = 50;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollX = useSharedValue(0);
    const slidesRef = useRef<FlatList<OnboardingSlide>>(null);

    const viewableItemsChanged = useRef((viewableInfo: { viewableItems: Array<{ index: number | null }> }) => {
        if (viewableInfo.viewableItems && viewableInfo.viewableItems.length > 0) {
            const index = viewableInfo.viewableItems[0].index;
            if (index !== null) {
                setCurrentIndex(index);
            }
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: VIEW_AREA_COVERAGE_THRESHOLD }).current;

    const scrollToNext = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({
                index: currentIndex + 1,
            });
        } else {
            onComplete();
        }
    };

    const skipToEnd = () => {
        onComplete();
    };

    const renderSlide = ({ item, index }: { item: OnboardingSlide, index: number }) => {
        return (
            <View style={[styles.slide, { backgroundColor: item.color }]}>
                <View style={styles.contentContainer}>
                    <Animated.Text
                        entering={FadeInDown.delay(100).duration(800)}
                        style={styles.emoji}
                    >
                        {item.emoji}
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(300).duration(800)}
                        style={styles.title}
                    >
                        {item.title}
                    </Animated.Text>
                    <Animated.Text
                        entering={FadeInDown.delay(500).duration(800)}
                        style={styles.description}
                    >
                        {item.description}
                    </Animated.Text>
                </View>
            </View>
        );
    };

    const Pagination = () => {
        return (
            <View style={styles.pagination}>
                {slides.map((_, index) => {
                    const animatedDotStyle = useAnimatedStyle(() => {
                        const width = interpolate(
                            scrollX.value,
                            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                            [8, 20, 8],
                            Extrapolate.CLAMP
                        );
                        const opacity = interpolate(
                            scrollX.value,
                            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                            [0.3, 1, 0.3],
                            Extrapolate.CLAMP
                        );
                        return { width, opacity };
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[styles.dot, animatedDotStyle]}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Background Decorations */}
            <BackgroundParticle size={200} x={-50} y={100} />
            <BackgroundParticle size={150} x={SCREEN_WIDTH - 100} y={SCREEN_HEIGHT / 2} />
            <BackgroundParticle size={100} x={50} y={SCREEN_HEIGHT - 200} />

            <Animated.FlatList
                data={slides}
                renderItem={(info) => renderSlide({ ...info, index: info.index })}
                horizontal
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={(event) => {
                    scrollX.value = event.nativeEvent.contentOffset.x;
                }}
                scrollEventThrottle={16}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                showsHorizontalScrollIndicator={false}
            />

            <Pagination />

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                {currentIndex < slides.length - 1 ? (
                    <TouchableOpacity
                        onPress={skipToEnd}
                        style={styles.skipButton}
                        activeOpacity={0.6}
                    >
                        <Animated.Text
                            entering={FadeInUp.delay(800)}
                            style={styles.skipText}
                        >
                            Skip
                        </Animated.Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.skipButton} />
                )}

                <TouchableOpacity
                    onPress={scrollToNext}
                    style={styles.nextButton}
                    activeOpacity={0.8}
                >
                    <Animated.Text
                        entering={FadeInUp.delay(800)}
                        style={styles.nextText}
                    >
                        {currentIndex === slides.length - 1 ? "Let's Play!" : 'Next'}
                    </Animated.Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    particle: {
        position: 'absolute',
        backgroundColor: '#FFD700',
        zIndex: 0,
    },
    slide: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -100,
        zIndex: 1,
    },
    emoji: {
        fontSize: 100,
        marginBottom: 30,
        textShadowColor: 'rgba(255, 215, 0, 0.4)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    description: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 28,
        maxWidth: 300,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 140,
        alignSelf: 'center',
        zIndex: 2,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        zIndex: 2,
    },
    skipButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    skipText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        paddingHorizontal: 35,
        borderRadius: 30,
        minWidth: 140,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    nextText: {
        color: '#1A1A2E',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default OnboardingScreen;

