import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "Provider id and name are required" },
        { status: 400 }
      );
    }

    // ✅ Update provider name
    const updatedProvider = await prisma.serviceProvider.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        district: true,
        specialization: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Provider name updated successfully",
        updatedProvider,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating provider name:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update provider name",
        message: error.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}