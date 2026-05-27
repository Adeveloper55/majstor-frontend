"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { unwrapPage } from "@/lib/utils";
import type { Review } from "@/types";

export function useReviewsForUser(userId: string) {
  return useQuery({
    queryKey: ["reviews-user", userId],
    queryFn: async () => unwrapPage<Review>((await api.get(`/api/reviews/user/${userId}?size=50`)).data),
    enabled: !!userId,
  });
}

export function useReviewsForHandyman(handymanId: string) {
  return useQuery({
    queryKey: ["reviews-handyman", handymanId],
    queryFn: async () => unwrapPage<Review>((await api.get(`/api/reviews/handyman/${handymanId}?size=50`)).data),
    enabled: !!handymanId,
  });
}

export function useReviewStatus(jobId: string) {
  return useQuery({
    queryKey: ["review-status", jobId],
    queryFn: async () => (await api.get<{ jobStatus: string; canReview: boolean; alreadyReviewed: boolean; isParticipant: boolean }>(`/api/reviews/job/${jobId}/status`)).data,
    enabled: !!jobId,
  });
}
