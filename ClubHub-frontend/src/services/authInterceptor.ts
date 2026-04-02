import api from "../api/api";
import { getRefreshToken, setTokens, clearTokens } from "../storage/auth";

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) throw new Error();

        const res = await api.post("/refresh", { refreshToken });

        await setTokens(res.data.accessToken, res.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        await clearTokens();
      }
    }

    return Promise.reject(error);
  }
);