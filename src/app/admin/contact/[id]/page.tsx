"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  isContractor: boolean;
  status: string;
  createdAt: string;
}

export default function AdminContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: msg } = useQuery({
    queryKey: ["admin-contact", id],
    queryFn: async () => (await api.get<ContactMessage>(`/api/admin/contact-messages/${id}`)).data,
    enabled: !!id,
  });

  const markRead = useMutation({
    mutationFn: () => api.post(`/api/admin/contact-messages/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] }),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/api/admin/contact-messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      router.push("/admin/contact");
    },
  });

  useEffect(() => {
    if (msg?.status === "NEW") {
      markRead.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg?.id, msg?.status]);

  if (!msg) {
    return (
      <AdminLayout className="p-4 sm:p-6">
        <p>Učitavanje...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout className="p-4 sm:p-6">
        <Link href="/admin/contact" className="mb-4 inline-block text-sm text-primary-800 hover:underline">
          ← Nazad na poruke
        </Link>
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{msg.fullName}</CardTitle>
              {msg.isContractor && (
                <Badge className="bg-amber-100 text-amber-800">Majstor / izvođač</Badge>
              )}
              <Badge className={msg.status === "NEW" ? undefined : "border border-slate-200 bg-white text-slate-600"}>
                {msg.status === "NEW" ? "Novo" : "Pročitano"}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              {new Date(msg.createdAt).toLocaleString("sr-RS")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <a href={`mailto:${msg.email}`} className="text-primary-800 hover:underline">{msg.email}</a>
            </div>
            {msg.phone && (
              <div>
                <p className="text-sm font-medium text-slate-500">Telefon</p>
                <a href={`tel:${msg.phone}`} className="text-primary-800 hover:underline">{msg.phone}</a>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-500">Poruka</p>
              <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-slate-800">{msg.message}</p>
            </div>
            <Button variant="destructive" onClick={() => remove.mutate()} disabled={remove.isPending}>
              Obriši poruku
            </Button>
          </CardContent>
        </Card>
    </AdminLayout>
  );
}
