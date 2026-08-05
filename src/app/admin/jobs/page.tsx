"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import type { JobListing } from "@/types";
import { JOB_STATUS_LABELS } from "@/constants";

export default function AdminJobsPage() {
  const { data } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => (await api.get<{ content: JobListing[] }>("/api/admin/jobs?size=50")).data.content,
    refetchOnMount: "always",
  });

  return (
    <AdminLayout className="p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Svi poslovi</h1>
          <Link href="/admin/jobs/new" className="rounded-lg bg-primary-800 px-4 py-2 text-sm font-medium text-white hover:bg-primary-900">+ Novi posao</Link>
        </div>
        <div className="space-y-3">
          {data?.map((job) => (
            <Link key={job.id} href={`/admin/jobs/${job.id}`} className="block rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{job.title}</span>
                <Badge>{JOB_STATUS_LABELS[job.status] || job.status}</Badge>
              </div>
              <p className="text-sm text-slate-500">{job.city} • {job.tokenCost} tokena</p>
            </Link>
          ))}
        </div>
    </AdminLayout>
  );
}
