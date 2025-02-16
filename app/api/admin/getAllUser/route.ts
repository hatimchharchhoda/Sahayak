import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany();
    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
