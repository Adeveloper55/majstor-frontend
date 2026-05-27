"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => (await api.get<User>(`/api/admin/users/${id}`)).data,
  });

  const deactivate = async () => {
    await api.delete(`/api/admin/users/${id}`);
    router.push("/admin/users");
  };

  if (!user) return <p className="p-8">Učitavanje...</p>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">{user.fullName}</h1>
        <div className="space-y-2 text-base">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefon:</strong> {user.phone || "—"}</p>
          <p><strong>Grad:</strong> {user.city || "—"}</p>
          <p><strong>Ocena:</strong> {user.averageRating} ({user.totalReviews} recenzija)</p>
        </div>
        <Button variant="destructive" className="mt-6" onClick={() => setConfirmOpen(true)}>Deaktiviraj nalog</Button>
        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Deaktiviraj klijenta?" description="Ova akcija se ne može poništiti." confirmLabel="Deaktiviraj" onConfirm={deactivate} />
      </main>
    </div>
  );
}
