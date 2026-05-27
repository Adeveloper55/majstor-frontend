"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Došlo je do greške</h1>
      <p className="max-w-md text-slate-600">
        Stranica nije učitana. Osvežite stranicu ili pokušajte ponovo.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Pokušaj ponovo</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Osveži stranicu
        </Button>
      </div>
    </main>
  );
}
