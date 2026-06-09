"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useJobs, useMyApplications, useAssignedJobs } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobList } from "@/components/jobs/JobList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Handyman } from "@/types";
import { APPLICATION_STATUS_LABELS } from "@/constants";

export default function DashboardPage() {
  const { role, user } = useAuth();

  if (role === "ROLE_CLIENT") return <ClientDashboard />;
  if (role === "ROLE_HANDYMAN") return <HandymanDashboard user={user as Handyman} />;
  return <p className="p-8">Učitavanje...</p>;
}

function ClientDashboard() {
  const { data: jobs } = useJobs(undefined, "my");
  const pendingJobs = jobs?.filter((j) => j.status === "PENDING_APPROVAL") || [];
  const activeJobs = jobs?.filter((j) => j.status === "OPEN" || j.status === "IN_PROGRESS") || [];
  const assignedJobs = jobs?.filter((j) => j.status === "IN_PROGRESS" && j.assignedHandymanContact) || [];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 space-y-8 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Početna</h1>
          <Link href="/jobs/new" className="font-semibold text-primary-800 hover:underline">+ Objavi novi posao</Link>
        </div>
        {pendingJobs.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader><CardTitle>Na čekanju odobrenja ({pendingJobs.length})</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-amber-900">Admin pregleda vaš oglas pre nego što postane vidljiv majstorima.</p>
              <JobList jobs={pendingJobs.slice(0, 4)} hideTokenCost emptyMessage="" />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>Aktivni poslovi ({activeJobs.length})</CardTitle></CardHeader>
          <CardContent>
            <JobList jobs={activeJobs.slice(0, 4)} hideTokenCost emptyMessage="Nemate aktivnih poslova." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Dodeljeni majstori ({assignedJobs.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {assignedJobs.slice(0, 4).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-lg border-2 border-green-200 bg-green-50/50 p-4 hover:bg-green-50">
                <p className="font-semibold text-slate-900">{job.title}</p>
                {job.assignedHandymanContact && (
                  <p className="mt-1 text-sm text-slate-700">
                    {job.assignedHandymanContact.fullName} •{" "}
                    {job.assignedHandymanContact.phone || job.assignedHandymanContact.email}
                  </p>
                )}
              </Link>
            ))}
            {!assignedJobs.length && <p className="text-slate-500">Još nema dodeljenog majstora.</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function HandymanDashboard({ user }: { user: Handyman }) {
  const [filters, setFilters] = useState({ categories: [] as number[], city: "", radius: 50, minTokenCost: 0, maxTokenCost: 100, sort: "closest" });
  const { data: applications } = useMyApplications();
  const { data: assignedJobs } = useAssignedJobs();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFilters((f) => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude }));
      });
    }
  }, []);

  const { data: jobs } = useJobs(filters, "browse");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 space-y-8 p-6">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Početna</h1>
          <p className="text-lg text-slate-600">Stanje tokena: <strong className="text-primary-800">{user?.tokenBalance ?? 0}</strong></p>
        </div>
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dodeljeni poslovi ({assignedJobs?.filter((j) => j.status === "IN_PROGRESS").length ?? 0})</CardTitle>
            <Link href="/assigned-jobs" className="text-sm font-semibold text-primary-800 hover:underline">Svi dodeljeni →</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedJobs?.filter((j) => j.status === "IN_PROGRESS").slice(0, 3).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-lg border-2 border-primary-100 bg-white p-4 hover:bg-primary-50">
                <p className="font-semibold text-slate-900">{job.title}</p>
                {job.clientContact && (
                  <p className="mt-1 text-sm text-slate-600">
                    Klijent: {job.clientContact.fullName} • {job.clientContact.phone || job.clientContact.email}
                  </p>
                )}
              </Link>
            ))}
            {!assignedJobs?.filter((j) => j.status === "IN_PROGRESS").length && (
              <p className="text-slate-500">Nemate aktivnih dodeljenih poslova.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nedavne prijave</CardTitle>
            <Link href="/applications" className="text-sm font-semibold text-primary-800 hover:underline">Sve prijave →</Link>
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
            {!applications?.length && <p className="text-slate-500">Još nema prijava.</p>}
          </CardContent>
        </Card>
        <div>
          <h2 className="mb-4 text-xl font-bold">Poslovi u blizini</h2>
          <JobList jobs={jobs?.slice(0, 5) || []} showDistance emptyMessage="Nema poslova u blizini." />
        </div>
      </main>
    </div>
  );
}
