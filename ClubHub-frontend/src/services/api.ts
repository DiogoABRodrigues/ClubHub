import axios from "axios";
import { teamConfig } from "../config/teamConfig";
import { clearTokens, getRefreshToken, saveTokens } from "../storage/auth";

const BASE_URL = `${teamConfig.backend_URL}/api/`;
let memoryToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setMemoryToken(token: string | null) {
  memoryToken = token;
}

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const healthApi = axios.create({
  baseURL: teamConfig.backend_URL,
  // Um cold start do alojamento pode demorar mais do que uma query normal.
  timeout: 60000,
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const scrapperApi = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
});

function attachAccessToken(config: any) {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
}

api.interceptors.request.use(attachAccessToken);
scrapperApi.interceptors.request.use(attachAccessToken);

async function refreshAccessToken(): Promise<string> {
  const refresh = await getRefreshToken();
  if (!refresh) throw new Error("Sem refresh token");

  const { data } = await publicApi.post("auth/refresh", {
    refreshToken: refresh,
  });
  await saveTokens(data.accessToken, data.refreshToken);
  setMemoryToken(data.accessToken);
  return data.accessToken;
}

function installRefreshInterceptor(client: typeof api) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (error.response?.status !== 401 || !original || original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;
      refreshPromise ??= refreshAccessToken()
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
      return client(original);
    },
  );
}

installRefreshInterceptor(api);
installRefreshInterceptor(scrapperApi);
