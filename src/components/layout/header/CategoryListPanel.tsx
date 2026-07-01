"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryListPanelProps {
  items: { slug: string; label: string; href?: string }[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
  className?: string;
}

export function CategoryListPanel({
  items,
  selectedSlug,
  onSelect,
  className,
}: CategoryListPanelProps) {
  return (
    <ul className={cn("max-h-[min(420px,70vh)] overflow-y-auto overscroll-contain", className)}>
      {items.map((item) => {
        const selected = selectedSlug === item.slug;
        const classNameItem =
          "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors " +
          (selected
            ? "bg-brand-50 font-medium text-brand-700"
            : "text-slate-700 hover:bg-brand-50 hover:text-brand-600");

        if (onSelect) {
          return (
            <li key={item.slug}>
              <button type="button" className={classNameItem} onClick={() => onSelect(item.slug)}>
                {item.label}
              </button>
            </li>
          );
        }

        return (
          <li key={item.slug}>
            <Link href={item.href || "#"} className={classNameItem}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
