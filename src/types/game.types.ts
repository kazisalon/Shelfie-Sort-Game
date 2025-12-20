/**
 * Core Game Types for Shelfie Sort
 */

export type ItemType = 'soda' | 'milk' | 'chips' | 'water' | 'juice' | 'bread';

export interface GameItem {
    id: string; // Unique identifier for this specific item instance
    type: ItemType; // Type of item (soda, milk, etc.)
    color: string; // Placeholder color for visual representation
}

export interface Shelf {
    items: GameItem[];
    maxCapacity: number; // Always 3 for this game
}

export interface GameState {
    shelves: Shelf[];
    currentLevel: number;
    coins: number;
    isGameWon: boolean;
    draggedItem: { shelfIndex: number; itemIndex: number } | null;
}

export interface UserProgress {
    coins: number;
    currentLevel: number;
    unlockedDecorations: string[];
    gamesPlayed: number;
    totalMatches: number;
}

export interface Decoration {
    id: string;
    name: string;
    price: number;
    isUnlocked: boolean;
    color: string; // For shelf background color
}
