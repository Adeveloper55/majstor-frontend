"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Handyman } from "@/types";

export default function AdminHandymanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adjustMessage, setAdjustMessage] = useState("");
  const [adjustError, setAdjustError] = useState("");

  const { data, refetch } = useQuery({
    queryKey: ["admin-handyman", id],
    queryFn: async () => (await api.get<Handyman>(`/api/admin/handymen/${id}`)).data,
  });

  const adjustTokens = async () => {
    setAdjustMessage("");
    setAdjustError("");
    if (amount < 0 && (data?.tokenBalance ?? 0) === 0) {
      setAdjustMessage("Stanje tokena je nula.");
      return;
    }
    try {
      await api.post(`/api/admin/handymen/${id}/adjust-tokens`, { amount, description });
      await refetch();
      setAdjustMessage(amount === 0 ? "Nema promene." : "Tokeni su ažurirani.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (msg?.toLowerCase().includes("nula")) {
        setAdjustMessage(msg);
      } else {
        setAdjustError(msg || "Greška pri korekciji tokena.");
      }
    }
  };

  const deactivate = async () => {
    await api.delete(`/api/admin/handymen/${id}`);
    router.push("/admin/handymen");
  };

  return (
    <AdminLayout className="p-4 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">{data?.fullName}</h1>
        <div className="mb-6 space-y-2 text-base">
          <p><strong>Email:</strong> {data?.email}</p>
          <p><strong>Grad:</strong> {data?.city || "—"}</p>
          {data?.companyName && <p><strong>Preduzeće:</strong> {data.companyName}</p>}
          <p><strong>PIB:</strong> {data?.pib || "—"}</p>
          {data?.address && <p><strong>Adresa:</strong> {data.address}{data.postalCode ? `, ${data.postalCode}` : ""} {data.city || ""}</p>}
          {data?.contactPerson && <p><strong>Kontakt osoba:</strong> {data.contactPerson}</p>}
          <p><strong>Tokeni:</strong> {data?.tokenBalance}</p>
          <p><strong>Ocena:</strong> {data?.averageRating} ({data?.totalReviews} recenzija)</p>
        </div>
        <div className="mb-8 max-w-sm space-y-3 rounded-xl border-2 border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Ručna korekcija tokena</h2>
          <div><Label>Količina (+/-)</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
          <div><Label>Opis</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <Button onClick={adjustTokens}>Primeni</Button>
          {adjustMessage && <p className="text-sm text-amber-700">{adjustMessage}</p>}
          {adjustError && <p className="text-sm text-red-600">{adjustError}</p>}
        </div>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Deaktiviraj majstora</Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Deaktiviraj majstora?"
          description="Majstor više neće moći da se prijavi na platformu."
          confirmLabel="Deaktiviraj"
          onConfirm={deactivate}
        />
    </AdminLayout>
  );
}
