import { Suspense } from "react";
import { ContractorProfileContent } from "@/components/contractors/ContractorProfileContent";

export const dynamic = "force-dynamic";

export default function ContractorProfilePage({
  params,
  searchParams,
}: {
  params: { slug: string; id: string };
  searchParams: { grad?: string };
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center">
          <p className="text-slate-500">Učitavanje...</p>
        </main>
      }
    >
      <ContractorProfileContent
        categorySlug={params.slug}
        handymanId={params.id}
        city={searchParams.grad || ""}
      />
    </Suspense>
  );
}
