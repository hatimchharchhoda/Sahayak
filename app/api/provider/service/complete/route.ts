// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
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
