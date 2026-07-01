"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import type { HandymanListing } from "@/types/handymanListing";

interface ContractorCardProps {
  contractor: HandymanListing;
  categorySlug: string;
  categoryName: string;
  city: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.round(rating) ? "fill-brand-500 text-brand-500" : "text-slate-200"
          )}
        />
      ))}
    </div>
  );
}

export function ContractorCard({ contractor, categorySlug, categoryName, city }: ContractorCardProps) {
  const rating = contractor.averageRating ?? 0;
  const hasReviews = (contractor.totalReviews ?? 0) > 0;
  const profileHref = `/izvodjaci/${categorySlug}/${contractor.id}?grad=${encodeURIComponent(city)}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <Link
            href={profileHref}
            className="text-lg font-bold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-brand-700"
          >
            {contractor.displayName}
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            {categoryName}
            {contractor.city ? `, ${contractor.city}` : ""}
          </p>
        </div>
        {hasReviews && (
          <div className="flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
            {rating.toFixed(1)}
            <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
          </div>
        )}
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-[200px_1fr]">
        {contractor.profileImageUrl ? (
          <Link href={profileHref} className="relative block aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={contractor.profileImageUrl}
              alt={contractor.displayName}
              fill
              className="object-cover"
              sizes="200px"
            />
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="min-w-0">
          {contractor.bio && (
            <p className="line-clamp-4 text-sm leading-relaxed text-slate-700">{contractor.bio}</p>
          )}

          {contractor.latestReview?.comment && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <Stars rating={contractor.latestReview.rating} />
              <p className="mt-2 text-sm italic text-slate-600">
                &ldquo;{contractor.latestReview.comment}&rdquo;
              </p>
              {contractor.latestReview.reviewerName && (
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {contractor.latestReview.reviewerName}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {contractor.city && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <MapPin className="h-3.5 w-3.5" />
                {contractor.city}
              </span>
            )}
            {contractor.yearsExperience != null && contractor.yearsExperience > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <Users className="h-3.5 w-3.5" />
                {contractor.yearsExperience}+ godina iskustva
              </span>
            )}
            {contractor.isVerified && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-800">
                Verifikovan
              </span>
            )}
          </div>

          <Link
            href={profileHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-5 inline-flex items-center gap-1"
            )}
          >
            Vidi profil
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
