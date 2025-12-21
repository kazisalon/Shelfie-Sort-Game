import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LevelCompleteModalProps {
    visible: boolean;
    coinsEarned: number;
    onNextLevel: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
    visible,
    coinsEarned,
    onNextLevel,
}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Success Icon with Glow */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconGlow} />
                        <Text style={styles.icon}>🎉</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Level Complete!</Text>

                    {/* Coins Display */}
                    <View style={styles.coinsContainer}>
                        <Text style={styles.coinIcon}>💰</Text>
                        <Text style={styles.coinsText}>+{coinsEarned}</Text>
                        <Text style={styles.coinsLabel}>coins</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Message */}
                    <Text style={styles.message}>
                        Great job! Ready for the next challenge?
                    </Text>

                    {/* Next Level Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onNextLevel}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>NEXT LEVEL</Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: width - 60,
        backgroundColor: '#1A1A2E',
        borderRadius: 25,
        padding: 35,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 25,
        elevation: 20,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#16213E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 3,
        borderColor: '#FFD700',
        position: 'relative',
    },
    iconGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFD700',
        opacity: 0.2,
    },
    icon: {
        fontSize: 55,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 1,
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    coinIcon: {
        fontSize: 28,
        marginRight: 10,
    },
    coinsText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        marginRight: 8,
    },
    coinsLabel: {
        fontSize: 18,
        color: '#FFD700',
        fontWeight: '600',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        marginVertical: 20,
    },
    message: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#16213E',
        paddingVertical: 18,
        paddingHorizontal: 45,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginRight: 10,
        letterSpacing: 2,
    },
    arrow: {
        fontSize: 22,
        color: '#FFD700',
        fontWeight: 'bold',
    },
});

export default LevelCompleteModal;
