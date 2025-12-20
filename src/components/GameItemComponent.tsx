import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, PanResponder, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GameItem } from '../types/game.types';
import { LAYOUT, ITEM_CONFIGS } from '../constants/game.constants';

interface GameItemComponentProps {
    item: GameItem;
    shelfIndex: number;
    onDrop: (fromShelfIndex: number, itemId: string, toShelfIndex: number) => void;
    getTargetShelfIndex: (absoluteY: number) => number;
}

/**
 * PRODUCTION-READY Draggable Item Component
 * Fixed: No animation reset until state update is complete
 */
const GameItemComponent: React.FC<GameItemComponentProps> = ({
    item,
    shelfIndex,
    onDrop,
    getTargetShelfIndex,
}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [isDragging, setIsDragging] = useState(false);
    const startYRef = useRef(0);
    const hasDroppedRef = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
            },

            onPanResponderGrant: (event) => {
                hasDroppedRef.current = false;
                setIsDragging(true);

                // Store start position
                startYRef.current = event.nativeEvent.pageY;

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                // Lift animation
                Animated.spring(scale, {
                    toValue: 1.25,
                    friction: 4,
                    useNativeDriver: true,
                }).start();
            },

            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),

            onPanResponderRelease: (_, gestureState) => {
                if (hasDroppedRef.current) return; // Prevent double-drops
                hasDroppedRef.current = true;

                setIsDragging(false);

                // Calculate final Y position
                const finalY = startYRef.current + gestureState.dy;

                // Get target shelf
                const targetShelfIndex = getTargetShelfIndex(finalY);

                console.log('🎯 Item drag ended:', {
                    from: shelfIndex,
                    to: targetShelfIndex,
                    finalY,
                    startY: startYRef.current,
                    dy: gestureState.dy
                });

                // Execute drop FIRST, reset animation AFTER
                if (targetShelfIndex !== -1 && targetShelfIndex !== shelfIndex) {
                    onDrop(shelfIndex, item.id, targetShelfIndex);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    // Reset after a delay to allow state update
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.spring(pan, {
                                toValue: { x: 0, y: 0 },
                                friction: 7,
                                useNativeDriver: true,
                            }),
                            Animated.spring(scale, {
                                toValue: 1,
                                friction: 5,
                                useNativeDriver: true,
                            }),
                        ]).start();
                    }, 200);
                } else {
                    // Snap back immediately for invalid drops
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    Animated.parallel([
                        Animated.spring(pan, {
                            toValue: { x: 0, y: 0 },
                            friction: 7,
                            useNativeDriver: true,
                        }),
                        Animated.spring(scale, {
                            toValue: 1,
                            friction: 5,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            },
        })
    ).current;

    const animatedStyle = {
        transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
        ],
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.95 : 1,
    };

    // Get item configuration
    const itemConfig = item?.type ? ITEM_CONFIGS[item.type] : ITEM_CONFIGS['soda'];

    if (!item || !item.type) {
        return null;
    }

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.itemContainer, animatedStyle]}
        >
            <View style={[styles.item, { backgroundColor: item.color }]}>
                <Text style={styles.itemEmoji}>{itemConfig.label}</Text>
            </View>
            {isDragging && (
                <View style={styles.dragIndicator}>
                    <View style={styles.dragDot} />
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        width: LAYOUT.ITEM_SIZE,
        height: LAYOUT.ITEM_SIZE,
    },
    item: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 10,
    },
    itemEmoji: {
        fontSize: 32,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    dragIndicator: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
});

export default GameItemComponent;
