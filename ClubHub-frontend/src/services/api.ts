import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { refreshToken } from "./AuthService";
import { teamConfig } from "../config/teamConfig";

const BACKEND_URI = "http://https://clubhub-c8u0.onrender.com:3000"; 
let memoryToken: string | null = null;

export function setMemoryToken(token: string | null) {
  memoryToken = token;
}

export const api = axios.create({
  baseURL: BACKEND_URI + "/api/",
  timeout: 15000,
});

export const scrapperApi = axios.create({
  baseURL: BACKEND_URI + "/api/",
  timeout: 300000,
});

api.interceptors.request.use(async (config) => {

  const token = memoryToken ?? await AsyncStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

scrapperApi.interceptors.request.use(async (config) => {
  const token = memoryToken ?? await AsyncStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

scrapperApi.interceptors.response.use(
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

      return scrapperApi(original);
    }

    return Promise.reject(error);
  }
);
