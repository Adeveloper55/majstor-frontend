"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SERVICE_CATEGORIES, categoryRoutes } from "@/constants/categories";
import { CategoryListPanel } from "./CategoryListPanel";

interface NadjiMajstoreMenuProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  active: boolean;
}

const STEPS = [
  { n: 1, title: "Pošaljete potražnju" },
  { n: 2, title: "Predložimo vam izvođače" },
  { n: 3, title: "Izaberite najboljeg" },
];

export function NadjiMajstoreMenu({ open, onOpen, onClose, active }: NadjiMajstoreMenuProps) {
  const categoryItems = SERVICE_CATEGORIES.map((c) => ({
    href: categoryRoutes.majstori(c.slug),
    label: c.name,
  }));

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm font-semibold transition-colors",
          active || open ? "text-brand-600" : "text-slate-800 hover:text-brand-600"
        )}
        aria-expanded={open}
      >
        Nađi majstore
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="w-[min(92vw,820px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated">
            <div className="grid md:grid-cols-2">
              <div className="border-b p-5 md:border-b-0 md:border-r md:border-slate-200">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
                  Najtraženije
                </h3>
                <CategoryListPanel items={categoryItems} />
              </div>
              <div className="p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
                  Kako radimo?
                </h3>
                <ol className="space-y-4">
                  {STEPS.map((step) => (
                    <li key={step.n} className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                        {step.n}
                      </span>
                      <span className="pt-1 text-sm font-medium text-slate-700">{step.title}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/register/client"
                  className={cn(
                    buttonVariants(),
                    "mt-6 w-full bg-brand-600 text-white hover:bg-brand-700"
                  )}
                >
                  Nađi majstore
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
