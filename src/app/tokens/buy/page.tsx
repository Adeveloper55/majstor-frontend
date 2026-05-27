"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenPackageCard } from "@/components/tokens/TokenPackageCard";
import { BankDetailsCard } from "@/components/tokens/BankDetailsCard";
import { useTokenPackages, useBankDetails } from "@/hooks/useTokens";

export default function BuyTokensPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: packages } = useTokenPackages();
  const { data: bank } = useBankDetails();

  const handleSubmit = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/api/tokens/request", { packageId: selectedPackage, paymentReference });
      router.push("/tokens/success");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri slanju zahteva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Kupovina tokena</h1>
        {bank && <div className="mb-8"><BankDetailsCard bank={bank} /></div>}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {packages?.map((pkg, i) => (
            <TokenPackageCard
              key={pkg.id}
              pkg={pkg}
              selected={selectedPackage === pkg.id}
              onSelect={() => setSelectedPackage(pkg.id)}
              onSubmit={handleSubmit}
              loading={loading}
              bestValue={i === 1}
            />
          ))}
        </div>
        <div className="max-w-md">
          <Label>Poziv na broj / referenca uplate</Label>
          <Input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Vaš email ili referenca" className="mt-1" />
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </main>
    </div>
  );
}
