"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useCategories } from "@/hooks/useJobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { CATEGORY_ICONS } from "@/constants";

const schema = z.object({
  categoryId: z.number({ message: "Izaberite kategoriju" }),
  title: z.string().min(3, "Naslov mora imati bar 3 karaktera"),
  description: z.string().min(10, "Opis mora imati bar 10 karaktera"),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export function JobForm() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState<{ score: number; reason: string; tokenCost: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { images: [] },
  });

  const values = watch();

  const loadPreview = async () => {
    const { data } = await api.post("/api/jobs/score-preview", {
      description: values.description,
      categoryId: values.categoryId,
    });
    setPreview(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ url: string }>("/api/uploads/image", formData);
      setValue("images", [...(values.images || []), data.url]);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await api.post("/api/jobs", data);
      router.push(`/jobs/${res.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri objavljivanju");
    }
  };

  const nextStep = async () => {
    if (step === 2) await loadPreview();
    setStep(step + 1);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader><CardTitle>Novi oglas — korak {step}/4</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {categories?.map((cat: { id: number; name: string; slug: string; baseTokenCost: number }) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue("categoryId", cat.id)}
                  className={`rounded-xl border-2 p-4 text-left ${values.categoryId === cat.id ? "border-primary-800 bg-primary-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <span className="text-2xl">{CATEGORY_ICONS[cat.slug] || "🔨"}</span>
                  <p className="mt-2 font-semibold">{cat.name}</p>
                  <p className="text-sm text-slate-500">{cat.baseTokenCost} baznih tokena</p>
                </button>
              ))}
              {errors.categoryId && <p className="col-span-2 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>
          )}

          {step === 2 && (
            <>
              <div><Label>Naslov</Label><Input {...register("title")} />{errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}</div>
              <div><Label>Opis</Label><Textarea rows={5} {...register("description")} />{errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}</div>
              <div>
                <Label>Slike (opciono)</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {values.images?.map((url, i) => <p key={i} className="text-xs text-green-600 truncate">✓ Slika {i + 1} otpremljena</p>)}
              </div>
            </>
          )}

          {step === 3 && (
            <LocationPicker
              address={values.address || ""}
              city={values.city || ""}
              latitude={values.latitude}
              longitude={values.longitude}
              onAddressChange={(v) => setValue("address", v)}
              onCityChange={(v) => setValue("city", v)}
              onLocationChange={(lat, lon) => { setValue("latitude", lat); setValue("longitude", lon); }}
            />
          )}

          {step === 4 && (
            preview ? (
              <div className="rounded-xl bg-primary-50 p-5">
                <p className="text-lg font-bold">AI ocena: {preview.score}/5</p>
                <p className="mt-2 text-slate-600">{preview.reason}</p>
                <p className="mt-3 font-semibold text-primary-900">
                  Na osnovu opisa, ovaj posao je ocenjen složenošću {preview.score}/5. Majstori će potrošiti {preview.tokenCost} tokena za prijavu.
                </p>
              </div>
            ) : (
              <p className="text-slate-500">Učitavanje AI procene...</p>
            )
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between pt-4">
            {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Nazad</Button>}
            {step < 4 ? (
              <Button type="button" onClick={nextStep} disabled={step === 1 && !values.categoryId}>Dalje</Button>
            ) : (
              <Button type="submit">Objavi oglas</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
