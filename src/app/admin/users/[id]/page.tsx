"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => (await api.get<User>(`/api/admin/users/${id}`)).data,
  });

  const deleteAccount = async () => {
    await api.delete(`/api/admin/users/${id}`);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-pending-jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    ]);
    queryClient.removeQueries({ queryKey: ["admin-user", id] });
    router.push("/admin/users");
    router.refresh();
  };

  if (!user) {
    return (
      <AdminLayout className="p-4 sm:p-6">
        <p>Učitavanje...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout className="p-4 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">{user.fullName}</h1>
        <div className="space-y-2 text-base">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefon:</strong> {user.phone || "—"}</p>
          <p><strong>Grad:</strong> {user.city || "—"}</p>
          <p><strong>Ocena:</strong> {user.averageRating} ({user.totalReviews} recenzija)</p>
        </div>
        <Button variant="destructive" className="mt-6" onClick={() => setConfirmOpen(true)}>Obriši nalog</Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Obriši nalog klijenta?"
          description="Nalog, svi oglasi, prijave i recenzije biće trajno obrisani iz baze. Korisnik će moći ponovo da se registruje istim emailom."
          confirmLabel="Obriši trajno"
          onConfirm={deleteAccount}
        />
    </AdminLayout>
  );
}
