"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useJobs, type JobFiltersState } from "@/hooks/useJobs";
import { useCategories } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobList } from "@/components/jobs/JobList";
import { JobsMap } from "@/components/maps/JobsMap";
import { Button } from "@/components/ui/button";
import type { Handyman } from "@/types";

const defaultFilters: JobFiltersState = {
  categories: [],
  city: "",
  radius: 50,
  minTokenCost: 0,
  maxTokenCost: 100,
  sort: "newest",
};

export default function JobsPage() {
  const { role, user } = useAuth();
  if (!role) return <p className="p-6">Učitavanje...</p>;
  const isHandyman = role === "ROLE_HANDYMAN";
  const handymanCategoryIds = (user as Handyman | null)?.categoryIds ?? [];
  const [filters, setFilters] = useState<JobFiltersState>(defaultFilters);

  useEffect(() => {
    if (isHandyman && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFilters((f) => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude }));
      });
    }
  }, [isHandyman]);
  const { data: categories } = useCategories();
  const visibleCategories = useMemo(() => {
    if (!isHandyman || !categories) return categories;
    if (!handymanCategoryIds.length) return [];
    return categories.filter((c) => handymanCategoryIds.includes(c.id));
  }, [isHandyman, categories, handymanCategoryIds]);
  const { data: jobs, isLoading } = useJobs(isHandyman ? filters : undefined, isHandyman ? "browse" : "my");
  const needsCategories = isHandyman && handymanCategoryIds.length === 0;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {isHandyman && visibleCategories && visibleCategories.length > 0 && (
          <JobFilters categories={visibleCategories} filters={filters} onChange={setFilters} />
        )}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{isHandyman ? "Dostupni poslovi" : "Moji poslovi"}</h1>
            {!isHandyman && (
              <Link href="/jobs/new"><Button>Novi oglas</Button></Link>
            )}
          </div>
          {needsCategories ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <p className="font-medium">Niste izabrali kategorije poslova.</p>
              <p className="mt-1 text-sm">
                Na{" "}
                <Link href="/profile" className="font-medium underline">
                  profilu
                </Link>{" "}
                izaberite 1–10 kategorija da biste videli relevantne poslove.
              </p>
            </div>
          ) : isLoading ? <p>Učitavanje...</p> : (
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
