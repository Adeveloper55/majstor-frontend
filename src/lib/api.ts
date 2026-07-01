import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearAuth, getRefreshToken } from "@/lib/auth";
import { resolveApiBaseUrl } from "@/lib/apiUrl";
import { useAuthStore } from "@/store/authStore";
import type { Handyman, Role, User } from "@/types";

const api = axios.create({
  timeout: 20_000,
});

function applyBaseUrl(config: InternalAxiosRequestConfig) {
  config.baseURL = resolveApiBaseUrl();
  return config;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post<{
        token: string;
        refreshToken: string;
        role: Role;
        user: User | Handyman;
      }>(`${resolveApiBaseUrl()}/api/auth/refresh`, { refreshToken })
      .then((res) => {
        const { token, refreshToken: newRefresh, role, user } = res.data;
        useAuthStore.getState().login(token, newRefresh, role, user);
        return token;
      })
      .catch(() => {
        clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  applyBaseUrl(config);
  if (typeof window !== "undefined") {
    const url = config.url || "";
    const isPublicAuth =
      url.startsWith("/api/auth/") && !url.startsWith("/api/auth/refresh");
    const token = localStorage.getItem("token");
    if (token && !isPublicAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/api/auth/refresh") &&
      !original.url?.includes("/api/auth/login") &&
      !original.url?.includes("/api/handymen/search") &&
      !original.url?.includes("/api/handymen/count") &&
      !original.url?.includes("/api/handymen/public-profile/")
    ) {
      const hadAuth = Boolean(original.headers?.Authorization);
      if (hadAuth) {
        original._retry = true;
        const newToken = await refreshAccessToken();
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
