"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => (await api.get<{ content: Review[] }>("/api/admin/reviews?size=50")).data.content,
  });

  const removeReview = async () => {
    if (!deleteId) return;
    await api.delete(`/api/admin/reviews/${deleteId}`);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    setDeleteId(null);
  };

  return (
    <AdminLayout className="p-4 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">Recenzije</h1>
        <div className="space-y-4">
          {data?.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white p-4">
              <ReviewCard review={r} />
              <Button variant="destructive" size="sm" onClick={() => setDeleteId(r.id)}>Ukloni</Button>
            </div>
          ))}
          {!data?.length && <p className="text-slate-500">Nema recenzija.</p>}
        </div>
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title="Ukloniti recenziju?"
          description="Recenzija će biti trajno obrisana."
          confirmLabel="Ukloni"
          onConfirm={removeReview}
        />
    </AdminLayout>
  );
}
