import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useUserStore, useDecorationStore } from '../store/gameStore';
import { Decoration } from '../types/game.types';

interface ShopScreenProps {
    onNavigateBack?: () => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onNavigateBack }) => {
    const { progress, spendCoins, unlockDecoration } = useUserStore();
    const { decorations, loadDecorations } = useDecorationStore();

    useEffect(() => {
        loadDecorations();
    }, [progress.unlockedDecorations]);

    const handlePurchase = (decoration: Decoration) => {
        if (decoration.isUnlocked) {
            Alert.alert('Already Owned', 'You already own this decoration!');
            return;
        }

        if (progress.coins < decoration.price) {
            Alert.alert(
                'Insufficient Coins',
                `You need ${decoration.price - progress.coins} more coins to buy this decoration.`
            );
            return;
        }

        Alert.alert(
            'Purchase Decoration',
            `Buy "${decoration.name}" for ${decoration.price} coins?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Buy',
                    onPress: () => {
                        const success = spendCoins(decoration.price);
                        if (success) {
                            unlockDecoration(decoration.id);
                            Alert.alert('Success!', `You now own "${decoration.name}"!`);
                        }
                    },
                },
            ]
        );
    };

    const renderDecoration = ({ item }: { item: Decoration }) => (
        <View style={styles.decorationCard}>
            <View style={[styles.preview, { backgroundColor: item.color }]} />
            <View style={styles.info}>
                <Text style={styles.decorationName}>{item.name}</Text>
                <Text style={styles.decorationPrice}>💰 {item.price}</Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.buyButton,
                    item.isUnlocked && styles.ownedButton,
                ]}
                onPress={() => handlePurchase(item)}
                disabled={item.isUnlocked}
            >
                <Text style={styles.buyButtonText}>
                    {item.isUnlocked ? '✓ Owned' : 'Buy'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Decoration Shop</Text>
                <View style={styles.coinDisplay}>
                    <Text style={styles.coinText}>💰 {progress.coins}</Text>
                </View>
            </View>

            {/* Decorations List */}
            <FlatList
                data={decorations}
                renderItem={renderDecoration}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#16213E',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    coinDisplay: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A2E',
    },
    listContainer: {
        padding: 20,
    },
    decorationCard: {
        backgroundColor: '#16213E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    preview: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    decorationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    decorationPrice: {
        fontSize: 16,
        color: '#FFD700',
    },
    buyButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    ownedButton: {
        backgroundColor: '#6C757D',
    },
    buyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default ShopScreen;
