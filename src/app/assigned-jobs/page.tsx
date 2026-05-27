"use client";

import Link from "next/link";
import { useAssignedJobs } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JOB_STATUS_LABELS } from "@/constants";

export default function AssignedJobsPage() {
  const { data: jobs, isLoading } = useAssignedJobs();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-2 text-2xl font-bold">Dodeljeni poslovi</h1>
        <p className="mb-6 text-slate-600">Poslovi koje vam je admin ili klijent dodelio — sa kontakt podacima klijenta.</p>

        {isLoading && <p>Učitavanje...</p>}

        <div className="space-y-4">
          {jobs?.map((job) => (
            <Card key={job.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    <Link href={`/jobs/${job.id}`} className="hover:text-primary-800 hover:underline">
                      {job.title}
                    </Link>
                  </CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{job.category?.name} • {job.city}</p>
                </div>
                <Badge>{JOB_STATUS_LABELS[job.status] || job.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed text-slate-700">{job.description}</p>
                {job.clientContact && (
                  <div className="rounded-xl border-2 border-primary-100 bg-primary-50/60 p-4">
                    <p className="mb-2 font-semibold text-primary-900">Kontakt klijenta</p>
                    <div className="grid gap-1 text-sm sm:grid-cols-2">
                      <p><strong>Ime:</strong> {job.clientContact.fullName}</p>
                      <p><strong>Email:</strong>{" "}
                        <a href={`mailto:${job.clientContact.email}`} className="text-primary-800 hover:underline">
                          {job.clientContact.email}
                        </a>
                      </p>
                      {job.clientContact.phone && (
                        <p><strong>Telefon:</strong>{" "}
                          <a href={`tel:${job.clientContact.phone}`} className="text-primary-800 hover:underline">
                            {job.clientContact.phone}
                          </a>
                        </p>
                      )}
                      {(job.clientContact.address || job.address) && (
                        <p><strong>Adresa:</strong> {job.address || job.clientContact.address}{job.city ? `, ${job.city}` : ""}</p>
                      )}
                    </div>
                  </div>
                )}
                <Link href={`/jobs/${job.id}`} className="inline-block text-sm font-semibold text-primary-800 hover:underline">
                  Otvori detalje posla →
                </Link>
              </CardContent>
            </Card>
          ))}
          {!isLoading && !jobs?.length && (
            <p className="text-slate-500">Još nemate dodeljenih poslova. Prijavite se na otvorene poslove ili sačekajte dodelu od admina.</p>
          )}
        </div>
      </main>
    </div>
  );
}
