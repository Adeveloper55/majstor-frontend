"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { JobListing } from "@/types";
import { JOB_STATUS_LABELS } from "@/constants";

export default function AdminPendingJobsPage() {
  const qc = useQueryClient();
  const [tokenCosts, setTokenCosts] = useState<Record<string, string>>({});
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-pending-jobs"],
    queryFn: async () =>
      (await api.get<{ content: JobListing[] }>("/api/admin/jobs?status=PENDING_APPROVAL&size=50")).data.content,
  });

  const approve = async (job: JobListing) => {
    const raw = tokenCosts[job.id] ?? String(job.category?.baseTokenCost ? job.category.baseTokenCost * 2 : 5);
    const tokenCost = parseInt(raw, 10);
    if (!tokenCost || tokenCost < 1) {
      setErrors((e) => ({ ...e, [job.id]: "Unesite validan broj tokena (min. 1)." }));
      return;
    }
    setApprovingId(job.id);
    setErrors((e) => ({ ...e, [job.id]: "" }));
    try {
      await api.post(`/api/admin/jobs/${job.id}/approve`, { tokenCost });
      qc.invalidateQueries({ queryKey: ["admin-pending-jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrors((e) => ({ ...e, [job.id]: msg || "Greška pri odobravanju." }));
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-2 text-2xl font-bold">Poslovi na čekanju</h1>
        <p className="mb-6 text-sm text-slate-600">
          Klijenti objavljuju oglase koji čekaju vaše odobrenje. Postavite cenu u tokenima i kliknite Dozvoli.
        </p>

        {isLoading && <p>Učitavanje...</p>}
        {!isLoading && !data?.length && (
          <p className="text-slate-500">Trenutno nema poslova na čekanju.</p>
        )}

        <div className="space-y-4">
          {data?.map((job) => (
            <Card key={job.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/admin/jobs/${job.id}`} className="text-lg font-semibold text-primary-900 hover:underline">
                      {job.title}
                    </Link>
                    <p className="mt-1 text-sm text-slate-600">{job.city || "—"} • {job.category?.name}</p>
                    {job.clientContact && (
                      <p className="mt-1 text-sm text-slate-500">
                        Klijent: {job.clientContact.fullName} ({job.clientContact.email})
                      </p>
                    )}
                  </div>
                  <Badge>{JOB_STATUS_LABELS[job.status] || job.status}</Badge>
                </div>
                <p className="line-clamp-3 text-sm text-slate-700">{job.description}</p>
                <div className="flex flex-wrap items-end gap-3 border-t pt-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Tokeni za posao</label>
                    <Input
                      type="number"
                      min={1}
                      className="w-32"
                      value={tokenCosts[job.id] ?? String(job.category?.baseTokenCost ? job.category.baseTokenCost * 2 : 5)}
                      onChange={(e) => setTokenCosts((prev) => ({ ...prev, [job.id]: e.target.value }))}
                    />
                  </div>
                  <Button disabled={approvingId === job.id} onClick={() => approve(job)}>
                    {approvingId === job.id ? "Odobravanje..." : "Dozvoli posao"}
                  </Button>
                  <Link href={`/admin/jobs/${job.id}`} className="text-sm text-primary-800 hover:underline">
                    Detalji →
                  </Link>
                </div>
                {errors[job.id] && <p className="text-sm text-red-600">{errors[job.id]}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
