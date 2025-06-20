// app/api/provider-services/route.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { providerId } = await req.json();

    if (!providerId) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    const services = await prisma.serviceProviderService.findMany({
      where: {
        providerId,
      },
      include: {
        Service: true,
      },
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching provider services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
