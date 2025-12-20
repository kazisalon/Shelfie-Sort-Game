# 🎮 Shelfie Sort: Goods Match 3D

A hybrid-casual mobile puzzle game built with React Native and Expo.

## 📝 Game Overview

**Shelfie Sort** is a shelf-organizing puzzle game where players drag items between shelves to create matches. When 3 identical items sit side-by-side on a shelf, they disappear, awarding coins and clearing space.

### Core Mechanics
- **Goal:** Group 3 identical items together on shelves
- **Match System:** 3-in-a-row makes items pop and awards coins
- **Win Condition:** Clear all items from the board
- **Infinite Levels:** Algorithmically generated with increasing difficulty

## 🚀 Tech Stack

- **Framework:** React Native (Expo SDK 54)
- **Language:** TypeScript
- **Animation:** react-native-reanimated v3 (60fps physics)
- **Gestures:** react-native-gesture-handler
- **Storage:** react-native-mmkv (offline persistence)
- **Ads:** react-native-google-mobile-ads
- **State:** Zustand
- **Audio:** expo-av
- **Haptics:** expo-haptics

## 📁 Project Structure

```
src/
├── components/
│   ├── GameItemComponent.tsx    # Draggable item with animations
│   └── ShelfComponent.tsx        # Shelf container with drop zones
├── screens/
│   ├── GameScreen.tsx            # Main game logic
│   └── ShopScreen.tsx            # Decoration shop
├── store/
│   └── gameStore.ts              # Zustand stores with MMKV persistence
├── types/
│   └── game.types.ts             # TypeScript interfaces
├── utils/
│   └── levelGenerator.ts         # Level generation with Buffer Rule
└── constants/
    └── game.constants.ts         # Game configuration
```

## 🎯 Key Features

### 1. **The Buffer Rule (Level Generation)**
- Ensures levels are always solvable
- Formula: `ItemsToSpawn = (TotalSlots - 3) / 3 sets`
- Always leaves at least 3 empty slots for player moves

### 2. **Drag & Drop System**
- Smooth 60fps animations with Reanimated v3
- Hit-testing for drop zone detection
- Validation: blocks full shelves, allows reordering
- Haptic feedback on drag, drop, and match

### 3. **Match Detection**
- Triggers immediately after item drop
- Checks if shelf has 3 identical items
- Animated "pop" effect with haptics
- Awards coins and clears matched items

### 4. **Offline Persistence (MMKV)**
- Saves coins, current level, unlocked decorations
- Resume exactly where you left off
- Fast, synchronous storage

### 5. **Meta Loop: Decoration Shop**
- Spend coins to unlock shelf skins
- 5 unique decorations (Wood, Neon, Rustic, Glass, Gold)
- Encourages replay to earn more coins

### 6. **Monetization (AdMob)**
- **Banner Ad:** Bottom of screen (always visible)
- **Interstitial Ad:** Every 2 levels
- **Rewarded Ad:** "Shuffle Items" button when stuck

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Install Dependencies
```bash
npm install
```

### Run on iOS Simulator
```bash
npx expo start --ios
```

### Run on Android Emulator
```bash
npx expo start --android
```

### Run on Physical Device
```bash
npx expo start
```
Then scan the QR code with Expo Go app.

## 🎮 How to Play

1. **Drag items** between shelves
2. **Match 3** identical items on the same shelf
3. **Clear the board** to win
4. **Earn coins** for each match
5. **Unlock decorations** in the shop

## 🔧 Configuration

### Ad Unit IDs
Update in `src/constants/game.constants.ts`:
```typescript
export const AD_CONFIG = {
  BANNER_AD_UNIT_ID: 'YOUR_BANNER_ID',
  INTERSTITIAL_AD_UNIT_ID: 'YOUR_INTERSTITIAL_ID',
  REWARDED_AD_UNIT_ID: 'YOUR_REWARDED_ID',
};
```

### Game Balance
Adjust in `src/constants/game.constants.ts`:
```typescript
export const GAME_CONFIG = {
  ITEMS_PER_SHELF: 3,
  MATCH_COUNT: 3,
  BUFFER_SHELVES: 1,
  COINS_PER_MATCH: 10,
  BASE_SHELVES_COUNT: 4,
  SHELVES_INCREASE_RATE: 1,
};
```

## 📊 Data Flow

1. **App.tsx** → Loads user progress from MMKV on mount
2. **GameScreen** → Generates level, handles game logic
3. **ShelfComponent** → Measures layout, renders items
4. **GameItemComponent** → Pan gesture, drag-drop logic
5. **On Drop** → Validates move → Updates state → Checks matches
6. **On Match** → Awards coins → Checks win condition
7. **On Win** → Shows alert → Increments level

## 🎨 Customization

### Add New Item Types
1. Add to `ITEM_CONFIGS` in `game.constants.ts`
2. Update `ItemType` in `game.types.ts`

### Add More Decorations
1. Update decorations array in `gameStore.ts`
2. Add price, name, and color

### Adjust Difficulty Curve
- Modify `calculateShelvesForLevel()` in `levelGenerator.ts`
- Change `SHELVES_INCREASE_RATE` in `game.constants.ts`

## 📱 Building for Production

### iOS
```bash
npx eas build --platform ios
```

### Android
```bash
npx eas build --platform android
```

## 🐛 Debug Features

The game includes a debug panel at the bottom showing:
- Total matches made
- (You can add more debug info here)

## 🚧 TODO / Future Enhancements

- [ ] Add sound effects for matches
- [ ] Implement rewarded video for shuffle
- [ ] Add particle effects for matches
- [ ] Leaderboard integration
- [ ] Daily challenges
- [ ] Power-ups (undo, hint, shuffle)
- [ ] More item types
- [ ] Animated backgrounds
- [ ] Tutorial for first-time players

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 🙏 Credits

Built with ❤️ using React Native & Expo.

---

**Ready to start sorting?** 🎉

Run `npx expo start` and enjoy the game!
