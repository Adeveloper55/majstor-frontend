"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TokenPackage } from "@/types";

interface TokenPackageCardProps {
  pkg: TokenPackage;
  selected?: boolean;
  onSelect: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  bestValue?: boolean;
}

export function TokenPackageCard({ pkg, selected, onSelect, onSubmit, loading, bestValue }: TokenPackageCardProps) {
  return (
    <div
      className={`relative rounded-xl border-2 p-6 transition-shadow ${selected ? "border-primary-800 bg-primary-50 shadow-elevated" : "border-slate-200 bg-white hover:shadow-card"}`}
    >
      {bestValue && <Badge className="absolute -top-3 right-4">Najbolja vrednost</Badge>}
      <p className="text-lg font-bold text-slate-900">{pkg.name}</p>
      <p className="mt-2 text-4xl font-bold text-primary-800">{pkg.tokenAmount}</p>
      <p className="text-sm text-slate-500">tokena</p>
      <p className="mt-3 text-xl font-semibold">{pkg.priceEur} RSD</p>
      <Button className="mt-4 w-full" variant={selected ? "default" : "outline"} onClick={onSelect}>
        {selected ? "Izabrano" : "Izaberi paket"}
      </Button>
      {selected && onSubmit && (
        <Button className="mt-2 w-full" onClick={onSubmit} disabled={loading}>
          {loading ? "Slanje..." : "Pošalji zahtev"}
        </Button>
      )}
    </div>
  );
}
