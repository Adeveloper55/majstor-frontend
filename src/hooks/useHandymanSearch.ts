import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getRole, getToken } from "@/lib/auth";
import publicApi from "@/lib/publicApi";
import type { HandymanProfile, HandymanSearchResponse } from "@/types/handymanListing";

function searchApiClient() {
  const token = getToken();
  const role = getRole();
  if (token && (role === "ROLE_CLIENT" || role === "ROLE_HANDYMAN")) {
    return api;
  }
  return publicApi;
}

export function useHandymanCategoryCount(categorySlug: string) {
  return useQuery({
    queryKey: ["handyman-count", categorySlug],
    enabled: Boolean(categorySlug),
    queryFn: async () =>
      (await publicApi.get<{ count: number }>(`/api/handymen/count?categorySlug=${encodeURIComponent(categorySlug)}`))
        .data.count,
  });
}

export function useHandymanSearch(categorySlug: string, city: string) {
  return useQuery({
    queryKey: ["handyman-search", categorySlug, city, getToken(), getRole()],
    enabled: Boolean(categorySlug) && Boolean(city.trim()),
    queryFn: async () => {
      const params = new URLSearchParams({ categorySlug });
      if (city.trim()) params.set("city", city.trim());
      const client = searchApiClient();
      return (await client.get<HandymanSearchResponse>(`/api/handymen/search?${params}`)).data;
    },
  });
}

export function useHandymanProfile(id: string) {
  return useQuery({
    queryKey: ["handyman-profile", id, getToken(), getRole()],
    enabled: Boolean(id),
    queryFn: async () => {
      const client = searchApiClient();
      return (await client.get<HandymanProfile>(`/api/handymen/public-profile/${id}`)).data;
    },
  });
}
