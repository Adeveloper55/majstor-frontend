"use client";

import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
      <AdminSidebar />
      <div className={cn("min-w-0 flex-1 pb-[3.5rem] md:pb-0", className)}>
        {children}
      </div>
    </div>
  );
}
