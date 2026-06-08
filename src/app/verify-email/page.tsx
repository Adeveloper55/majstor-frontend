"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Mail } from "lucide-react";

type VerifyStatus = "loading" | "VERIFIED" | "ALREADY_VERIFIED" | "EXPIRED" | "STALE_LINK" | "INVALID" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (!token) {
      setStatus("INVALID");
      setMessage("Link za verifikaciju nije validan.");
      return;
    }

    const cacheKey = `verify-email:${token}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached) as { status: string; message: string };
        setStatus(data.status as VerifyStatus);
        setMessage(data.message);
        return;
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    startedRef.current = true;

    api
      .get<{ status: string; message: string }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(({ data }) => {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        setStatus(data.status as VerifyStatus);
        setMessage(data.message);
      })
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string; status?: string } } })?.response?.data;
        if (msg?.status && msg?.message) {
          setStatus(msg.status as VerifyStatus);
          setMessage(msg.message);
          return;
        }
        if (msg?.message) {
          setStatus("error");
          setMessage(msg.message);
          return;
        }
        setStatus("error");
        setMessage("Greška pri verifikaciji. Pokušajte ponovo.");
      });
  }, [token]);

  const isSuccess = status === "VERIFIED" || status === "ALREADY_VERIFIED";
  const isExpired = status === "EXPIRED" || status === "STALE_LINK";

  return (
    <Card className="w-full max-w-md shadow-elevated">
      <CardHeader className="text-center">
        {status === "loading" && <Mail className="mx-auto mb-2 h-12 w-12 text-slate-400" />}
        {isSuccess && <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-green-600" />}
        {isExpired && <Clock className="mx-auto mb-2 h-12 w-12 text-amber-500" />}
        {(status === "INVALID" || status === "error") && (
          <XCircle className="mx-auto mb-2 h-12 w-12 text-red-600" />
        )}
        <CardTitle>
          {status === "loading" && "Verifikacija u toku..."}
          {isSuccess && "Email potvrđen!"}
          {isExpired && (status === "STALE_LINK" ? "Link nije aktuelan" : "Link je istekao")}
          {(status === "INVALID" || status === "error") && "Verifikacija nije uspela"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-slate-600">{message || "Molimo sačekajte..."}</p>

        {isSuccess && (
          <Link href="/login">
            <Button className="w-full">Prijavi se</Button>
          </Link>
        )}

        {isExpired && (
          <div className="flex flex-col gap-2">
            <Link href="/register/check-email">
              <Button className="w-full">Zatraži novi link</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">Prijava</Button>
            </Link>
          </div>
        )}

        {(status === "INVALID" || status === "error") && (
          <div className="flex flex-col gap-2">
            <Link href="/register/check-email">
              <Button className="w-full">Zatraži novi link</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">Registracija</Button>
            </Link>
            <Link href="/login">
              <Button className="w-full">Prijava</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-primary-50 to-slate-50 px-4 py-12">
      <Suspense fallback={<p className="text-slate-600">Učitavanje...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
