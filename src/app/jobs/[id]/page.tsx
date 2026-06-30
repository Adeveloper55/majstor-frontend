"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJobs";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS, CLIENT_JOB_APPROVAL_LABELS, JOB_STATUS_LABELS } from "@/constants";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role, user, token } = useAuth();
  const router = useRouter();
  const [unlocking, setUnlocking] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const { data: job, refetch, isLoading, isError } = useJob(id);

  const isClientOwner = role === "ROLE_CLIENT" && job?.userId === user?.id;
  const clientCanCancel = isClientOwner && (job?.status === "OPEN" || job?.status === "PENDING_APPROVAL");
  const clientCanEdit = isClientOwner && (job?.status === "OPEN" || job?.status === "PENDING_APPROVAL");
  const isHandyman = role === "ROLE_HANDYMAN";
  const hasUnlocked = Boolean(job?.unlockedByMe || job?.clientContact);

  const handleUnlock = async () => {
    setUnlocking(true);
    setError("");
    try {
      await api.post(`/api/jobs/${id}/unlock`);
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      await queryClient.invalidateQueries({ queryKey: ["unlocked-jobs"] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri pregledu detalja");
    } finally {
      setUnlocking(false);
    }
  };

  const handleComplete = async () => {
    await api.post(`/api/jobs/${id}/complete`);
    refetch();
  };

  const handleCancel = async () => {
    await api.delete(`/api/jobs/${id}`);
    router.push("/jobs");
  };

  if (!token || isLoading) return <p className="p-8">Učitavanje...</p>;
  if (isError || !job) {
    return (
      <PanelLayout>
        <main className="p-4 sm:p-6">
          <p className="text-red-600">Posao nije pronađen ili nemate pristup.</p>
          <Link href="/jobs" className="mt-4 inline-block text-primary-800 hover:underline">← Nazad na poslove</Link>
        </main>
      </PanelLayout>
    );
  }

  const icon = CATEGORY_ICONS[job.category?.slug || ""] || "🔨";
  const statusLabel = isClientOwner
    ? CLIENT_JOB_APPROVAL_LABELS[job.status] || JOB_STATUS_LABELS[job.status] || job.status
    : JOB_STATUS_LABELS[job.status] || job.status;

  return (
    <PanelLayout>
      <main className="p-4 sm:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{icon} {job.category?.name}</Badge>
              <Badge variant={job.status === "OPEN" ? "success" : job.status === "PENDING_APPROVAL" ? "warning" : job.status === "COMPLETED" ? "default" : "warning"}>
                {statusLabel}
              </Badge>
              {hasUnlocked && isHandyman && (
                <Badge variant="success">Detalji pregledani</Badge>
              )}
            </div>
            <CardTitle className="mt-3 text-2xl">{job.title}</CardTitle>
            <p className="text-sm text-slate-500">Objavljeno {new Date(job.createdAt).toLocaleDateString("sr")}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-base leading-relaxed text-slate-700">{job.description}</p>

            {job.images && job.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {job.images.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`Slika ${i + 1}`} className="h-40 w-full rounded-lg object-cover" />
                ))}
              </div>
            )}

            <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <p><strong>Grad:</strong> {job.city || "—"}</p>
              {role !== "ROLE_CLIENT" && job.tokenCost != null && (
                <p><strong>Tokeni:</strong> {job.tokenCost}</p>
              )}
            </div>

            {role === "ROLE_CLIENT" && job.status === "PENDING_APPROVAL" && isClientOwner && (
              <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">Oglas još nije vidljiv majstorima i izvođačima</p>
                <p className="mt-1">
                  Admin mora da pregleda oglas, upiše koliko tokena košta pregled detalja i klikne „Dozvoli posao”.
                  Tek tada oglas postaje aktivan i vidljiv svim majstorima i izvođačima u platformi.
                </p>
              </div>
            )}

            {role === "ROLE_CLIENT" && job.status === "OPEN" && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <p className="font-semibold">Oglas je aktivan</p>
                <p className="mt-1">Majstori i izvođači vide oglas i mogu da pogledaju detalje (uz tokene). Ako im odgovara, sami zovu — vi ne birate ko zove.</p>
              </div>
            )}

            {clientCanEdit && (
              <div className="flex flex-wrap gap-3 border-t pt-5">
                <Link href={`/jobs/${id}/edit`}><Button variant="outline">Izmeni oglas</Button></Link>
                {clientCanCancel && (
                  <Button variant="destructive" onClick={() => setCancelOpen(true)}>Obriši oglas</Button>
                )}
              </div>
            )}

            {job.clientContact && isHandyman && hasUnlocked && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 font-bold text-green-900">Kontakt klijenta</h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><strong>Ime:</strong> {job.clientContact.fullName}</p>
                  {job.clientContact.phone && (
                    <p><strong>Telefon:</strong>{" "}
                      <a href={`tel:${job.clientContact.phone}`} className="text-lg font-semibold text-primary-800 hover:underline">
                        {job.clientContact.phone}
                      </a>
                    </p>
                  )}
                  <p><strong>Grad:</strong> {job.city || job.clientContact.city || "—"}</p>
                  <p><strong>Email:</strong>{" "}
                    <a href={`mailto:${job.clientContact.email}`} className="text-primary-800 hover:underline">
                      {job.clientContact.email}
                    </a>
                  </p>
                </div>
                <p className="mt-3 text-sm text-green-800">Pozovite klijenta i dogovorite detalje posla.</p>
              </div>
            )}

            {isHandyman && job.status === "OPEN" && !hasUnlocked && (
              <div className="space-y-3 border-t pt-5">
                <h3 className="font-semibold">Vidi detalje</h3>
                <p className="text-sm text-slate-600">
                  Klikom vidite detalje posla i kontakt klijenta (telefon i grad). Skinuće se {job.tokenCost} tokena sa vašeg naloga.
                  Nakon toga sami odlučujete da li ćete pozvati klijenta. Više majstora može da pogleda isti oglas.
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleUnlock} disabled={unlocking}>
                    {unlocking ? "Učitavanje..." : `Vidi detalje (${job.tokenCost} tokena)`}
                  </Button>
                  <Link href="/tokens"><Button variant="outline">Dopuni tokene</Button></Link>
                </div>
              </div>
            )}

            {isClientOwner && job.status === "OPEN" && (
              <div className="flex flex-wrap gap-3 border-t pt-5">
                <Button onClick={handleComplete}>Označi kao završeno</Button>
              </div>
            )}

            {job.status === "COMPLETED" && isClientOwner && (
              <div className="border-t pt-5">
                <Link href={`/reviews/${id}`}><Button variant="outline">Ostavi recenziju</Button></Link>
              </div>
            )}
          </CardContent>
        </Card>
        <ConfirmDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          title="Obriši oglas?"
          description="Oglas će biti uklonjen sa liste dostupnih poslova."
          confirmLabel="Obriši oglas"
          onConfirm={handleCancel}
        />
      </main>
    </PanelLayout>
  );
}
