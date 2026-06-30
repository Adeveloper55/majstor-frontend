"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { isValidSerbianPhone } from "@/lib/phoneUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", city: "" });
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
            {(["fullName", "email", "password", "phone", "city"] as const).map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field === "fullName" ? "Ime i prezime" : field === "email" ? "Email" : field === "password" ? "Lozinka" : field === "phone" ? "Telefon" : "Grad"}
                </Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  required={field === "fullName" || field === "email" || field === "password"}
                  placeholder={field === "phone" ? "npr. 0641234567" : undefined}
                  value={form[field]}
                  onChange={(e) => {
                    setForm({ ...form, [field]: e.target.value });
                    if (field === "phone" && phoneError) setPhoneError("");
                  }}
                />
                {field === "phone" && phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
              </div>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Registracija..." : "Registruj se"}</Button>
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
