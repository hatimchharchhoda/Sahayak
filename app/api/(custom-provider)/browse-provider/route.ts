import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if different
import { verifyAuth } from "@/lib/auth"; // your JWT verify logic

export async function POST(req: NextRequest) {
  try {
    const userToken = req.cookies.get("userToken")?.value;
    if (!userToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(userToken); // contains user info like city, email, etc.
    const userCity = payload?.city;

    if (!userCity) {
      return NextResponse.json(
        { error: "City not found in token" },
        { status: 400 }
      );
    }

    // Find providers in the same city
    const providers = await prisma.serviceProvider.findMany({
      where: {
        city: userCity,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        district: true,
        city: true,
        specialization: true,
        ratings: true,
      },
    });

    return NextResponse.json({ providers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
