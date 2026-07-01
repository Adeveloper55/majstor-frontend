"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Star } from "lucide-react";
import { useHandymanProfile } from "@/hooks/useHandymanSearch";
import { useAuth } from "@/hooks/useAuth";
import { getCategoryBySlug } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

interface ContractorProfileContentProps {
  categorySlug: string;
  handymanId: string;
  city: string;
}

export function ContractorProfileContent({
  categorySlug,
  handymanId,
  city,
}: ContractorProfileContentProps) {
  const category = getCategoryBySlug(categorySlug);
  const { data: profile, isLoading, isError } = useHandymanProfile(handymanId);
  const { token, role } = useAuth();
  const isLoggedIn = Boolean(token) && (role === "ROLE_CLIENT" || role === "ROLE_HANDYMAN");

  const inquiryHref = `/nadji-majstore/upit?kategorija=${encodeURIComponent(categorySlug)}${
    city ? `&grad=${encodeURIComponent(city)}` : ""
  }`;
  const listHref = `/izvodjaci/${categorySlug}${city ? `?grad=${encodeURIComponent(city)}` : ""}`;

  if (!category) return null;

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-slate-500">Učitavanje profila...</p>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="px-4 py-12 text-center">
        <p className="text-slate-600">Profil izvođača nije pronađen.</p>
        <Link href={listHref} className="mt-4 inline-block text-brand-700 hover:underline">
          Nazad na listu
        </Link>
      </main>
    );
  }

  const phoneDisplay =
    isLoggedIn && profile.contactVisible && profile.phone
      ? profile.phone
      : profile.maskedPhone;

  const serviceTags = profile.serviceNames.length > 0 ? profile.serviceNames : [category.name];

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-8 sm:py-12">
      <div className="page-container mx-auto max-w-5xl">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-700">
            Početna
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={listHref} className="hover:text-brand-700">
            {category.name}
            {city ? `, ${city}` : ""}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-800">{profile.displayName}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-start gap-5">
              {profile.profileImageUrl && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image
                    src={profile.profileImageUrl}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {profile.displayName}
                  {profile.city ? `, ${profile.city}` : ""}
                </h1>
                <p className="mt-2 text-sm text-slate-600">{serviceTags.join(", ")}</p>
                {profile.averageRating != null && (profile.totalReviews ?? 0) > 0 && (
                  <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    {profile.averageRating.toFixed(1)}
                    <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                    <span className="font-normal text-slate-500">
                      ({profile.totalReviews} ocena)
                    </span>
                  </p>
                )}
              </div>
            </div>

            {profile.bio && (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">O preduzeću</h2>
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                  {profile.bio}
                </p>
              </section>
            )}

            {profile.serviceNames.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold text-slate-900">Gde i šta radimo</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.serviceNames.map((service) => (
                    <div
                      key={service}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <h3 className="font-semibold text-slate-900">{service}</h3>
                      <Link
                        href={inquiryHref}
                        className="mt-3 inline-flex text-sm font-semibold text-brand-700 hover:underline"
                      >
                        Pošalji potražnju
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.latestReview?.comment && (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Recenzija</h2>
                <p className="mt-3 text-sm italic text-slate-600">
                  &ldquo;{profile.latestReview.comment}&rdquo;
                </p>
                {profile.latestReview.reviewerName && (
                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {profile.latestReview.reviewerName}
                  </p>
                )}
              </section>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            {profile.contactPerson && (
              <div className="mb-5 border-b border-slate-100 pb-5">
                <p className="text-sm font-semibold text-slate-900">{profile.contactPerson}</p>
                <p className="text-sm text-slate-500">predstavnik preduzeća</p>
              </div>
            )}

            <div className="space-y-3">
              {!isLoggedIn && (
                <Link
                  href="/register/client"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  Kontakt
                </Link>
              )}
              <Link
                href={inquiryHref}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "flex w-full items-center justify-center gap-1 rounded-full bg-brand-600 hover:bg-brand-700"
                )}
              >
                Pošalji potražnju
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
              {profile.city && (
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {profile.city}
                </p>
              )}
              {phoneDisplay && (
                <p className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  Tel: {phoneDisplay}
                </p>
              )}
              {!isLoggedIn && profile.maskedPhone && (
                <Link href="/register/client" className="block text-sm font-semibold text-brand-700 hover:underline">
                  Registrujte se da vidite pun broj
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
