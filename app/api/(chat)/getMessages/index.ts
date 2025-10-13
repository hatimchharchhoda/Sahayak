import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: "senderId and receiverId are required" },
        { status: 400 }
      );
    }

    // Fetch messages in both directions (sender to receiver and receiver to sender)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({ messages });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching messages:", error?.message || error);

    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
