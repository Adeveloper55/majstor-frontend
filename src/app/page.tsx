"use client";

import Link from "next/link";
import {
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  ShieldCheck,
  Coins,
  Users,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSearch } from "@/components/home/HeroSearch";
import { categoryRoutes } from "@/constants/categories";

const popularCategories = [
  { icon: Zap, name: "Elektroinstalacije", slug: "elektroinstalacije-elektricar", color: "bg-amber-100 text-amber-700" },
  { icon: Droplets, name: "Vodoinstalater", slug: "vodoinstalater", color: "bg-blue-100 text-blue-700" },
  { icon: Hammer, name: "Stolar", slug: "stolar", color: "bg-orange-100 text-orange-700" },
  { icon: Paintbrush, name: "Krečenje, moler", slug: "krecenje-moler", color: "bg-purple-100 text-purple-700" },
];

const steps = [
  {
    title: "Objavite posao",
    desc: "Klijent opiše problem, AI proceni složenost i cenu u tokenima.",
  },
  {
    title: "Majstori se prijave",
    desc: "Verifikovani majstori troše tokene da pošalju ponudu.",
  },
  {
    title: "Admin dodeli majstora",
    desc: "Admin pregleda prijave i dodeljuje najboljeg majstora za posao.",
  },
];

const features = [
  { icon: ShieldCheck, title: "Pouzdano", desc: "Recenzije i ocene nakon svakog završenog posla." },
  { icon: Coins, title: "Fer cena", desc: "AI ocena složenosti određuje koliko tokena košta prijava." },
  { icon: Users, title: "Jednostavno", desc: "Dizajn prilagođen svima — bez komplikacija." },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-section">
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg2djZIMzZ6TTAgMGg2djZIMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="page-container relative py-14 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="hero-badge">
              <Wrench className="h-4 w-4 shrink-0" aria-hidden />
              Majstor na klik — brzo, lako, pouzdano
            </div>
            <h1 className="hero-heading mb-6">
              Pronađite majstora za svaku popravku u kući
            </h1>
            <p className="hero-subtitle mb-8">
              Pretražite uslugu ili objavite posao besplatno — majstori se prijave za par klikova.
            </p>

            <div className="mb-10">
              <HeroSearch />
            </div>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register/client" className={cn(buttonVariants({ size: "lg" }), "btn-hero-primary w-full min-w-[200px] sm:w-auto")}>
                Tražim majstora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/register/handyman" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "btn-hero-secondary w-full min-w-[200px] sm:w-auto")}>
                Ja sam majstor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popularne kategorije */}
      <section id="najtrazenije" className="page-container py-16">
        <h2 className="section-title mb-2 text-center">Popularne kategorije</h2>
        <p className="mb-10 text-center text-base text-slate-600">Od elektrike do molerskih radova</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {popularCategories.map(({ icon: Icon, name, slug, color }) => (
            <Link key={slug} href={categoryRoutes.majstori(slug)}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="text-base font-semibold text-slate-800">{name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Još 40+ usluga — pogledajte u meniju{" "}
          <span className="font-semibold text-primary-800">Nađi majstore</span> u headeru
        </p>
      </section>

      {/* Kako radi */}
      <section className="bg-white py-16">
        <div className="page-container">
          <h2 className="section-title mb-10 text-center">Kako funkcioniše?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-800 text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-base leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-primary-100 bg-primary-50/50">
              <CardContent className="p-6">
                <Icon className="mb-3 h-8 w-8 text-primary-800" />
                <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-base leading-relaxed text-slate-600">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-container pb-20">
        <div
          className="rounded-2xl bg-primary-800 px-6 py-12 text-center sm:px-12"
          style={{ background: "linear-gradient(135deg, #1e40af, #1d4ed8)" }}
        >
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Spremni da krenete?</h2>
          <p className="mb-8 text-base text-blue-100">Registracija traje manje od 2 minuta.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register/client" className={cn(buttonVariants({ size: "lg" }), "btn-hero-primary")}>
              Registruj se kao klijent
            </Link>
            <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "btn-hero-secondary")}>
              Već imam nalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
