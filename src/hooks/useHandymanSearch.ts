import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { HandymanSearchResponse } from "@/types/handymanListing";

export function useHandymanCategoryCount(categorySlug: string) {
  return useQuery({
    queryKey: ["handyman-count", categorySlug],
    enabled: Boolean(categorySlug),
    queryFn: async () =>
      (await api.get<{ count: number }>(`/api/handymen/count?categorySlug=${encodeURIComponent(categorySlug)}`))
        .data.count,
  });
}

export function useHandymanSearch(categorySlug: string, city: string) {
  return useQuery({
    queryKey: ["handyman-search", categorySlug, city],
    enabled: Boolean(categorySlug) && Boolean(city.trim()),
    queryFn: async () => {
      const params = new URLSearchParams({ categorySlug });
      if (city.trim()) params.set("city", city.trim());
      return (await api.get<HandymanSearchResponse>(`/api/handymen/search?${params}`)).data;
    },
  });
}
