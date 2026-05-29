"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryHref, searchCategories } from "@/lib/categorySearch";
import { HeroSearch } from "@/components/home/HeroSearch";

export default function PretragaPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const results = useMemo(() => (q ? searchCategories(q, 20) : []), [q]);

  return (
    <main className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Pretraga usluga
        </h1>
        <p className="mb-8 text-center text-slate-600">
          Pronađite majstora za uslugu koja vam treba
        </p>

        <HeroSearch initialQuery={q} />

        {q && (
          <div className="mt-10">
            <p className="mb-4 text-sm text-slate-500">
              Rezultati za: <span className="font-semibold text-slate-800">&ldquo;{q}&rdquo;</span>
            </p>

            {results.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                <p className="font-medium text-slate-700">Nema rezultata za uneti pojam</p>
                <p className="mt-2 text-sm text-slate-500">
                  Probajte drugi naziv usluge ili pogledajte kategorije u meniju.
                </p>
                <Link
                  href="/register/client"
                  className={cn(buttonVariants(), "mt-6 inline-flex")}
                >
                  Pošalji potražnju
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {results.map(({ category }) => (
                  <li key={category.slug}>
                    <Link
                      href={getCategoryHref(category.slug)}
                      className="flex items-center gap-3 px-5 py-4 text-slate-800 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Search className="h-4 w-4 shrink-0 text-slate-400" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
