"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { validatePib, normalizePib } from "@/lib/pibValidation";
import { useAuthStore } from "@/store/authStore";
import { useCategories } from "@/hooks/useJobs";
import { CategoryPicker } from "@/components/shared/CategoryPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterHandymanPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", city: "", bio: "", pib: "" });
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [pibError, setPibError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPibError("");
    setCategoryError("");

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
      const { data } = await api.post("/api/auth/register/handyman", payload);
      login(data.token, data.role, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri registraciji");
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
            <div><Label>Telefon</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
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
            ) : categories ? (
              <CategoryPicker
                categories={categories}
                selected={categoryIds}
                onChange={(ids) => {
                  setCategoryIds(ids);
                  if (categoryError) setCategoryError("");
                }}
                error={categoryError}
              />
            ) : null}
            <div><Label>O meni</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || categoriesLoading}>
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
