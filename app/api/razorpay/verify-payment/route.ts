import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma"; // Adjust path if different

export async function POST(req: NextRequest) {
  const data = await req.formData(); // Razorpay sends form data

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
      const updatedBooking = await prisma.booking.updateMany({
        where: { orderId: razorpay_order_id },
        data: {
          isPaid: true,
          paymentId: razorpay_payment_id,
          paymentSignature: razorpay_signature,
          paymentVerifiedAt: new Date(),
        },
      });

      // Redirect to success page
      return NextResponse.redirect(
        "https://sahayak0.vercel.app/payment-success"
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json(
        { error: "Payment verified but DB update failed" },
        { status: 500 }
      );
    }
  } else {
    // Redirect to failure page
    return NextResponse.redirect("https://sahayak0.vercel.app/payment-failure");
  }
}
