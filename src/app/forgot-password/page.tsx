"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri slanju. Proverite email i pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Zaboravljena lozinka</CardTitle></CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-gray-600">
                Ako nalog postoji, poslali smo vam link za reset lozinke na <strong>{email.trim()}</strong>.
                Proverite inbox i spam folder.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Nazad na prijavu</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">Unesite email sa kojim ste se registrovali.</p>
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Slanje..." : "Pošalji link"}
              </Button>
              <p className="text-center text-sm">
                <Link href="/login" className="text-blue-800 hover:underline">Nazad na prijavu</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
