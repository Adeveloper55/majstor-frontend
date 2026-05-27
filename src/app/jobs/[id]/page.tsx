"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS, JOB_STATUS_LABELS } from "@/constants";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role, user } = useAuth();
  const router = useRouter();
  const [coverMessage, setCoverMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [error, setError] = useState("");

  const { data: job, refetch } = useJob(id);

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

  if (!job) return <p className="p-8">Učitavanje...</p>;

  const icon = CATEGORY_ICONS[job.category?.slug || ""] || "🔨";

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{icon} {job.category?.name}</Badge>
              <Badge variant={job.status === "OPEN" ? "success" : "default"}>
                {JOB_STATUS_LABELS[job.status] || job.status}
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
              {job.address && <p><strong>Adresa:</strong> {job.address}</p>}
              <p><strong>Tokeni (pri odobrenju):</strong> {job.tokenCost}</p>
              <div className="flex items-center gap-2">
                <strong>Složenost:</strong>
                <StarRating value={job.aiScore} readonly size="sm" />
              </div>
            </div>

            {role === "ROLE_CLIENT" && job.status === "OPEN" && (
              <div className="flex flex-wrap gap-3 border-t pt-5">
                <Link href={`/jobs/${id}/edit`}><Button variant="outline">Izmeni oglas</Button></Link>
                <Button variant="destructive" onClick={() => setCancelOpen(true)}>Otkaži oglas</Button>
                <Link href={`/jobs/${id}/applications`}><Button>Prijave majstora →</Button></Link>
              </div>
            )}

            {role === "ROLE_CLIENT" && job.status === "IN_PROGRESS" && (
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">Admin je dodelio majstora na vaš posao.</p>
                <p className="mt-1">Majstor će vas kontaktirati da dogovorite detalje rada. Kada posao bude završen, označite ga kao završen.</p>
              </div>
            )}

            {job.clientContact && role === "ROLE_HANDYMAN" && job.selectedHandymanId === user?.id && (
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
                  {(job.address || job.clientContact.address) && (
                    <p><strong>Lokacija:</strong> {[job.address || job.clientContact.address, job.city].filter(Boolean).join(", ")}</p>
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
                <Textarea placeholder="Poruka za klijenta (opciono)" value={coverMessage} onChange={(e) => setCoverMessage(e.target.value)} />
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
          title="Otkaži oglas?"
          description="Oglas će biti označen kao otkazan."
          confirmLabel="Otkaži oglas"
          onConfirm={handleCancel}
        />
      </main>
    </div>
  );
}
