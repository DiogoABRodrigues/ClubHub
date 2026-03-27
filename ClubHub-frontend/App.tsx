// App.tsx
import React, { useState } from "react";
import { SplashScreen } from "./src/screens/Splash/SplashScreen";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { MatchesProvider } from "./src/contexts/MatchesContext";
import { TeamsProvider } from "./src/contexts/TeamsContext";
import { NewsProvider } from "./src/contexts/NewsContext";
import { StandingsProvider } from "./src/contexts/StandingsContext";
import { PlayersProvider } from "./src/contexts/PlayersContext";
import { StatsProvider } from "./src/contexts/StatsContext";
import { SeasonsProvider } from "./src/contexts/SeasonContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MatchesProvider>
        <TeamsProvider>
          <NewsProvider>
            <StandingsProvider>
              <StatsProvider>
                <PlayersProvider>
                  <SeasonsProvider>
                    {!splashDone ? (
                      <SplashScreen onFinish={() => setSplashDone(true)} />
                    ) : (
                      <AppNavigator />
                    )}
                  </SeasonsProvider>
                </PlayersProvider>
              </StatsProvider>
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
