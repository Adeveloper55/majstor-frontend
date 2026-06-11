"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

interface PanelLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Layout za ulogovane klijente i majstore — sidebar + sadržaj bez duplog scroll-a. */
export function PanelLayout({ children, className }: PanelLayoutProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
      <Sidebar />
      <div className={cn("min-w-0 flex-1 pb-[4.75rem] md:pb-0", className)}>{children}</div>
    </div>
  );
}
