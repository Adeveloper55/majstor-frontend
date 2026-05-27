"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { CATEGORY_ICONS, JOB_STATUS_LABELS } from "@/constants";
import type { JobListing } from "@/types";
import Link from "next/link";

interface JobCardProps {
  job: JobListing;
  showDistance?: boolean;
}

export function JobCard({ job, showDistance = false }: JobCardProps) {
  const icon = CATEGORY_ICONS[job.category?.slug || ""] || "🔨";

  return (
    <Card className="transition-shadow hover:shadow-elevated">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge>{icon} {job.category?.name}</Badge>
          <Badge variant={job.status === "OPEN" ? "success" : "default"}>
            {JOB_STATUS_LABELS[job.status] || job.status}
          </Badge>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">{job.title}</h3>
        <p className="mb-4 line-clamp-2 text-base text-slate-600">{job.description}</p>
        <div className="mb-4 flex flex-wrap gap-2 text-sm text-slate-500">
          {job.city && <span>📍 {job.city}</span>}
          {showDistance && job.distance != null && <span>• {job.distance.toFixed(1)} km</span>}
          <span>• {job.tokenCost} tokena</span>
          {job.aiScore > 0 && (
            <span className="flex items-center gap-1">• Složenost <StarRating value={job.aiScore} readonly size="sm" /></span>
          )}
          <span>• {new Date(job.createdAt).toLocaleDateString("sr")}</span>
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button className="w-full sm:w-auto">Pogledaj detalje</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
