"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Klijenti" },
  { href: "/admin/handymen", label: "Majstori" },
  { href: "/admin/jobs", label: "Poslovi" },
  { href: "/admin/job-requests", label: "Zahtevi za posao" },
  { href: "/admin/token-requests", label: "Zahtevi za tokene" },
  { href: "/admin/contact", label: "Kontakt poruke" },
  { href: "/admin/reviews", label: "Recenzije" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r bg-gray-900 p-4 text-white">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Admin panel</p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2.5 text-base font-medium",
              pathname === link.href ? "bg-blue-700" : "hover:bg-gray-800"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
