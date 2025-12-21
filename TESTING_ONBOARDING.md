# 🔧 HOW TO TEST ONBOARDING

## ✅ **App.tsx Updated!**

The onboarding flow is now integrated. Here's how to test it:

---

## 📱 **Method 1: Test as New User (Recommended)**

### On Your Phone:
1. **Uninstall the app** completely from your phone
2. **Scan the QR code** again to reinstall
3. You should now see:
   - ✨ Splash Screen (3 seconds)
   - 📖 Onboarding Carousel (4 slides)
   - 👋 Welcome Screen (name entry)
   - 🎮 Game Screen

---

## 🔄 **Method 2: Reset Without Uninstalling**

Add this to your game (temporary debug button):

In `GameScreen.tsx`, add a reset button:

```typescript
// At top with other imports
import { useUserStore } from '../store/gameStore';

// Inside component
const { resetProgress } = useUserStore();

// Add button in render (temporary)
<TouchableOpacity 
    onPress={async () => {
        await resetProgress();
        // Reload app
    }}
    style={{ position: 'absolute', top: 100, right: 20 }}
>
    <Text style={{ color: 'red' }}>RESET</Text>
</TouchableOpacity>
```

---

## 🎯 **Expected Flow:**

### **First-Time User:**
Splash → Onboarding → Welcome → Game

### **Returning User:**
Splash → Game (direct)

---

## 🐛 **If It's Not Showing:**

1. **Check Console** - Look for errors
2. **Verify files exist:**
   - `src/screens/OnboardingScreen.tsx` ✅
   - `src/screens/WelcomeScreen.tsx` ✅
   - `src/store/gameStore.ts` (updated) ✅
   - `App.tsx` (updated) ✅

3. **Force clear storage:**
   - Use Method 1 (uninstall)
   - Or add reset button (Method 2)

---

## 📊 **Verification:**

After name entry, check console:
```
✅ Player name saved: [YOUR NAME]
✅ Onboarding completed: true
```

Next app launch should skip onboarding!

---

**Delete the app from your phone and reinstall to see the full onboarding flow** 🚀
