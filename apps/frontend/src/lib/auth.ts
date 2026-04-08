import { apiRequest } from "./api";
import { authStorage } from "./auth-storage";

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = (await apiRequest(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )) as AuthResponse;

  authStorage.setToken(res.token);

  return res;
}

export async function login(data: {
  email: string;
  password: string;
}) {
  const res = (await apiRequest(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )) as AuthResponse;

  authStorage.setToken(res.token);

  return res;
}

export async function getMe() {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  return apiRequest("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function logout() {
  authStorage.clearToken();
}