"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ServiceInquiryWizard } from "@/components/inquiry/ServiceInquiryWizard";
import { getCategoryBySlug } from "@/constants/categories";

export function ServiceInquiryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("kategorija") || "";
  const initialCity = searchParams.get("grad") || "";
  const category = getCategoryBySlug(slug);

  useEffect(() => {
    if (!category) {
      router.replace("/");
    }
  }, [category, router]);

  if (!category) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-slate-500">Učitavanje...</p>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white px-4 py-10 sm:py-14">
      <ServiceInquiryWizard
        categorySlug={category.slug}
        categoryName={category.name}
        initialCity={initialCity}
      />
    </main>
  );
}
