import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { updatedTicketStatus, id } = await req.json();
    console.log({ updatedTicketStatus, id });
    const ticket = await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        status: updatedTicketStatus,
      },
      include: {
        user: true,       // 👈 include user
        provider: true,   // 👈 include provider
      },
    });
    console.log(ticket);
    return NextResponse.json({ ticket });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
