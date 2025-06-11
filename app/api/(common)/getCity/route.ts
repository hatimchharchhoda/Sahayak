import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { district } = await req.json();

    const city = await prisma.gujaratCity.findMany({
      where: {
        district,
      },
    });

    const cities = city[0]?.cities || [];

    return NextResponse.json({ cities });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load city data" },
      { status: 500 }
    );
  }
}
