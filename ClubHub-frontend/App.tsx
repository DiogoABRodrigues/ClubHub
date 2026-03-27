// App.tsx
import React, { useState } from 'react';
import { SplashScreen } from './src/screens/Splash/SplashScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MatchesProvider } from './src/contexts/MatchesContext';
import { TeamsProvider } from './src/contexts/TeamsContext';
import { NewsProvider } from './src/contexts/NewsContext';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <MatchesProvider>
      <TeamsProvider>
        <NewsProvider>
          {!splashDone ? (
            <SplashScreen onFinish={() => setSplashDone(true)} />
          ) : (
            <AppNavigator />
          )}
        </NewsProvider>
      </TeamsProvider>
    </MatchesProvider>
  );
}