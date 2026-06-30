"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { logoutSession } from "@/lib/auth";

export function useAuth() {
  const { token, role, user, login, logout, hydrate, refreshToken } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleLogout = async () => {
    await logoutSession();
    logout();
    window.location.href = "/login";
  };

  return {
    token,
    refreshToken,
    role,
    user,
    login,
    logout: handleLogout,
    hydrate,
    isAuthenticated: !!token,
    isClient: role === "ROLE_CLIENT",
    isHandyman: role === "ROLE_HANDYMAN",
    isAdmin: role === "ROLE_ADMIN",
  };
}
