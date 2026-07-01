import { Suspense } from "react";
import { SERVICE_CATEGORIES } from "@/constants/categories";
import { IzvodjaciCategoryContent } from "@/components/contractors/IzvodjaciCategoryContent";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function IzvodjaciCategoryPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center">
          <p className="text-slate-500">Učitavanje...</p>
        </main>
      }
    >
      <IzvodjaciCategoryContent slug={params.slug} />
    </Suspense>
  );
}
