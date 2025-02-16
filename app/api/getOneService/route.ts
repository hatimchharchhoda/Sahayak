// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { serviceId } = await req.json();
    const service = await prisma.service.findFirst({
      where: { id: serviceId },
    });
    return NextResponse.json({ service });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}
