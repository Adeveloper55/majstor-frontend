"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NadjiMajstoreMenu } from "./NadjiMajstoreMenu";
import { AlatiMenu } from "./AlatiMenu";
import { MobileSiteNav } from "./MobileSiteNav";
import { APP_NAME } from "@/constants";

interface SiteHeaderNavProps {
  isLoggedIn?: boolean;
  panelHref?: string;
  userLabel?: string;
  onLogout?: () => void;
  /** Kompaktan header na panel/admin stranicama — bez mega menija */
  compact?: boolean;
}

type OpenMenu = "nadji" | "alati" | null;

export function SiteHeaderNav({
  isLoggedIn,
  panelHref = "/dashboard",
  userLabel,
  onLogout,
  compact = false,
}: SiteHeaderNavProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenus = useCallback(() => setOpenMenu(null), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

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

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  const onHero = pathname === "/" && !compact;

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 border-b",
        onHero
          ? "border-white/5 bg-[#01040f]/40 backdrop-blur-md"
          : "glass-nav border-slate-200 bg-white"
      )}
    >
      <div className="page-container">
        <div className="flex h-16 items-center gap-4 md:gap-6">
          <Link
            href="/"
            className={cn(
              "flex shrink-0 items-center gap-2 text-lg font-bold no-underline",
              onHero ? "text-white" : "text-primary-800"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-white",
                onHero ? "bg-blue-500 shadow-glow-blue-sm" : "bg-primary-800"
              )}
            >
              <Wrench className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>

          {/* Nađi majstore, Alati — sakriveno u kompaktnom panel modu */}
          {!compact && (
          <nav
            className="hidden min-w-0 flex-1 items-center gap-1 md:flex"
            aria-label="Glavna navigacija"
          >
            <NadjiMajstoreMenu
              open={openMenu === "nadji"}
              active={openMenu === "nadji"}
              onOpen={() => setOpenMenu("nadji")}
              onClose={closeMenus}
              inverted={onHero}
            />
            <AlatiMenu
              open={openMenu === "alati"}
              active={openMenu === "alati"}
              onOpen={() => setOpenMenu("alati")}
              onClose={closeMenus}
              inverted={onHero}
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
          )}

          {compact && <div className="hidden flex-1 md:block" aria-hidden />}

          {/* Desna strana — auth ili korisnički panel */}
          {!isLoggedIn ? (
            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  onHero && "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
              >
                Prijavi se
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  onHero && "bg-blue-500 hover:bg-blue-600"
                )}
              >
                Registruj se
              </Link>
            </div>
          ) : (
            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Link
                href={panelHref}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  onHero && "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
              >
                Moj panel
              </Link>
              {userLabel && (
                <span
                  className={cn(
                    "max-w-[100px] truncate text-sm lg:max-w-[140px]",
                    onHero ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {userLabel}
                </span>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    onHero && "border-white/25 text-slate-200 hover:bg-white/10 hover:text-white"
                  )}
                >
                  Odjava
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            className={cn(
              "relative z-[110] ml-auto inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg border md:hidden",
              onHero
                ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-site-nav"
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
          onNavigate={closeMobile}
          onClose={closeMobile}
        />
      )}
    </header>
  );
}
