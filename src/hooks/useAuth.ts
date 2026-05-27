"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { clearAuth } from "@/lib/auth";

export function useAuth() {
  const { token, role, user, login, logout, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleLogout = () => {
    logout();
    clearAuth();
    window.location.href = "/login";
  };

  return {
    token,
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
