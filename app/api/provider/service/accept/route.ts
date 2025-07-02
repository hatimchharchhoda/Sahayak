// @ts-nocheck
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, bookingId } = await req.json();
    console.log("accept Route");
    // 1. Change the status of the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "ACCEPTED", providerId: id },
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
    console.log({ fullBooking });
    // 3. Send to internal API
    try {
      await axios.post(
        "https://sahayak-socket.onrender.com/api/services/modify-user",
        {
          booking: fullBooking,
        }
      );
    } catch (error) {
      console.error("Error sending booking to /api/services:", error.message);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error accepting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
