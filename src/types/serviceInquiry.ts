export interface ServiceInquiry {
  id: string;
  categorySlug: string;
  categoryName: string;
  city: string;
  startTimeline: string;
  shortDescription?: string;
  detailedDescription: string;
  salutation?: string;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
}
