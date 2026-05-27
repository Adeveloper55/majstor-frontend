"use client";

import dynamic from "next/dynamic";
import type { JobListing } from "@/types";

const JobsMapInner = dynamic(() => import("./JobsMapInner"), {
  ssr: false,
  loading: () => <div className="flex h-80 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500">Učitavanje mape...</div>,
});

interface JobsMapProps {
  jobs: JobListing[];
}

export function JobsMap({ jobs }: JobsMapProps) {
  const withCoords = jobs.filter((j) => j.latitude != null && j.longitude != null);
  if (!withCoords.length) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500">
        Nema poslova sa lokacijom za prikaz na mapi.
      </div>
    );
  }
  return <JobsMapInner jobs={withCoords} />;
}
