// @ts-nocheck
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  // Clear the userToken cookie
  response.cookies.set("userToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });
  // response.cookies.set("userToken", "", { maxAge: 0, path: "/" });
  return response;
}
