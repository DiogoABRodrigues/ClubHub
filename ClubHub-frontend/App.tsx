import React, { useCallback, useEffect, useState } from "react";
import { SplashScreen as SplashScreenComponent } from "./src/screens/Splash/SplashScreen";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/queryClient";
import { SocketProvider } from "./src/contexts/SocketContext";
import { SelectedSeasonProvider } from "./src/contexts/Selectedseasoncontext";
import { CategoryProvider } from "./src/contexts/CategoryContext";
import { registerForPushNotifications } from "./src/utils/notifications";
import * as SplashScreen from "expo-splash-screen";

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  useEffect(() => {
    // O splash React mantém-se visível enquanto o backend e os dados carregam.
    // O splash nativo tem de sair para podermos apresentar o estado de erro.
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!splashDone) return;
    registerForPushNotifications();
  }, [splashDone]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <CategoryProvider>
          <SelectedSeasonProvider>
            <AuthProvider>
              <SocketProvider>
                {!splashDone ? (
                  <SplashScreenComponent onFinish={handleSplashFinish} />
                ) : (
                  <AppNavigator />
                )}
              </SocketProvider>
            </AuthProvider>
          </SelectedSeasonProvider>
        </CategoryProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
