import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // 🧠 Step 1: Get all unread messages grouped by sender
    const unreadMessages = await prisma.message.groupBy({
      by: ["senderId"],
      where: {
        receiverId: userId,
        seen: false,
      },
      _count: { id: true },
    });

    // 🧠 Step 2: Fetch sender names from both User and ServiceProvider tables
    const senderIds = unreadMessages.map((msg) => msg.senderId);

    const [users, providers] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: senderIds } },
        select: { id: true, name: true, role: true },
      }),
      prisma.serviceProvider.findMany({
        where: { id: { in: senderIds } },
        select: { id: true, name: true, role: true },
      }),
    ]);

    // 🧠 Step 3: Merge results with proper sender info
    const combined = unreadMessages.map((msg) => {
      const user = users.find((u) => u.id === msg.senderId);
      const provider = providers.find((p) => p.id === msg.senderId);

      const senderName = user?.name || provider?.name || "Unknown Sender";
      const senderRole = user?.role || provider?.role || "UNKNOWN";

      return {
        senderId: msg.senderId,
        senderName,
        senderRole,
        unreadCount: msg._count.id,
      };
    });

    return NextResponse.json({ unreadMessages: combined });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread messages" },
      { status: 500 }
    );
  }
}