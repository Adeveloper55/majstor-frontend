import axios from "axios";
import { resolveApiBaseUrl } from "@/lib/apiUrl";
import type { AdminUser, Handyman, Role, User } from "@/types";

/** 7 days — matches backend refresh token lifetime */
export const AUTH_COOKIE_MAX_AGE = 604800;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role") as Role | null;
}

export function setAuthSession(
  token: string,
  refreshToken: string,
  role: Role,
  user: User | Handyman | AdminUser
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("role", role);
  localStorage.setItem("user", JSON.stringify(user));
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `role=${encodeURIComponent(role)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";
}

export async function logoutSession(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await axios.post(`${resolveApiBaseUrl()}/api/auth/logout`, { refreshToken });
    } catch {
      // ignore — local session is cleared regardless
    }
  }
  clearAuth();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
