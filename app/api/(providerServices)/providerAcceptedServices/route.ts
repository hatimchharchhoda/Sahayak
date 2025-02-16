import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const acceptedServices = await prisma.booking.findMany({
      where: {
        providerId: id,
        status: "ACCEPTED",
      },
      include: {
        Service: {
          include: {
            ServiceCategory: true,
          },
        },
      },
    });

    return NextResponse.json({ acceptedServices });
  } catch (error) {
    console.error("Error fetching booked services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
