"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { unwrapPage } from "@/lib/utils";
import type { JobListing, JobApplication, Category } from "@/types";
import { useAuthStore } from "@/store/authStore";

export interface JobFiltersState {
  categories: number[];
  city: string;
  radius: number;
  minTokenCost: number;
  maxTokenCost: number;
  sort: string;
  lat?: number;
  lon?: number;
}

export function useJobs(filters?: JobFiltersState, mode: "browse" | "my" = "browse") {
  const token = useAuthStore((s) => s.token);
  const myMode = mode === "my";

  return useQuery({
    queryKey: ["jobs", mode, filters, myMode ? token : "public"],
    enabled: myMode ? !!token : true,
    queryFn: async () => {
      if (myMode) {
        const { data } = await api.get<{ content: JobListing[] }>("/api/jobs/my?size=50");
        return data.content;
      }
      const params = new URLSearchParams({ status: "OPEN", size: "50", sort: filters?.sort || "newest" });
      if (filters?.categories.length) params.set("categories", filters.categories.join(","));
      if (filters?.city) params.set("city", filters.city);
      if (filters?.radius) params.set("radius", String(filters.radius));
      if (filters?.lat) params.set("lat", String(filters.lat));
      if (filters?.lon) params.set("lon", String(filters.lon));
      if (filters?.minTokenCost) params.set("minTokenCost", String(filters.minTokenCost));
      if (filters?.maxTokenCost) params.set("maxTokenCost", String(filters.maxTokenCost));
      const { data } = await api.get<{ content: JobListing[] }>(`/api/jobs?${params}`);
      return data.content;
    },
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => (await api.get<JobListing>(`/api/jobs/${id}`)).data,
    enabled: !!id,
  });
}

export function useRecentApplications() {
  return useQuery({
    queryKey: ["recent-applications"],
    queryFn: async () => (await api.get<JobApplication[]>(`/api/jobs/my/recent-applications`)).data,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => unwrapPage<JobApplication & { jobTitle?: string }>((await api.get("/api/handymen/me/applications?size=50")).data),
  });
}

export function useAssignedJobs() {
  return useQuery({
    queryKey: ["assigned-jobs"],
    queryFn: async () => (await api.get<JobListing[]>("/api/handymen/me/assigned-jobs")).data,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => unwrapPage<Category>((await api.get("/api/categories?size=100")).data),
  });
}
