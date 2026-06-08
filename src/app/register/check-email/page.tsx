"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const resend = async () => {
    if (!email.trim()) {
      setError("Unesite email.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const { data } = await api.post<{ message: string; emailSent: boolean }>(
        "/api/auth/resend-verification",
        { email: email.trim() }
      );
      setSent(true);
      setSentOk(data.emailSent);
      setInfo(data.message);
    } catch {
      setError("Greška pri slanju. Proverite da li backend radi i pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="text-center">
        <Mail className="mx-auto mb-2 h-12 w-12 text-brand-600" />
        <CardTitle>Proverite email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-slate-600">
          Poslali smo vam link za potvrdu emaila. Kliknite na link u poruci da biste aktivirali nalog.
          Link važi 24 sata. Proverite i <strong>spam/promocije</strong> folder.
        </p>
        {initialEmail && (
          <p className="text-center text-sm font-medium text-slate-800">{initialEmail}</p>
        )}
        <div>
          <Label htmlFor="resend-email">Niste dobili mail?</Label>
          <Input
            id="resend-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vaš@email.com"
            className="mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {sent && (
          <p className={`text-sm ${sentOk ? "text-green-600" : "text-amber-700"}`}>{info}</p>
        )}
        {!sentOk && sent && (
          <p className="text-center text-sm">
            <Link href="/register" className="text-blue-800 hover:underline">Registruj se ponovo</Link>
            {" · "}
            <Link href="/login" className="text-blue-800 hover:underline">Prijava</Link>
          </p>
        )}
        <Button className="w-full" onClick={resend} disabled={loading}>
          {loading ? "Slanje..." : "Pošalji ponovo"}
        </Button>
        <p className="text-center text-sm">
          <Link href="/login" className="text-blue-800 hover:underline">Nazad na prijavu</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-primary-50 to-slate-50 px-4 py-12">
      <Suspense fallback={<p className="text-slate-600">Učitavanje...</p>}>
        <CheckEmailContent />
      </Suspense>
    </main>
  );
}
