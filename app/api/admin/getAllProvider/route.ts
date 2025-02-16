import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const allProvider = await prisma.serviceProvider.findMany();
    return NextResponse.json(allProvider);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
