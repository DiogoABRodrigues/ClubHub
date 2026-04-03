import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const saveTokens = async (access: string, refresh: string) => {
  await AsyncStorage.setItem(ACCESS, access);
  await AsyncStorage.setItem(REFRESH, refresh);
};

export const getAccessToken = () => AsyncStorage.getItem(ACCESS);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH);

export const clearTokens = async () => {
  await AsyncStorage.removeItem(ACCESS);
  await AsyncStorage.removeItem(REFRESH);
};
