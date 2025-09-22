// @ts-nocheck
// app/api/admin/auth/getMe/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    // Fetch admin info from DB
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.userId },
    });

    if (!admin) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: admin, role: decoded.role }, { status: 200 });
  } catch (error) {
    console.log("getMe error:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
