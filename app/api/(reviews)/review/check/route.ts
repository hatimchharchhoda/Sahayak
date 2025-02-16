import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const bookingId = url.searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Check if a rating exists for this booking
    const rating = await prisma.rating.findUnique({
      where: { bookingId },
    });

    return NextResponse.json({
      hasReviewed: !!rating,
      review: rating
        ? {
            id: rating.id,
            stars: rating.stars,
            review: rating.review,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking review status:", error);
    return NextResponse.json(
      { message: "An error occurred while checking review status" },
      { status: 500 }
    );
  }
}
