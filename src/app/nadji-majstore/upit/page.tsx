import { Suspense } from "react";
import { ServiceInquiryPageContent } from "./ServiceInquiryPageContent";

export default function ServiceInquiryPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center px-4">
          <p className="text-slate-500">Učitavanje...</p>
        </main>
      }
    >
      <ServiceInquiryPageContent />
    </Suspense>
  );
}
