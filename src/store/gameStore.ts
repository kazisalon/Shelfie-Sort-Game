import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, UserProgress, Decoration } from '../types/game.types';

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
    USER_COINS: 'user_coins',
    CURRENT_LEVEL: 'current_level',
    UNLOCKED_DECORATIONS: 'unlocked_decorations',
    GAMES_PLAYED: 'games_played',
    TOTAL_MATCHES: 'total_matches',
} as const;

/**
 * Helper functions for AsyncStorage
 */
const getNumber = async (key: string, defaultValue: number = 0): Promise<number> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? parseFloat(value) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const setNumber = async (key: string, value: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
    }
};

const getString = async (key: string, defaultValue: string = ''): Promise<string> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value || defaultValue;
    } catch {
        return defaultValue;
    }
};

const setString = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
    }
};

const removeItem = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from AsyncStorage:', error);
    }
};

/**
 * User Progress Store
 */
interface UserStore {
    progress: UserProgress;
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    unlockDecoration: (decorationId: string) => void;
    incrementLevel: () => void;
    incrementMatches: () => void;
    loadProgress: () => Promise<void>;
    resetProgress: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    progress: {
        coins: 0,
        currentLevel: 1,
        unlockedDecorations: [],
        gamesPlayed: 0,
        totalMatches: 0,
    },

    loadProgress: async () => {
        const coins = await getNumber(STORAGE_KEYS.USER_COINS, 0);
        const currentLevel = await getNumber(STORAGE_KEYS.CURRENT_LEVEL, 1);
        const unlockedDecorationsStr = await getString(STORAGE_KEYS.UNLOCKED_DECORATIONS, '[]');
        const unlockedDecorations = JSON.parse(unlockedDecorationsStr);
        const gamesPlayed = await getNumber(STORAGE_KEYS.GAMES_PLAYED, 0);
        const totalMatches = await getNumber(STORAGE_KEYS.TOTAL_MATCHES, 0);

        set({
            progress: {
                coins,
                currentLevel,
                unlockedDecorations,
                gamesPlayed,
                totalMatches,
            },
        });
    },

    addCoins: (amount: number) => {
        set((state) => {
            const newCoins = state.progress.coins + amount;
            setNumber(STORAGE_KEYS.USER_COINS, newCoins);
            return { progress: { ...state.progress, coins: newCoins } };
        });
    },

    spendCoins: (amount: number) => {
        const currentCoins = get().progress.coins;
        if (currentCoins >= amount) {
            set((state) => {
                const newCoins = state.progress.coins - amount;
                setNumber(STORAGE_KEYS.USER_COINS, newCoins);
                return { progress: { ...state.progress, coins: newCoins } };
            });
            return true;
        }
        return false;
    },

    unlockDecoration: (decorationId: string) => {
        set((state) => {
            const newUnlocked = [...state.progress.unlockedDecorations, decorationId];
            setString(STORAGE_KEYS.UNLOCKED_DECORATIONS, JSON.stringify(newUnlocked));
            return { progress: { ...state.progress, unlockedDecorations: newUnlocked } };
        });
    },

    incrementLevel: () => {
        set((state) => {
            const newLevel = state.progress.currentLevel + 1;
            const newGamesPlayed = state.progress.gamesPlayed + 1;
            setNumber(STORAGE_KEYS.CURRENT_LEVEL, newLevel);
            setNumber(STORAGE_KEYS.GAMES_PLAYED, newGamesPlayed);
            return {
                progress: {
                    ...state.progress,
                    currentLevel: newLevel,
                    gamesPlayed: newGamesPlayed,
                },
            };
        });
    },

    incrementMatches: () => {
        set((state) => {
            const newMatches = state.progress.totalMatches + 1;
            setNumber(STORAGE_KEYS.TOTAL_MATCHES, newMatches);
            return { progress: { ...state.progress, totalMatches: newMatches } };
        });
    },

    resetProgress: async () => {
        await removeItem(STORAGE_KEYS.USER_COINS);
        await removeItem(STORAGE_KEYS.CURRENT_LEVEL);
        await removeItem(STORAGE_KEYS.UNLOCKED_DECORATIONS);
        await removeItem(STORAGE_KEYS.GAMES_PLAYED);
        await removeItem(STORAGE_KEYS.TOTAL_MATCHES);

        set({
            progress: {
                coins: 0,
                currentLevel: 1,
                unlockedDecorations: [],
                gamesPlayed: 0,
                totalMatches: 0,
            },
        });
    },
}));

/**
 * Decoration Shop Store
 */
interface DecorationStore {
    decorations: Decoration[];
    loadDecorations: () => void;
}

export const useDecorationStore = create<DecorationStore>((set) => ({
    decorations: [],

    loadDecorations: () => {
        const { progress } = useUserStore.getState();

        const allDecorations: Decoration[] = [
            { id: 'default', name: 'Classic Wood', price: 0, isUnlocked: true, color: '#8B4513' },
            { id: 'neon', name: 'Cyberpunk Neon', price: 100, isUnlocked: false, color: '#FF00FF' },
            { id: 'rustic', name: 'Rustic Barn', price: 150, isUnlocked: false, color: '#D2691E' },
            { id: 'modern', name: 'Modern Glass', price: 200, isUnlocked: false, color: '#87CEEB' },
            { id: 'gold', name: 'Golden Luxury', price: 300, isUnlocked: false, color: '#FFD700' },
        ];

        const decorationsWithStatus = allDecorations.map((dec) => ({
            ...dec,
            isUnlocked: dec.id === 'default' || progress.unlockedDecorations.includes(dec.id),
        }));

        set({ decorations: decorationsWithStatus });
    },
}));
