import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Shelf, GameItem } from '../types/game.types';
import { useUserStore } from '../store/gameStore';
import { generateLevel, checkWinCondition, checkShelfForMatch } from '../utils/levelGenerator';
import { GAME_CONFIG, LAYOUT, ANIMATION_DURATION } from '../constants/game.constants';
import ShelfComponent from '../components/ShelfComponent';
import GameItemComponent from '../components/GameItemComponent';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameScreenProps {
    onNavigateToShop?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onNavigateToShop }) => {
    const { progress, addCoins, incrementLevel, incrementMatches } = useUserStore();

    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [isGameWon, setIsGameWon] = useState(false);
    const [draggedItem, setDraggedItem] = useState<{ shelfIndex: number; itemIndex: number } | null>(null);

    const shelfLayoutsRef = useRef<{ y: number; height: number }[]>([]);

    /**
     * Initialize Level
     */
    useEffect(() => {
        startNewLevel();
    }, [progress.currentLevel]);

    const startNewLevel = () => {
        const newShelves = generateLevel(progress.currentLevel);
        setShelves(newShelves);
        setIsGameWon(false);
        setDraggedItem(null);
    };

    /**
     * Handle Item Drop - Production Ready
     */
    const handleItemDrop = useCallback(
        (fromShelfIndex: number, itemId: string, toShelfIndex: number) => {
            console.log('=== DROP ATTEMPT ===');
            console.log('From shelf:', fromShelfIndex, 'item ID:', itemId);
            console.log('To shelf:', toShelfIndex);

            setShelves((prevShelves) => {
                // Create deep copy to avoid mutations
                const newShelves = prevShelves.map(shelf => ({
                    ...shelf,
                    items: [...shelf.items]
                }));

                const fromShelf = newShelves[fromShelfIndex];
                const toShelf = newShelves[toShelfIndex];

                // Comprehensive safety checks
                if (!fromShelf || !toShelf) {
                    console.warn('Invalid shelf indices');
                    return prevShelves;
                }

                if (!fromShelf.items || !toShelf.items) {
                    console.warn('Shelf items array missing');
                    return prevShelves;
                }

                // FIND ITEM BY ID (fixes stale index!)
                const itemIndex = fromShelf.items.findIndex(item => item?.id === itemId);

                if (itemIndex === -1) {
                    console.warn('❌ Item not found:', itemId);
                    return prevShelves;
                }

                const itemToMove = fromShelf.items[itemIndex];
                if (!itemToMove || !itemToMove.type) {
                    console.warn('❌ Invalid item');
                    return prevShelves;
                }

                // Check if it's the same shelf (reorder)
                if (fromShelfIndex === toShelfIndex) {
                    // Don't do anything for same-shelf drops
                    return prevShelves;
                }

                // Check if target shelf has space
                if (toShelf.items.length >= GAME_CONFIG.ITEMS_PER_SHELF) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    return prevShelves;
                }

                // MOVE ITEM (not swap!)
                console.log('✅ Moving item:', itemToMove.type);
                console.log('   From items:', fromShelf.items.length, '→', fromShelf.items.length - 1);
                console.log('   To items:', toShelf.items.length, '→', toShelf.items.length + 1);

                // 1. Remove from source
                fromShelf.items.splice(itemIndex, 1);

                // 2. Add to target
                toShelf.items.push(itemToMove);

                console.log('=== DROP SUCCESS ===');
                return newShelves;
            });

            // Check for matches after state update
            setTimeout(() => {
                checkForMatches();
            }, 150);
        },
        []
    );

    /**
     * Check all shelves for matches
     */
    const checkForMatches = useCallback(() => {
        let matchCount = 0;

        setShelves((prevShelves) => {
            let newShelves = [...prevShelves];

            newShelves.forEach((shelf, index) => {
                if (checkShelfForMatch(shelf)) {
                    matchCount++;

                    // Trigger haptic feedback
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                    // Clear the shelf
                    shelf.items = [];
                }
            });

            // Check win condition
            if (checkWinCondition(newShelves)) {
                setTimeout(() => {
                    handleLevelComplete();
                }, 500);
            }

            return newShelves;
        });

        // Award coins and increment matches AFTER state update
        if (matchCount > 0) {
            addCoins(GAME_CONFIG.COINS_PER_MATCH * matchCount);
            incrementMatches();
        }
    }, [addCoins, incrementMatches]);

    /**
     * Handle Level Complete
     */
    const handleLevelComplete = () => {
        setIsGameWon(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Alert.alert(
            '🎉 Level Complete!',
            `You earned ${GAME_CONFIG.COINS_PER_MATCH} coins!\n\nReady for the next challenge?`,
            [
                {
                    text: 'Next Level',
                    onPress: () => {
                        incrementLevel();
                    },
                },
            ]
        );
    };

    /**
     * Save shelf layout positions for drop detection
     */
    const handleShelfLayout = (index: number, y: number, height: number) => {
        shelfLayoutsRef.current[index] = { y, height };
        console.log(`Shelf ${index} layout:`, { y, height });
    };

    /**
     * Determine which shelf the item is being dropped on
     * Uses nearest-shelf logic for better UX
     */
    const getTargetShelfIndex = (absoluteY: number): number => {
        if (shelfLayoutsRef.current.length === 0) {
            return 0; // Default to first shelf if no layouts yet
        }

        // First try exact hit-testing
        for (let i = 0; i < shelfLayoutsRef.current.length; i++) {
            const layout = shelfLayoutsRef.current[i];
            if (layout && absoluteY >= layout.y && absoluteY <= layout.y + layout.height) {
                return i;
            }
        }

        // If no exact match, find nearest shelf
        let nearestIndex = 0;
        let smallestDistance = Infinity;

        for (let i = 0; i < shelfLayoutsRef.current.length; i++) {
            const layout = shelfLayoutsRef.current[i];
            if (layout) {
                const centerY = layout.y + layout.height / 2;
                const distance = Math.abs(absoluteY - centerY);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    nearestIndex = i;
                }
            }
        }

        return nearestIndex;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.levelText}>Level {progress.currentLevel}</Text>
                    <TouchableOpacity onPress={onNavigateToShop} style={styles.coinButton}>
                        <Text style={styles.coinText}>💰 {progress.coins}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Game Board */}
            <View style={styles.gameBoard}>
                {shelves.map((shelf, shelfIndex) => (
                    <ShelfComponent
                        key={`shelf-${shelfIndex}`}
                        shelf={shelf}
                        shelfIndex={shelfIndex}
                        onLayout={handleShelfLayout}
                        onItemDrop={handleItemDrop}
                        getTargetShelfIndex={getTargetShelfIndex}
                    />
                ))}
            </View>

            {/* Debug Info */}
            <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                    Total Matches: {progress.totalMatches}
                </Text>
            </View>
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
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    coinButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    coinText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A2E',
    },
    gameBoard: {
        flex: 1,
        padding: LAYOUT.CONTAINER_PADDING,
        justifyContent: 'center',
    },
    debugInfo: {
        padding: 10,
        backgroundColor: '#16213E',
        alignItems: 'center',
    },
    debugText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});

export default GameScreen;
