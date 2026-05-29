"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompanyRegistration {
  id: string;
  email: string;
  phone: string;
  normalizedPhone: string;
  companyName: string;
  pib: string;
  city: string;
  contactPerson: string;
  status: string;
  selectedServiceNames: string[];
  selectedDistricts: string[];
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Na čekanju",
  APPROVED: "Odobreno",
  REJECTED: "Odbijeno",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AdminCompanyRegistrationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-company-registrations", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? `?status=${statusFilter}&size=50` : "?size=50";
      return (await api.get<{ content: CompanyRegistration[] }>(`/api/admin/company-registrations${params}`))
        .data.content;
    },
  });

  return (
    <AdminLayout>
      <h1 className="mb-2 text-xl font-bold sm:text-2xl">Registracije preduzeća</h1>
      <p className="mb-5 text-sm text-slate-600 sm:mb-6 sm:text-base">
        Pregled prijava izvođača. Odobrenje kreira nalog majstora.
      </p>

      <div className="mb-5 flex flex-wrap gap-2 sm:mb-6">
        {(["PENDING", "APPROVED", "REJECTED", ""] as const).map((s) => (
          <Button
            key={s || "all"}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            className="h-9"
            onClick={() => setStatusFilter(s)}
          >
            {s ? STATUS_LABELS[s] : "Sve"}
          </Button>
        ))}
      </div>

      {isLoading && <p className="text-slate-500">Učitavanje...</p>}

      <div className="space-y-3">
        {!isLoading && data?.length === 0 && (
          <p className="text-slate-500">Nema prijava za izabrani filter.</p>
        )}
        {data?.map((reg) => (
          <Link
            key={reg.id}
            href={`/admin/company-registrations/${reg.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-3.5 hover:bg-slate-50 sm:border-2 sm:p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">{reg.companyName}</span>
                <Badge className={STATUS_BADGE[reg.status] ?? "bg-slate-100 text-slate-800"}>
                  {STATUS_LABELS[reg.status] ?? reg.status}
                </Badge>
              </div>
              <span className="text-xs text-slate-500 sm:text-sm">
                {new Date(reg.createdAt).toLocaleString("sr-RS")}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              <p>{reg.contactPerson}</p>
              <p className="break-all">{reg.email}</p>
              <p>{reg.normalizedPhone}</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              PIB: {reg.pib} · {reg.city}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-700 sm:line-clamp-1">
              Delatnosti: {reg.selectedServiceNames?.join(", ") || "—"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Okruzi: {reg.selectedDistricts?.length ?? 0}
            </p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
