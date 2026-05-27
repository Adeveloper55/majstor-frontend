"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, User, Wrench } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    isContractor: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/api/contact", form);
      setSuccess(true);
      setForm({ fullName: "", email: "", phone: "", message: "", isContractor: false });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri slanju poruke. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="section-title mb-3">Kontakt</h1>
          <p className="text-base text-slate-600">
            Imate pitanje, predlog ili želite saradnju? Pošaljite nam poruku — odgovaramo u najkraćem roku.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt forma</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
                <p className="text-lg font-semibold text-green-800">Poruka je uspešno poslata!</p>
                <p className="mt-2 text-sm text-green-700">Hvala što ste nas kontaktirali. Javićemo vam se uskoro.</p>
                <Button className="mt-4" variant="outline" onClick={() => setSuccess(false)}>
                  Pošalji novu poruku
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="fullName">Ime i prezime *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="fullName"
                      required
                      className="pl-10"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Poruka *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    minLength={10}
                    placeholder="Opišite vaše pitanje ili poruku..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-4 hover:border-primary-300">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-800 focus:ring-primary-600"
                    checked={form.isContractor}
                    onChange={(e) => setForm({ ...form, isContractor: e.target.checked })}
                  />
                  <div>
                    <span className="flex items-center gap-2 font-semibold text-slate-900">
                      <Wrench className="h-4 w-4 text-primary-800" />
                      Ja sam majstor ili izvođač
                    </span>
                    <p className="mt-1 text-sm text-slate-600">
                      Označite ako želite da se registrujete na platformi, imate pitanja o tokenima ili saradnji.
                    </p>
                  </div>
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Slanje..." : "Pošalji poruku"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          Već imate nalog?{" "}
          <Link href="/login" className="font-medium text-primary-800 hover:underline">
            Prijavite se
          </Link>
        </p>
      </div>
    </main>
  );
}
