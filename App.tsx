import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import SplashScreen from './src/components/SplashScreen';
import { useUserStore } from './src/store/gameStore';

// NOTE: AdMob requires a custom development build and doesn't work with Expo Go.
// To enable ads, create a development build with: npx expo prebuild && npx expo run:android/ios

type Screen = 'game' | 'shop';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('game');
  const [showSplash, setShowSplash] = useState(true);
  const { loadProgress } = useUserStore();

  useEffect(() => {
    // Load user progress from AsyncStorage
    loadProgress();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'game':
        return <GameScreen onNavigateToShop={() => setCurrentScreen('shop')} />;
      case 'shop':
        return <ShopScreen onNavigateBack={() => setCurrentScreen('game')} />;
      default:
        return <GameScreen onNavigateToShop={() => setCurrentScreen('shop')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {renderScreen()}

        {/* Animated Splash Screen */}
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
});
