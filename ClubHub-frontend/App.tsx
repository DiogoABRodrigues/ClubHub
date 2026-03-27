// App.tsx
import React, { useState } from 'react';
import { SplashScreen } from './src/screens/Splash/SplashScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MatchesProvider } from './src/contexts/MatchesContext';
import { TeamsProvider } from './src/contexts/TeamsContext';
import { NewsProvider } from './src/contexts/NewsContext';
import { StandingsProvider } from './src/contexts/StandingsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MatchesProvider>
        <TeamsProvider>
          <NewsProvider>
            <StandingsProvider>
              {!splashDone ? (
                <SplashScreen onFinish={() => setSplashDone(true)} />
              ) : (
                <AppNavigator />
              )}
            </StandingsProvider>
          </NewsProvider>
        </TeamsProvider>
      </MatchesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});