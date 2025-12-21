import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import SplashScreen from './src/components/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { useUserStore } from './src/store/gameStore';

type Screen = 'game' | 'shop';
type AppFlow = 'splash' | 'onboarding' | 'welcome' | 'app';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('game');
  const [appFlow, setAppFlow] = useState<AppFlow>('splash');
  const [isReady, setIsReady] = useState(false);

  const { loadProgress, hasCompletedOnboarding, setPlayerName, completeOnboarding } = useUserStore();

  // Load user progress on app start
  useEffect(() => {
    async function prepare() {
      await loadProgress();
      setIsReady(true);
    }
    prepare();
  }, []);

  // Handle splash screen completion
  useEffect(() => {
    if (isReady && appFlow === 'splash') {
      // Splash screen will auto-transition after 3 seconds
      const timer = setTimeout(() => {
        if (hasCompletedOnboarding) {
          setAppFlow('app');
        } else {
          setAppFlow('onboarding');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isReady, appFlow, hasCompletedOnboarding]);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setAppFlow('welcome');
  };

  // Handle welcome/name entry completion
  const handleWelcomeComplete = (name: string) => {
    setPlayerName(name);
    completeOnboarding();
    setAppFlow('app');
  };

  // Render main game screens
  const renderGameScreen = () => {
    switch (currentScreen) {
      case 'game':
        return <GameScreen onNavigateToShop={() => setCurrentScreen('shop')} />;
      case 'shop':
        return <ShopScreen onNavigateBack={() => setCurrentScreen('game')} />;
      default:
        return <GameScreen onNavigateToShop={() => setCurrentScreen('shop')} />;
    }
  };

  // Render based on app flow
  const renderContent = () => {
    switch (appFlow) {
      case 'splash':
        return <SplashScreen onFinish={() => { }} />;

      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;

      case 'welcome':
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;

      case 'app':
        return (
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <StatusBar style="light" />
              {renderGameScreen()}
            </SafeAreaView>
          </SafeAreaProvider>
        );

      default:
        return <SplashScreen onFinish={() => { }} />;
    }
  };

  if (!isReady) {
    return null; // Wait for data to load
  }

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
});
