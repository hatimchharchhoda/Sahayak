import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Starting provider fetch...");

    // Use select to only get non-problematic fields
    const providers = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        status: true,
      },
    });

    console.log("Providers found:", providers?.length || 0);

    return NextResponse.json(providers);
  } catch (error) {
    // Safe error logging
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log("Error message:", errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch providers",
        message: errorMsg,
      },
      { status: 500 }
    );
  }
}
