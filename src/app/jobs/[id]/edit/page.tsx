"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useJob, useCategories } from "@/hooks/useJobs";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { JobImageUpload } from "@/components/jobs/JobImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_ICONS } from "@/constants";
import { SERBIAN_CITIES } from "@/constants/serbianCities";

const CITY_OPTIONS = SERBIAN_CITIES.map((city) => ({ value: city.name, label: city.name }));

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: job } = useJob(id || "");
  const { data: categories } = useCategories();
  const [form, setForm] = useState({
    categoryId: 0,
    title: "",
    description: "",
    city: "",
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
        city: job.city || "",
        images: job.images || [],
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city.trim()) {
      setError("Izaberite grad.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.put(`/api/jobs/${id}`, {
        categoryId: form.categoryId,
        title: form.title,
        description: form.description,
        city: form.city.trim(),
        images: form.images.length ? form.images : undefined,
      });
      router.push(`/jobs/${id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri čuvanju");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p className="p-8">Učitavanje...</p>;
  if (job.status !== "OPEN" && job.status !== "PENDING_APPROVAL") {
    return <p className="p-8">Samo aktivni oglasi mogu biti izmenjeni.</p>;
  }

  return (
    <PanelLayout>
      <main className="p-4 sm:p-6">
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
              <JobImageUpload
                images={form.images}
                onChange={(images) => setForm({ ...form, images })}
              />
              <div>
                <Label>Grad</Label>
                <Select
                  options={CITY_OPTIONS}
                  value={form.city}
                  placeholder="Izaberite grad"
                  onValueChange={(v) => setForm({ ...form, city: v })}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>{loading ? "Čuvanje..." : "Sačuvaj izmene"}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Nazad</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </PanelLayout>
  );
}
