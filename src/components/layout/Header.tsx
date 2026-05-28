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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="shrink-0 text-lg font-bold text-primary-800" title="Početna strana">
            Majstor na klik
          </Link>
          <Link href="/" className="hidden text-sm font-medium text-slate-600 hover:text-primary-800 sm:inline">
            Početna
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {tokenBalance !== null && tokenBalance !== undefined && (
            <span className="rounded-full bg-primary-100 px-3 py-1.5 text-sm font-semibold text-primary-900">
              {tokenBalance} tokena
            </span>
          )}
          {user && <span className="hidden text-base font-medium text-slate-700 sm:inline">{user.fullName || user.email}</span>}
          <Button variant="outline" size="sm" onClick={() => { logout(); router.push("/login"); }}>
            Odjava
          </Button>
        </div>
      </div>
    </header>
  );
}
