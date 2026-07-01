"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { HandymanListing } from "@/types/handymanListing";

interface ContractorCardProps {
  contractor: HandymanListing;
  categoryName: string;
  isLoggedIn: boolean;
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

export function ContractorCard({ contractor, categoryName, isLoggedIn }: ContractorCardProps) {
  const rating = contractor.averageRating ?? 0;
  const hasReviews = (contractor.totalReviews ?? 0) > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 underline decoration-slate-300 underline-offset-2">
            {contractor.displayName}
          </h3>
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
          {contractor.profileImageUrl ? (
            <Image
              src={contractor.profileImageUrl}
              alt={contractor.displayName}
              fill
              className="object-cover"
              sizes="200px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Nema slike</div>
          )}
        </div>

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

          <div className="mt-5 border-t border-slate-100 pt-4">
            {isLoggedIn && contractor.phone ? (
              <a
                href={`tel:${contractor.phone}`}
                className="inline-flex items-center gap-2 text-base font-semibold text-brand-700 hover:underline"
              >
                <Phone className="h-4 w-4" />
                {contractor.phone}
              </a>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <Phone className="h-4 w-4" />
                  Broj telefona dostupan nakon registracije
                </span>
                <Link
                  href="/register/client"
                  className={cn(buttonVariants({ size: "sm" }), "bg-brand-600 hover:bg-brand-700")}
                >
                  Registrujte se
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
