import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for api routes, static files, images, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes("/api/") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Get all tokens
  const providerToken = req.cookies.get("providerToken")?.value;
  const userToken = req.cookies.get("userToken")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;

  // Verify all tokens to determine user state
  const providerPayload = await verifyAuth(providerToken);
  const userPayload = await verifyAuth(userToken);
  const adminPayload = await verifyAuth(adminToken);

  // Get the active payload (first valid one)
  const activePayload = providerPayload || userPayload || adminPayload;

  // Restrict access if user has only userToken
  if (userPayload) {
    if (
      !pathname.startsWith("/auth") &&
      !pathname.startsWith("/provider/auth") &&
      !pathname.startsWith("/admin/auth") &&
      !pathname.startsWith("/")
    ) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // Restrict access if user has only providerToken
  if (providerPayload) {
    if (
      !pathname.startsWith("/provider") &&
      !pathname.startsWith("/provider/")
    ) {
      return NextResponse.redirect(new URL("/provider", req.url));
    }
    if (pathname.startsWith("/provider/auth")) {
      return NextResponse.redirect(new URL("/provider", req.url));
    }
  }

  // Restrict access to '/' if user does not have userToken
  if (pathname === "/" && !userPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Handle auth routes access
  if (pathname.startsWith("/auth")) {
    if (activePayload) {
      if (providerPayload) {
        return NextResponse.redirect(new URL("/provider", req.url));
      } else if (adminPayload) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (userPayload) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  }

  // Handle provider auth routes
  if (pathname.startsWith("/provider/auth")) {
    if (providerPayload) {
      return NextResponse.redirect(new URL("/provider", req.url));
    }
    return NextResponse.next();
  }

  // Handle admin auth routes
  if (pathname.startsWith("/admin/auth")) {
    if (adminPayload) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes handling
  if (!activePayload) {
    if (pathname.startsWith("/provider")) {
      return NextResponse.redirect(new URL("/provider/auth", req.url));
    } else if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/auth", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // Role-based access control
  if (pathname.startsWith("/provider") && !providerPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (pathname.startsWith("/admin") && !adminPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
