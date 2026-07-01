"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import type { AdminUser } from "@/types";
import type { ServiceInquiry } from "@/types/serviceInquiry";

export default function AdminInquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user) as AdminUser | null;
  const isPrimaryAdmin = Boolean(user?.primaryAdmin);
  const queryClient = useQueryClient();

  const { data: inquiry, isLoading } = useQuery({
    queryKey: ["admin-inquiry", id],
    enabled: isPrimaryAdmin && Boolean(id),
    queryFn: async () => (await api.get<ServiceInquiry>(`/api/admin/inquiries/${id}`)).data,
  });

  const markRead = useMutation({
    mutationFn: async () => (await api.post<ServiceInquiry>(`/api/admin/inquiries/${id}/read`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiry", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  if (!isPrimaryAdmin) {
    return (
      <AdminLayout className="p-6">
        <p className="text-slate-600">Nemate pristup upitima klijenata.</p>
      </AdminLayout>
    );
  }

  if (isLoading || !inquiry) {
    return (
      <AdminLayout className="p-6">
        <p className="text-slate-500">Učitavanje...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout className="p-4 sm:p-6">
      <Link href="/admin/upiti" className="text-sm text-primary-800 hover:underline">
        ← Nazad na upite
      </Link>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{inquiry.fullName}</h1>
          {inquiry.status === "NEW" && <Badge className="bg-blue-100 text-blue-800">Novo</Badge>}
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Poslato: {new Date(inquiry.createdAt).toLocaleString("sr-RS")}
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategorija</dt>
            <dd className="mt-1 text-base font-medium text-slate-900">{inquiry.categoryName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Grad</dt>
            <dd className="mt-1 text-base font-medium text-slate-900">{inquiry.city}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Početak radova</dt>
            <dd className="mt-1 text-base text-slate-900">{inquiry.startTimeline}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kontakt</dt>
            <dd className="mt-1 text-base text-slate-900">
              {inquiry.salutation ? `${inquiry.salutation} ` : ""}
              {inquiry.fullName}
              <br />
              {inquiry.email}
              {inquiry.phone ? ` · ${inquiry.phone}` : ""}
            </dd>
          </div>
        </dl>

        {inquiry.shortDescription && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Ukratko</h2>
            <p className="mt-1 text-slate-900">{inquiry.shortDescription}</p>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Opis</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-900">{inquiry.detailedDescription}</p>
        </div>

        {inquiry.status === "NEW" && (
          <Button className="mt-6" onClick={() => markRead.mutate()} disabled={markRead.isPending}>
            Označi kao pročitano
          </Button>
        )}
      </div>
    </AdminLayout>
  );
}
