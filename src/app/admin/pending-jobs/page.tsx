"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import type { JobListing } from "@/types";
import { JOB_STATUS_LABELS } from "@/constants";

export default function AdminPendingJobsPage() {
  const { data } = useQuery({
    queryKey: ["admin-pending-jobs"],
    queryFn: async () =>
      (await api.get<{ content: JobListing[] }>("/api/admin/jobs?status=PENDING_APPROVAL&size=50")).data.content,
    refetchOnMount: "always",
  });

  return (
    <AdminLayout className="p-4 sm:p-6">
        <h1 className="mb-2 text-2xl font-bold">Poslovi na čekanju</h1>
        <p className="mb-6 text-sm text-slate-600">
          Klijentski oglasi čekaju odobrenje. Postavite broj tokena i kliknite „Dozvoli posao” — oglas tada postaje vidljiv majstorima i izvođačima.
        </p>
        <div className="space-y-3">
          {data?.map((job) => (
            <Link
              key={job.id}
              href={`/admin/jobs/${job.id}`}
              className="block rounded-xl border-2 border-amber-200 bg-amber-50/30 p-4 hover:bg-amber-50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{job.title}</span>
                <Badge variant="warning">{JOB_STATUS_LABELS[job.status] || job.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {job.city || "—"} • AI predlog: {job.tokenCost ?? "—"} tokena
              </p>
              {job.clientContact && (
                <p className="mt-1 text-sm text-slate-500">
                  {job.clientContact.fullName} • {job.clientContact.email}
                </p>
              )}
            </Link>
          ))}
          {!data?.length && <p className="text-slate-500">Nema poslova na čekanju.</p>}
        </div>
    </AdminLayout>
  );
}
