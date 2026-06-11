"use client";

import Link from "next/link";
import { useMyApplications } from "@/hooks/useJobs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { APPLICATION_STATUS_LABELS, JOB_STATUS_LABELS } from "@/constants";

interface HandymanViewedJobsHistoryProps {
  title?: string;
  description?: string;
  limit?: number;
  showViewAllLink?: boolean;
}

export function HandymanViewedJobsHistory({
  title = "Istorija pregledanih poslova",
  description = "Poslovi za koje ste kliknuli „Vidi detalje” i otključali kontakt.",
  limit,
  showViewAllLink = false,
}: HandymanViewedJobsHistoryProps) {
  const { data, isLoading, isError } = useMyApplications();
  const items = limit ? data?.slice(0, limit) : data;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {showViewAllLink && (data?.length ?? 0) > (limit ?? 0) && (
          <Link href="/applications" className="text-sm font-semibold text-primary-800 hover:underline">
            Svi poslovi →
          </Link>
        )}
      </div>

      {isLoading && <p className="text-slate-500">Učitavanje...</p>}
      {isError && <p className="text-red-600">Greška pri učitavanju istorije.</p>}

      <div className="space-y-3">
        {items?.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/jobs/${app.jobListingId}`}
                    className="text-base font-semibold text-primary-900 hover:underline"
                  >
                    {app.jobTitle || "Posao"}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                    {app.jobCategory && <span>{app.jobCategory}</span>}
                    {app.jobCity && <span>• {app.jobCity}</span>}
                    {app.tokensSpent > 0 && <span>• {app.tokensSpent} tokena</span>}
                  </div>
                  {app.jobStatus && app.jobStatus !== "OPEN" && (
                    <p className="mt-1 text-sm text-slate-500">
                      Status: {JOB_STATUS_LABELS[app.jobStatus] || app.jobStatus}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-500">
                    Pregledano: {new Date(app.appliedAt).toLocaleString("sr")}
                  </p>
                </div>
                <Badge variant="success">
                  {APPLICATION_STATUS_LABELS[app.status] || app.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && !items?.length && (
          <p className="text-slate-500">
            Još niste pregledali nijedan posao. Na listi poslova kliknite „Vidi detalje”.
          </p>
        )}
      </div>
    </section>
  );
}
