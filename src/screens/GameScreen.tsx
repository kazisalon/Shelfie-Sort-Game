import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Shelf, GameItem } from '../types/game.types';
import { useUserStore } from '../store/gameStore';
import { generateLevel, checkWinCondition, checkShelfForMatch } from '../utils/levelGenerator';
import { GAME_CONFIG, LAYOUT, ANIMATION_DURATION, LEVEL_THEMES } from '../constants/game.constants';
import ShelfComponent from '../components/ShelfComponent';
import GameItemComponent from '../components/GameItemComponent';
import soundManager from '../utils/soundManager';
import SettingsScreen from './SettingsScreen';
import LevelCompleteModal from '../components/LevelCompleteModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameScreenProps {
    onNavigateToShop?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onNavigateToShop }) => {
    const { progress, addCoins, incrementLevel, incrementMatches, playerName } = useUserStore();

    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [isGameWon, setIsGameWon] = useState(false);
    const [draggedItem, setDraggedItem] = useState<{ shelfIndex: number; itemIndex: number } | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    const shelfLayoutsRef = useRef<{ y: number; height: number }[]>([]);
    const scrollOffsetRef = useRef(0);


    useEffect(() => {
        startNewLevel();
    }, [progress.currentLevel]);

    const startNewLevel = () => {
        const newShelves = generateLevel(progress.currentLevel);
        setShelves(newShelves);
        setIsGameWon(false);
        setDraggedItem(null);
    };

 
    const handleItemDrop = useCallback(
        (fromShelfIndex: number, itemId: string, toShelfIndex: number) => {

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
                    return prevShelves;
                }

                if (!fromShelf.items || !toShelf.items) {
                    return prevShelves;
                }

                // FIND ITEM BY ID (fixes stale index!)
                const itemIndex = fromShelf.items.findIndex(item => item?.id === itemId);

                if (itemIndex === -1) {
                    return prevShelves;
                }

                const itemToMove = fromShelf.items[itemIndex];
                if (!itemToMove || !itemToMove.type) {
                    return prevShelves;
                }

                if (fromShelfIndex === toShelfIndex) {
                    // Don't do anything for same-shelf drops
                    return prevShelves;
                }

                // Check if target shelf has space
                if (toShelf.items.length >= GAME_CONFIG.ITEMS_PER_SHELF) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    return prevShelves;
                }


                fromShelf.items.splice(itemIndex, 1);

                // 2. Add to target
                toShelf.items.push(itemToMove);

                // 🎵 Play satisfying drop sound
                soundManager.playSound('drop');
                return newShelves;
            });

            setTimeout(() => {
                checkForMatches();
            }, 150);
        },
        []
    );

    const checkForMatches = useCallback(() => {
        let matchCount = 0;

        setShelves((prevShelves) => {
            let newShelves = [...prevShelves];

            newShelves.forEach((shelf, index) => {
                if (checkShelfForMatch(shelf)) {
                    matchCount++;

                    // 🎵 Play match sound immediately
                    soundManager.playSound('match');

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
            const coinsToAward = GAME_CONFIG.COINS_PER_MATCH * matchCount;
            addCoins(coinsToAward);
            incrementMatches();
        }
    }, [addCoins, incrementMatches]);

    /**
     * Handle Level Complete
     */
    const handleLevelComplete = () => {
        setIsGameWon(true);

        // Award coins for completing level
        addCoins(GAME_CONFIG.COINS_PER_MATCH);

        // Victory sound + haptic
        soundManager.playSound('win');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    /**
     * Handle Next Level
     */
    const handleNextLevel = () => {
        incrementLevel();
        setIsGameWon(false);
    };

    /**
     * Save shelf layout positions for drop detection
     */
    const handleShelfLayout = (index: number, y: number, height: number) => {
        shelfLayoutsRef.current[index] = { y, height };
    };

    /**
     * Determine which shelf the item is being dropped on
     * FIXED: Accounts for scroll position for accurate drops
     */
    const getTargetShelfIndex = (absoluteY: number): number => {
        if (shelfLayoutsRef.current.length === 0) {
            return 0;
        }

        // CRITICAL: Adjust for scroll offset!
        // absoluteY is screen-relative, but layouts are content-relative
        const adjustedY = absoluteY + scrollOffsetRef.current;

        // First try exact hit-testing
        for (let i = 0; i < shelfLayoutsRef.current.length; i++) {
            const layout = shelfLayoutsRef.current[i];
            if (layout && adjustedY >= layout.y && adjustedY <= layout.y + layout.height) {
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
                const distance = Math.abs(adjustedY - centerY);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    nearestIndex = i;
                }
            }
        }

        return nearestIndex;
    };

    // Dynamic theme - Changes every 5 levels
    const themeIndex = Math.min(Math.floor((progress.currentLevel - 1) / 5), LEVEL_THEMES.length - 1);
    const currentTheme = LEVEL_THEMES[themeIndex];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
            {/* PREMIUM HEADER */}
            <View style={[styles.header, { backgroundColor: currentTheme.header }]}>
                {/* Glow overlay */}
                <View style={styles.headerGlow} />

                <View style={styles.headerContent}>
                    {/* Left side - Level info */}
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelLabel}>LEVEL</Text>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelNumber}>{progress.currentLevel}</Text>
                        </View>
                        <Text style={styles.themeName}>{currentTheme.name}</Text>
                    </View>

                    {/* Right side - Coins */}
                    <TouchableOpacity
                        onPress={onNavigateToShop}
                        style={styles.coinContainer}
                        activeOpacity={0.8}
                    >
                        <View style={styles.coinGlow} />
                        <Text style={styles.coinIcon}>💰</Text>
                        <Text style={styles.coinAmount}>{progress.coins}</Text>
                        <View style={styles.coinShine} />
                    </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${(progress.totalMatches % 10) * 10}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {progress.totalMatches % 10}/10 matches to bonus
                    </Text>
                </View>
            </View>

            {/* Game Board - Scrollable */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.gameBoard}
                showsVerticalScrollIndicator={false}
                bounces={true}
                scrollEventThrottle={16}
                onScroll={(event) => {
                    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
                }}
            >
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
            </ScrollView>

            {/* Floating Settings Button */}
            <TouchableOpacity
                onPress={() => setShowSettings(true)}
                style={styles.settingsButton}
                activeOpacity={0.7}
            >
                <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsScreen
                    onClose={() => setShowSettings(false)}
                    playerName={playerName}
                />
            )}

            {/* Level Complete Modal */}
            <LevelCompleteModal
                visible={isGameWon}
                coinsEarned={GAME_CONFIG.COINS_PER_MATCH}
                onNextLevel={handleNextLevel}
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
        paddingTop: 35,
        paddingHorizontal: 12,
        paddingBottom: 6,
        backgroundColor: '#16213E',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    headerGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(255, 215, 0, 0.08)',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    settingsButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#16213E',
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        zIndex: 100,
    },
    settingsIcon: {
        fontSize: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    levelContainer: {
        alignItems: 'flex-start',
    },
    levelLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFD700',
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    levelBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 3,
    },
    levelNumber: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    themeName: {
        fontSize: 9,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 1,
        fontStyle: 'italic',
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#FFA500',
    },
    coinGlow: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderRadius: 28,
    },
    coinIcon: {
        fontSize: 24,
        marginRight: 6,
    },
    coinAmount: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1A2E',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    coinShine: {
        position: 'absolute',
        top: 4,
        right: 8,
        width: 20,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 10,
    },
    progressBarContainer: {
        marginTop: 6,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 2,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
    },
    progressText: {
        fontSize: 8,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginTop: 3,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    gameBoard: {
        padding: LAYOUT.CONTAINER_PADDING,
        paddingBottom: 40,
    },
});

export default GameScreen;
