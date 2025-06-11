import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const allServices = await prisma.booking.findMany({
      where: {
        providerId: id,
      },
      include: {
        Service: {
          include: {
            ServiceCategory: true,
          },
        },
      },
    });

    return NextResponse.json({ allServices });
  } catch (error) {
    console.error("Error fetching booked services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
