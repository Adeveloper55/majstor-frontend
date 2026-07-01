export interface HandymanReviewSnippet {
  rating: number;
  comment?: string;
  reviewerName?: string;
}

export interface HandymanListing {
  id: string;
  fullName: string;
  companyName?: string;
  displayName: string;
  city?: string;
  bio?: string;
  profileImageUrl?: string;
  isVerified?: boolean;
  averageRating?: number;
  totalReviews?: number;
  phone?: string | null;
  email?: string | null;
  latestReview?: HandymanReviewSnippet | null;
  yearsExperience?: number | null;
  memberSince?: string;
}

export interface HandymanSearchResponse {
  categorySlug: string;
  categoryName: string;
  city: string;
  totalCount: number;
  averageRating?: number | null;
  totalReviews: number;
  content: HandymanListing[];
}
