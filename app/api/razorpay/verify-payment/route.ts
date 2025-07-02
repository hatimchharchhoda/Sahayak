import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma"; // Adjust path if different
import axios from "axios";

export async function POST(req: NextRequest) {
  const data = await req.formData(); // Razorpay sends form data
  console.log(data);
  console.log("check verify payment api");

  const razorpay_order_id = data.get("razorpay_order_id") as string;
  const razorpay_payment_id = data.get("razorpay_payment_id") as string;
  const razorpay_signature = data.get("razorpay_signature") as string;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (isValid) {
    try {
      // ✅ Update the booking in DB using order_id
      await prisma.booking.updateMany({
        where: { orderId: razorpay_order_id },
        data: {
          isPaid: true,
          paymentId: razorpay_payment_id,
          paymentSignature: razorpay_signature,
          paymentVerifiedAt: new Date(),
        },
      });

      const updatedBookings = await prisma.booking.findMany({
        where: {
          orderId: razorpay_order_id,
        },
        include: {
          User: {
            select: {
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          Service: {
            include: {
              ServiceCategory: true,
            },
          },
          rating: {
            include: {
              User: true,
            },
          },
        },
      });

      try {
        await axios.post(`${process.env.BACKEND_URL}/api/payment`, {
          updatedBookings,
        });
      } catch (axiosError) {
        console.error("Error sending data to socket backend:", axiosError);
      }

      console.log(updatedBookings);
      return NextResponse.redirect(
        "https://sahayak0.vercel.app/payment-success",
        303
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json(
        { error: "Payment verified but DB update failed" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.redirect(
      "https://sahayak0.vercel.app/payment-success",
      303
    );
  }
}
