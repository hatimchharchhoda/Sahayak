// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// File: app/api/getProviderServiceRatings/route.ts
import { prisma } from "@/lib/prisma"; // Changed: Named import instead of default
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { providerId } = await req.json();

    if (!providerId) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Group ratings by serviceId and calculate average ratings
    const ratings = await prisma.rating.groupBy({
      by: ["serviceId"],
      where: { providerId },
      _avg: { stars: true },
      _count: { stars: true },
    });

    // Format the ratings data
    const formattedRatings = ratings.map((r) => ({
      serviceId: r.serviceId,
      averageRating: r._avg.stars?.toFixed(1) || "0.0",
      totalReviews: r._count.stars,
    }));

    return NextResponse.json(formattedRatings);
  } catch (error) {
    console.error("Error fetching provider service ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
};