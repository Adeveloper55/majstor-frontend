"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useJobs, type JobFiltersState } from "@/hooks/useJobs";
import { useCategories } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobList } from "@/components/jobs/JobList";
import { JobsMap } from "@/components/maps/JobsMap";
import { Button } from "@/components/ui/button";

const defaultFilters: JobFiltersState = {
  categories: [],
  city: "",
  radius: 50,
  minTokenCost: 0,
  maxTokenCost: 100,
  sort: "newest",
};

export default function JobsPage() {
  const { role } = useAuth();
  const isHandyman = role === "ROLE_HANDYMAN";
  const [filters, setFilters] = useState<JobFiltersState>(defaultFilters);

  useEffect(() => {
    if (isHandyman && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFilters((f) => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude }));
      });
    }
  }, [isHandyman]);
  const { data: categories } = useCategories();
  const { data: jobs, isLoading } = useJobs(isHandyman ? filters : undefined, isHandyman ? "browse" : "my");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {isHandyman && categories && (
          <JobFilters categories={categories} filters={filters} onChange={setFilters} />
        )}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{isHandyman ? "Dostupni poslovi" : "Moji poslovi"}</h1>
            {!isHandyman && (
              <Link href="/jobs/new"><Button>Novi oglas</Button></Link>
            )}
          </div>
          {isLoading ? <p>Učitavanje...</p> : (
            <>
              {isHandyman && (jobs?.length ?? 0) > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 text-lg font-bold">Mapa poslova</h2>
                  <JobsMap jobs={jobs || []} />
                </div>
              )}
              <JobList jobs={jobs || []} showDistance={isHandyman} emptyMessage={isHandyman ? "Nema poslova za zadate filtere." : "Nemate objavljenih poslova."} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
