"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplication, JobListing } from "@/types";
import { APPLICATION_STATUS_LABELS, JOB_STATUS_LABELS } from "@/constants";

export default function AdminJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tokenCost, setTokenCost] = useState("");
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState("");

  const { data: job, refetch } = useQuery({
    queryKey: ["admin-job", id],
    queryFn: async () => (await api.get<JobListing>(`/api/admin/jobs/${id}`)).data,
  });

  const { data: applications } = useQuery({
    queryKey: ["admin-job-applications", id],
    queryFn: async () => (await api.get<{ content: JobApplication[] }>(`/api/admin/jobs/${id}/applications?size=50`)).data.content,
    enabled: !!id,
  });

  const unlocked = applications?.filter((a) => a.status === "UNLOCKED" || a.status === "ACCEPTED") ?? [];

  useEffect(() => {
    if (job?.tokenCost != null && job.status === "PENDING_APPROVAL") {
      setTokenCost(String(job.tokenCost));
    }
  }, [job?.tokenCost, job?.status]);

  const remove = async () => {
    await api.delete(`/api/admin/jobs/${id}`);
    router.push("/admin/jobs");
  };

  const approveLegacyJob = async () => {
    const cost = parseInt(tokenCost, 10);
    if (!cost || cost < 1) {
      setApproveError("Unesite validan broj tokena (min. 1).");
      return;
    }
    setApproving(true);
    setApproveError("");
    try {
      await api.post(`/api/admin/jobs/${id}/approve`, { tokenCost: cost });
      await refetch();
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-pending-jobs"] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApproveError(msg || "Greška pri odobravanju.");
    } finally {
      setApproving(false);
    }
  };

  if (!job) {
    return (
      <AdminLayout className="p-4 sm:p-6">
        <p>Učitavanje...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <Badge>{JOB_STATUS_LABELS[job.status] || job.status}</Badge>
        </div>
        <p className="text-base text-slate-700">{job.description}</p>
        <div className="space-y-1 text-slate-600">
          <p>Grad: {job.city || "—"}</p>
          <p>Kategorija: {job.category?.name}</p>
          <p>Tokeni (pregled detalja): {job.tokenCost ?? "—"}</p>
          {job.clientContact && (
            <p>Klijent: {job.clientContact.fullName} ({job.clientContact.email}){job.clientContact.phone ? ` • ${job.clientContact.phone}` : ""}</p>
          )}
        </div>

        {job.status === "PENDING_APPROVAL" && (
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader><CardTitle>Odobri oglas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Postavite koliko tokena košta pregled detalja za ovaj posao. AI predlog: {job.tokenCost ?? "—"} tokena
                {job.aiScore != null ? ` (ocena ${job.aiScore}/5)` : ""}.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Tokeni</label>
                  <Input type="number" min={1} className="w-32" value={tokenCost} onChange={(e) => setTokenCost(e.target.value)} />
                </div>
                <Button disabled={approving} onClick={approveLegacyJob}>
                  {approving ? "Odobravanje..." : "Dozvoli posao"}
                </Button>
              </div>
              {approveError && <p className="text-sm text-red-600">{approveError}</p>}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pregledali detalje ({unlocked.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              Majstori i izvođači koji su pogledali detalje i videli kontakt klijenta. Više njih može pogledati isti oglas.
            </p>
            {unlocked.map((app) => (
              <div key={app.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{app.handyman?.fullName || "Majstor"}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(app.appliedAt).toLocaleString("sr")} • {app.tokensSpent} tokena
                    </p>
                  </div>
                  <Badge variant="success">{APPLICATION_STATUS_LABELS[app.status] || app.status}</Badge>
                </div>
              </div>
            ))}
            {!unlocked.length && <p className="text-slate-500">Još niko nije pogledao detalje za ovaj posao.</p>}
          </CardContent>
        </Card>

        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Ukloni oglas</Button>
        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Ukloniti oglas?" confirmLabel="Ukloni" onConfirm={remove} />
    </AdminLayout>
  );
}
