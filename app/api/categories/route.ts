// app/api/categories/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        services: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const category = await prisma.serviceCategory.create({
      data: { name },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
