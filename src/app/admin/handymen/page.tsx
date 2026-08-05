"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import type { Handyman } from "@/types";

export default function AdminHandymenPage() {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-handymen", search],
    queryFn: async () => (await api.get<{ content: Handyman[] }>(`/api/admin/handymen?size=50&search=${encodeURIComponent(search)}`)).data.content,
    refetchOnMount: "always",
  });

  return (
    <AdminLayout className="p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Majstori</h1>
          <Link href="/admin/handymen/new" className="rounded-lg bg-primary-800 px-4 py-2 text-sm font-medium text-white hover:bg-primary-900">+ Novi majstor</Link>
        </div>
        <Input placeholder="Pretraži po imenu ili emailu..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-md" />
        <div className="overflow-x-auto rounded-xl border-2 border-slate-200 bg-white">
          <table className="w-full text-base">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">Ime</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">PIB</th><th className="p-3 text-left">Tokeni</th><th className="p-3"></th></tr></thead>
            <tbody>
              {data?.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="p-3">{h.fullName}</td>
                  <td className="p-3">{h.email}</td>
                  <td className="p-3">{h.pib || "—"}</td>
                  <td className="p-3">{h.tokenBalance}</td>
                  <td className="p-3"><Link href={`/admin/handymen/${h.id}`} className="text-primary-800 hover:underline">Detalji</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </AdminLayout>
  );
}
