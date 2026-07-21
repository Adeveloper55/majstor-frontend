import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/register/client",
  "/register/handyman",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/register/check-email",
  "/offline",
  "/contact",
  "/magazin",
  "/majstori",
  "/izvodjaci",
  "/prosecne-cene",
  "/pretraga",
  "/nadji-majstore",
  "/registracija-preduzeca",
  "/uslovi-koriscenja",
  "/pravila-poslovanja",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isPublic) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "ROLE_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/tokens") && role !== "ROLE_HANDYMAN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/applications" && role !== "ROLE_HANDYMAN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/assigned-jobs" && role !== "ROLE_HANDYMAN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/jobs/new" && role !== "ROLE_CLIENT") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (/^\/jobs\/[^/]+\/edit/.test(pathname) && role !== "ROLE_CLIENT") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (/^\/jobs\/[^/]+\/applications/.test(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|manifest.json|sw.js|offline|.*\\..*).*)"],
};
