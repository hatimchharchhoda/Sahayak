import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path as per your project

export async function POST(req: NextRequest): Promise<NextResponse> {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });

  const body = await req.json();
  console.log(body);
  const { amount, bookingId } = body;
  const options = {
    amount,
    currency: "INR",
    receipt: `receipt_${bookingId}`,
    notes: {
      bookingId: bookingId,
    },
  };
  console.log("check create payment api");

  try {
    const order = await razorpay.orders.create(options);

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        orderId: order.id,
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
