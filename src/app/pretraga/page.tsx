import { Suspense } from "react";
import PretragaPage from "./PretragaContent";

export default function Page() {
  return (
    <Suspense fallback={<main className="page-container py-20 text-center text-slate-500">Učitavanje...</main>}>
      <PretragaPage />
    </Suspense>
  );
}
