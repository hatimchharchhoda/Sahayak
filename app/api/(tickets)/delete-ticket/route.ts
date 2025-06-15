import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const deletedTicket = await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json({ deletedTicket });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
