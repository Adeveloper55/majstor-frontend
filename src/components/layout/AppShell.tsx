"use client";

import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showFooter =
    pathname === "/" ||
    pathname === "/contact" ||
    pathname.startsWith("/majstori/") ||
    pathname.startsWith("/izvodjaci/") ||
    pathname.startsWith("/prosecne-cene/") ||
    pathname === "/magazin";

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <div className="flex-1">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
