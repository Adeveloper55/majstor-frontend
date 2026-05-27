"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";

const publicRoutes = ["/", "/login", "/register/client", "/register/handyman", "/forgot-password", "/reset-password", "/offline", "/contact"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const showFooter = pathname === "/" || pathname === "/contact";

  return (
    <div className="flex min-h-screen flex-col">
      {isPublic ? <PublicHeader /> : <Header />}
      <div className="flex-1">{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}
