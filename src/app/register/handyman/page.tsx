"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { resolveApiBaseUrl } from "@/lib/apiUrl";
import { validatePib, normalizePib } from "@/lib/pibValidation";
import { isValidSerbianPhone } from "@/lib/phoneUtils";
import { useCategories } from "@/hooks/useJobs";
import { CategoryPicker } from "@/components/shared/CategoryPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterHandymanPage() {
  const router = useRouter();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", city: "", bio: "", pib: "" });
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [pibError, setPibError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categoriesReady = Boolean(categories?.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPibError("");
    setCategoryError("");

    if (!categoriesReady) {
      setError("Kategorije nisu učitane. Proverite konekciju sa serverom i pokušajte ponovo.");
      setLoading(false);
      return;
    }

    if (form.phone.trim() && !isValidSerbianPhone(form.phone)) {
      setPhoneError("Unesite ispravan srpski mobilni broj (npr. 0641234567).");
      setLoading(false);
      return;
    }
    setPhoneError("");

    const pibValidation = validatePib(form.pib, false);
    if (pibValidation) {
      setPibError(pibValidation);
      setLoading(false);
      return;
    }
    if (categoryIds.length === 0) {
      setCategoryError("Izaberite bar jednu kategoriju posla.");
      setLoading(false);
      return;
    }
    if (categoryIds.length > 10) {
      setCategoryError("Možete izabrati najviše 10 kategorija.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        pib: normalizePib(form.pib) || undefined,
        categoryIds,
      };
      const { data } = await api.post<{ message: string; email: string }>("/api/auth/register/handyman", payload);
      router.push(`/register/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (!axiosErr.response) {
        setError("Server nije dostupan. Proverite internet konekciju i pokušajte ponovo.");
      } else {
        setError(axiosErr.response.data?.message || "Greška pri registraciji");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-primary-50 to-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-elevated">
        <CardHeader><CardTitle>Registracija majstora</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Ime i prezime</Label><Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Lozinka</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div>
              <Label>Telefon</Label>
              <Input
                type="tel"
                placeholder="npr. 0641234567"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (phoneError) setPhoneError("");
                }}
              />
              {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
            </div>
            <div><Label>Grad</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div>
              <Label htmlFor="pib">PIB — Poreski identifikacioni broj (opciono)</Label>
              <Input
                id="pib"
                inputMode="numeric"
                placeholder="9 cifara (npr. 123456789)"
                value={form.pib}
                onChange={(e) => {
                  setForm({ ...form, pib: e.target.value.replace(/\D/g, "").slice(0, 9) });
                  if (pibError) setPibError("");
                }}
              />
              {pibError && <p className="mt-1 text-sm text-red-600">{pibError}</p>}
            </div>
            {categoriesLoading ? (
              <p className="text-sm text-slate-500">Učitavanje kategorija...</p>
            ) : categoriesError || !categories?.length ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p>Nije moguće učitati kategorije poslova.</p>
                <p className="mt-1 text-xs text-red-600">API: {resolveApiBaseUrl()}</p>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => refetchCategories()}>
                  Pokušaj ponovo
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-amber-800">
                  Kategorije birate jednom pri registraciji — naknadna izmena nije moguća.
                </p>
                <CategoryPicker
                  categories={categories}
                  selected={categoryIds}
                  onChange={(ids) => {
                    setCategoryIds(ids);
                    if (categoryError) setCategoryError("");
                  }}
                  error={categoryError}
                />
              </>
            )}
            <div><Label>O meni</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registracija..." : "Registruj se"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Već imaš nalog? <Link href="/login" className="text-blue-800 hover:underline">Prijavi se</Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-600">
            Registruješ preduzeće?{" "}
            <Link href="/registracija-preduzeca" className="text-blue-800 hover:underline">
              Registracija preduzeća
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
