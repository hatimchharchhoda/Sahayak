import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all service categories with services + specialization IDs
export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        services: {
          select: {
            id: true,
            name: true,
            description: true,
            categoryId: true,
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch service categories" },
      { status: 500 }
    );
  }
}
