"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useJob, useCategories } from "@/hooks/useJobs";
import { Sidebar } from "@/components/layout/Sidebar";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/constants";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: job } = useJob(id || "");
  const { data: categories } = useCategories();
  const [form, setForm] = useState({
    categoryId: 0,
    title: "",
    description: "",
    address: "",
    city: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    images: [] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setForm({
        categoryId: job.categoryId,
        title: job.title,
        description: job.description,
        address: job.address || "",
        city: job.city || "",
        latitude: job.latitude,
        longitude: job.longitude,
        images: job.images || [],
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.put(`/api/jobs/${id}`, form);
      router.push(`/jobs/${id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri čuvanju");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p className="p-8">Učitavanje...</p>;
  if (job.status !== "OPEN") return <p className="p-8">Samo otvoreni oglasi mogu biti izmenjeni.</p>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader><CardTitle>Izmena oglasa</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Kategorija</Label>
                <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-slate-100 p-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {categories?.map((cat: { id: number; name: string; slug: string }) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm({ ...form, categoryId: cat.id })}
                      className={`rounded-lg border-2 p-3 text-left text-sm ${form.categoryId === cat.id ? "border-primary-800 bg-primary-50" : "border-slate-200"}`}
                    >
                      {CATEGORY_ICONS[cat.slug] || "🔨"} {cat.name}
                    </button>
                  ))}
                  </div>
                </div>
              </div>
              <div><Label>Naslov</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Opis</Label><Textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <LocationPicker
                address={form.address}
                city={form.city}
                latitude={form.latitude}
                longitude={form.longitude}
                onAddressChange={(v) => setForm({ ...form, address: v })}
                onCityChange={(v) => setForm({ ...form, city: v })}
                onLocationChange={(lat, lon) => setForm({ ...form, latitude: lat, longitude: lon })}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>{loading ? "Čuvanje..." : "Sačuvaj izmene"}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Nazad</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
