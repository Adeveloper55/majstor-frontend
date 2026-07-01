"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get<Record<string, number>>("/api/admin/stats")).data,
  });

  const stats = [
    { label: "Klijenti", key: "totalUsers", color: "bg-blue-500", href: "/admin/users" },
    { label: "Majstori", key: "totalHandymen", color: "bg-indigo-500", href: "/admin/handymen" },
    { label: "Poslovi", key: "totalJobs", color: "bg-purple-500", href: "/admin/jobs" },
    { label: "Otvoreni", key: "openJobs", color: "bg-green-500", href: "/admin/jobs" },
    { label: "Na čekanju", key: "pendingJobs", color: "bg-orange-500", href: "/admin/pending-jobs" },
    { label: "Pregledani detalji", key: "unlockedLeads", color: "bg-emerald-500", href: "/admin/jobs" },
    { label: "Zahtevi (tokeni)", key: "pendingTokenRequests", color: "bg-amber-500", href: "/admin/token-requests" },
    { label: "Registracije preduzeća", key: "pendingCompanyRegistrations", color: "bg-teal-500", href: "/admin/company-registrations" },
  ];

  const maxVal = Math.max(...stats.map((s) => Number(data?.[s.key] ?? 0)), 1);

  return (
    <AdminLayout className="p-4 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="block rounded-xl transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-800"
            >
              <Card className="h-full cursor-pointer border-slate-200 hover:border-primary-300 hover:bg-slate-50/50">
                <CardHeader><CardTitle className="text-base">{s.label}</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">{data?.[s.key] ?? "—"}</p></CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>Pregled statistike</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {stats.map((s) => {
              const val = Number(data?.[s.key] ?? 0);
              const pct = Math.round((val / maxVal) * 100);
              return (
                <Link
                  key={s.key}
                  href={s.href}
                  className={cn(
                    "block rounded-lg p-2 -mx-2 transition-colors",
                    "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-800"
                  )}
                >
                  <div className="mb-1 flex justify-between text-sm font-medium">
                    <span>{s.label}</span><span>{val}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
    </AdminLayout>
  );
}
