import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userToken = req.cookies.get("adminToken")?.value;
    console.log(userToken);
    if (!userToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(userToken);
    console.log(payload);

    if (!payload)
      return NextResponse.json({ error: "404 User is Unautorized" });

    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
        booking: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket fetched successfully",
        tickets,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing ticket:", error);

    return NextResponse.json(
      {
        error: "Failed to process ticket",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
