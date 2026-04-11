import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoNotifications from "expo-notifications";
import { DeviceService } from "../services/DeviceService";

export async function registerForPushNotifications() {
  try {
    // Android 13+ precisa de pedir POST_NOTIFICATIONS explicitamente
    if (Platform.OS === "android") {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Push permission not granted (Android)");
        return;
      }
    }

    // iOS — pede permissão via Firebase
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log("Push permission not granted (iOS)");
        return;
      }
    }

    const token = await messaging().getToken();

    let deviceId = await AsyncStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2);
      await AsyncStorage.setItem("deviceId", deviceId);
    }

    await DeviceService.register({
      id: deviceId,
      pushToken: token,
      platform: Platform.OS,
      goals: true,
      matchday: true,
      result: true,
      news: false,
    });
  } catch (err) {
    console.log("Push registration error:", err);
  }
}

export const parseBooleanSetting = (value?: string) => {
  return value === "true";
};