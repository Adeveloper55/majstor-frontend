"use client";

import { StarRating } from "@/components/shared/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplication } from "@/types";
import { APPLICATION_STATUS_LABELS } from "@/constants";

interface ApplicationCardProps {
  application: JobApplication & { handyman?: { id?: string; fullName?: string; city?: string; averageRating?: number } };
  statusLabel?: string;
}

export function ApplicationCard({ application, statusLabel }: ApplicationCardProps) {
  const handyman = application.handyman as { id?: string; fullName?: string; city?: string; averageRating?: number; profileImageUrl?: string } | undefined;
  const isUnlocked = application.status === "UNLOCKED" || application.status === "ACCEPTED";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-bold text-slate-500">
          {handyman?.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={handyman.profileImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            handyman?.fullName?.charAt(0) || "?"
          )}
        </div>
        <CardTitle>{handyman?.fullName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center gap-2 text-slate-600">
          <span>{handyman?.city}</span>
          <StarRating value={Math.round(handyman?.averageRating || 0)} readonly size="sm" />
        </div>
        {application.coverMessage && <p className="mb-3 text-base text-slate-700">{application.coverMessage}</p>}
        <p className="text-sm text-slate-500">
          {isUnlocked ? "Pregledano" : "Prijavljeno"}: {new Date(application.appliedAt).toLocaleString("sr")}
        </p>
        {isUnlocked && application.tokensSpent > 0 && (
          <p className="mt-2 text-sm font-medium text-green-800">Plaćeno: {application.tokensSpent} tokena</p>
        )}
        <p className="mt-3 font-semibold text-slate-700">
          {statusLabel || APPLICATION_STATUS_LABELS[application.status] || application.status}
        </p>
      </CardContent>
    </Card>
  );
}
