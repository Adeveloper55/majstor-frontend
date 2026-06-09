"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplication, JobListing } from "@/types";
import { JOB_STATUS_LABELS } from "@/constants";

export default function AdminJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedHandymanId, setSelectedHandymanId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [tokenCost, setTokenCost] = useState("5");
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

  const assignHandyman = async (handymanId: string) => {
    setAssigning(true);
    setAssignError("");
    try {
      await api.post(`/api/admin/jobs/${id}/assign/${handymanId}`);
      await refetch();
      qc.invalidateQueries({ queryKey: ["admin-job-applications", id] });
      setSelectedHandymanId("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setAssignError(msg || "Greška pri dodeli majstora");
    } finally {
      setAssigning(false);
    }
  };

  const remove = async () => {
    await api.delete(`/api/admin/jobs/${id}`);
    router.push("/admin/jobs");
  };

  const approveJob = async () => {
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
      qc.invalidateQueries({ queryKey: ["admin-pending-jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApproveError(msg || "Greška pri odobravanju.");
    } finally {
      setApproving(false);
    }
  };

  if (!job) return <p className="p-8">Učitavanje...</p>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <Badge>{JOB_STATUS_LABELS[job.status] || job.status}</Badge>
        </div>
        <p className="text-base text-slate-700">{job.description}</p>
        <div className="space-y-1 text-slate-600">
          <p>Grad: {job.city || "—"}</p>
          <p>Adresa: {job.address || "—"}</p>
          <p>Kategorija: {job.category?.name}</p>
          <p>Tokeni: {job.status === "PENDING_APPROVAL" ? "— (postavite pri odobrenju)" : job.tokenCost}</p>
          {job.clientContact && (
            <p>Klijent: {job.clientContact.fullName} ({job.clientContact.email})</p>
          )}
        </div>

        {job.status === "PENDING_APPROVAL" && (
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader><CardTitle>Odobri oglas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Postavite koliko tokena košta ovaj posao za majstore. Nakon odobrenja oglas postaje vidljiv.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Tokeni</label>
                  <Input
                    type="number"
                    min={1}
                    className="w-32"
                    value={tokenCost}
                    onChange={(e) => setTokenCost(e.target.value)}
                  />
                </div>
                <Button disabled={approving} onClick={approveJob}>
                  {approving ? "Odobravanje..." : "Dozvoli posao"}
                </Button>
              </div>
              {approveError && <p className="text-sm text-red-600">{approveError}</p>}
            </CardContent>
          </Card>
        )}

        {job.status === "OPEN" && (
          <Card>
            <CardHeader><CardTitle>Odobri majstora za posao</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Samo admin odobrava majstora. Pri dodeli posla skidaju se tokeni sa računa majstora.
              </p>
              {applications && applications.length > 0 && (
                <div>
                  <p className="mb-2 font-medium">Prijave na posao:</p>
                  <div className="space-y-2">
                    {applications.map((app) => (
                      <div key={app.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{app.handyman?.fullName}</p>
                          <p className="text-sm text-slate-500">{app.coverMessage || "Bez poruke"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{app.status}</Badge>
                          {job.status === "OPEN" && (
                            <Button size="sm" disabled={assigning} onClick={() => assignHandyman(app.handyman?.id || "")}>
                              Dodeli posao
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 font-medium">Ručna dodela (samo ako se majstor već prijavio):</p>
                <p className="mb-2 text-xs text-slate-500">Majstor mora prvo da se prijavi na posao pre odobrenja.</p>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="min-w-[240px] rounded-lg border-2 border-slate-200 px-3 py-2"
                    value={selectedHandymanId}
                    onChange={(e) => setSelectedHandymanId(e.target.value)}
                  >
                    <option value="">— Majstor sa prijavom —</option>
                    {applications?.filter((a) => a.status === "PENDING").map((a) => (
                      <option key={a.id} value={a.handyman?.id}>{a.handyman?.fullName}</option>
                    ))}
                  </select>
                  <Button
                    disabled={!selectedHandymanId || assigning}
                    onClick={() => assignHandyman(selectedHandymanId)}
                  >
                    {assigning ? "Dodela..." : "Dodeli posao"}
                  </Button>
                </div>
              </div>
              {assignError && <p className="text-sm text-red-600">{assignError}</p>}
            </CardContent>
          </Card>
        )}

        {job.status === "IN_PROGRESS" && job.selectedHandymanId && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="font-medium text-green-900">Posao je dodeljen majstoru (ID: {job.selectedHandymanId})</p>
            </CardContent>
          </Card>
        )}

        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Ukloni oglas</Button>
        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Ukloniti oglas?" confirmLabel="Ukloni" onConfirm={remove} />
      </main>
    </div>
  );
}
