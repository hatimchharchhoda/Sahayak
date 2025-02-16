import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, bookingId } = await req.json();
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "ACCEPTED", providerId: id },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error accepting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
