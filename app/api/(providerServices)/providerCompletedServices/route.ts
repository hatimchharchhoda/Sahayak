// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // Fetch completed services for the provider
    const completedServices = await prisma.booking.findMany({
      where: {
        providerId: id,
        status: "COMPLETED",
      },
      include: {
        Service: {
          include: {
            ServiceCategory: true,
          },
        },
      },
    });

    // Handle case when no completed services are found
    if (completedServices.length === 0) {
      return NextResponse.json(
        { message: "No completed services found", completedServices: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ completedServices });
  } catch (error: any) {
    console.error("Error fetching booked services:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
