import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

export default function MagazinPage() {
  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Majstor na klik</h1>
        <p className="mt-2 text-lg font-medium text-primary-800">Magazin</p>
        <p className="mt-4 text-lg text-slate-600">
          Saveti, vodiči i vesti o renoviranju, gradnji i održavanju doma.
        </p>
        <p className="mt-2 text-sm text-slate-500">Uskoro više sadržaja.</p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 inline-flex")}
        >
          Nazad na početnu
        </Link>
      </div>
    </main>
  );
}
