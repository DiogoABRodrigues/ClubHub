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
import { CompetitionsProvider } from "./src/contexts/CompetitionContext";
import { StatementsProvider } from "./src/contexts/StatementContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/queryClient";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MatchesProvider>
          <TeamsProvider>
            <NewsProvider>
              <StandingsProvider>
                <StatsProvider>
                    <SeasonsProvider>
                      <CompetitionsProvider>
                        <StatementsProvider>
                          {!splashDone ? (
                            <SplashScreen onFinish={() => setSplashDone(true)} />
                          ) : (
                            <AppNavigator />
                          )}
                        </StatementsProvider>
                      </CompetitionsProvider>
                    </SeasonsProvider>
                </StatsProvider>
              </StandingsProvider>
            </NewsProvider>
          </TeamsProvider>
        </MatchesProvider>
      </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
