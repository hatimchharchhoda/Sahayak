// app/api/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, basePrice, categoryId } = body;

    // Validate required fields
    if (!name || !description || !basePrice || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate price is positive
    if (basePrice <= 0) {
      return NextResponse.json(
        { error: "Base price must be greater than 0" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Create new service
    const service = await prisma.service.create({
      data: {
        name,
        description,
        basePrice,
        categoryId,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

export const GET = async (req: NextRequest) => {
  try {
    // Fetch services along with their category names
    const services = await prisma.service.findMany({
      include: {
        ServiceCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    // Format response to include category name directly in the service object
    const formattedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      categoryId: service.categoryId,
      categoryName: service.ServiceCategory?.name || "Unknown", // Include category name
    }));

    return NextResponse.json(formattedServices);
  } catch (error: any) {
    console.error("Error fetching services:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
};
