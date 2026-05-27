"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Badge } from "@/components/ui/badge";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  isContractor: boolean;
  status: string;
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const { data } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () =>
      (await api.get<{ content: ContactMessage[] }>("/api/admin/contact-messages?size=50")).data.content,
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Kontakt poruke</h1>
        <div className="space-y-3">
          {data?.length === 0 && (
            <p className="text-slate-500">Nema poruka.</p>
          )}
          {data?.map((msg) => (
            <Link
              key={msg.id}
              href={`/admin/contact/${msg.id}`}
              className="block rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{msg.fullName}</span>
                  {msg.isContractor && (
                    <Badge className="bg-amber-100 text-amber-800">Majstor / izvođač</Badge>
                  )}
                  {msg.status === "NEW" && (
                    <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
                  )}
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(msg.createdAt).toLocaleString("sr-RS")}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{msg.email}</p>
              <p className="mt-2 line-clamp-2 text-base text-slate-700">{msg.message}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
