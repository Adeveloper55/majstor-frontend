"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useJob } from "@/hooks/useJobs";
import { useReviewStatus } from "@/hooks/useReviews";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewFormProps {
  jobId: string;
}

export function ReviewForm({ jobId }: ReviewFormProps) {
  const router = useRouter();
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { data: status, isLoading: statusLoading } = useReviewStatus(jobId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/reviews", { jobId, rating, comment });
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Greška pri slanju recenzije");
    } finally {
      setLoading(false);
    }
  };

  if (jobLoading || statusLoading) return <p>Učitavanje...</p>;

  if (!status?.isParticipant) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          <p className="text-slate-600">Nemate pristup recenziji za ovaj posao.</p>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard")}>Nazad</Button>
        </CardContent>
      </Card>
    );
  }

  if (!job || job.status !== "COMPLETED" || !status.canReview) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          <p className="text-slate-600">
            {status.alreadyReviewed
              ? "Već ste ostavili recenziju za ovaj posao."
              : "Recenzija je dostupna samo za završene poslove."}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard")}>Nazad</Button>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6 text-center">
          <p className="font-semibold text-green-700">Hvala! Recenzija je poslata.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Ostavi recenziju</CardTitle>
        <p className="text-sm text-slate-500">{job.title}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <StarRating value={rating} onChange={setRating} size="lg" />
          <Textarea placeholder="Komentar (opciono)" value={comment} onChange={(e) => setComment(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Slanje..." : "Pošalji recenziju"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
