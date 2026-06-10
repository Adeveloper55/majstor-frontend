"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  SERVICE_CATEGORIES,
  categoryRoutes,
  getCategoryPriceLabel,
} from "@/constants/categories";

interface MobileSiteNavProps {
  isLoggedIn?: boolean;
  panelHref?: string;
  onLogout?: () => void;
  onNavigate: () => void;
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold",
          open ? "text-brand-600" : "text-slate-800"
        )}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-2 pb-3">{children}</div>}
    </div>
  );
}

export function MobileSiteNav({
  isLoggedIn,
  panelHref = "/dashboard",
  onLogout,
  onNavigate,
}: MobileSiteNavProps) {
  const [nadjiOpen, setNadjiOpen] = useState(false);
  const [alatiOpen, setAlatiOpen] = useState(false);
  const [izvodjaciOpen, setIzvodjaciOpen] = useState(false);
  const [ceneOpen, setCeneOpen] = useState(false);

  const linkClass =
    "block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600";

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
      <Accordion title="Nađi majstore" open={nadjiOpen} onToggle={() => setNadjiOpen((v) => !v)}>
        <ul className="max-h-64 overflow-y-auto">
          {SERVICE_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={categoryRoutes.majstori(c.slug)} className={linkClass} onClick={onNavigate}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/register/client"
          className={cn(buttonVariants({ size: "sm" }), "mx-3 mt-2 w-[calc(100%-1.5rem)] bg-brand-600 hover:bg-brand-700")}
          onClick={onNavigate}
        >
          Nađi majstore
        </Link>
      </Accordion>

      <Accordion title="Alati" open={alatiOpen} onToggle={() => setAlatiOpen((v) => !v)}>
        <div className="space-y-1 px-2">
          <div>
            <button
              type="button"
              onClick={() => setIzvodjaciOpen((v) => !v)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold",
                izvodjaciOpen ? "text-brand-600" : "text-slate-700"
              )}
            >
              Izvođači
              <ChevronDown className={cn("h-4 w-4 transition-transform", izvodjaciOpen && "rotate-180")} />
            </button>
            {izvodjaciOpen && (
              <ul className="max-h-48 overflow-y-auto pl-2">
                {SERVICE_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={categoryRoutes.izvodjaci(c.slug)}
                      className={linkClass}
                      onClick={onNavigate}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => setCeneOpen((v) => !v)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold",
                ceneOpen ? "text-brand-600" : "text-slate-700"
              )}
            >
              Prosečne cene
              <ChevronDown className={cn("h-4 w-4 transition-transform", ceneOpen && "rotate-180")} />
            </button>
            {ceneOpen && (
              <ul className="max-h-48 overflow-y-auto pl-2">
                {SERVICE_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={categoryRoutes.prosecneCene(c.slug)}
                      className={linkClass}
                      onClick={onNavigate}
                    >
                      {getCategoryPriceLabel(c)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Accordion>

      <Link
        href="/contact"
        className="block border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800"
        onClick={onNavigate}
      >
        Kontakt
      </Link>

      <div className="space-y-2 p-4">
        {!isLoggedIn && (
          <Link
            href="/registracija-preduzeca"
            className={cn(buttonVariants(), "w-full bg-brand-600 hover:bg-brand-700")}
            onClick={onNavigate}
          >
            Da li ste izvođač?
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link href={panelHref} className={cn(buttonVariants({ variant: "outline" }), "w-full")} onClick={onNavigate}>
              Moj panel
            </Link>
            {onLogout && (
              <button type="button" className={cn(buttonVariants({ variant: "ghost" }), "w-full")} onClick={() => { onLogout(); onNavigate(); }}>
                Odjava
              </button>
            )}
          </>
        ) : (
          <>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full")} onClick={onNavigate}>
              Prijavi se
            </Link>
            <Link href="/register" className={cn(buttonVariants(), "w-full")} onClick={onNavigate}>
              Registruj se
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "ghost" }), "w-full")} onClick={onNavigate}>
              Kontakt
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
