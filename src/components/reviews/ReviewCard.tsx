import { StarRating } from "@/components/shared/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="p-4">
        <StarRating value={review.rating} readonly size="sm" />
        {review.comment && <p className="mt-2 text-base text-slate-700">{review.comment}</p>}
        <p className="mt-2 text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString("sr")}</p>
      </CardContent>
    </Card>
  );
}
