"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NadjiMajstoreMenu } from "./NadjiMajstoreMenu";
import { AlatiMenu } from "./AlatiMenu";
import { MobileSiteNav } from "./MobileSiteNav";

interface SiteHeaderNavProps {
  isLoggedIn?: boolean;
  panelHref?: string;
  userLabel?: string;
  onLogout?: () => void;
}

type OpenMenu = "nadji" | "alati" | null;

export function SiteHeaderNav({
  isLoggedIn,
  panelHref = "/dashboard",
  userLabel,
  onLogout,
}: SiteHeaderNavProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenus = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeMenus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [closeMenus]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header ref={headerRef} className="glass-nav sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="page-container">
        <div className="flex h-16 items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold text-primary-800 no-underline"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 text-white">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">Majstor na klik</span>
          </Link>

          {/* Nađi majstore, Alati, Da li ste izvođač? */}
          <nav
            className="hidden min-w-0 flex-1 items-center gap-1 md:flex"
            aria-label="Glavna navigacija"
          >
            <NadjiMajstoreMenu
              open={openMenu === "nadji"}
              active={openMenu === "nadji"}
              onOpen={() => setOpenMenu("nadji")}
              onClose={closeMenus}
            />
            <AlatiMenu
              open={openMenu === "alati"}
              active={openMenu === "alati"}
              onOpen={() => setOpenMenu("alati")}
              onClose={closeMenus}
            />
            {!isLoggedIn && (
              <Link
                href="/registracija-preduzeca"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "ml-1 whitespace-nowrap bg-brand-600 text-white hover:bg-brand-700"
                )}
              >
                Da li ste izvođač?
              </Link>
            )}
          </nav>

          {/* Desna strana — auth ili korisnički panel */}
          {!isLoggedIn ? (
            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Prijavi se
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Registruj se
              </Link>
            </div>
          ) : (
            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link href={panelHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Moj panel
              </Link>
              {userLabel && (
                <span className="max-w-[100px] truncate text-sm text-slate-600 lg:max-w-[140px]">
                  {userLabel}
                </span>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Odjava
                </button>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <MobileSiteNav
          isLoggedIn={isLoggedIn}
          panelHref={panelHref}
          onLogout={onLogout}
          onNavigate={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
