"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
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
  createdAt: string;
}

export default function AdminTokenRequestsPage() {
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});

  const { data, refetch } = useQuery({
    queryKey: ["admin-token-requests"],
    queryFn: async () => (await api.get<{ content: TokenRequest[] }>("/api/admin/token-requests?size=50")).data.content,
  });

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
        <div className="space-y-4">
          {data?.map((req) => (
            <div key={req.id} className="rounded border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{req.handyman?.fullName} ({req.handymanEmail})</p>
                  <p className="text-sm text-gray-600">{req.tokenAmount} tokena • {req.amountExpected} RSD</p>
                  <p className="text-sm">Referenca: {req.paymentReference || "—"}</p>
                  <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString("sr")}</p>
                </div>
                <Badge variant={req.status === "PENDING" ? "warning" : req.status === "APPROVED" ? "success" : "destructive"}>
                  {req.status}
                </Badge>
              </div>
              {req.status === "PENDING" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => approve(req.id)}>Odobri</Button>
                  <Input className="max-w-xs" placeholder="Razlog odbijanja" value={rejectNote[req.id] || ""} onChange={(e) => setRejectNote({ ...rejectNote, [req.id]: e.target.value })} />
                  <Button size="sm" variant="destructive" onClick={() => reject(req.id)}>Odbij</Button>
                </div>
              )}
            </div>
          ))}
          {!data?.length && <p className="text-gray-500">Nema zahteva.</p>}
        </div>
      </main>
    </div>
  );
}
