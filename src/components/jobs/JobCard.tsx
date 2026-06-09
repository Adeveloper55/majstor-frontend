"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_ICONS, JOB_STATUS_LABELS, CLIENT_JOB_APPROVAL_LABELS } from "@/constants";
import type { JobListing } from "@/types";
import Link from "next/link";

interface JobCardProps {
  job: JobListing;
  showDistance?: boolean;
  hideTokenCost?: boolean;
}

export function JobCard({ job, showDistance = false, hideTokenCost = false }: JobCardProps) {
  const icon = CATEGORY_ICONS[job.category?.slug || ""] || "🔨";

  return (
    <Card className="transition-shadow hover:shadow-elevated">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge>{icon} {job.category?.name}</Badge>
          <Badge variant={job.status === "OPEN" ? "success" : job.status === "PENDING_APPROVAL" ? "warning" : "default"}>
            {(hideTokenCost ? CLIENT_JOB_APPROVAL_LABELS : JOB_STATUS_LABELS)[job.status] || job.status}
          </Badge>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">{job.title}</h3>
        <p className="mb-4 line-clamp-2 text-base text-slate-600">{job.description}</p>
        <div className="mb-4 flex flex-wrap gap-2 text-sm text-slate-500">
          {job.city && <span>📍 {job.city}</span>}
          {showDistance && job.distance != null && <span>• {job.distance.toFixed(1)} km</span>}
          {!hideTokenCost && job.tokenCost != null && <span>• {job.tokenCost} tokena</span>}
          <span>• {new Date(job.createdAt).toLocaleDateString("sr")}</span>
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button className="w-full sm:w-auto">Pogledaj detalje</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
