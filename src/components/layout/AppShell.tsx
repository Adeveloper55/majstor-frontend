"use client";

import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";

const PANEL_PREFIXES = [
  "/dashboard",
  "/jobs",
  "/applications",
  "/assigned-jobs",
  "/tokens",
  "/profile",
  "/reviews",
];

function isPanelRoute(pathname: string) {
  return PANEL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const compactHeader = isPanelRoute(pathname) || pathname.startsWith("/admin");
  const showFooter =
    pathname === "/" ||
    pathname === "/contact" ||
    pathname.startsWith("/majstori/") ||
    pathname.startsWith("/izvodjaci/") ||
    pathname.startsWith("/prosecne-cene/") ||
    pathname === "/magazin" ||
    pathname === "/pretraga" ||
    pathname.startsWith("/pretraga/") ||
    pathname === "/registracija-preduzeca";

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader compact={compactHeader} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
