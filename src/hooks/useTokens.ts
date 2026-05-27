"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { unwrapPage } from "@/lib/utils";
import type { BankDetails, TokenPackage, TokenPurchaseRequest } from "@/types";

export function useTokenInfo() {
  return useQuery({
    queryKey: ["token-info"],
    queryFn: async () =>
      (await api.get<{ tokenBalance: number; transactions: { id: string; amount: number; type: string; description?: string; createdAt: string }[] }>(
        "/api/handymen/me/tokens"
      )).data,
  });
}

export function useTokenPackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => unwrapPage<TokenPackage>((await api.get("/api/tokens/packages?size=20")).data),
  });
}

export function useBankDetails() {
  return useQuery({
    queryKey: ["bank-details"],
    queryFn: async () => (await api.get<BankDetails>("/api/tokens/bank-details")).data,
  });
}

export function useTokenRequests() {
  return useQuery({
    queryKey: ["token-requests"],
    queryFn: async () => unwrapPage<TokenPurchaseRequest>((await api.get("/api/tokens/requests?size=50")).data),
  });
}
