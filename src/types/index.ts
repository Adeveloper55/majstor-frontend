export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  profileImageUrl?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Handyman {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  tokenBalance: number;
  averageRating: number;
  totalReviews: number;
  companyName?: string;
  pib?: string;
  address?: string;
  postalCode?: string;
  country?: string;
  contactPerson?: string;
  isCompany?: boolean;
  categoryIds?: number[];
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  baseTokenCost: number;
}

export interface ClientContact {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface HandymanContact {
  fullName: string;
  email: string;
  phone?: string;
}

export interface JobListing {
  id: string;
  userId: string;
  categoryId: number;
  category: Category;
  title: string;
  description: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  locationPinned?: boolean;
  images?: string[];
  aiScore: number;
  tokenCost?: number | null;
  status: "PENDING_APPROVAL" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  selectedHandymanId?: string;
  createdAt: string;
  distance?: number;
  clientContact?: ClientContact;
  assignedHandymanContact?: HandymanContact;
}

export interface JobApplication {
  id: string;
  jobListingId: string;
  handyman?: Partial<Handyman>;
  tokensSpent: number;
  coverMessage?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  jobTitle?: string;
  jobCity?: string;
  jobCategory?: string;
  jobStatus?: string;
  jobTokenCost?: number;
}

export interface TokenPackage {
  id: number;
  name: string;
  tokenAmount: number;
  priceEur: number;
  isActive: boolean;
}

export interface TokenTransaction {
  id: string;
  amount: number;
  type: "DEDUCTED" | "PURCHASED";
  description?: string;
  createdAt: string;
}

export interface TokenPurchaseRequest {
  id: string;
  packageId?: number;
  tokenAmount: number;
  amountExpected: number;
  paymentReference?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  createdAt: string;
}

export interface BankDetails {
  companyName: string;
  companyPib?: string;
  bankName: string;
  bankAccount: string;
  paymentInstructions: string;
}

export interface Review {
  id: string;
  jobListingId: string;
  reviewerType: "CLIENT" | "HANDYMAN";
  rating: number;
  comment?: string;
  createdAt: string;
}

export type Role = "ROLE_CLIENT" | "ROLE_HANDYMAN" | "ROLE_ADMIN";

export interface AuthState {
  token: string | null;
  role: Role | null;
  user: User | Handyman | null;
  login: (token: string, role: Role, user: User | Handyman) => void;
  logout: () => void;
  hydrate: () => void;
}
