import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getTokenFromCookies,
  isTokenValid,
  validateRedirectUrl,
  decodeJWT,
  hasPermission,
} from "./lib/jwt-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = [
    "/login",
    "/register",
    "/unauthorized",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/check",
    "/api/auth/token",
  ];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const cookies = request.headers.get("cookie") || "";
  const token = getTokenFromCookies(cookies);
  const isValid = token ? isTokenValid(token) : false;

  // If no token or token is invalid
  if (!token || !isValid) {
    // For API routes, return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For page routes, redirect to login
    if (pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      // Validate pathname to prevent open redirect attacks
      const safeRedirect = validateRedirectUrl(pathname, "/dashboard");
      loginUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check if user is an admin (admin users should not access Product app)
  if (token && isValid) {
    const payload = decodeJWT(token);
    const hasAdminAccess = payload?.has_admin_access === true;

    if (hasAdminAccess) {
      // For API routes, return 403 Forbidden
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            error:
              "Forbidden - Product access only. Admin users must use the Admin Panel.",
          },
          { status: 403 }
        );
      }

      // For page routes, redirect to unauthorized page
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("reason", "admin_user_not_allowed");
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Role-based access control for /proposals routes
    if (pathname.startsWith("/proposals")) {
      // Check if user has read_proposals_product permission
      const hasProposalAccess = hasPermission(token, "read_proposals_product");

      if (!hasProposalAccess) {
        // For API routes, return 403 Forbidden
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error: "Forbidden - Proposal access required",
            },
            { status: 403 }
          );
        }

        // For page routes, redirect to unauthorized page
        const unauthorizedUrl = new URL("/unauthorized", request.url);
        unauthorizedUrl.searchParams.set("reason", "proposal_access_required");
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
