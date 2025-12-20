import { ItemType } from '../types/game.types';

/**
 * Game Configuration Constants
 */

export const GAME_CONFIG = {
    ITEMS_PER_SHELF: 3,
    MATCH_COUNT: 3,
    BUFFER_SHELVES: 1,
    COINS_PER_MATCH: 10,
    COMBO_MULTIPLIER: 2, // 2x coins for quick consecutive matches
    SPEED_BONUS: 50, // Bonus coins for completing level quickly
    BASE_SHELVES_COUNT: 4,
    SHELVES_INCREASE_RATE: 1,
} as const;

/**
 * Theme colors that change every 5 levels
 */
export const LEVEL_THEMES = [
    { background: '#1A1A2E', header: '#16213E', name: 'Midnight' }, // Levels 1-5
    { background: '#2A1A4E', header: '#3E1656', name: 'Purple Haze' }, // Levels 6-10
    { background: '#1A3E2E', header: '#16563E', name: 'Forest' }, // Levels 11-15
    { background: '#3E1A1A', header: '#561616', name: 'Crimson' }, // Levels 16-20
    { background: '#1A2E3E', header: '#163E56', name: 'Ocean' }, // Levels 21+
];

/**
 * Item type definitions with their visual properties
 */
export const ITEM_CONFIGS: Record<ItemType, { color: string; label: string }> = {
    soda: { color: '#FF6B6B', label: '🥤' },
    milk: { color: '#4ECDC4', label: '🥛' },
    chips: { color: '#FFE66D', label: '🍟' },
    water: { color: '#95E1D3', label: '💧' },
    juice: { color: '#F38181', label: '🧃' },
    bread: { color: '#AA96DA', label: '🍞' },
};

export const ITEM_TYPES: ItemType[] = Object.keys(ITEM_CONFIGS) as ItemType[];

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
    DRAG: 200,
    SNAP_BACK: 300,
    POP: 400,
    CELEBRATION: 500,
} as const;

/**
 * Layout Constants
 */
export const LAYOUT = {
    SHELF_HEIGHT: 80,
    SHELF_GAP: 16,
    ITEM_SIZE: 60,
    ITEM_GAP: 8,
    CONTAINER_PADDING: 20,
} as const;

/**
 * Ad Configuration
 */
export const AD_CONFIG = {
    INTERSTITIAL_FREQUENCY: 2, // Show interstitial every 2 levels
    BANNER_AD_UNIT_ID: __DEV__
        ? 'ca-app-pub-3940256099942544/6300978111' // Test Banner ID
        : 'YOUR_PRODUCTION_BANNER_ID',
    INTERSTITIAL_AD_UNIT_ID: __DEV__
        ? 'ca-app-pub-3940256099942544/1033173712' // Test Interstitial ID
        : 'YOUR_PRODUCTION_INTERSTITIAL_ID',
    REWARDED_AD_UNIT_ID: __DEV__
        ? 'ca-app-pub-3940256099942544/5224354917' // Test Rewarded ID
        : 'YOUR_PRODUCTION_REWARDED_ID',
} as const;
