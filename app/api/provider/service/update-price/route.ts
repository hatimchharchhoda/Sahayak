import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// The function receives params as a separate argument
export async function POST(req: NextRequest) {
  try {
    const { basePrice, bookingId } = await req.json();

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId }, // Use params.id directly
      data: { basePrice },
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
