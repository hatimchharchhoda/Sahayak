import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies instead of headers
    const userToken = req.cookies.get("userToken")?.value;

    if (!userToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(userToken);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const { serviceId, date, basePrice } = await req.json();

    const isServiceExistis = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!isServiceExistis)
      return NextResponse.json(
        { error: "Service not exists" },
        { status: 404 }
      );
    // console.log(isServiceExistis);
    const booking = await prisma.booking.create({
      data: {
        userId: payload.userId,
        serviceCategoryId: isServiceExistis.categoryId,
        serviceId,
        date: new Date(date),
        basePrice,
      },
    });
    // console.log(booking);

    return NextResponse.json({ booking });
  } catch (error: any) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
