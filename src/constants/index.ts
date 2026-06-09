export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Majstor na klik";

export const API_PATHS = {
  auth: {
    login: "/api/auth/login",
    registerClient: "/api/auth/register/client",
    registerHandyman: "/api/auth/register/handyman",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  categories: "/api/categories",
  jobs: "/api/jobs",
  jobsMy: "/api/jobs/my",
  jobsScorePreview: "/api/jobs/score-preview",
  jobsRecentApplications: "/api/jobs/my/recent-applications",
  uploads: "/api/uploads/image",
  handymenMe: "/api/handymen/me",
  handymenTokens: "/api/handymen/me/tokens",
  usersMe: "/api/users/me",
  tokens: {
    packages: "/api/tokens/packages",
    bankDetails: "/api/tokens/bank-details",
    request: "/api/tokens/request",
    requests: "/api/tokens/requests",
  },
  reviews: "/api/reviews",
  admin: {
    stats: "/api/admin/stats",
    users: "/api/admin/users",
    handymen: "/api/admin/handymen",
    jobs: "/api/admin/jobs",
  },
} as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Najnovije" },
  { value: "closest", label: "Najbliže" },
  { value: "lowest_cost", label: "Najjeftinije" },
] as const;

export const JOB_SORT_OPTIONS = SORT_OPTIONS;

export const JOB_STATUS_LABELS: Record<string, string> = {
  PENDING_APPROVAL: "Na čekanju odobrenja",
  OPEN: "Otvoren",
  IN_PROGRESS: "U toku",
  COMPLETED: "Završen",
  CANCELLED: "Otkazan",
};

/** Status oglasa iz perspektive klijenta (admin odobrenje) */
export const CLIENT_JOB_APPROVAL_LABELS: Record<string, string> = {
  PENDING_APPROVAL: "Nije odobren",
  OPEN: "Odobren",
  IN_PROGRESS: "Majstor dodeljen",
  COMPLETED: "Završen",
  CANCELLED: "Otkazan",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Na čekanju (admin)",
  ACCEPTED: "Odobreno — dodeljeno",
  REJECTED: "Nije odobreno",
};

export const TOKEN_REQUEST_STATUS: Record<string, string> = {
  PENDING: "Na čekanju",
  APPROVED: "Odobren",
  REJECTED: "Odbijen",
};

export const TOKEN_REQUEST_STATUS_LABELS = TOKEN_REQUEST_STATUS;

export const CATEGORY_ICONS: Record<string, string> = {
  elektrika: "⚡",
  "elektroinstalacije-elektricar": "⚡",
  vodoinstalacije: "💧",
  vodoinstalater: "💧",
  "kucno-odrzavanje": "🏠",
  "molerski-radovi": "🎨",
  "krecenje-moler": "🎨",
  stolarija: "🪚",
  stolar: "🪚",
  keramika: "🧱",
  "keramika-keramicar": "🧱",
  "lepljenje-plocica": "🧱",
  "grejanje-klima": "🌡️",
  "klima-uredjaji-ugradnja-klime": "🌡️",
  "toplotne-pumpe": "🌡️",
  "bravarski-radovi": "🔧",
  "bravarija-bravarske-usluge": "🔧",
  "gradjevinski-radovi": "🏗️",
  "gradjevinski-radovi-nove": "🏗️",
  ciscenje: "🧹",
  "agencija-za-ciscenje": "🧹",
  "ciscenje-dimnjaka": "🧹",
  selidbe: "📦",
  fasade: "🏢",
  "majstori-za-krov": "🏠",
  parketari: "🪵",
  laminati: "🪵",
  drugo: "🔨",
};

export const BEST_VALUE_PACKAGE_NAMES = ["Standard", "Pro"];

import { SERVICE_CATEGORIES } from "./categories";

export {
  SERVICE_CATEGORIES,
  categoryRoutes,
  getCategoryBySlug,
  getCategoryPriceLabel,
} from "./categories";
export type { ServiceCategory } from "./categories";

/** @deprecated Koristite SERVICE_CATEGORIES */
export const NAJTRAZENIJE_SLUGS = SERVICE_CATEGORIES.map((c) => c.slug) as readonly string[];

/** @deprecated Koristite SERVICE_CATEGORIES */
export const NAJTRAZENIJE_LABELS = Object.fromEntries(
  SERVICE_CATEGORIES.map((c) => [c.slug, c.name])
) as Record<string, string>;

export const DEFAULT_MAP_CENTER: [number, number] = [44.8176, 20.4633];
export const DEFAULT_RADIUS_KM = 25;
export const MAX_RADIUS_KM = 100;
