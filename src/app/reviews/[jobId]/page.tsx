"use client";

import { useParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default function ReviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <ReviewForm jobId={jobId} />
      </main>
    </div>
  );
}
