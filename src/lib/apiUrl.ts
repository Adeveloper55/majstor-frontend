const PRODUCTION_API_URL = "https://api.majstor365.com";

/** Resolves API base URL — production domen uvek ide na api.majstor365.com */
export function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "majstor365.com" || host === "www.majstor365.com") {
      return PRODUCTION_API_URL;
    }
  }

  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  return typeof window !== "undefined" ? "http://localhost:8080" : PRODUCTION_API_URL;
}
