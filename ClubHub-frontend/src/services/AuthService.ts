import { api, publicApi } from "./api";

export async function login(userName: string, password: string) {
  const response = await publicApi.post("auth/login", {
    userName,
    password,
  });

  return response.data;
}

export async function refreshToken(refreshToken: string) {
  const response = await publicApi.post("auth/refresh", {
    refreshToken,
  });

  return response.data;
}

export async function logout() {
  const response = await api.post("auth/logout");

  return response.data;
}

export async function getMe() {
  const response = await api.get("auth/me");
  return response.data;
}
