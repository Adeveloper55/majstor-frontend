"use client";

import Link from "next/link";
import { useMyApplications } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { APPLICATION_STATUS_LABELS, JOB_STATUS_LABELS } from "@/constants";

export default function ApplicationsPage() {
  const { data, isLoading, isError } = useMyApplications();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-2 text-2xl font-bold">Moje prijave</h1>
        <p className="mb-6 text-slate-600">Pregled poslova na koje ste se prijavili. Admin odlučuje ko dobija posao.</p>

        {isLoading && <p>Učitavanje...</p>}
        {isError && <p className="text-red-600">Greška pri učitavanju prijava. Osvežite stranicu.</p>}

        <div className="space-y-3">
          {data?.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/jobs/${app.jobListingId}`} className="text-lg font-semibold text-primary-900 hover:underline">
                      {app.jobTitle || "Posao (naziv nedostupan)"}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                      {app.jobCategory && <span>{app.jobCategory}</span>}
                      {app.jobCity && <span>• {app.jobCity}</span>}
                      {app.jobTokenCost != null && <span>• {app.jobTokenCost} tokena</span>}
                    </div>
                    {app.jobStatus && app.jobStatus !== "OPEN" && (
                      <p className="mt-1 text-sm text-slate-500">
                        Status posla: {JOB_STATUS_LABELS[app.jobStatus] || app.jobStatus}
                      </p>
                    )}
                    {app.coverMessage && <p className="mt-2 text-sm text-slate-600">Vaša poruka: {app.coverMessage}</p>}
                    <p className="mt-2 text-sm text-slate-500">
                      Prijavljeno: {new Date(app.appliedAt).toLocaleString("sr")}
                      {app.status === "ACCEPTED" && app.tokensSpent > 0 && (
                        <> • Skinuto: {app.tokensSpent} tokena</>
                      )}
                      {app.status === "PENDING" && app.jobTokenCost != null && (
                        <> • Tokeni ({app.jobTokenCost}) skidaju se kada admin odobri</>
                      )}
                    </p>
                    {app.status === "ACCEPTED" && (
                      <Link href="/assigned-jobs" className="mt-2 inline-block text-sm font-semibold text-green-800 hover:underline">
                        Posao odobren → pogledaj kontakt klijenta
                      </Link>
                    )}
                  </div>
                  <Badge variant={app.status === "ACCEPTED" ? "success" : app.status === "REJECTED" ? "destructive" : "default"}>
                    {APPLICATION_STATUS_LABELS[app.status] || app.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && !data?.length && <p className="text-slate-500">Nema prijava. Pregledajte dostupne poslove i prijavite se.</p>}
        </div>
      </main>
    </div>
  );
}
