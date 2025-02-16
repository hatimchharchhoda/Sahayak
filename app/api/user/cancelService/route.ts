import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// pages/api/user/cancelService.js
export async function POST(req: NextRequest) {
  try {
    const { serviceId } = await req.json();

    await prisma.booking.update({
      where: { id: serviceId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "Service cancelled successfully" });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to cancel service" },
      { status: 500 }
    );
  }
}
