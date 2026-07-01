"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { isValidSerbianPhone } from "@/lib/phoneUtils";
import type { EmailAvailabilityStatus } from "@/hooks/useEmailAvailability";
import { EmailAvailabilityInput } from "@/components/shared/EmailAvailabilityInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", city: "" });
  const [emailStatus, setEmailStatus] = useState<EmailAvailabilityStatus>("idle");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (emailStatus !== "available") {
      setError(emailStatus === "taken" || emailStatus === "invalid"
        ? "Email nije dostupan za registraciju."
        : "Sačekajte proveru email adrese.");
      setLoading(false);
      return;
    }

    if (form.phone.trim() && !isValidSerbianPhone(form.phone)) {
      setPhoneError("Unesite ispravan srpski mobilni broj (npr. 0641234567).");
      setLoading(false);
      return;
    }
    setPhoneError("");
    try {
      const { data } = await api.post<{ message: string; email: string }>("/api/auth/register/client", form);
      router.push(`/register/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
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
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader><CardTitle>Registracija klijenta</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Ime i prezime</Label>
              <Input
                id="fullName"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <EmailAvailabilityInput
              id="email"
              value={form.email}
              onChange={(email) => setForm({ ...form, email })}
              onAvailabilityChange={({ status }) => setEmailStatus(status)}
            />
            <div>
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
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
            <div>
              <Label htmlFor="city">Grad</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || emailStatus === "checking"}>
              {loading ? "Registracija..." : "Registruj se"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Već imaš nalog? <Link href="/login" className="text-blue-800 hover:underline">Prijavi se</Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-600">
            Majstor ili izvođač?{" "}
            <Link href="/register/handyman" className="text-blue-800 hover:underline">Registracija majstora</Link>
            {" · "}
            <Link href="/registracija-preduzeca" className="text-blue-800 hover:underline">Registracija preduzeća</Link>
            <span className="mt-1 block text-xs text-slate-500">Za preduzeća PIB je obavezan.</span>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
