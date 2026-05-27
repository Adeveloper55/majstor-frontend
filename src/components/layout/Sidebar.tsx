"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const clientLinks = [
  { href: "/dashboard", label: "Početna" },
  { href: "/jobs", label: "Moji poslovi" },
  { href: "/jobs/new", label: "Novi oglas" },
  { href: "/profile", label: "Profil" },
];

const handymanLinks = [
  { href: "/dashboard", label: "Početna" },
  { href: "/jobs", label: "Poslovi" },
  { href: "/assigned-jobs", label: "Dodeljeni poslovi" },
  { href: "/applications", label: "Prijave" },
  { href: "/tokens", label: "Tokeni" },
  { href: "/profile", label: "Profil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const links = role === "ROLE_HANDYMAN" ? handymanLinks : clientLinks;

  if (role === "ROLE_ADMIN") return null;

  return (
    <aside className="w-56 shrink-0 border-r bg-gray-50 p-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2.5 text-base font-medium",
              pathname === link.href || pathname.startsWith(link.href + "/")
                ? "bg-blue-800 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
