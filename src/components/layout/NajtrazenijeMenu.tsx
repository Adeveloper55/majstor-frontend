"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Droplets, Hammer, Paintbrush, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_ICONS, SERVICE_CATEGORIES } from "@/constants";
import { categoryRoutes } from "@/constants/categories";
import type { Category } from "@/types";
import type { LucideIcon } from "lucide-react";

function unwrapPage<T>(data: { content?: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return data.content ?? [];
}

export type NajtrazenijeItem = {
  slug: string;
  name: string;
  id?: number;
};

function buildCategoryList(apiCategories: Category[]): NajtrazenijeItem[] {
  const bySlug = new Map(apiCategories.map((c) => [c.slug, c]));
  return SERVICE_CATEGORIES.map(({ slug, name }) => {
    const fromApi = bySlug.get(slug);
    return {
      slug,
      name: fromApi?.name ?? name,
      id: fromApi?.id,
    };
  });
}

const FEATURED_CATEGORIES: { slug: string; icon: LucideIcon; color: string }[] = [
  { slug: "elektroinstalacije-elektricar", icon: Zap, color: "bg-amber-100 text-amber-700" },
  { slug: "vodoinstalater", icon: Droplets, color: "bg-blue-100 text-blue-700" },
  { slug: "stolar", icon: Hammer, color: "bg-orange-100 text-orange-700" },
  { slug: "krecenje-moler", icon: Paintbrush, color: "bg-purple-100 text-purple-700" },
];

const GRID_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
];

interface NajtrazenijeMenuProps {
  variant?: "light" | "dark";
  className?: string;
}

export function NajtrazenijeMenu({ variant = "light", className }: NajtrazenijeMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: apiCategories = [] } = useQuery({
    queryKey: ["categories", "najtrazenije"],
    queryFn: async () => unwrapPage<Category>((await api.get("/api/categories?size=100")).data),
    staleTime: 5 * 60 * 1000,
  });

  const categories = buildCategoryList(apiCategories);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const triggerClass =
    variant === "light"
      ? "text-slate-700 hover:bg-slate-100"
      : "text-white hover:bg-white/10";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
          triggerClass,
          open && (variant === "light" ? "bg-slate-100" : "bg-white/10")
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Najtraženije
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[min(92vw,720px)] rounded-xl border border-slate-200 bg-white p-4 shadow-elevated">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Najtraženije usluge
          </p>
          <div className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={categoryRoutes.majstori(cat.slug)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-900"
              >
                <span className="text-base">{CATEGORY_ICONS[cat.slug] || "🔨"}</span>
                <span className="leading-snug">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  name,
  slug,
  href,
  icon,
  colorClass,
  compact = false,
}: {
  name: string;
  slug: string;
  href: string;
  icon?: LucideIcon;
  colorClass: string;
  compact?: boolean;
}) {
  const Icon = icon;
  const emoji = CATEGORY_ICONS[slug] || "🔨";

  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elevated">
        <CardContent className={cn("flex flex-col items-center gap-3 text-center", compact ? "p-4" : "p-6")}>
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl",
              colorClass,
              compact ? "h-12 w-12 text-xl" : "h-14 w-14"
            )}
          >
            {Icon ? <Icon className={compact ? "h-6 w-6" : "h-7 w-7"} /> : <span>{emoji}</span>}
          </div>
          <p className={cn("font-semibold text-slate-800", compact ? "text-sm leading-snug" : "text-base")}>
            {name}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function NajtrazenijeGrid() {
  const [showAll, setShowAll] = useState(false);

  const { data: apiCategories = [], isLoading } = useQuery({
    queryKey: ["categories", "najtrazenije-grid"],
    queryFn: async () => unwrapPage<Category>((await api.get("/api/categories?size=100")).data),
    staleTime: 5 * 60 * 1000,
  });

  const categories = buildCategoryList(apiCategories);
  const featuredSlugs = new Set(FEATURED_CATEGORIES.map((f) => f.slug));
  const otherCategories = categories.filter((c) => !featuredSlugs.has(c.slug));

  if (isLoading) {
    return <p className="text-center text-slate-500">Učitavanje kategorija...</p>;
  }

  return (
    <div className="space-y-10">
      {/* Istaknute — isti lep izgled kao ranije */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {FEATURED_CATEGORIES.map(({ slug, icon, color }) => {
          const cat = categories.find((c) => c.slug === slug);
          if (!cat) return null;
          return (
            <CategoryCard
              key={slug}
              slug={slug}
              name={cat.name}
              href={categoryRoutes.majstori(slug)}
              icon={icon}
              colorClass={color}
            />
          );
        })}
      </div>

      {/* Ostale kategorije */}
      {showAll ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {otherCategories.map((cat, i) => (
            <CategoryCard
              key={cat.slug}
              slug={cat.slug}
              name={cat.name}
              href={categoryRoutes.majstori(cat.slug)}
              colorClass={GRID_COLORS[i % GRID_COLORS.length]}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => setShowAll(true)}>
            Prikaži sve kategorije ({categories.length})
          </Button>
        </div>
      )}
    </div>
  );
}
