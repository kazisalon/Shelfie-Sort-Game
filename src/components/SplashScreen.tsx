import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const shelfAnim = useRef(new Animated.Value(-50)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(-width)).current;

    // Individual item animations
    const item1Scale = useRef(new Animated.Value(0)).current;
    const item2Scale = useRef(new Animated.Value(0)).current;
    const item3Scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Complex staggered animation sequence
        Animated.sequence([
            // Fade in background
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // Title and shelf appear
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 40,
                    friction: 6,
                    useNativeDriver: true,
                }),
                Animated.spring(shelfAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]),
            // Items pop in one by one
            Animated.stagger(100, [
                Animated.spring(item1Scale, {
                    toValue: 1,
                    tension: 100,
                    friction: 5,
                    useNativeDriver: true,
                }),
                Animated.spring(item2Scale, {
                    toValue: 1,
                    tension: 100,
                    friction: 5,
                    useNativeDriver: true,
                }),
                Animated.spring(item3Scale, {
                    toValue: 1,
                    tension: 100,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Continuous glow pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Shimmer effect
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: width * 2,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                onFinish();
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Gradient Background Layers */}
            <View style={styles.gradientTop} />
            <View style={styles.gradientMiddle} />
            <View style={styles.gradientBottom} />

            {/* Shimmer overlay */}
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX: shimmerAnim }],
                    },
                ]}
            />

            {/* Main Content with Glow */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Glow effect behind title */}
                <Animated.View
                    style={[
                        styles.titleGlow,
                        { opacity: glowOpacity },
                    ]}
                />

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>SHELFIE</Text>
                    <Text style={[styles.title, styles.titleAccent]}>SORT</Text>
                </View>

                {/* Premium Shelf with Items */}
                <Animated.View
                    style={[
                        styles.shelfContainer,
                        {
                            transform: [{ translateY: shelfAnim }],
                        },
                    ]}
                >
                    {/* Shelf glow */}
                    <Animated.View
                        style={[
                            styles.shelfGlow,
                            { opacity: glowOpacity },
                        ]}
                    />

                    <View style={styles.shelf}>
                        {/* Item 1 */}
                        <Animated.View
                            style={[
                                styles.item,
                                { backgroundColor: '#FF6B6B', transform: [{ scale: item1Scale }] },
                            ]}
                        >
                            <Text style={styles.itemEmoji}>🥤</Text>
                            <View style={styles.itemShine} />
                        </Animated.View>

                        {/* Item 2 */}
                        <Animated.View
                            style={[
                                styles.item,
                                { backgroundColor: '#4ECDC4', transform: [{ scale: item2Scale }] },
                            ]}
                        >
                            <Text style={styles.itemEmoji}>🥛</Text>
                            <View style={styles.itemShine} />
                        </Animated.View>

                        {/* Item 3 */}
                        <Animated.View
                            style={[
                                styles.item,
                                { backgroundColor: '#FFE66D', transform: [{ scale: item3Scale }] },
                            ]}
                        >
                            <Text style={styles.itemEmoji}>🍟</Text>
                            <View style={styles.itemShine} />
                        </Animated.View>
                    </View>
                </Animated.View>

                {/* Subtitle with shimmer */}
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>Match and Organize</Text>
                    <View style={styles.subtitleUnderline} />
                </View>
            </Animated.View>

            {/* Premium loading dots */}
            <View style={styles.footer}>
                <Text style={styles.loading}>Loading..</Text>
                <Animated.View style={styles.dotsContainer}>
                    <Animated.Text style={[styles.dot, { opacity: glowOpacity }]}>•</Animated.Text>
                    <Animated.Text style={[styles.dot, { opacity: glowOpacity }]}>•</Animated.Text>
                    <Animated.Text style={[styles.dot, { opacity: glowOpacity }]}>•</Animated.Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#1A1433',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height / 3,
        backgroundColor: '#2A1A4E',
        opacity: 0.9,
    },
    gradientMiddle: {
        position: 'absolute',
        top: height / 3,
        left: 0,
        right: 0,
        height: height / 3,
        backgroundColor: '#1A2E3E',
        opacity: 0.6,
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height / 3,
        backgroundColor: '#16213E',
        opacity: 0.8,
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 100,
        height: height,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: [{ skewX: '-20deg' }],
    },
    content: {
        alignItems: 'center',
    },
    titleGlow: {
        position: 'absolute',
        top: -20,
        width: 300,
        height: 100,
        backgroundColor: '#FFD700',
        borderRadius: 100,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 52,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 4,
        textShadowColor: 'rgba(255, 215, 0, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    titleAccent: {
        color: '#FFD700',
        marginTop: -8,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
    },
    shelfContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    shelfGlow: {
        position: 'absolute',
        width: 280,
        height: 120,
        backgroundColor: '#8B4513',
        borderRadius: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 30,
    },
    shelf: {
        flexDirection: 'row',
        backgroundColor: '#A0522D',
        padding: 18,
        borderRadius: 18,
        gap: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 15,
        borderWidth: 3,
        borderColor: '#8B4513',
    },
    item: {
        width: 75,
        height: 75,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },
    itemShine: {
        position: 'absolute',
        top: 5,
        left: 5,
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
    },
    itemEmoji: {
        fontSize: 40,
    },
    subtitleContainer: {
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#FFD700',
        fontWeight: '700',
        letterSpacing: 2,
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    subtitleUnderline: {
        width: 120,
        height: 2,
        backgroundColor: '#FFD700',
        marginTop: 8,
        borderRadius: 1,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 80,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loading: {
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.8,
        fontWeight: '600',
        letterSpacing: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginLeft: 8,
    },
    dot: {
        color: '#FFD700',
        fontSize: 20,
        marginHorizontal: 2,
    },
});

export default SplashScreen;
