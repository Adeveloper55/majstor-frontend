"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import type { Handyman } from "@/types";

export function Header() {
  const { role, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) {
    return null;
  }

  const tokenBalance = role === "ROLE_HANDYMAN" ? (user as Handyman)?.tokenBalance : null;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={role === "ROLE_ADMIN" ? "/admin" : "/dashboard"} className="text-lg font-bold text-primary-800">
          Majstor na klik
        </Link>
        <div className="flex items-center gap-4">
          {tokenBalance !== null && tokenBalance !== undefined && (
            <span className="rounded-full bg-primary-100 px-3 py-1.5 text-sm font-semibold text-primary-900">
              {tokenBalance} tokena
            </span>
          )}
          {user && <span className="text-base font-medium text-slate-700">{user.fullName || user.email}</span>}
          <Button variant="outline" size="sm" onClick={() => { logout(); router.push("/login"); }}>
            Odjava
          </Button>
        </div>
      </div>
    </header>
  );
}
