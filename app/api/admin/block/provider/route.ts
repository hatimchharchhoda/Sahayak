// /api/admin/provider/block.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { providerId, status } = await req.json();

    if (!providerId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: providerId },
      data: { status },
    });

    return NextResponse.json(updatedProvider, { status: 200 });
  } catch (error) {
    console.error("Error updating provider status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
