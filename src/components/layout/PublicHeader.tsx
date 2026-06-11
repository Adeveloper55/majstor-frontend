"use client";

import { useRouter } from "next/navigation";
import { SiteHeaderNav } from "@/components/layout/header/SiteHeaderNav";
import { useAuthStore } from "@/store/authStore";

export function PublicHeader({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { token, role, user, logout } = useAuthStore();
  const isLoggedIn = !!token;

  const panelHref =
    role === "ROLE_ADMIN" ? "/admin" : role === "ROLE_HANDYMAN" ? "/jobs" : "/dashboard";

  return (
    <SiteHeaderNav
      compact={compact}
      isLoggedIn={isLoggedIn}
      panelHref={panelHref}
      userLabel={user?.fullName || user?.email}
      onLogout={() => {
        logout();
        router.push("/");
      }}
    />
  );
}
