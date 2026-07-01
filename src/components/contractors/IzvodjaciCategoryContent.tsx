"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Search, Star } from "lucide-react";
import { getCategoryBySlug } from "@/constants/categories";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { ContractorCard } from "@/components/contractors/ContractorCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useHandymanCategoryCount, useHandymanSearch } from "@/hooks/useHandymanSearch";
import { getCityCoordinates } from "@/constants/serbianCities";
import { searchCities } from "@/lib/citySearch";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

interface IzvodjaciCategoryContentProps {
  slug: string;
}

export function IzvodjaciCategoryContent({ slug }: IzvodjaciCategoryContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("grad") || "";
  const category = getCategoryBySlug(slug);
  const { token, role } = useAuth();
  const isLoggedIn = Boolean(token) && (role === "ROLE_CLIENT" || role === "ROLE_HANDYMAN");

  const [cityInput, setCityInput] = useState(cityParam);
  const [cityError, setCityError] = useState("");

  const { data: totalCount } = useHandymanCategoryCount(slug);
  const { data: results, isLoading } = useHandymanSearch(slug, cityParam);

  useEffect(() => {
    setCityInput(cityParam);
  }, [cityParam]);

  if (!category) return null;

  const resolveCity = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (getCityCoordinates(trimmed)) return trimmed;
    return searchCities(trimmed, 1)[0] || "";
  };

  const handleSearch = () => {
    const resolved = resolveCity(cityInput);
    if (!resolved) {
      setCityError("Izaberite grad iz predloga.");
      return;
    }
    setCityError("");
    router.push(`/izvodjaci/${slug}?grad=${encodeURIComponent(resolved)}`);
  };

  const showResults = Boolean(cityParam.trim());

  if (!showResults) {
    return (
      <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{category.name}</h1>
          <p className="mt-3 text-lg text-slate-600">
            {totalCount != null ? (
              <>
                <span className="font-semibold text-slate-800">{totalCount.toLocaleString("sr-RS")}</span>{" "}
                {totalCount === 1 ? "izvođač" : "izvođača"} na platformi
              </>
            ) : (
              "Učitavanje..."
            )}
          </p>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-4 text-left text-base text-slate-700">
              Upišite svoju lokaciju i poštanski broj:
            </p>
            <div className="text-left">
              <CityAutocomplete
                value={cityInput}
                onChange={(v) => {
                  setCityInput(v);
                  if (cityError) setCityError("");
                }}
                label=""
                placeholder="Grad ili mesto"
                error={cityError}
              />
            </div>
            <Button
              type="button"
              className="mt-4 h-12 w-full rounded-full bg-brand-600 text-base hover:bg-brand-700"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-5 w-5" />
              Pretraži
            </Button>

            <p className="mt-8 text-sm text-slate-500">ili jednostavno pošaljite:</p>
            <Link
              href={`/nadji-majstore/upit?kategorija=${encodeURIComponent(slug)}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-3 inline-flex w-full rounded-full bg-brand-600 hover:bg-brand-700 sm:w-auto"
              )}
            >
              Besplatna potražnja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const resultCount = results?.content.length ?? 0;

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-8 sm:py-12">
      <div className="page-container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {category.name}, {cityParam}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Prikazujemo proverene izvođače za uslugu{" "}
            <span className="font-medium text-slate-800">{category.name.toLowerCase()}</span> u gradu{" "}
            <span className="font-medium text-slate-800">{cityParam}</span>. Izaberite izvođača ili pošaljite
            besplatnu potražnju — mi vam predlažemo najbolje opcije.
          </p>
          <Link
            href={`/nadji-majstore/upit?kategorija=${encodeURIComponent(slug)}&grad=${encodeURIComponent(cityParam)}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 inline-flex rounded-full bg-brand-600 hover:bg-brand-700"
            )}
          >
            Pošalji potražnju
          </Link>

          {results && results.totalCount > 0 && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
              {results.averageRating != null && results.averageRating > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                  {results.averageRating.toFixed(1)} prosečna ocena
                  {results.totalReviews > 0 && ` (${results.totalReviews} ocena)`}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600" />
                {results.totalCount} {results.totalCount === 1 ? "izvođač" : "izvođača"} u gradu
              </span>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="min-w-[220px] flex-1">
            <CityAutocomplete
              value={cityInput}
              onChange={setCityInput}
              label="Promeni grad:"
              placeholder="Grad ili mesto"
            />
          </div>
          <Button type="button" onClick={handleSearch} className="bg-brand-600 hover:bg-brand-700">
            Pretraži
          </Button>
        </div>

        {isLoading && <p className="text-slate-500">Učitavanje izvođača...</p>}

        {!isLoading && resultCount === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-lg text-slate-700">
              Trenutno nema registrovanih izvođača za ovu kategoriju u gradu {cityParam}.
            </p>
            <Link
              href={`/nadji-majstore/upit?kategorija=${encodeURIComponent(slug)}&grad=${encodeURIComponent(cityParam)}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 inline-flex rounded-full bg-brand-600 hover:bg-brand-700"
              )}
            >
              Pošalji besplatnu potražnju
            </Link>
          </div>
        )}

        {results && resultCount > 0 && (
          <>
            <h2 className="mb-4 text-lg font-bold text-brand-800">
              {resultCount} najboljih rezultata za: {category.name.toLowerCase()} u {cityParam}
            </h2>
            <div className="space-y-6">
              {results.content.map((contractor) => (
                <ContractorCard
                  key={contractor.id}
                  contractor={contractor}
                  categoryName={category.name}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
