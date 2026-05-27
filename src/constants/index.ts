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
  OPEN: "Otvoren",
  IN_PROGRESS: "U toku",
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
  vodoinstalacije: "💧",
  "kucno-odrzavanje": "🏠",
  "molerski-radovi": "🎨",
  stolarija: "🪚",
  keramika: "🧱",
  "grejanje-klima": "🌡️",
  "bravarski-radovi": "🔧",
  "gradjevinski-radovi": "🏗️",
  ciscenje: "🧹",
};

export const BEST_VALUE_PACKAGE_NAMES = ["Standard", "Pro"];

export const DEFAULT_MAP_CENTER: [number, number] = [44.8176, 20.4633];
export const DEFAULT_RADIUS_KM = 25;
export const MAX_RADIUS_KM = 100;
