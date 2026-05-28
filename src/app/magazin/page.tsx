import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function MagazinPage() {
  return (
    <main className="page-container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Daibau magazin</h1>
        <p className="mt-4 text-lg text-slate-600">
          Saveti, vodiči i vesti o renoviranju, gradnji i održavanju doma.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg", className: "mt-8 inline-flex" })}>
          Nazad na početnu
        </Link>
      </div>
    </main>
  );
}
