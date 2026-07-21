"use client";

import Link from "next/link";
import {
  Search,
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  ShieldCheck,
  Coins,
  Users,
  ArrowRight,
  Clock,
  MessageCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSearch } from "@/components/home/HeroSearch";
import { StatsCounter } from "@/components/home/StatsCounter";
import { APP_NAME } from "@/constants";
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
    desc: "Klijent opiše posao; admin odobri i oglas postaje vidljiv majstorima i izvođačima.",
  },
  {
    title: "Majstori i izvođači gledaju detalje",
    desc: "Registrovani majstori i izvođači vide oglase i troše tokene da bi videli detalje i kontakt klijenta.",
  },
  {
    title: "Zovu ako žele",
    desc: "Nakon pregleda detalja, majstor ili izvođač sam odlučuje da li će pozvati klijenta i pitati za posao.",
  },
];

const heroFeatures = [
  { icon: ShieldCheck, title: "Provereni majstori", desc: "Svi majstori su verifikovani i ocenjeni od strane korisnika." },
  { icon: Clock, title: "Brzo i lako", desc: "Postavite oglas za manje od 1 minuta." },
  { icon: MessageCircle, title: "Direktna komunikacija", desc: "Dogovarajte detalje direktno sa majstorima." },
  { icon: Lock, title: "Bezbedno i pouzdano", desc: "Vaša sigurnost i zadovoljstvo su naš prioritet." },
];

const features = [
  { icon: ShieldCheck, title: "Pouzdano", desc: "Recenzije i ocene nakon svakog završenog posla." },
  { icon: Coins, title: "Fer cena", desc: "Admin određuje koliko tokena košta pregled detalja posla." },
  { icon: Users, title: "Jednostavno", desc: "Dizajn prilagođen svima — bez komplikacija." },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-section -mt-16 pt-16">
        <div className="page-container hero-inner">
          <div className="flex flex-col items-center py-10 text-center sm:py-12">
            <div className="hero-badge">
              <Search className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden />
              {APP_NAME} — brzo, lako, pouzdano
            </div>
            <h1 className="hero-heading mb-4 max-w-[920px]">
              Pronađite majstora za svaku{" "}
              <span className="hero-heading-accent">popravku u kući</span>
            </h1>
            <p className="hero-subtitle mb-8">
              Pretražite usluge ili objavite posao besplatno — majstori se prijave za par klikova.
            </p>

            <div className="mb-8 w-full max-w-[600px]">
              <HeroSearch />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <Link href="/register/client" className="btn-hero-link">
                Tražim majstora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register/handyman" className="btn-hero-primary">
                Ja sam majstor
              </Link>
            </div>

            <div className="mt-8 w-full">
              <StatsCounter />
            </div>
          </div>

          <div className="pb-8">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {heroFeatures.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="hero-feature-card">
                  <div className="hero-feature-icon">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="mb-0.5 text-sm font-bold text-white sm:text-base">{title}</h3>
                    <p className="text-xs leading-snug text-slate-400 sm:text-sm sm:leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
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
