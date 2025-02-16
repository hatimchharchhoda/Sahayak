import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { providerId } = await req.json();

    if (!providerId)
      return NextResponse.json({ error: "Invalid provider" }, { status: 500 });
    const reviews = await prisma.rating.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
        Service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        Booking: {
          date: "desc",
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
