"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryListPanelProps {
  items: { href: string; label: string }[];
  className?: string;
}

export function CategoryListPanel({ items, className }: CategoryListPanelProps) {
  return (
    <ul className={cn("max-h-[min(420px,70vh)] overflow-y-auto overscroll-contain", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
