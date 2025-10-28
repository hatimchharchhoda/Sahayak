// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import axios from "axios";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract user token from cookies
    const userToken = req.cookies.get("userToken")?.value;
    if (!userToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    // 2. Decode token
    const payload = await verifyAuth(userToken);
    if (!payload || !payload.id || !payload.city) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // 3. Get request body
    const { serviceId, date, basePrice, providerId } = await req.json();

    // 4. Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service does not exist" },
        { status: 404 }
      );
    }

    // 5. Common function to check for time conflicts
    const hasTimeConflict = (providerBookings, newBookingDate) => {
      const newDate = new Date(newBookingDate);
      const twoHoursInMs = 2 * 60 * 60 * 1000;

      return providerBookings.some((booking) => {
        const bookingDate = new Date(booking.date);
        const timeDifference = Math.abs(
          newDate.getTime() - bookingDate.getTime()
        );
        return timeDifference <= twoHoursInMs;
      });
    };

    // If providerId is passed, directly book for that provider
    if (providerId) {
      const provider = await prisma.serviceProvider.findUnique({
        where: { id: providerId },
        include: {
          bookings: {
            where: {
              status: {
                in: ["PENDING", "ACCEPTED", "CONFIRMED"],
              },
            },
          },
        },
      });

      if (!provider) {
        return NextResponse.json(
          { error: "Specified provider does not exist" },
          { status: 404 }
        );
      }

      if (hasTimeConflict(provider.bookings, date)) {
        return NextResponse.json(
          { error: "Selected provider is not available at the chosen time." },
          { status: 409 }
        );
      }

      // Book directly
      const booking = await prisma.booking.create({
        data: {
          userId: payload.id,
          providerId: provider.id,
          serviceId: service.id,
          serviceCategoryId: service.categoryId,
          date: new Date(date),
          basePrice,
          status: "PENDING",
        },
      });

      const fullBooking = await prisma.booking.findMany({
        where: {
          id: booking.id,
        },
        include: {
          Service: {
            include: {
              ServiceCategory: true,
            },
          },
        },
      });
      console.log(fullBooking);

      // Fetch user & provider emails
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      const serviceDetails = await prisma.service.findUnique({ where: { id: service.id } });

      // Send confirmation email to customer
      if (user?.email) {
        await sendEmail(
          user.email,
          "Booking Confirmation",
          `Hello ${user.name},\n\nYour booking for ${serviceDetails?.name} has been placed on ${new Date(date).toLocaleString()}.\n\nThank you for using Sahayak!`
        );
      }

      // Send notification email to provider
      if (provider?.email) {
        await sendEmail(
          provider.email,
          "New Booking Assigned",
          `Hello ${provider.name},\n\nYou have a new booking for ${serviceDetails?.name} scheduled on ${new Date(date).toLocaleString()}.\n\nPlease check your dashboard for details.`
        );
      }

      // 11. Send to socket API — external notification
      try {
        await axios.post("https://sahayak-socket.onrender.com/api/services", {
          bookingArray: fullBooking,
        });
      } catch (error) {
        console.error("Error sending booking to /api/services:", error.message);
      }

      return NextResponse.json({
        success: true,
        booking,
        assignedProvider: {
          id: provider.id,
          name: provider.name,
        },
      });
    }
    console.log("first");
    // 🔁 If no providerId passed → Auto assign flow

    // 6. Get providers offering this service in user's city
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
                  in: ["PENDING", "ACCEPTED", "CONFIRMED"],
                },
              },
            },
          },
        },
      },
    });

    const allProviders = providerLinks?.map((link) => link.ServiceProvider);

    if (allProviders.length === 0) {
      return NextResponse.json(
        { error: "No providers available for this service in your city" },
        { status: 404 }
      );
    }

    // 7. Filter providers with time conflicts
    const availableProviders = allProviders.filter((provider) => {
      return !hasTimeConflict(provider.bookings, date);
    });

    if (availableProviders.length === 0) {
      return NextResponse.json(
        {
          error:
            "No providers available at this time. All providers have conflicting bookings within 2 hours.",
        },
        { status: 404 }
      );
    }

    // 8. Assign provider based on ratings
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

    const ratedProviders = providersWithRatings.filter(
      (p) => p.averageStars !== null
    );

    let assignedProvider;

    if (ratedProviders.length > 0) {
      ratedProviders.sort((a, b) => b.averageStars - a.averageStars);
      assignedProvider = ratedProviders[0];
    } else {
      assignedProvider =
        providersWithRatings[
          Math.floor(Math.random() * providersWithRatings.length)
        ];
    }

    // 9. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: payload.id,
        providerId: assignedProvider.id,
        serviceId: service.id,
        serviceCategoryId: service.categoryId,
        date: new Date(date),
        basePrice,
        status: "ACCEPTED",
      },
    });

    // 10. Fetch full booking with nested Service & Category
    const fullBooking = await prisma.booking.findMany({
      where: {
        id: booking.id,
      },
      include: {
        Service: {
          include: {
            ServiceCategory: true,
          },
        },
      },
    });
    console.log(fullBooking);

    // 11. Send to socket API — external notification
    try {
      await axios.post("https://sahayak-socket.onrender.com/api/services", {
        bookingArray: fullBooking,
      });
    } catch (error) {
      console.error("Error sending booking to /api/services:", error.message);
    }

    return NextResponse.json({
      success: true,
      booking,
      assignedProvider: {
        id: assignedProvider.id,
        name: assignedProvider.name,
        averageStars: assignedProvider.averageStars,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
