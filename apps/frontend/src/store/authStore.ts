import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;

  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false, // ✅ tracks if we've checked the session on load

  // ── REGISTER ──────────────────────────────────────────────
  register: async (data) => {
    set({ loading: true });
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await get().fetchUser();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      throw new Error(message); // ✅ re-throw so form catches it
    } finally {
      set({ loading: false });
    }
  },

  // ── LOGIN ─────────────────────────────────────────────────
  login: async (email, password) => {
    set({ loading: true });
    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await get().fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      throw new Error(message); // ✅ re-throw so form catches it
    } finally {
      set({ loading: false });
    }
  },

  // ── FETCH USER (restores session on page refresh) ─────────
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
      set({ user: null }); // ✅ always clear, even if request fails
    }
  },
}));