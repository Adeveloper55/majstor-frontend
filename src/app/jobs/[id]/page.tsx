"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS, JOB_STATUS_LABELS, CLIENT_JOB_APPROVAL_LABELS } from "@/constants";
import { JobLocationMap } from "@/components/maps/JobLocationMap";
import { getJobMapCoordinates, hasJobMapLocation } from "@/lib/jobLocation";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role, user, token } = useAuth();
  const router = useRouter();
  const [coverMessage, setCoverMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [error, setError] = useState("");

  const { data: job, refetch, isLoading, isError } = useJob(id);

  const isClientOwner = role === "ROLE_CLIENT" && job?.userId === user?.id;
  const clientCanCancel = isClientOwner
    && !job?.selectedHandymanId
    && (job?.status === "PENDING_APPROVAL" || job?.status === "OPEN");
  const clientCanEdit = isClientOwner
    && !job?.selectedHandymanId
    && (job?.status === "PENDING_APPROVAL" || job?.status === "OPEN");

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await api.post(`/api/jobs/${id}/apply`, { coverMessage });
      router.push("/applications");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri prijavi");
    } finally {
      setApplying(false);
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
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6">
          <p className="text-red-600">Posao nije pronađen ili nemate pristup.</p>
          <Link href="/jobs" className="mt-4 inline-block text-primary-800 hover:underline">← Nazad na moje poslove</Link>
        </main>
      </div>
    );
  }

  const icon = CATEGORY_ICONS[job.category?.slug || ""] || "🔨";
  const showMapLocation = hasJobMapLocation(job);
  const mapCoords = getJobMapCoordinates(job);
  const isHandyman = role === "ROLE_HANDYMAN";
  const isAssignedHandyman = isHandyman
    && job.selectedHandymanId === user?.id
    && (job.status === "IN_PROGRESS" || job.status === "COMPLETED");
  const locationLabel = [showMapLocation && job.address, job.city].filter(Boolean).join(", ");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{icon} {job.category?.name}</Badge>
              <Badge variant={job.status === "OPEN" ? "success" : job.status === "PENDING_APPROVAL" ? "warning" : "default"}>
                {role === "ROLE_CLIENT"
                  ? (CLIENT_JOB_APPROVAL_LABELS[job.status] || JOB_STATUS_LABELS[job.status] || job.status)
                  : (JOB_STATUS_LABELS[job.status] || job.status)}
              </Badge>
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
              {(!isHandyman || isAssignedHandyman) && showMapLocation && job.address && (
                <p><strong>Adresa:</strong> {job.address}</p>
              )}
              {role !== "ROLE_CLIENT" && job.tokenCost != null && (
                <p><strong>Tokeni:</strong> {job.tokenCost}</p>
              )}
            </div>

            {isHandyman && job.status === "OPEN" && !isAssignedHandyman && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Tačna lokacija na mapi biće vidljiva tek kada vam admin dodeli posao.
              </div>
            )}

            {role === "ROLE_CLIENT" && job.status === "PENDING_APPROVAL" && (
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Status: Nije odobren</p>
                <p className="mt-1">Admin pregleda vaš oglas. Kada ga odobri, postaće vidljiv majstorima.</p>
              </div>
            )}

            {role === "ROLE_CLIENT" && job.status === "OPEN" && !job.selectedHandymanId && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <p className="font-semibold">Status: Odobren</p>
                <p className="mt-1">Oglas je vidljiv majstorima. Admin će dodeliti majstora kada se neko prijavi.</p>
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

            {role === "ROLE_CLIENT" && (job.status === "IN_PROGRESS" || job.status === "COMPLETED") && job.assignedHandymanContact && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                <h3 className="mb-1 font-bold text-green-900">Dodeljeni majstor</h3>
                <p className="mb-3 text-sm text-green-800">Kontaktirajte majstora da dogovorite detalje rada.</p>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><strong>Ime:</strong> {job.assignedHandymanContact.fullName}</p>
                  <p><strong>Email:</strong>{" "}
                    <a href={`mailto:${job.assignedHandymanContact.email}`} className="text-primary-800 hover:underline">
                      {job.assignedHandymanContact.email}
                    </a>
                  </p>
                  {job.assignedHandymanContact.phone && (
                    <p><strong>Telefon:</strong>{" "}
                      <a href={`tel:${job.assignedHandymanContact.phone}`} className="text-primary-800 hover:underline">
                        {job.assignedHandymanContact.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {job.clientContact && isAssignedHandyman && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 font-bold text-green-900">Kontakt klijenta — možete krenuti sa radom</h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><strong>Ime:</strong> {job.clientContact.fullName}</p>
                  <p><strong>Email:</strong>{" "}
                    <a href={`mailto:${job.clientContact.email}`} className="text-primary-800 hover:underline">
                      {job.clientContact.email}
                    </a>
                  </p>
                  {job.clientContact.phone && (
                    <p><strong>Telefon:</strong>{" "}
                      <a href={`tel:${job.clientContact.phone}`} className="text-primary-800 hover:underline">
                        {job.clientContact.phone}
                      </a>
                    </p>
                  )}
                </div>
                <div className="mt-4 border-t border-green-200 pt-4">
                  <p className="text-sm font-semibold text-green-900">Lokacija</p>
                  <p className="mt-1 text-sm text-green-800">
                    {locationLabel || job.city || "—"}
                  </p>
                  {mapCoords ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-green-700">Tačka na mapi koju je klijent označio:</p>
                      <div className="overflow-hidden rounded-xl border border-green-200 bg-white">
                        <JobLocationMap
                          key={`${mapCoords.latitude}-${mapCoords.longitude}`}
                          latitude={mapCoords.latitude}
                          longitude={mapCoords.longitude}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-green-700">
                      Klijent nije označio tačnu tačku na mapi. Dogovorite lokaciju sa klijentom telefonom.
                    </p>
                  )}
                </div>
              </div>
            )}

            {role === "ROLE_HANDYMAN" && job.status === "OPEN" && !job.selectedHandymanId && (
              <div className="space-y-3 border-t pt-5">
                <h3 className="font-semibold">Prijavi se na posao</h3>
                <p className="text-sm text-slate-600">
                  Prijava je besplatna. Tokeni ({job.tokenCost}) skidaju se tek kada admin odobri i dodeli vam posao.
                </p>
                <Textarea placeholder="Poruka za admina (opciono)" value={coverMessage} onChange={(e) => setCoverMessage(e.target.value)} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button onClick={handleApply} disabled={applying}>{applying ? "Prijava..." : "Prijavi se"}</Button>
              </div>
            )}

            {(job.status === "IN_PROGRESS" || job.status === "COMPLETED") && (
              <div className="flex flex-wrap gap-3 border-t pt-5">
                {job.status === "IN_PROGRESS" && (role === "ROLE_CLIENT" || role === "ROLE_HANDYMAN") && (
                  <Button onClick={handleComplete}>Označi kao završeno</Button>
                )}
                {job.status === "COMPLETED" && (
                  <Link href={`/reviews/${id}`}><Button variant="outline">Ostavi recenziju</Button></Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <ConfirmDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          title="Obriši oglas?"
          description="Oglas će biti uklonjen. Ovo nije moguće ako je majstor već dodeljen."
          confirmLabel="Obriši oglas"
          onConfirm={handleCancel}
        />
      </main>
    </div>
  );
}
