"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SERVICE_CATEGORIES,
  categoryRoutes,
  getCategoryPriceLabel,
} from "@/constants/categories";
import { CategoryListPanel } from "./CategoryListPanel";

type AlatiPanel = "izvodjaci" | "cene" | null;

interface AlatiMenuProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  active: boolean;
}

export function AlatiMenu({ open, onOpen, onClose, active }: AlatiMenuProps) {
  const [panel, setPanel] = useState<AlatiPanel>("izvodjaci");

  const izvodjaciItems = SERVICE_CATEGORIES.map((c) => ({
    slug: c.slug,
    href: categoryRoutes.izvodjaci(c.slug),
    label: c.name,
  }));

  const ceneItems = SERVICE_CATEGORIES.map((c) => ({
    slug: c.slug,
    href: categoryRoutes.prosecneCene(c.slug),
    label: getCategoryPriceLabel(c),
  }));

  const handleClose = () => {
    setPanel("izvodjaci");
    onClose();
  };

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={() => {
        setPanel("izvodjaci");
        onClose();
      }}
    >
      <button
        type="button"
        onClick={() => (open ? handleClose() : onOpen())}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm font-semibold transition-colors",
          active || open ? "text-brand-600" : "text-slate-800 hover:text-brand-600"
        )}
        aria-expanded={open}
      >
        Alati
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 flex pt-2">
          <div className="w-52 overflow-hidden rounded-l-xl border border-r-0 border-slate-200 bg-white shadow-elevated">
            <button
              type="button"
              onMouseEnter={() => setPanel("izvodjaci")}
              className={cn(
                "block w-full px-4 py-3 text-left text-sm font-semibold transition-colors",
                panel === "izvodjaci" ? "bg-brand-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              Izvođači
            </button>
            <button
              type="button"
              onMouseEnter={() => setPanel("cene")}
              className={cn(
                "block w-full px-4 py-3 text-left text-sm font-semibold transition-colors",
                panel === "cene" ? "bg-brand-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              Prosečne cene
            </button>
          </div>
          {panel && (
            <div className="w-[min(60vw,340px)] rounded-r-xl border border-slate-200 bg-white p-3 shadow-elevated">
              <CategoryListPanel
                items={panel === "izvodjaci" ? izvodjaciItems : ceneItems}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
