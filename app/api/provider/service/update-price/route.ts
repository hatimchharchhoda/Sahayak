// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { basePrice, bookingId } = await req.json();

    // 1. Update the booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: { basePrice },
    });

    // 2. Fetch the updated booking with full related data
    const fullBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        ServiceProvider: true,
        User: true,
        Service: true,
      },
    });

    // 3. Send to internal API
    try {
      await axios.post(
        "https://sahayak-socket.onrender.com/api/services/modify-service",
        {
          booking: fullBooking,
        }
      );
    } catch (error) {
      console.error("Error sending booking to /api/services:", error.message);
    }

    return NextResponse.json(fullBooking);
  } catch (error) {
    console.error("Error accepting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
