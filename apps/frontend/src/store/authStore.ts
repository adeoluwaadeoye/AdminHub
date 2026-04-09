import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user:        null,
  loading:     false,
  initialized: false,

  // ── REGISTER ──────────────────────────────────────────────
  register: async (data) => {
    set({ loading: true });
    try {
      const res = await apiRequest<{ token: string }>("/auth/register", {
        method: "POST",
        body:   JSON.stringify(data),
      });
      // ✅ store token in localStorage for cross-domain middleware
      if (res.token) localStorage.setItem("token", res.token);
      await get().fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  // ── LOGIN ─────────────────────────────────────────────────
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body:   JSON.stringify({ email, password }),
      });
      // ✅ store token in localStorage for cross-domain middleware
      if (res.token) localStorage.setItem("token", res.token);
      await get().fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  // ── FETCH USER ────────────────────────────────────────────
  fetchUser: async () => {
    try {
      const res = await apiRequest<{ user: User }>("/auth/me");
      set({ user: res.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  // ── LOGOUT ────────────────────────────────────────────────
  logout: async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      // ✅ clear token from localStorage on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      set({ user: null });
    }
  },
}));