"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useJobs, useMyApplications, useAssignedJobs } from "@/hooks/useJobs";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { JobList } from "@/components/jobs/JobList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Handyman } from "@/types";
import { APPLICATION_STATUS_LABELS } from "@/constants";

export default function DashboardPage() {
  const { role, user, token } = useAuth();

  if (role === "ROLE_CLIENT") return <ClientDashboard />;
  if (role === "ROLE_HANDYMAN") return <HandymanDashboard user={user as Handyman} />;

  return (
    <PanelLayout>
      <main className="flex min-h-[40vh] items-center justify-center p-8 text-slate-600">
        {token ? "Učitavanje panela..." : "Preusmeravanje na prijavu..."}
      </main>
    </PanelLayout>
  );
}

function ClientDashboard() {
  const { data: jobs } = useJobs(undefined, "my");
  const pendingJobs = jobs?.filter((j) => j.status === "PENDING_APPROVAL") || [];
  const activeJobs = jobs?.filter((j) => j.status === "OPEN") || [];

  return (
    <PanelLayout>
      <main className="space-y-8 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Početna</h1>
          <Link href="/jobs/new" className="font-semibold text-primary-800 hover:underline">+ Objavi novi posao</Link>
        </div>
        {pendingJobs.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader><CardTitle>Na čekanju od admina ({pendingJobs.length})</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-slate-600">
                Ovi oglasi nisu vidljivi majstorima i izvođačima dok admin ne odobri oglas i ne postavi cenu u tokenima.
              </p>
              <JobList jobs={pendingJobs.slice(0, 6)} hideTokenCost emptyMessage="" />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>Aktivni oglasi ({activeJobs.length})</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">Majstori i izvođači vide ove odobrene oglase i mogu da pogledaju detalje (uz tokene). Ako im odgovara, sami zovu klijenta — vi ne birate ko zove.</p>
            <JobList jobs={activeJobs.slice(0, 6)} hideTokenCost emptyMessage="Nemate aktivnih oglasa." />
          </CardContent>
        </Card>
      </main>
    </PanelLayout>
  );
}

function HandymanDashboard({ user }: { user: Handyman }) {
  const [filters, setFilters] = useState({ categories: [] as number[], city: "", radius: 50, minTokenCost: 0, maxTokenCost: 100, sort: "newest" });
  const { data: applications } = useMyApplications();
  const { data: unlockedJobs } = useAssignedJobs();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFilters((f) => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude }));
      });
    }
  }, []);

  const { data: jobs } = useJobs(filters, "browse");

  return (
    <PanelLayout>
      <main className="space-y-8 p-4 sm:p-6">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Početna</h1>
          <p className="text-lg text-slate-600">Stanje tokena: <strong className="text-primary-800">{user?.tokenBalance ?? 0}</strong></p>
        </div>
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pregledani poslovi ({unlockedJobs?.length ?? 0})</CardTitle>
            <Link href="/applications" className="text-sm font-semibold text-primary-800 hover:underline">Svi pregledani →</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockedJobs?.slice(0, 3).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-lg border-2 border-primary-100 bg-white p-4 hover:bg-primary-50">
                <p className="font-semibold text-slate-900">{job.title}</p>
                {job.clientContact && (
                  <p className="mt-1 text-sm text-slate-600">
                    Klijent: {job.clientContact.fullName} • {job.clientContact.phone || job.clientContact.email}
                  </p>
                )}
              </Link>
            ))}
            {!unlockedJobs?.length && (
              <p className="text-slate-500">Još niste pregledali nijedan posao.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Poslednje pregledano</CardTitle>
            <Link href="/applications" className="text-sm font-semibold text-primary-800 hover:underline">Sve →</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications?.slice(0, 5).map((app) => (
              <Link key={app.id} href={`/jobs/${app.jobListingId}`} className="block rounded-lg border-2 border-slate-200 p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{app.jobTitle || "Posao"}</span>
                  <Badge>{APPLICATION_STATUS_LABELS[app.status] || app.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {[app.jobCategory, app.jobCity].filter(Boolean).join(" • ")} • {new Date(app.appliedAt).toLocaleDateString("sr")}
                </p>
              </Link>
            ))}
            {!applications?.length && <p className="text-slate-500">Još nema pregledanih poslova.</p>}
          </CardContent>
        </Card>
        <div>
          <h2 className="mb-4 text-xl font-bold">Dostupni poslovi</h2>
          <JobList jobs={jobs?.slice(0, 5) || []} showDistance emptyMessage="Nema poslova za zadate filtere." />
        </div>
      </main>
    </PanelLayout>
  );
}
