import * as SecureStore from "expo-secure-store";

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const DEVICE_ACCESS = "deviceAccessToken";
const OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const saveTokens = async (access: string, refresh: string) => {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS, access, OPTIONS),
    SecureStore.setItemAsync(REFRESH, refresh, OPTIONS),
  ]);
};

export const getAccessToken = () => SecureStore.getItemAsync(ACCESS);
export const getRefreshToken = () => SecureStore.getItemAsync(REFRESH);
export const saveDeviceAccessToken = (token: string) =>
  SecureStore.setItemAsync(DEVICE_ACCESS, token, OPTIONS);
export const getDeviceAccessToken = () =>
  SecureStore.getItemAsync(DEVICE_ACCESS);

export const clearTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS),
    SecureStore.deleteItemAsync(REFRESH),
  ]);
};
