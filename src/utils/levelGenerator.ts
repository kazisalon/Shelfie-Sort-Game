import { GameItem, Shelf, ItemType } from '../types/game.types';
import { GAME_CONFIG, ITEM_TYPES, ITEM_CONFIGS, getDifficultyForLevel } from '../constants/game.constants';

/**
 * Level Generator with Progressive Difficulty
 * Uses the new getDifficultyForLevel system for professional progression
 */

/**
 * Generate a unique ID for each item instance
 */
const generateItemId = (): string => {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};


/**
 * Generate a pool of items for the level based on difficulty
 */
const generateItemPool = (level: number): GameItem[] => {
    const difficulty = getDifficultyForLevel(level);
    const itemPool: GameItem[] = [];

    // Get the specified number of item types for this level
    const availableTypes = ITEM_TYPES.slice(0, difficulty.itemTypes);

    // Create sets of items based on difficulty
    // Each type appears 'itemsPerType' times (3 or 4)
    for (const itemType of availableTypes) {
        const itemConfig = ITEM_CONFIGS[itemType];

        // Create multiple items of this type
        for (let i = 0; i < difficulty.itemsPerType; i++) {
            itemPool.push({
                id: generateItemId(),
                type: itemType,
                color: itemConfig.color,
            });
        }
    }

    return itemPool;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Distribute items across shelves randomly
 * Ensures no shelf starts with 3 matching items (otherwise it auto-clears immediately)
 */
const distributeItemsToShelves = (items: GameItem[], shelfCount: number): Shelf[] => {
    const shelves: Shelf[] = Array.from({ length: shelfCount }, () => ({
        items: [],
        maxCapacity: GAME_CONFIG.ITEMS_PER_SHELF,
    }));

    const shuffledItems = shuffleArray(items);
    let currentShelfIndex = 0;

    for (const item of shuffledItems) {
        // Skip undefined items
        if (!item || !item.type) {
            continue;
        }

        let attempts = 0;
        const maxAttempts = shelfCount * 2;

        // Try to place item on a shelf that won't create an instant match
        while (attempts < maxAttempts) {
            const shelf = shelves[currentShelfIndex];

            // Check if shelf has space
            if (shelf.items.length < GAME_CONFIG.ITEMS_PER_SHELF) {
                // Check if adding this item would create an instant match of 3
                const wouldCreateMatch =
                    shelf.items.length === 2 &&
                    shelf.items[0]?.type === item.type &&
                    shelf.items[1]?.type === item.type;

                if (!wouldCreateMatch) {
                    shelf.items.push(item);
                    break;
                }
            }

            // Move to next shelf
            currentShelfIndex = (currentShelfIndex + 1) % shelfCount;
            attempts++;
        }

        // Fallback: if we couldn't find a good spot after max attempts, just place it
        if (attempts >= maxAttempts) {
            const shelf = shelves[currentShelfIndex];
            if (shelf.items.length < GAME_CONFIG.ITEMS_PER_SHELF) {
                shelf.items.push(item);
            }
        }

        currentShelfIndex = (currentShelfIndex + 1) % shelfCount;
    }

    return shelves;
};

/**
 * MAIN LEVEL GENERATOR
 * Uses progressive difficulty system
 */
export const generateLevel = (level: number): Shelf[] => {
    const difficulty = getDifficultyForLevel(level);
    const itemPool = generateItemPool(level);
    const shelves = distributeItemsToShelves(itemPool, difficulty.numShelves);

    return shelves;
};

/**
 * Check if the game is won (all shelves are empty)
 */
export const checkWinCondition = (shelves: Shelf[]): boolean => {
    return shelves.every(shelf => shelf.items.length === 0);
};

/**
 * Check a specific shelf for matches
 * Returns true if the shelf has 3 identical items
 */
export const checkShelfForMatch = (shelf: Shelf): boolean => {
    if (!shelf || !shelf.items || shelf.items.length !== GAME_CONFIG.MATCH_COUNT) {
        return false;
    }

    // Filter out any undefined items
    const validItems = shelf.items.filter(item => item && item.type);
    if (validItems.length !== GAME_CONFIG.MATCH_COUNT) {
        return false;
    }

    const firstType = validItems[0].type;
    return validItems.every(item => item && item.type === firstType);
};
