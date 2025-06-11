// @ts-nocheck

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract user token from cookies
    const userToken = req.cookies.get("userToken")?.value;
    console.log(userToken);
    if (!userToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    // 2. Decode token
    const payload = await verifyAuth(userToken);
    console.log(payload);
    if (!payload || !payload.userId || !payload.city) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const { serviceId, date, basePrice } = await req.json();

    // 3. Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service does not exist" },
        { status: 404 }
      );
    }

    // 4. Find providers offering this service in user's city
    const providerLinks = await prisma.serviceProviderService.findMany({
      where: {
        serviceId: serviceId,
        ServiceProvider: {
          city: payload.city,
        },
      },
      include: {
        ServiceProvider: {
          include: {
            ratings: true,
            bookings: {
              where: {
                status: {
                  in: ["PENDING", "ACCEPTED", "CONFIRMED"], // Only check non-cancelled/completed bookings
                },
              },
            },
          },
        },
      },
    });

    console.log({ providerLinks });

    const allProviders = providerLinks?.map((link) => link.ServiceProvider);

    if (allProviders.length === 0) {
      return NextResponse.json(
        { error: "No providers available for this service in your city" },
        { status: 404 }
      );
    }

    // 5. Helper function to check time conflicts
    const hasTimeConflict = (providerBookings, newBookingDate) => {
      const newDate = new Date(newBookingDate);
      const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

      return providerBookings.some((booking) => {
        const bookingDate = new Date(booking.date);
        const timeDifference = Math.abs(
          newDate.getTime() - bookingDate.getTime()
        );
        return timeDifference <= twoHoursInMs;
      });
    };

    // 6. Filter out providers with time conflicts
    const availableProviders = allProviders.filter((provider) => {
      return !hasTimeConflict(provider.bookings, date);
    });

    console.log({ availableProviders });

    if (availableProviders.length === 0) {
      return NextResponse.json(
        {
          error:
            "No providers available at this time. All providers have conflicting bookings within 2 hours.",
        },
        { status: 404 }
      );
    }

    // 7. Process provider ratings and assign the best one
    const providersWithRatings = availableProviders.map((provider) => {
      const ratings = provider.ratings;
      const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
      const averageStars =
        ratings.length > 0 ? totalStars / ratings.length : null;

      return {
        ...provider,
        averageStars,
      };
    });

    // Filter out providers with no ratings
    const ratedProviders = providersWithRatings.filter(
      (p) => p.averageStars !== null
    );

    let assignedProvider;

    if (ratedProviders.length > 0) {
      // Sort by average stars descending and pick the top one
      ratedProviders.sort((a, b) => b.averageStars - a.averageStars);
      assignedProvider = ratedProviders[0];
    } else {
      // No ratings, pick randomly
      assignedProvider =
        providersWithRatings[
          Math.floor(Math.random() * providersWithRatings.length)
        ];
    }

    console.log("Assigned provider:", assignedProvider);

    // 8. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: payload.userId,
        providerId: assignedProvider.id,
        serviceId: service.id,
        serviceCategoryId: service.categoryId,
        date: new Date(date),
        basePrice,
        status: "ACCEPTED", // Since we found an available provider
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      assignedProvider: {
        id: assignedProvider.id,
        name: assignedProvider.name,
        averageStars: assignedProvider.averageStars,
      },
    });
  } catch (error: any) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
