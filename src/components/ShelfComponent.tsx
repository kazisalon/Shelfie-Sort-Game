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
        backgroundColor: '#8B4513',
        borderRadius: 12,
        padding: 10,
        minHeight: LAYOUT.SHELF_HEIGHT,
        justifyContent: 'center',
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    itemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: LAYOUT.ITEM_GAP,
    },
    emptySlot: {
        width: LAYOUT.ITEM_SIZE,
        height: LAYOUT.ITEM_SIZE,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
    },
});

export default ShelfComponent;
