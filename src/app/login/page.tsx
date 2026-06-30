"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Handyman, Role, User } from "@/types";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post<{
        token: string;
        refreshToken: string;
        role: Role;
        user: User | Handyman;
      }>("/api/auth/login", {
        email,
        password,
      });
      login(data.token, data.refreshToken, data.role, data.user);
      const dest = data.role === "ROLE_ADMIN" ? "/admin" : "/dashboard";
      window.location.href = dest;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number }; code?: string; message?: string };
      if (!axiosErr.response) {
        setError("Backend nije dostupan. Pokreni backend (port 8080) i proveri PostgreSQL bazu.");
      } else if (axiosErr.response.status === 401) {
        setError("Pogrešan email ili lozinka");
      } else if (axiosErr.response.status === 403) {
        const msg = (axiosErr as { response?: { data?: { message?: string } } }).response?.data?.message;
        setError(msg || "Email nije potvrđen. Proverite inbox.");
      } else {
        setError("Greška pri prijavi. Proveri da li backend radi ispravno.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-primary-50 to-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader>
          <CardTitle>Prijava</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Lozinka</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {error.includes("potvrđen") && (
              <p className="text-sm">
                <Link href="/register/check-email" className="text-blue-800 hover:underline">
                  Pošalji ponovo link za verifikaciju
                </Link>
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Prijava..." : "Prijavi se"}
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm">
            <Link href="/forgot-password" className="text-blue-800 hover:underline">Zaboravljena lozinka?</Link>
            <p>
              Nemaš nalog?{" "}
              <Link href="/register" className="text-blue-800 hover:underline">Registruj se</Link>
            </p>
            <p>
              Majstor / izvođač?{" "}
              <Link href="/register/handyman" className="text-blue-800 hover:underline">Registracija majstora</Link>
              {" · "}
              <Link href="/registracija-preduzeca" className="text-blue-800 hover:underline">Registracija preduzeća</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
