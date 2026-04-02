import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotifications() {
  if (!Device.isDevice) return;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // 🆔 criar ou obter deviceId
  let deviceId = await AsyncStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2);
    await AsyncStorage.setItem("deviceId", deviceId);
  }

  // 🚀 enviar para backend
  await fetch("https://teu-backend.com/devices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: deviceId,
      pushToken: token,
      platform: Platform.OS,
      goals: true,
      matchday: true,
      result: true,
      news: false,
    }),
  });
}

export async function setupNotificationChannels() {
  await Notifications.setNotificationChannelAsync("goals", {
    name: "Golos",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 300, 200, 300],
    sound: "goal.wav",
  });

  await Notifications.setNotificationChannelAsync("general", {
    name: "Geral",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}