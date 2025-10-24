// @ts-nocheck
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  // Clear the providerToken cookie
  response.cookies.set("providerToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });
  // response.cookies.set("providerToken", "", { maxAge: 0, path: "/" });
  return response;
}
