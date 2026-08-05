"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import type { AdminUser } from "@/types";
import type { ServiceInquiry } from "@/types/serviceInquiry";

export default function AdminInquiriesPage() {
  const user = useAuthStore((s) => s.user) as AdminUser | null;
  const isPrimaryAdmin = Boolean(user?.primaryAdmin);

  const { data, isError, error } = useQuery({
    queryKey: ["admin-inquiries"],
    enabled: isPrimaryAdmin,
    queryFn: async () =>
      (await api.get<{ content: ServiceInquiry[] }>("/api/admin/inquiries?size=50")).data.content,
    refetchOnMount: "always",
  });

  if (!isPrimaryAdmin) {
    return (
      <AdminLayout className="p-6">
        <p className="text-slate-600">Nemate pristup upitima klijenata.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout className="p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Upiti klijenata</h1>
      {isError && (
        <p className="mb-4 text-sm text-red-600">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Greška pri učitavanju upita."}
        </p>
      )}
      <div className="space-y-3">
        {data?.length === 0 && <p className="text-slate-500">Nema upita.</p>}
        {data?.map((inquiry) => (
          <Link
            key={inquiry.id}
            href={`/admin/upiti/${inquiry.id}`}
            className="block rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">{inquiry.fullName}</span>
                <Badge className="bg-primary-100 text-primary-900">{inquiry.categoryName}</Badge>
                <Badge className="border border-slate-300 bg-white text-slate-700">{inquiry.city}</Badge>
                {inquiry.status === "NEW" && <Badge className="bg-blue-100 text-blue-800">Novo</Badge>}
              </div>
              <span className="text-sm text-slate-500">
                {new Date(inquiry.createdAt).toLocaleString("sr-RS")}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Početak: {inquiry.startTimeline} · {inquiry.email}
            </p>
            <p className="mt-2 line-clamp-2 text-base text-slate-700">{inquiry.detailedDescription}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
