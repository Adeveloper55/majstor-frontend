"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Coins,
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const clientLinks = [
  { href: "/dashboard", label: "Početna", shortLabel: "Početna", icon: LayoutDashboard },
  { href: "/jobs", label: "Moji poslovi", shortLabel: "Poslovi", icon: Briefcase },
  { href: "/jobs/new", label: "Novi oglas", shortLabel: "Novi", icon: PlusCircle },
  { href: "/profile", label: "Profil", shortLabel: "Profil", icon: User },
];

const handymanLinks = [
  { href: "/dashboard", label: "Početna", shortLabel: "Početna", icon: LayoutDashboard },
  { href: "/jobs", label: "Poslovi", shortLabel: "Poslovi", icon: Briefcase },
  { href: "/applications", label: "Pregledani poslovi", shortLabel: "Pregledani", icon: ShoppingBag },
  { href: "/tokens", label: "Tokeni", shortLabel: "Tokeni", icon: Coins },
  { href: "/profile", label: "Profil", shortLabel: "Profil", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/jobs") {
    return pathname === "/jobs" || (pathname.startsWith("/jobs/") && !pathname.startsWith("/jobs/new"));
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  links,
  pathname,
  variant,
  onNavigate,
}: {
  links: typeof clientLinks;
  pathname: string;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  return (
    <>
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        const Icon = link.icon;
        if (variant === "mobile") {
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium leading-tight sm:text-xs",
                active ? "text-primary-800" : "text-slate-600"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary-800")} aria-hidden />
              <span className="truncate">{link.shortLabel}</span>
            </Link>
          );
        }
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium",
              active ? "bg-primary-800 text-white" : "text-slate-700 hover:bg-slate-200"
            )}
          >
            <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const links = role === "ROLE_HANDYMAN" ? handymanLinks : clientLinks;

  if (role === "ROLE_ADMIN") return null;

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-slate-50 p-4 md:block">
        <nav className="flex flex-col gap-1">
          <NavLinks links={links} pathname={pathname} variant="desktop" />
        </nav>
      </aside>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Panel navigacija"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
          <NavLinks links={links} pathname={pathname} variant="mobile" />
        </div>
      </nav>
    </>
  );
}
