import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoNotifications from "expo-notifications";
import { DeviceService } from "../services/DeviceService";

export async function registerForPushNotifications() {
  try {
    if (Platform.OS === "android") {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Push permission not granted (Android)");
        return;
      }
    }

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

    // over19 tudo true por defeito; restantes categorias tudo false
    await DeviceService.register({
      id: deviceId,
      pushToken: token,
      platform: Platform.OS,
      news: true,
      over19_goals: true,
      over19_matchday: true,
      over19_result: true,
      sub19_goals: false,
      sub19_matchday: false,
      sub19_result: false,
      sub17_goals: false,
      sub17_matchday: false,
      sub17_result: false,
      sub15_goals: false,
      sub15_matchday: false,
      sub15_result: false,
      sub13_goals: false,
      sub13_matchday: false,
      sub13_result: false,
    });
  } catch (err) {
    console.log("Push registration error:", err);
  }
}

export const parseBooleanSetting = (value?: string) => {
  return value === "true";
};
