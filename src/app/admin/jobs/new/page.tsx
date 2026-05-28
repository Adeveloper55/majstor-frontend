"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCategories } from "@/hooks/useJobs";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/constants";
import type { User } from "@/types";

export default function AdminCreateJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const { data: clients } = useQuery({
    queryKey: ["admin-users-for-job"],
    queryFn: async () => (await api.get<{ content: User[] }>("/api/admin/users?size=100")).data.content,
  });

  const [form, setForm] = useState({
    clientId: "",
    categoryId: 0,
    title: "",
    description: "",
    address: "",
    city: "Beograd",
    tokenCost: "5",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        clientId: form.clientId,
        categoryId: form.categoryId,
        title: form.title,
        description: form.description,
        address: form.address || undefined,
        city: form.city || undefined,
        tokenCost: parseInt(form.tokenCost, 10),
      };
      const { data } = await api.post("/api/admin/jobs", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      router.push(`/admin/jobs/${data.id}`);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri kreiranju posla");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.clientId) {
      setError("Izaberite klijenta");
      return;
    }
    if (!form.categoryId) {
      setError("Izaberite kategoriju");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Novi posao</h1>
          <Link href="/admin/jobs" className="text-sm text-primary-800 hover:underline">← Nazad na listu</Link>
        </div>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Objavi posao u ime klijenta</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Klijent *</Label>
                <select
                  className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2"
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  required
                >
                  <option value="">— Izaberite klijenta —</option>
                  {clients?.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                  ))}
                </select>
                {clients?.length === 0 && (
                  <p className="mt-1 text-sm text-amber-700">Nema registrovanih klijenata. Prvo registruj klijenta preko /register/client.</p>
                )}
              </div>

              <div>
                <Label>Kategorija *</Label>
                <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-slate-100 p-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {categories?.map((cat: { id: number; name: string; slug: string; baseTokenCost: number }) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm({ ...form, categoryId: cat.id, tokenCost: String(cat.baseTokenCost * 2) })}
                      className={`rounded-xl border-2 p-3 text-left text-sm ${form.categoryId === cat.id ? "border-primary-800 bg-primary-50" : "border-slate-200 hover:bg-slate-50"}`}
                    >
                      <span className="text-xl">{CATEGORY_ICONS[cat.slug] || "🔨"}</span>
                      <p className="mt-1 font-semibold">{cat.name}</p>
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              <div><Label>Naslov *</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Opis *</Label><Textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Grad</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div><Label>Adresa</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              </div>
              <div>
                <Label>Cena posla (tokeni) *</Label>
                <Input type="number" min={1} required value={form.tokenCost} onChange={(e) => setForm({ ...form, tokenCost: e.target.value })} />
                <p className="mt-1 text-sm text-slate-500">Ovoliko tokena se skida majstoru kada se prijavi na posao.</p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Kreiranje..." : "Kreiraj posao"}</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
