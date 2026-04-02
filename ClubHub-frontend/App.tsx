// App.tsx
import React, { useEffect, useState } from "react";
import { SplashScreen } from "./src/screens/Splash/SplashScreen";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/queryClient";
import { SocketProvider } from "./src/contexts/SocketContext";
import { registerForPushNotifications } from "./src/utils/notifications";
import { setupNotificationChannels } from "./src/utils/notifications";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    if (!splashDone) return;

    registerForPushNotifications();
    setupNotificationChannels();
  }, [splashDone]);
  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            {!splashDone ? (
              <SplashScreen onFinish={() => setSplashDone(true)} />
            ) : (
              <AppNavigator />
            )}
          </SocketProvider>
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
