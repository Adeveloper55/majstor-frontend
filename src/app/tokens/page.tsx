"use client";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { TokenBalance } from "@/components/tokens/TokenBalance";
import { Badge } from "@/components/ui/badge";
import { useTokenInfo, useTokenRequests } from "@/hooks/useTokens";
import { TOKEN_REQUEST_STATUS } from "@/constants";

export default function TokensPage() {
  const { data: info } = useTokenInfo();
  const { data: requests } = useTokenRequests();

  return (
    <PanelLayout>
      <main className="p-4 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">Tokeni</h1>
        <TokenBalance balance={info?.tokenBalance ?? 0} transactions={info?.transactions} />
        <h2 className="mb-3 mt-8 text-lg font-bold">Zahtevi za tokene</h2>
        <div className="space-y-2">
          {requests?.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-4">
              <div>
                <p className="font-medium">{r.tokenAmount} tokena — {r.amountExpected} RSD</p>
                <p className="text-sm text-slate-500">{new Date(r.createdAt).toLocaleString("sr")}</p>
              </div>
              <Badge variant={r.status === "APPROVED" ? "success" : r.status === "REJECTED" ? "destructive" : "warning"}>
                {TOKEN_REQUEST_STATUS[r.status] || r.status}
              </Badge>
            </div>
          ))}
          {!requests?.length && <p className="text-slate-500">Nemate poslatih zahteva.</p>}
        </div>
      </main>
    </PanelLayout>
  );
}
