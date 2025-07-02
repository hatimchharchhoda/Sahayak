import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userToken = req.cookies.get("userToken")?.value;
    const providerToken = req.cookies.get("providerToken")?.value;

    if (userToken) {
      const { userId } = await req.json();
      const user = await prisma.serviceProvider.findUnique({
        where: { id: userId },
      });
      return NextResponse.json({ user });
    } else if (providerToken) {
      const { userId } = await req.json();
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return NextResponse.json({ user });
    }
  } catch (error) {}
}
