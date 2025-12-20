import { GameItem, Shelf, ItemType } from '../types/game.types';
import { GAME_CONFIG, ITEM_TYPES, ITEM_CONFIGS } from '../constants/game.constants';

/**
 * Level Generator with Buffer Rule
 * 
 * CRITICAL: This ensures levels are always solvable by leaving buffer space
 */

/**
 * Calculate number of shelves based on level
 */
export const calculateShelvesForLevel = (level: number): number => {
    const baselineShelves = GAME_CONFIG.BASE_SHELVES_COUNT;
    const additionalShelves = Math.floor((level - 1) / 3) * GAME_CONFIG.SHELVES_INCREASE_RATE;
    const totalShelves = baselineShelves + additionalShelves;

    // Cap at 6 shelves to keep everything visible on screen
    return Math.min(totalShelves, 6);
};

/**
 * Generate a unique ID for each item instance
 */
const generateItemId = (): string => {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Apply the Buffer Rule to determine how many items to spawn
 * 
 * PROGRESSIVE DIFFICULTY: Buffer reduces as levels increase!
 * - Early levels: 3 empty slots (easy, plenty of room)
 * - Mid levels: 2 empty slots (getting tight)
 * - High levels: 1 empty slot (very challenging!)
 */
export const calculateItemsToSpawn = (shelfCount: number, level: number): number => {
    const totalSlots = shelfCount * GAME_CONFIG.ITEMS_PER_SHELF;

    // PROGRESSIVE BUFFER: Reduces as you level up!
    let bufferSlots: number;
    if (level <= 3) {
        bufferSlots = 3; // 3 empty slots (easy)
    } else if (level <= 7) {
        bufferSlots = 2; // 2 empty slots (medium)
    } else {
        bufferSlots = 1; // 1 empty slot (hard!)
    }

    const availableSlots = totalSlots - bufferSlots;

    // Each "set" is 3 identical items
    const numberOfSets = Math.floor(availableSlots / GAME_CONFIG.MATCH_COUNT);

    return numberOfSets * GAME_CONFIG.MATCH_COUNT;
};

/**
 * Generate a pool of items for the level
 * Items are created in sets of 3 (to ensure they can be matched)
 */
const generateItemPool = (level: number, shelfCount: number): GameItem[] => {
    const totalItemsToSpawn = calculateItemsToSpawn(shelfCount, level);
    const numberOfSets = totalItemsToSpawn / GAME_CONFIG.MATCH_COUNT;

    // IMPROVED: More aggressive item type scaling
    const itemTypesCount = Math.min(
        Math.max(2, Math.floor(level * 0.6) + 1), // Increases faster: level 1=2, level 5=4, level 10=7, level 13+=8
        ITEM_TYPES.length
    );

    const availableTypes = ITEM_TYPES.slice(0, itemTypesCount);
    const itemPool: GameItem[] = [];

    // Create sets of 3 identical items
    for (let i = 0; i < numberOfSets; i++) {
        const itemType = availableTypes[i % availableTypes.length];
        const itemConfig = ITEM_CONFIGS[itemType];

        // Create 3 identical items (for matching)
        for (let j = 0; j < GAME_CONFIG.MATCH_COUNT; j++) {
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
 * 
 * Generates a solvable level using the Buffer Rule
 */
export const generateLevel = (level: number): Shelf[] => {
    const shelfCount = calculateShelvesForLevel(level);
    const itemPool = generateItemPool(level, shelfCount);
    const shelves = distributeItemsToShelves(itemPool, shelfCount);

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
