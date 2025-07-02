// @ts-nocheck
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// pages/api/user/cancelService.js
export async function POST(req: NextRequest) {
  try {
    const { serviceId } = await req.json();

    // 1. Cancel service
    await prisma.booking.update({
      where: { id: serviceId },
      data: { status: "CANCELLED" },
    });

    // 2. Fetch the updated booking with full related data
    const fullBooking = await prisma.booking.findUnique({
      where: { id: serviceId },
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

    return NextResponse.json({ message: "Service cancelled successfully" });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to cancel service" },
      { status: 500 }
    );
  }
}
