import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    console.log(id);
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
