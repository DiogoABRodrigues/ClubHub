import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const DEVICE_ACCESS = "deviceAccessToken";
const OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const isWeb = Platform.OS === "web";

function webStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

async function setItem(key: string, value: string) {
  if (isWeb) {
    webStorage()?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value, OPTIONS);
}

async function getItem(key: string) {
  if (isWeb) return webStorage()?.getItem(key) ?? null;
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (isWeb) {
    webStorage()?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const saveTokens = async (access: string, refresh: string) => {
  await Promise.all([
    setItem(ACCESS, access),
    setItem(REFRESH, refresh),
  ]);
};

export const getAccessToken = () => getItem(ACCESS);
export const getRefreshToken = () => getItem(REFRESH);
export const saveDeviceAccessToken = (token: string) =>
  setItem(DEVICE_ACCESS, token);
export const getDeviceAccessToken = () =>
  getItem(DEVICE_ACCESS);

export const clearTokens = async () => {
  await Promise.all([
    deleteItem(ACCESS),
    deleteItem(REFRESH),
  ]);
};
