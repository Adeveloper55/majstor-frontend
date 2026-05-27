"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => (await api.get<{ content: User[] }>(`/api/admin/users?size=50&search=${encodeURIComponent(search)}`)).data.content,
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Klijenti</h1>
        <Input placeholder="Pretraži po imenu ili emailu..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-md" />
        <div className="overflow-x-auto rounded-xl border-2 border-slate-200 bg-white">
          <table className="w-full text-base">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">Ime</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Grad</th><th className="p-3"></th></tr></thead>
            <tbody>
              {data?.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.city}</td>
                  <td className="p-3"><Link href={`/admin/users/${u.id}`} className="text-primary-800 hover:underline">Detalji</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
