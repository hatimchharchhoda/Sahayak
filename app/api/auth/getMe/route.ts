// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

interface DecodedToken {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("userToken")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const user: DecodedToken = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    const fetchedUser = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    return NextResponse.json({ user: fetchedUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
