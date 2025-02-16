import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, email, name, phone, address } = data;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find and update the user
    const updatedUser = await prisma.user.update({
      where: { id }, // Ensure the user exists
      data: {
        email,
        name,
        phone,
        address,
      },
    });

    return NextResponse.json({ updatedUser });
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
