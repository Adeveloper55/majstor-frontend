import { create } from "zustand";
import type { AuthState, Handyman, Role, User } from "@/types";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  user: null,
  login: (token, role, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `role=${encodeURIComponent(role)}; path=/; max-age=86400; SameSite=Lax`;
    set({ token, role, user });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    set({ token: null, role: null, user: null });
  },
  hydrate: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;
    const userStr = localStorage.getItem("user");
    const user = userStr ? (JSON.parse(userStr) as User | Handyman) : null;
    if (token) {
      document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
    }
    if (role) {
      document.cookie = `role=${encodeURIComponent(role)}; path=/; max-age=86400; SameSite=Lax`;
    }
    set({ token, role, user });
  },
}));
