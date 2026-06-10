"use client";

import dynamic from "next/dynamic";
import type { JobListing } from "@/types";
import { hasJobMapLocation } from "@/lib/jobLocation";

const JobsMapInner = dynamic(() => import("./JobsMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500">
      Učitavanje mape...
    </div>
  ),
});

interface JobsMapProps {
  jobs: JobListing[];
  centerLat?: number;
  centerLon?: number;
  selectedCity?: string;
}

export function JobsMap({ jobs, centerLat, centerLon, selectedCity }: JobsMapProps) {
  const withCoords = jobs.filter((j) => hasJobMapLocation(j));

  const mapCenterLat = withCoords.length
    ? withCoords.reduce((s, j) => s + (j.latitude || 0), 0) / withCoords.length
    : centerLat;
  const mapCenterLon = withCoords.length
    ? withCoords.reduce((s, j) => s + (j.longitude || 0), 0) / withCoords.length
    : centerLon;

  if (mapCenterLat == null || mapCenterLon == null) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500">
        Izaberite grad da biste videli mapu poslova.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <JobsMapInner
        jobs={withCoords}
        centerLat={mapCenterLat}
        centerLon={mapCenterLon}
        zoom={withCoords.length === 1 ? 14 : selectedCity ? 12 : 11}
      />
      {selectedCity && withCoords.length === 0 && (
        <p className="text-sm text-slate-500">
          Nema poslova sa pinom na mapi u gradu {selectedCity}. Prikazani su poslovi u listi ispod.
        </p>
      )}
    </div>
  );
}
