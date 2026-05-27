"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobApplicationRequest {
  id: string;
  jobListingId: string;
  status: string;
  coverMessage: string;
  appliedAt: string;
  handyman: { id: string; fullName: string; city?: string };
  handymanEmail: string;
  handymanTokenBalance: number;
  jobTitle?: string;
  jobCity?: string;
  jobCategory?: string;
  jobTokenCost?: number;
  jobStatus?: string;
  clientName?: string;
  clientEmail?: string;
}

export default function AdminJobRequestsPage() {
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-job-applications"],
    queryFn: async () =>
      (await api.get<{ content: JobApplicationRequest[] }>("/api/admin/job-applications?size=50")).data.content,
  });

  const assign = async (applicationId: string) => {
    setAssigningId(applicationId);
    setError((prev) => ({ ...prev, [applicationId]: "" }));
    try {
      await api.post(`/api/admin/job-applications/${applicationId}/assign`);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError((prev) => ({ ...prev, [applicationId]: msg || "Greška pri dodeli posla" }));
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-2 text-2xl font-bold">Zahtevi za posao</h1>
        <p className="mb-6 text-slate-600">
          Majstori se prijavljuju bez skidanja tokena. Klikom na <strong>Dodeli posao</strong> odobravate majstora i skidaju se tokeni.
        </p>

        {isLoading && <p>Učitavanje...</p>}

        <div className="space-y-4">
          {data?.map((req) => (
            <div key={req.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <Link href={`/admin/jobs/${req.jobListingId}`} className="text-lg font-semibold text-primary-900 hover:underline">
                      {req.jobTitle || "Posao"}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                      {req.jobCategory && <span>{req.jobCategory}</span>}
                      {req.jobCity && <span>• {req.jobCity}</span>}
                      {req.jobTokenCost != null && <span>• {req.jobTokenCost} tokena</span>}
                    </div>
                  </div>

                  <div className="rounded-md bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-900">
                      Majstor: {req.handyman?.fullName}{" "}
                      <span className="font-normal text-slate-600">({req.handymanEmail})</span>
                    </p>
                    <p className="text-slate-600">
                      Stanje tokena: <strong>{req.handymanTokenBalance}</strong>
                      {req.jobTokenCost != null && req.handymanTokenBalance < req.jobTokenCost && (
                        <span className="ml-2 text-red-600">— nedovoljno za dodelu</span>
                      )}
                    </p>
                    {req.coverMessage && <p className="mt-1 text-slate-600">Poruka: {req.coverMessage}</p>}
                  </div>

                  {(req.clientName || req.clientEmail) && (
                    <p className="text-sm text-slate-500">
                      Klijent: {req.clientName || "—"} {req.clientEmail && `(${req.clientEmail})`}
                    </p>
                  )}

                  <p className="text-xs text-slate-400">{new Date(req.appliedAt).toLocaleString("sr")}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant="warning">Na čekanju</Badge>
                  {req.jobStatus === "OPEN" ? (
                    <Button
                      size="sm"
                      disabled={assigningId === req.id || (req.jobTokenCost != null && req.handymanTokenBalance < req.jobTokenCost)}
                      onClick={() => assign(req.id)}
                    >
                      {assigningId === req.id ? "Dodela..." : "Dodeli posao"}
                    </Button>
                  ) : (
                    <Badge variant="destructive">Posao više nije otvoren</Badge>
                  )}
                </div>
              </div>
              {error[req.id] && <p className="mt-2 text-sm text-red-600">{error[req.id]}</p>}
            </div>
          ))}
          {!isLoading && !data?.length && <p className="text-gray-500">Nema zahteva za posao.</p>}
        </div>
      </main>
    </div>
  );
}
