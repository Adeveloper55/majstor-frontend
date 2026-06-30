import { create } from "zustand";
import type { AuthState, Handyman, Role, User } from "@/types";
import { AUTH_COOKIE_MAX_AGE, clearAuth, setAuthSession } from "@/lib/auth";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  role: null,
  user: null,
  login: (token, refreshToken, role, user) => {
    setAuthSession(token, refreshToken, role, user);
    set({ token, refreshToken, role, user });
  },
  logout: () => {
    clearAuth();
    set({ token: null, refreshToken: null, role: null, user: null });
  },
  hydrate: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role") as Role | null;
    const userStr = localStorage.getItem("user");
    const user = userStr ? (JSON.parse(userStr) as User | Handyman) : null;
    if (token) {
      document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    if (role) {
      document.cookie = `role=${encodeURIComponent(role)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    set({ token, refreshToken, role, user });
  },
}));
