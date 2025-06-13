import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes("/api/") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Define shared routes (public to all roles after login)
  const sharedRoutes = ["/chat"];
  const isSharedRoute = sharedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get tokens from cookies
  const providerToken = req.cookies.get("providerToken")?.value;
  const userToken = req.cookies.get("userToken")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;

  // Verify tokens
  const providerPayload = await verifyAuth(providerToken);
  const userPayload = await verifyAuth(userToken);
  const adminPayload = await verifyAuth(adminToken);

  const isAuthenticated = providerPayload || userPayload || adminPayload;

  // 🔒 Allow login/auth pages only if NOT already authenticated
  if (pathname.startsWith("/auth")) {
    if (userPayload) return NextResponse.redirect(new URL("/", req.url));
    if (providerPayload)
      return NextResponse.redirect(new URL("/provider", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/provider/auth")) {
    if (providerPayload)
      return NextResponse.redirect(new URL("/provider", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/auth")) {
    if (adminPayload) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  // 🔐 Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated) {
    if (pathname.startsWith("/provider")) {
      return NextResponse.redirect(new URL("/provider/auth", req.url));
    } else if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/auth", req.url));
    } else if (!isSharedRoute) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // 🔒 Role-based protection
  if (pathname.startsWith("/provider") && !providerPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (pathname.startsWith("/admin") && !adminPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 🔁 Optional: prevent logged-in users from accessing others' routes
  if (userPayload && pathname.startsWith("/provider")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (providerPayload && pathname === "/") {
    return NextResponse.redirect(new URL("/provider", req.url));
  }

  if (adminPayload && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
