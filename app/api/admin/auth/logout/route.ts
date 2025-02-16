// @ts-nocheck
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  response.cookies.set("adminToken", "", { maxAge: 0, path: "/" });
  return response;
}
