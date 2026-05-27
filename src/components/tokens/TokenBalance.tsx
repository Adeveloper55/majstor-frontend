"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TokenBalanceProps {
  balance: number;
  transactions?: { amount: number; type: string; description?: string; createdAt: string }[];
}

export function TokenBalance({ balance, transactions = [] }: TokenBalanceProps) {
  return (
    <>
      <Card className="mb-6">
        <CardHeader><CardTitle>Stanje tokena</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-4xl font-bold text-primary-800">{balance}</p>
          <Link href="/tokens/buy"><Button>Kupi tokene</Button></Link>
        </CardContent>
      </Card>
      <h2 className="mb-3 text-lg font-bold">Istorija transakcija</h2>
      <div className="space-y-2">
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium">{t.description || t.type}</p>
              <p className="text-sm text-slate-500">{new Date(t.createdAt).toLocaleString("sr")}</p>
            </div>
            <Badge variant={t.amount > 0 ? "success" : "destructive"}>{t.amount > 0 ? "+" : ""}{t.amount}</Badge>
          </div>
        ))}
        {!transactions.length && <p className="text-slate-500">Nema transakcija.</p>}
      </div>
    </>
  );
}
