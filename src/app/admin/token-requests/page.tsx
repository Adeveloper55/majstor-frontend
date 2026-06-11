"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { unwrapPage } from "@/lib/utils";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TokenRequest {
  id: string;
  handymanEmail: string;
  handyman: { fullName: string };
  tokenAmount: number;
  amountExpected: number;
  paymentReference: string;
  status: string;
  predracunSentAt?: string | null;
  createdAt: string;
}

export default function AdminTokenRequestsPage() {
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ["admin-token-requests"],
    queryFn: async () =>
      unwrapPage<TokenRequest>((await api.get("/api/admin/token-requests?size=50")).data),
  });

  const sendPredracun = async (id: string) => {
    setSendingId(id);
    try {
      await api.post(`/api/admin/token-requests/${id}/send-predracun`);
      await refetch();
    } finally {
      setSendingId(null);
    }
  };

  const approve = async (id: string) => {
    await api.post(`/api/admin/token-requests/${id}/approve`);
    refetch();
  };

  const reject = async (id: string) => {
    await api.post(`/api/admin/token-requests/${id}/reject`, { adminNote: rejectNote[id] || "" });
    refetch();
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Zahtevi za tokene</h1>
        <p className="mb-6 text-sm text-slate-600">
          Majstor ili izvođač izabere paket → admin pošalje predračun sa IPS QR kodom → nakon uplate admin odobri i tokeni se dodaju.
        </p>
        <div className="space-y-4">
          {isLoading && <p className="text-slate-500">Učitavanje...</p>}
          {isError && (
            <p className="text-red-600">Greška pri učitavanju zahteva. Osvežite stranicu ili proverite backend.</p>
          )}
          {data?.map((req) => (
            <div key={req.id} className="rounded border bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{req.handyman?.fullName} ({req.handymanEmail})</p>
                  <p className="text-sm text-gray-600">{req.tokenAmount} tokena • {req.amountExpected} RSD</p>
                  <p className="text-sm">Svrha: Uplata za tokene • Poziv: 97-18365000001</p>
                  <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString("sr")}</p>
                  {req.predracunSentAt && (
                    <p className="mt-1 text-xs text-emerald-700">
                      Predračun poslat: {new Date(req.predracunSentAt).toLocaleString("sr")}
                    </p>
                  )}
                </div>
                <Badge variant={req.status === "PENDING" ? "warning" : req.status === "APPROVED" ? "success" : "destructive"}>
                  {req.status}
                </Badge>
              </div>
              {req.status === "PENDING" && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    disabled={sendingId === req.id}
                    onClick={() => sendPredracun(req.id)}
                  >
                    {sendingId === req.id ? "Slanje..." : req.predracunSentAt ? "Pošalji predračun ponovo" : "Pošalji predračun"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => approve(req.id)}>Odobri uplatu</Button>
                  <Input
                    className="max-w-xs"
                    placeholder="Razlog odbijanja"
                    value={rejectNote[req.id] || ""}
                    onChange={(e) => setRejectNote({ ...rejectNote, [req.id]: e.target.value })}
                  />
                  <Button size="sm" variant="destructive" onClick={() => reject(req.id)}>Odbij</Button>
                </div>
              )}
            </div>
          ))}
          {!isLoading && !isError && !data?.length && <p className="text-gray-500">Nema zahteva.</p>}
        </div>
      </main>
    </div>
  );
}
