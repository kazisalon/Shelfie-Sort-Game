import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    withRepeat,
    withTiming,
    withSequence,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 20;
const DEFAULT_PLAYER_NAME = 'Player';

interface WelcomeScreenProps {
    onComplete: (name: string) => void;
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

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    const [name, setName] = useState<string>('');
    const emojiRotation = useSharedValue(0);
    const buttonScale = useSharedValue(1);

    useEffect(() => {
        // Waving emoji animation
        emojiRotation.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 400 }),
                withTiming(15, { duration: 400 })
            ),
            -1,
            true
        );

        // Button pulsing animation
        buttonScale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const wavingStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${emojiRotation.value}deg` }],
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: name.trim() ? buttonScale.value : 1 }],
    }));

    const handleContinue = () => {
        const trimmedName = name.trim();

        if (trimmedName.length < MIN_NAME_LENGTH) {
            Alert.alert(
                'Name Required',
                `Please enter your name (at least ${MIN_NAME_LENGTH} characters)`,
                [{ text: 'OK' }]
            );
            return;
        }

        if (trimmedName.length > MAX_NAME_LENGTH) {
            Alert.alert(
                'Name Too Long',
                `Please enter a shorter name (max ${MAX_NAME_LENGTH} characters)`,
                [{ text: 'OK' }]
            );
            return;
        }

        onComplete(trimmedName);
    };

    return (
        <View style={styles.container}>
            {/* Background Decorations */}
            <BackgroundParticle size={200} x={-50} y={100} />
            <BackgroundParticle size={150} x={SCREEN_WIDTH - 100} y={SCREEN_HEIGHT / 2} />
            <BackgroundParticle size={100} x={50} y={SCREEN_HEIGHT - 200} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    {/* Welcome Header */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800)}
                        style={styles.header}
                    >
                        <View style={styles.emojiContainer}>
                            <Animated.Text style={[styles.emoji, wavingStyle]}>👋</Animated.Text>
                        </View>
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        <Text style={styles.appName}>SHELFIE SORT</Text>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subtitle}>Match & Organize</Text>
                        </View>
                    </Animated.View>

                    {/* Name Input Section */}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(800)}
                        style={styles.inputSection}
                    >
                        <Text style={styles.label}>What should we call you?</Text>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                value={name}
                                onChangeText={setName}
                                maxLength={MAX_NAME_LENGTH}
                                autoCapitalize="words"
                                autoCorrect={false}
                                returnKeyType="done"
                                onSubmitEditing={handleContinue}
                            />
                        </View>

                        <Text style={styles.hint}>
                            We'll use this to personalize your experience
                        </Text>
                    </Animated.View>

                    {/* Continue Button */}
                    <Animated.View
                        entering={FadeInUp.delay(600).duration(800)}
                        style={buttonAnimatedStyle}
                    >
                        <TouchableOpacity
                            style={[
                                styles.button,
                                !name.trim() && styles.buttonDisabled,
                            ]}
                            onPress={handleContinue}
                            disabled={!name.trim()}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>LET'S PLAY!</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Skip Option */}
                    <Animated.View entering={FadeInUp.delay(800).duration(800)}>
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => onComplete(DEFAULT_PLAYER_NAME)}
                        >
                            <Text style={styles.skipText}>Skip for now</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    keyboardView: {
        flex: 1,
    },
    particle: {
        position: 'absolute',
        backgroundColor: '#FFD700',
        zIndex: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 60,
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    emojiContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 5,
    },
    emoji: {
        fontSize: 60,
    },
    welcomeText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        letterSpacing: 1,
    },
    appName: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 3,
        marginBottom: 12,
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitleContainer: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    subtitle: {
        fontSize: 16,
        color: '#FFD700',
        fontWeight: '600',
        letterSpacing: 2,
    },
    inputSection: {
        marginBottom: 40,
    },
    label: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
    inputWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        overflow: 'hidden',
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 18,
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
    },
    hint: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#16213E',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 3,
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(22, 33, 62, 0.3)',
        shadowOpacity: 0,
        borderColor: 'rgba(255, 215, 0, 0.15)',
    },
    buttonText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    skipButton: {
        marginTop: 25,
        paddingVertical: 15,
        alignItems: 'center',
    },
    skipText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
    },
});

export default WelcomeScreen;

