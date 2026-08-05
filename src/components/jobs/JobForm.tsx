"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useCategories } from "@/hooks/useJobs";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobImageUpload } from "@/components/jobs/JobImageUpload";
import { CATEGORY_ICONS } from "@/constants";
import { SERBIAN_CITIES } from "@/constants/serbianCities";

const schema = z.object({
  categoryId: z.number({ message: "Izaberite kategoriju" }),
  title: z.string().min(3, "Naslov mora imati bar 3 karaktera"),
  description: z.string().min(10, "Opis mora imati bar 10 karaktera"),
  city: z.string().min(1, "Izaberite grad"),
  images: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const CITY_OPTIONS = [
  { value: "", label: "Izaberite grad" },
  ...SERBIAN_CITIES.map((city) => ({ value: city.name, label: city.name })),
];

export function JobForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [stepBusy, setStepBusy] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { images: [], city: "" },
  });

  const values = watch();
  const selectedCategory = categories?.find((c: { id: number }) => c.id === values.categoryId);

  const onSubmit = async (data: FormData) => {
    const city = data.city?.trim() ?? "";
    if (!city) {
      setStep(3);
      setError("Izaberite grad pre objavljivanja.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        categoryId: data.categoryId,
        title: data.title.trim(),
        description: data.description.trim(),
        city,
        images: data.images?.length ? data.images : undefined,
      };
      const res = await api.post("/api/jobs", payload);
      await queryClient.invalidateQueries({ queryKey: ["jobs", "my"] });
      router.push(`/jobs/${res.data.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 403) {
        setError("Samo klijenti mogu da objave oglas. Prijavite se kao klijent.");
      } else {
        setError(axiosErr.response?.data?.message || "Greška pri objavljivanju. Pokušajte ponovo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = () => {
    if (!values.categoryId) {
      setStep(1);
      setError("Izaberite kategoriju posla.");
      return;
    }
    if (!values.title || values.title.length < 3 || !values.description || values.description.length < 10) {
      setStep(2);
      setError("Naslov (min. 3 znaka) i opis (min. 10 znakova) su obavezni.");
      return;
    }
    setStep(3);
    setError("Izaberite grad pre objavljivanja.");
  };

  const nextStep = async () => {
    if (stepBusy || step >= 3) return;
    setStepBusy(true);
    setError("");
    try {
      if (step === 1) {
        if (!values.categoryId) {
          setError("Izaberite kategoriju.");
          return;
        }
      }
      if (step === 2) {
        const ok = await trigger(["title", "description"]);
        if (!ok) return;
      }
      setStep((s) => s + 1);
    } finally {
      setStepBusy(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      void nextStep();
      return;
    }
    void handleSubmit(onSubmit, onInvalid)(e);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || step >= 3) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA") return;
    e.preventDefault();
    void nextStep();
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader><CardTitle>Novi oglas — korak {step}/3</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} onKeyDown={handleFormKeyDown} className="space-y-4">
          {step === 1 && (
            <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-100 p-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories?.map((cat: { id: number; name: string; slug: string }) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue("categoryId", cat.id, { shouldValidate: true })}
                  className={`rounded-xl border-2 p-4 text-left ${values.categoryId === cat.id ? "border-primary-800 bg-primary-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <span className="text-2xl">{CATEGORY_ICONS[cat.slug] || "🔨"}</span>
                  <p className="mt-2 font-semibold">{cat.name}</p>
                </button>
              ))}
              {errors.categoryId && <p className="col-span-2 text-sm text-red-600">{errors.categoryId.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div><Label>Naslov</Label><Input {...register("title")} />{errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}</div>
              <div><Label>Opis</Label><Textarea rows={5} {...register("description")} />{errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}</div>
              <div>
                <JobImageUpload
                  images={values.images || []}
                  onChange={(images) => setValue("images", images, { shouldDirty: true })}
                />
              </div>
            </>
          )}

            {step === 3 && (
            <>
              <div>
                <Label>Grad</Label>
                <Select
                  options={CITY_OPTIONS}
                  value={values.city ?? ""}
                  onValueChange={(v) => {
                    setError("");
                    setValue("city", v, { shouldValidate: true, shouldDirty: true });
                  }}
                />
                {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Pregled</p>
                <p className="mt-2"><strong>Kategorija:</strong> {selectedCategory?.name || "—"}</p>
                <p><strong>Naslov:</strong> {values.title || "—"}</p>
                <p><strong>Grad:</strong> {values.city || "—"}</p>
                <p className="mt-2 text-slate-600">
                  Oglas ide adminu na pregled. Biće vidljiv majstorima i izvođačima tek kada admin odobri oglas.
                </p>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => { setError(""); setStep(step - 1); }}>
                Nazad
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={() => void nextStep()} disabled={stepBusy} className={step === 1 ? "ml-auto" : ""}>
                {stepBusy ? "Provera..." : "Dalje"}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={submitting || !(values.city && values.city.trim())}
                className="ml-auto"
                onClick={() => void handleSubmit(onSubmit, onInvalid)()}
              >
                {submitting ? "Objavljivanje..." : "Objavi oglas"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
