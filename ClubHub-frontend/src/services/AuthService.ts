import { api } from "./api";

export async function login(userName: string, password: string) {
  const response = await api.post("auth/login", {
    userName,
    password,
  });

  return response.data;
}

export async function refreshToken(refreshToken: string) {
  const response = await api.post("auth/refresh", {
    refreshToken,
  });

  return response.data;
}

export async function logout(userName: string, password: string) {
  const response = await api.post("auth/logout", {
    userName,
    password,
  });

  return response.data;
}

export async function getMe() {
  const response = await api.get("auth/me");
  return response.data;
}
