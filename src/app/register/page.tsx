import Link from "next/link";
import { User, Wrench, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const options = [
  {
    href: "/register/client",
    icon: User,
    title: "Klijent",
    description: "Tražite majstora za posao kod kuće. PIB nije potreban.",
    cta: "Registracija klijenta",
    highlight: false,
  },
  {
    href: "/register/handyman",
    icon: Wrench,
    title: "Majstor",
    description: "Ponudite usluge kao registrovani izvođač. PIB je obavezan (9 cifara).",
    cta: "Registracija majstora",
    highlight: true,
  },
  {
    href: "/registracija-preduzeca",
    icon: Building2,
    title: "Preduzeće",
    description: "Registracija firme sa više delatnosti i okruga. PIB je obavezan, admin odobrava prijavu.",
    cta: "Registracija preduzeća",
    highlight: true,
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50 to-slate-50 px-4 py-10 sm:py-14">
      <div className="page-container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Registruj se</h1>
          <p className="mt-2 text-slate-600">Izaberi tip naloga. Za majstore i preduzeća unosi se PIB.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {options.map((opt) => (
            <Card
              key={opt.href}
              className={cn(
                "flex flex-col shadow-sm transition-shadow hover:shadow-md",
                opt.highlight && "border-brand-200 ring-1 ring-brand-100"
              )}
            >
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
                  <opt.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{opt.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="flex-1 text-sm leading-relaxed text-slate-600">{opt.description}</p>
                <Link href={opt.href} className={cn(buttonVariants({ className: "w-full" }), opt.highlight && "bg-brand-600 hover:bg-brand-700")}>
                  {opt.cta}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Već imaš nalog?{" "}
          <Link href="/login" className="font-medium text-primary-800 hover:underline">
            Prijavi se
          </Link>
        </p>
      </div>
    </main>
  );
}
