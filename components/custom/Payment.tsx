"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IndianRupee, Loader2 } from "lucide-react";
import axios from "axios";
import Script from "next/script";
import toast from "react-hot-toast";

interface IPaymentProps {
  amount: number;
  bookingId: string;
  user?: {
    name: string;
    email: string;
    contact: string;
  };
}

const Payment = ({ amount, bookingId, user }: IPaymentProps) => {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    if (typeof window === "undefined" || !(window as any).Razorpay) {
      toast.error("Razorpay SDK not loaded yet. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order from backend
      const response = await axios.post("/api/razorpay/create-payment", {
        amount,
        bookingId,
      });

      const order = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key only
        amount: order.amount,
        currency: order.currency,
        name: "Sahayak",
        description: `Payment for booking #${bookingId}`,
        order_id: order.id,
        callback_url: `http://localhost:3000/api/razorpay/verify-payment`,
        prefill: {
          name: user?.name || "Guest User",
          email: user?.email || "guest@example.com",
          contact: user?.contact || "9999999999",
        },
        theme: {
          color: "#16a34a", // green accent
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong while initiating payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        disabled={loading}
        onClick={handlePayment}
        className={`w-full px-4 py-2 ${
          loading
            ? "cursor-progress bg-green-500"
            : "bg-green-500 hover:bg-green-600"
        } text-white rounded-lg transition-colors flex items-center justify-center space-x-2`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Pay ₹{amount}</span>
          </>
        )}
      </Button>

      {/* Razorpay SDK Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
};

export default Payment;