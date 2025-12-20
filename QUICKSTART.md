# 🎮 Shelfie Sort - Quick Start Guide

## 🚀 Current Status: ✅ READY TO TEST

Your game is **fully functional** and running!

## ▶️ Testing Right Now

### Option 1: Mobile Device (Recommended)
1. Download **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. The dev server is already running! Look for the QR code in your terminal

3. Open Expo Go and scan the QR code

4. The game will load on your device!

### Option 2: iOS Simulator (Mac only)
```bash
npm run ios
```

### Option 3: Android Emulator
```bash
npm run android
```

---

## 🎯 What to Test

| Feature | How to Test |
|---------|-------------|
| **Drag & Drop** | Touch and drag any item to another shelf |
| **Match 3** | Get 3 identical items on the same shelf |
| **Coins** | See the coin counter increase after a match |
| **Level Complete** | Clear all items to win and advance to next level |
| **Shop** | Tap the coin button → Buy decorations |
| **Persistence** | Close and reopen the app → Your progress should be saved |

---

## 📁 Project Structure (Quick Reference)

```
src/
├── screens/
│   ├── GameScreen.tsx     👈 Main game logic
│   └── ShopScreen.tsx     👈 Decoration shop
├── components/
│   ├── GameItemComponent.tsx   👈 Draggable items
│   └── ShelfComponent.tsx      👈 Shelf containers
├── store/
│   └── gameStore.ts       👈 State + MMKV persistence
├── utils/
│   └── levelGenerator.ts  👈 Buffer Rule algorithm
└── constants/
    └── game.constants.ts  👈 Game settings

App.tsx                    👈 Entry point
```

---

## 🔧 Quick Customization

### Change Colors
Edit `src/constants/game.constants.ts`:
```typescript
export const ITEM_CONFIGS = {
  soda: { color: '#YOUR_COLOR', label: '🥤' },
  // ...
};
```

### Adjust Difficulty
```typescript
export const GAME_CONFIG = {
  BASE_SHELVES_COUNT: 4,  // Starting shelves
  COINS_PER_MATCH: 10,    // Coins per match
};
```

### Change Item Types
```typescript
export const ITEM_CONFIGS = {
  pizza: { color: '#FF6347', label: '🍕' },
  // Add your own!
};
```

---

## 📦 Adding Features

### Want to add sounds?
Uncomment in `GameScreen.tsx`:
```typescript
import { Audio } from 'expo-av';

// Play on match
const sound = await Audio.Sound.createAsync(
  require('../assets/sounds/match.mp3')
);
await sound.playAsync();
```

### Want ads?
Already configured! Just update unit IDs in:
- `src/constants/game.constants.ts` (production IDs)
- `app.json` (app IDs)

### Want images instead of emojis?
Replace in `GameItemComponent.tsx`:
```typescript
// Current:
<Text style={styles.itemEmoji}>{itemConfig.label}</Text>

// New:
<Image source={require(`../assets/items/${item.type}.png`)} />
```

---

## 📖 Documentation

- **README.md** - Full project overview
- **IMPLEMENTATION_GUIDE.md** - Deep dive into architecture
- **This file** - Quick reference for development

---

## 🎉 You're All Set!

The game is **running and playable** right now.

### Next Steps:
1. ✅ **Test it** - Open Expo Go and play!
2. 🎨 **Customize it** - Change colors, add items
3. 🔊 **Add sounds** - Make it juicy
4. 📱 **Build for production** - `npx eas build`

---

## 💡 Pro Tips

- **Hot Reload** is enabled - Save any file to see instant changes
- **Press 'r'** in terminal to reload manually
- **Press 'm'** in terminal to toggle menu
- **Shake device** to open developer menu

---

## 🐛 Troubleshooting

### App won't load?
```bash
# Clear cache and restart
npx expo start --clear
```

### TypeScript errors in IDE?
They're just warnings - the app runs fine! You can ignore them or:
```bash
npm run tsc
```

### Module not found?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

**Happy Coding! 🚀**

Questions? Check `IMPLEMENTATION_GUIDE.md` for detailed explanations.
