import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

/**
 * Next.js Proxy (New Convention)
 * Handles all request interception, authentication, and redirects.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  // 1. PUBLIC ROUTES (Always allow)
  const publicPaths = ["/login", "/", "/maps"];

  // Static assets and internal next paths are already excluded by the matcher,
  // but we handle them here for safety if the matcher is broad.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. REDIRECT LOGIC FOR LOGIN PAGE
  if (pathname === "/login") {
    if (session) {
      try {
        await decrypt(session);
        // Already logged in, go to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch (e) {
        // Invalid session, allow login page
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 3. ADMIN PROTECTION
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await decrypt(session);

      // Role protection for user management
      if (
        pathname.startsWith("/admin/users") &&
        payload.user.role !== "superadmin"
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      // Root /admin redirect to dashboard
      if (pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Session expired or corrupted
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 4. LANDING PAGE REDIRECT (If applicable)
  // If "/" should go to landing page, keep it as is.
  // If "/" should redirect to maps, uncomment below:
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/maps", request.url));
  // }

  return NextResponse.next();
}

/**
 * Proxy Configuration Matcher
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
