import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { refreshToken } from "./AuthService";

export const api = axios.create({
  baseURL: process.env.BACKEND_URI + "/api/",
  timeout: 5000,
});

export const scrapperApi = axios.create({
  baseURL: process.env.BACKEND_URI + "/api/",
  timeout: 300000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = await AsyncStorage.getItem("refreshToken");
      if (!refresh) return Promise.reject(error);

      const data = await refreshToken(refresh);

      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(original);
    }

    return Promise.reject(error);
  },
);
