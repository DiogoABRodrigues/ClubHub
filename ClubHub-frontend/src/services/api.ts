import axios from "axios";
import { refreshToken } from "./AuthService";
import { teamConfig } from "../config/teamConfig";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../storage/auth";

const BACKEND_URI = teamConfig.backend_URL;
let memoryToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

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
  const token = memoryToken ?? (await getAccessToken());

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

scrapperApi.interceptors.request.use(async (config) => {
  const token = memoryToken ?? (await getAccessToken());

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

      const refresh = await getRefreshToken();
      if (!refresh) return Promise.reject(error);

      refreshPromise ??= refreshToken(refresh)
        .then(async (data) => {
          await saveTokens(data.accessToken, data.refreshToken);
          setMemoryToken(data.accessToken);
          return data.accessToken;
        })
        .catch(async (refreshError) => {
          setMemoryToken(null);
          await clearTokens();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const accessToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${accessToken}`;

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

      const refresh = await getRefreshToken();
      if (!refresh) return Promise.reject(error);

      refreshPromise ??= refreshToken(refresh)
        .then(async (data) => {
          await saveTokens(data.accessToken, data.refreshToken);
          setMemoryToken(data.accessToken);
          return data.accessToken;
        })
        .catch(async (refreshError) => {
          setMemoryToken(null);
          await clearTokens();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const accessToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${accessToken}`;

      return scrapperApi(original);
    }

    return Promise.reject(error);
  },
);
