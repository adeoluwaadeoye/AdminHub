import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // ✅ check httpOnly cookie (works same-domain / when SameSite=None works)
  const cookieToken = req.cookies.get("token")?.value;

  // ✅ check public non-httpOnly cookie (set by backend, readable by middleware)
  const authStatus  = req.cookies.get("auth-status")?.value;

  // ✅ check Authorization header (set by api.ts via localStorage token)
  const authHeader  = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // ✅ user is logged in if ANY of these exist
  const isLoggedIn = !!(cookieToken || authStatus === "1" || headerToken);

  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage  = req.nextUrl.pathname.startsWith("/auth");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};