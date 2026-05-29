"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get<Record<string, number>>("/api/admin/stats")).data,
  });

  const stats = [
    { label: "Klijenti", key: "totalUsers", color: "bg-blue-500" },
    { label: "Majstori", key: "totalHandymen", color: "bg-indigo-500" },
    { label: "Poslovi", key: "totalJobs", color: "bg-purple-500" },
    { label: "Otvoreni", key: "openJobs", color: "bg-green-500" },
    { label: "Zahtevi (tokeni)", key: "pendingTokenRequests", color: "bg-amber-500" },
    { label: "Zahtevi (poslovi)", key: "pendingJobApplications", color: "bg-orange-500" },
    { label: "Registracije preduzeća", key: "pendingCompanyRegistrations", color: "bg-teal-500" },
    { label: "Prihod (EUR)", key: "totalRevenue", color: "bg-emerald-500" },
  ];

  const maxVal = Math.max(...stats.map((s) => Number(data?.[s.key] ?? 0)), 1);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.key}>
              <CardHeader><CardTitle className="text-base">{s.label}</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{data?.[s.key] ?? "—"}</p></CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>Pregled statistike</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {stats.map((s) => {
              const val = Number(data?.[s.key] ?? 0);
              const pct = Math.round((val / maxVal) * 100);
              return (
                <div key={s.key}>
                  <div className="mb-1 flex justify-between text-sm font-medium">
                    <span>{s.label}</span><span>{val}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
