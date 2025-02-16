// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { categoryName } = await req.json();
    // Fetch services along with their category names

    const isCategoryExist = await prisma.serviceCategory.findFirst({
      where: { name: categoryName },
    });

    // const categoryId
    if (!isCategoryExist) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const services = await prisma.service.findMany({
      where: {
        categoryId: isCategoryExist.id,
      },
      include: {
        ServiceCategory: {
          select: {
            name: true, // Select only the category name
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
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
};
