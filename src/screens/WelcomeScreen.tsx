import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';

interface WelcomeScreenProps {
    onComplete: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    const [name, setName] = useState('');

    const handleContinue = () => {
        const trimmedName = name.trim();

        if (trimmedName.length < 2) {
            Alert.alert(
                'Name Required',
                'Please enter your name (at least 2 characters)',
                [{ text: 'OK' }]
            );
            return;
        }

        if (trimmedName.length > 20) {
            Alert.alert(
                'Name Too Long',
                'Please enter a shorter name (max 20 characters)',
                [{ text: 'OK' }]
            );
            return;
        }

        onComplete(trimmedName);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Welcome Header */}
                <View style={styles.header}>
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>👋</Text>
                    </View>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.appName}>SHELFIE SORT</Text>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Match & Organize</Text>
                    </View>
                </View>

                {/* Name Input Section */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>What should we call you?</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor="rgba(255, 255, 255, 0.3)"
                            value={name}
                            onChangeText={setName}
                            maxLength={20}
                            autoCapitalize="words"
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={handleContinue}
                        />
                    </View>

                    <Text style={styles.hint}>
                        We'll use this to personalize your experience
                    </Text>
                </View>

                {/* Continue Button */}
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

                {/* Skip Option */}
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => onComplete('Player')}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 60,
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
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.2)',
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
