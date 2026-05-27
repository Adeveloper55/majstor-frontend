"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/api/auth/forgot-password", { email });
    setSent(true);
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Zaboravljena lozinka</CardTitle></CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-gray-600">Ako nalog postoji, poslali smo vam link za reset lozinke.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <Button type="submit" className="w-full">Pošalji link</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
