import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { specialization } = await req.json();

    const bookedServices = await prisma.booking.findMany({
      where: {
        serviceCategoryId: specialization,
        status: "PENDING",
      },
      include: {
        Service: {
          include: {
            ServiceCategory: true,
          },
        },
      },
    });

    return NextResponse.json({ bookedServices });
  } catch (error) {
    console.error("Error fetching booked services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
