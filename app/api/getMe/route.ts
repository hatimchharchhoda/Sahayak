import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!; // make sure it's set

export async function GET(req: NextRequest) {
  try {
    const cookies = req.cookies;

    const userToken = cookies.get("userToken")?.value;
    const providerToken = cookies.get("providerToken")?.value;

    let decoded, user, role;
    console.log({ userToken, providerToken });
    // Check user token
    if (userToken) {
      decoded = jwt.verify(userToken, JWT_SECRET) as { userId: string };
      console.log({ decoded });

      user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });
      role = "user";
    }

    // If not found, check provider token
    if (!user && providerToken) {
      decoded = jwt.verify(providerToken, JWT_SECRET) as { id: string };
      user = await prisma.serviceProvider.findUnique({
        where: { id: decoded.id },
      });
      role = "provider";
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ...user, role });
  } catch (error) {
    console.error("getMe error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
