"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Klijenti" },
  { href: "/admin/handymen", label: "Majstori" },
  { href: "/admin/jobs", label: "Poslovi" },
  { href: "/admin/job-requests", label: "Zahtevi za posao" },
  { href: "/admin/token-requests", label: "Zahtevi za tokene" },
  { href: "/admin/company-registrations", label: "Registracije preduzeća" },
  { href: "/admin/contact", label: "Kontakt poruke" },
  { href: "/admin/reviews", label: "Recenzije" },
];

function AdminNavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={cn(
            "rounded-lg px-3 py-2.5 text-base font-medium",
            pathname === link.href || pathname.startsWith(`${link.href}/`)
              ? "bg-blue-700"
              : "hover:bg-gray-800"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="sticky top-16 z-40 flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3 md:hidden">
        <p className="text-sm font-semibold text-white">Admin panel</p>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-white hover:bg-gray-800"
          aria-label="Otvori admin meni"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Zatvori meni"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(18rem,88vw)] flex-col bg-gray-900 p-4 text-white shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Admin panel</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-800"
                aria-label="Zatvori meni"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminNavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <aside className="hidden w-56 shrink-0 border-r bg-gray-900 p-4 text-white md:block">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Admin panel</p>
        <AdminNavLinks pathname={pathname} />
      </aside>
    </>
  );
}
