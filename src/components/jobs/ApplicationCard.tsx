"use client";

import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobApplication } from "@/types";

interface ApplicationCardProps {
  application: JobApplication & { handyman?: { id?: string; fullName?: string; city?: string; averageRating?: number } };
  onSelect?: (handymanId: string) => void;
  statusLabel?: string;
  loading?: boolean;
}

export function ApplicationCard({ application, onSelect, statusLabel, loading }: ApplicationCardProps) {
  const handyman = application.handyman as { id?: string; fullName?: string; city?: string; averageRating?: number; profileImageUrl?: string } | undefined;

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
        <p className="text-sm text-slate-500">Prijavljeno: {new Date(application.appliedAt).toLocaleString("sr")}</p>
        {application.status === "PENDING" && onSelect && handyman?.id && (
          <Button className="mt-4" disabled={loading} onClick={() => onSelect(handyman.id!)}>
            Izaberi ovog majstora
          </Button>
        )}
        {application.status === "PENDING" && !onSelect && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            Čeka admin odobrenje
          </p>
        )}
        {application.status !== "PENDING" && (
          <p className="mt-3 font-semibold text-slate-700">
            Status: {statusLabel || application.status}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
