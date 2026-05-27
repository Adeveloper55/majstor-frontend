"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { unwrapPage } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { ApplicationCard } from "@/components/jobs/ApplicationCard";
import { Card, CardContent } from "@/components/ui/card";
import type { JobApplication } from "@/types";
import { APPLICATION_STATUS_LABELS } from "@/constants";

export default function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["applications", id],
    queryFn: async () => unwrapPage<JobApplication>((await api.get(`/api/jobs/${id}/applications?size=50`)).data),
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-2 text-2xl font-bold">Prijave majstora</h1>
        <p className="mb-6 text-slate-600">
          Majstori se prijavljuju na vaš oglas. <strong>Admin pregleda prijave i odlučuje</strong> koga da dodeli —
          vi ne birate majstora direktno.
        </p>

        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-900">
            Status prijava: <strong>Na čekanju</strong> = admin još nije odobrio.
            Kada admin odobri majstora, posao prelazi u „U toku“ i obe strane dobijaju kontakt podatke.
          </CardContent>
        </Card>

        <div className="space-y-4">
          {data?.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              statusLabel={APPLICATION_STATUS_LABELS[app.status]}
            />
          ))}
          {!data?.length && <p className="text-slate-500">Još nema prijava. Sačekajte da se majstori prijave.</p>}
        </div>
      </main>
    </div>
  );
}
