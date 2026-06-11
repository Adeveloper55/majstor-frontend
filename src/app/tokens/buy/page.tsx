"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { TokenPackageCard } from "@/components/tokens/TokenPackageCard";
import { BankDetailsCard } from "@/components/tokens/BankDetailsCard";
import { useTokenPackages, useBankDetails } from "@/hooks/useTokens";

export default function BuyTokensPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: packages } = useTokenPackages();
  const { data: bank } = useBankDetails();

  const bestValuePackageId = useMemo(() => {
    if (!packages?.length) return null;
    return [...packages]
      .sort((a, b) => Number(a.priceEur) / a.tokenAmount - Number(b.priceEur) / b.tokenAmount)[0]
      ?.id ?? null;
  }, [packages]);

  useEffect(() => {
    if (packages?.length && selectedPackage == null) {
      setSelectedPackage(packages[0].id);
    }
  }, [packages, selectedPackage]);

  const handleSubmit = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/api/tokens/request", {
        packageId: selectedPackage,
      });
      router.push("/tokens/success");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri slanju zahteva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelLayout>
      <main className="p-4 sm:p-6">
        <h1 className="mb-2 text-2xl font-bold">Kupovina tokena</h1>
        <p className="mb-6 text-sm text-slate-600">
          Izaberite paket i pošaljite zahtev. Admin će vam poslati predračun sa IPS QR kodom na email ({user?.email || "vaš nalog"}).
        </p>
        {bank && (
          <div className="mb-8 max-w-md text-sm text-slate-600">
            <p className="mb-2">
              U predračunu će biti fiksni podaci za uplatu — primalac <strong>{bank.companyName}</strong>,
              svrha <strong>{bank.paymentPurpose}</strong>, poziv na broj <strong>{bank.paymentReferenceDisplay}</strong>.
            </p>
          </div>
        )}
        {bank && (
          <div className="mb-8">
            <BankDetailsCard bank={bank} />
          </div>
        )}
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {packages?.map((pkg) => (
            <TokenPackageCard
              key={pkg.id}
              pkg={pkg}
              selected={selectedPackage === pkg.id}
              onSelect={() => setSelectedPackage(pkg.id)}
              onSubmit={handleSubmit}
              loading={loading}
              bestValue={pkg.id === bestValuePackageId}
            />
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </main>
    </PanelLayout>
  );
}
