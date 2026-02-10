import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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
        color: '#2C2C54', // Deep purple
    },
    {
        id: '4',
        title: 'Ready to Play?',
        description: 'Each level gets progressively harder. Can you master all the themes? Let\'s get started!',
        emoji: '🚀',
        color: '#1A1A2E', // Back to dark navy
    },
];

interface OnboardingScreenProps {
    onComplete: () => void;
}

const VIEW_AREA_COVERAGE_THRESHOLD = 50;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;
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

    const renderSlide = ({ item }: { item: OnboardingSlide }) => (
        <View style={[styles.slide, { backgroundColor: item.color }]}>
            <View style={styles.contentContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={slides}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                showsHorizontalScrollIndicator={false}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, index) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    width: dotWidth,
                                    opacity,
                                },
                            ]}
                        />
                    );
                })}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                {currentIndex < slides.length - 1 && (
                    <TouchableOpacity
                        onPress={skipToEnd}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={scrollToNext}
                    style={styles.nextButton}
                >
                    <Text style={styles.nextText}>
                        {currentIndex === slides.length - 1 ? "Let's Play!" : 'Next'}
                    </Text>
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
    slide: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -100,
    },
    emoji: {
        fontSize: 100,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    skipButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    skipText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nextText: {
        color: '#1A1A2E',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
