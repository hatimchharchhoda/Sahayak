import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, userId, providerId, serviceId, stars, review } = body;

    if (!bookingId || !userId || !providerId || !serviceId || !stars) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating is between 1 and 5
    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { message: "Stars must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingRating = await prisma.rating.findUnique({
      where: { bookingId },
    });

    if (existingRating) {
      return NextResponse.json(
        { message: "You have already reviewed this service" },
        { status: 400 }
      );
    }

    // Create the new rating
    const newRating = await prisma.rating.create({
      data: {
        bookingId,
        userId,
        providerId,
        serviceId,
        stars,
        review,
      },
    });

    return NextResponse.json({ success: true, rating: newRating });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the review" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, stars, review } = body;

    // Validate required fields
    if (!bookingId || !stars) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating is between 1 and 5
    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { message: "Stars must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingRating = await prisma.rating.findUnique({
      where: { bookingId },
    });

    if (!existingRating) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Update the existing rating
    const updatedRating = await prisma.rating.update({
      where: { bookingId },
      data: {
        stars,
        review,
      },
    });

    return NextResponse.json({ success: true, rating: updatedRating });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the review" },
      { status: 500 }
    );
  }
}
