"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface CompanyRegistration {
  id: string;
  email: string;
  phone: string;
  normalizedPhone: string;
  selectedServiceIds: string[];
  selectedServiceNames: string[];
  companyShortDescription: string;
  selectedDistricts: string[];
  companyName: string;
  pib: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  contactPerson: string;
  status: string;
  adminNote?: string;
  handymanId?: string;
  createdAt: string;
  reviewedAt?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Na čekanju",
  APPROVED: "Odobreno",
  REJECTED: "Odbijeno",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-0.5 text-base text-slate-900">{value}</div>
    </div>
  );
}

export default function AdminCompanyRegistrationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [rejectNote, setRejectNote] = useState("");
  const [actionError, setActionError] = useState("");

  const { data: reg, isLoading } = useQuery({
    queryKey: ["admin-company-registration", id],
    queryFn: async () =>
      (await api.get<CompanyRegistration>(`/api/admin/company-registrations/${id}`)).data,
    enabled: !!id,
  });

  const approve = useMutation({
    mutationFn: () => api.post(`/api/admin/company-registrations/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-company-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-company-registration", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setActionError("");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(msg || "Greška pri odobravanju.");
    },
  });

  const reject = useMutation({
    mutationFn: () =>
      api.post(`/api/admin/company-registrations/${id}/reject`, { adminNote: rejectNote || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-company-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-company-registration", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setActionError("");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(msg || "Greška pri odbijanju.");
    },
  });

  if (isLoading || !reg) {
    return (
      <AdminLayout>
        <p>Učitavanje...</p>
      </AdminLayout>
    );
  }

  const isPending = reg.status === "PENDING";

  return (
    <AdminLayout>
        <Link
          href="/admin/company-registrations"
          className="mb-4 inline-block text-sm text-primary-800 hover:underline"
        >
          ← Nazad na prijave
        </Link>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <h1 className="text-xl font-bold sm:text-2xl">{reg.companyName}</h1>
          <Badge
            className={
              reg.status === "PENDING"
                ? "bg-amber-100 text-amber-800"
                : reg.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
            }
          >
            {STATUS_LABELS[reg.status] ?? reg.status}
          </Badge>
        </div>

        <p className="mb-6 text-sm text-slate-500">
          Poslato: {new Date(reg.createdAt).toLocaleString("sr-RS")}
          {reg.reviewedAt && (
            <> · Obrađeno: {new Date(reg.reviewedAt).toLocaleString("sr-RS")}</>
          )}
        </p>

        <div className="grid max-w-4xl gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Email" value={<a href={`mailto:${reg.email}`} className="break-all text-primary-800 hover:underline">{reg.email}</a>} />
              <DetailRow label="Telefon (unet)" value={reg.phone} />
              <DetailRow label="Telefon (normalizovan)" value={reg.normalizedPhone} />
              <DetailRow label="Kontakt osoba" value={reg.contactPerson} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preduzeće</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Naziv preduzeća" value={reg.companyName} />
              <DetailRow label="PIB" value={reg.pib} />
              <DetailRow label="Adresa" value={reg.address} />
              <DetailRow label="Poštanski broj" value={reg.postalCode} />
              <DetailRow label="Grad" value={reg.city} />
              <DetailRow label="Država" value={reg.country} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delatnosti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reg.companyShortDescription && (
                <DetailRow
                  label="Kratak opis"
                  value={<p className="whitespace-pre-wrap">{reg.companyShortDescription}</p>}
                />
              )}
              <DetailRow
                label={`Izabrane usluge (${reg.selectedServiceNames?.length ?? 0})`}
                value={
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
                    {reg.selectedServiceNames?.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Okruzi pokrivanja ({reg.selectedDistricts?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {reg.selectedDistricts?.map((d) => (
                  <Badge key={d} className="border border-slate-200 bg-white font-normal text-slate-700">
                    {d}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {reg.status === "APPROVED" && reg.handymanId && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">
                  Nalog majstora kreiran.{" "}
                  <Link href={`/admin/handymen/${reg.handymanId}`} className="text-primary-800 hover:underline">
                    Pogledaj profil majstora →
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}

          {reg.adminNote && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Napomena admina</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-slate-800">{reg.adminNote}</p>
              </CardContent>
            </Card>
          )}

          {isPending && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Akcije</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actionError && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>
                )}
                <p className="text-sm text-slate-600">
                  Odobrenje kreira verifikovan nalog majstora sa svim podacima iz prijave. Korisnik može odmah da se prijavi.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    onClick={() => approve.mutate()}
                    disabled={approve.isPending || reject.isPending}
                    className="h-11 w-full sm:w-auto"
                  >
                    {approve.isPending ? "Odobravanje..." : "Odobri registraciju"}
                  </Button>
                </div>
                <div className="space-y-2 border-t pt-4">
                  <label htmlFor="rejectNote" className="text-sm font-medium text-slate-700">
                    Napomena pri odbijanju (opciono)
                  </label>
                  <Textarea
                    id="rejectNote"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Razlog odbijanja..."
                    rows={3}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => reject.mutate()}
                    disabled={approve.isPending || reject.isPending}
                    className="h-11 w-full sm:w-auto"
                  >
                    {reject.isPending ? "Odbijanje..." : "Odbij prijavu"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
    </AdminLayout>
  );
}
