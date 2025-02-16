// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const serviceDetails = await prisma.booking.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        Service: {
          include: {
            ServiceCategory: true,
          },
        },
      },
    });

    if (!serviceDetails) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(serviceDetails);
  } catch (error) {
    console.error("Error fetching service details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
