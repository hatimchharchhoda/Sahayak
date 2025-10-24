import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  // Shared routes (accessible to both user & provider only)
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

  // Check if user/provider is blocked (if authenticated)
  if (providerPayload) {
    try {
      const provider = await prisma.serviceProvider.findUnique({
        where: { id: providerPayload.id },
        select: { status: true },
      });

      if (provider?.status === "BLOCKED") {
        // Clear cookie and redirect
        const res = NextResponse.redirect(new URL("/provider/auth", req.url));
        res.cookies.set("providerToken", "", {
          httpOnly: true,
          maxAge: 0,
          path: "/",
        });
        return res;
      }
    } catch (error) {
      console.error("Error checking provider status:", error);
    }
  }

  if (userPayload) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userPayload.id },
        select: { status: true },
      });

      if (user?.status === "BLOCKED") {
        // Clear cookie and redirect
        const res = NextResponse.redirect(new URL("/auth", req.url));
        res.cookies.set("userToken", "", {
          httpOnly: true,
          maxAge: 0,
          path: "/",
        });
        return res;
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  }

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
    let redirectUrl = "/auth";
    if (pathname.startsWith("/provider")) redirectUrl = "/provider/auth";
    else if (pathname.startsWith("/admin")) redirectUrl = "/admin/auth";

    const res = NextResponse.redirect(new URL(redirectUrl, req.url));
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  }

  // 🧩 Shared route protection (chat between user and provider only)
  if (isSharedRoute) {
    if (!(userPayload || providerPayload)) {
      const res = NextResponse.redirect(new URL("/auth", req.url));
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      res.headers.set("Pragma", "no-cache");
      res.headers.set("Expires", "0");
      return res;
    }
    // user/provider allowed → continue
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  }

  // 🔒 Role-based protection
  if (pathname.startsWith("/provider") && !providerPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (pathname.startsWith("/admin") && !adminPayload) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (
    pathname.startsWith("/") &&
    !pathname.startsWith("/provider") &&
    !pathname.startsWith("/admin") &&
    !isSharedRoute &&
    !userPayload
  ) {
    // Restrict provider/admin from accessing normal user pages
    return NextResponse.redirect(
      new URL(
        providerPayload ? "/provider" : adminPayload ? "/admin" : "/auth",
        req.url
      )
    );
  }

  // 🔁 Prevent logged-in users from accessing others' home routes
  if (userPayload && pathname.startsWith("/provider")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (providerPayload && pathname === "/") {
    return NextResponse.redirect(new URL("/provider", req.url));
  }

  if (adminPayload && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ✅ Default response with anti-cache headers
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
