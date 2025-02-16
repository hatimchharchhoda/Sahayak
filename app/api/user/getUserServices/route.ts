import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: "User id not provided" });
    const userServices = await prisma.booking.findMany({
      where: { userId: userId },
      include: {
        ServiceProvider: true,
        User: true,
        Service: true,
      },
    });

    const sanitizedServices = userServices.map((service) => ({
      ...service,
      serviceCategoryId: service.serviceCategoryId || "Unknown",
    }));

    return NextResponse.json({ userServices: sanitizedServices });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message });
  }
}
