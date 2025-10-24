// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST: Fetch average rating and total reviews for services in a category
 * Request body: { categoryName: string }
 */
export const POST = async (req) => {
  try {
    const { categoryName } = await req.json();

    // ✅ Find the category
    const category = await prisma.serviceCategory.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // ✅ Fetch all services of that category with ratings
    const services = await prisma.service.findMany({
      where: { categoryId: category.id },
      include: {
        ratings: true, // Include all rating fields
      },
    });

    // ✅ Calculate average rating & total reviews
    const formattedRatings = services.map((service) => {
      const totalReviews = service.ratings?.length || 0;

      // Sum up stars (not 'rating')
      const avgRating =
        totalReviews > 0
          ? (
              service.ratings.reduce((sum, r) => sum + (r.stars || 0), 0) /
              totalReviews
            ).toFixed(1)
          : "0.0";

      return {
        serviceId: service.id,
        averageRating: avgRating,
        totalReviews,
      };
    });

    return NextResponse.json(formattedRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
};
