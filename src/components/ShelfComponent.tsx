import React, { useRef } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Shelf } from '../types/game.types';
import { LAYOUT } from '../constants/game.constants';
import GameItemComponent from './GameItemComponent';

interface ShelfComponentProps {
    shelf: Shelf;
    shelfIndex: number;
    onLayout: (index: number, y: number, height: number) => void;
    onItemDrop: (fromShelfIndex: number, itemId: string, toShelfIndex: number) => void;
    getTargetShelfIndex: (absoluteY: number) => number;
}

const ShelfComponent: React.FC<ShelfComponentProps> = ({
    shelf,
    shelfIndex,
    onLayout,
    onItemDrop,
    getTargetShelfIndex,
}) => {
    const viewRef = useRef<View>(null);

    const handleLayout = (event: LayoutChangeEvent) => {
        // Use setTimeout to ensure measurement happens after layout is complete
        setTimeout(() => {
            if (viewRef.current) {
                viewRef.current.measure((x, y, width, height, pageX, pageY) => {
                    if (pageY !== undefined && height !== undefined) {
                        onLayout(shelfIndex, pageY, height);
                    }
                });
            }
        }, 100);
    };

    return (
        <View
            ref={viewRef}
            style={styles.shelfContainer}
            onLayout={handleLayout}
        >
            <View style={styles.shelf}>
                {/* Item Slots */}
                <View style={styles.itemsContainer}>
                    {shelf?.items?.map((item, originalIndex) => {
                        // Skip null/undefined items
                        if (!item || !item.type) {
                            return null;
                        }

                        return (
                            <GameItemComponent
                                key={item.id || `item-${shelfIndex}-${originalIndex}`}
                                item={item}
                                shelfIndex={shelfIndex}
                                onDrop={onItemDrop}
                                getTargetShelfIndex={getTargetShelfIndex}
                            />
                        );
                    })}

                    {/* Empty Slots (Visual Indicator) */}
                    {Array.from({ length: (shelf?.maxCapacity || 3) - (shelf?.items?.filter(i => i).length || 0) }).map((_, index) => (
                        <View key={`empty-${shelfIndex}-${index}`} style={styles.emptySlot} />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shelfContainer: {
        marginBottom: LAYOUT.SHELF_GAP,
    },
    shelf: {
        backgroundColor: '#A0522D', // Lighter wood color
        borderRadius: 16,
        padding: 12,
        minHeight: LAYOUT.SHELF_HEIGHT,
        justifyContent: 'center',
        // Premium 3D shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 12,
        // Border for 3D depth
        borderWidth: 3,
        borderColor: '#8B4513',
        borderBottomWidth: 5,
        borderBottomColor: '#654321',
    },
    itemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: LAYOUT.ITEM_GAP + 2,
    },
    emptySlot: {
        width: LAYOUT.ITEM_SIZE,
        height: LAYOUT.ITEM_SIZE,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(139, 69, 19, 0.5)',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(101, 67, 33, 0.25)',
    },
});

export default ShelfComponent;
