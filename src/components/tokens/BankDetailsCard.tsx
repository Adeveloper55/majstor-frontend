"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BankDetails } from "@/types";

export function BankDetailsCard({ bank }: { bank: BankDetails }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const rows = [
    { key: "company", label: "Firma", value: bank.companyName },
    ...(bank.companyPib ? [{ key: "pib", label: "PIB", value: bank.companyPib }] : []),
    { key: "bank", label: "Banka", value: bank.bankName },
    { key: "account", label: "Račun", value: bank.bankAccount },
  ];

  return (
    <Card className="border-primary-200 bg-primary-50/50">
      <CardHeader><CardTitle>Podaci za uplatu</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">{r.label}</p>
              <p className="text-base text-slate-900">{r.value}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => copy(r.value, r.key)}>
              {copied === r.key ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        ))}
        <p className="rounded-lg bg-white p-3 text-sm text-slate-600">{bank.paymentInstructions}</p>
      </CardContent>
    </Card>
  );
}
