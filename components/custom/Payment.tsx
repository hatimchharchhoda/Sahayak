"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IndianRupee, Loader2 } from "lucide-react";
import axios from "axios";
import Script from "next/script";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
      const response = await axios.post("/api/razorpay/create-payment", {
        amount,
        bookingId,
      });

      const order = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
          color: "#FF6F61", // coral accent for premium look
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Button
        disabled={loading}
        onClick={handlePayment}
        className={`w-full px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 font-poppins font-medium uppercase text-white shadow-lg transition-all duration-300 ${
          loading
            ? "cursor-progress bg-gradient-to-r from-[#FF6F61]/70 to-[#FF8A65]/70"
            : "bg-gradient-to-r from-[#FF6F61] to-[#FF8A65] hover:scale-105 hover:shadow-xl"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <IndianRupee className="h-5 w-5" />
            <span>Pay ₹{amount}</span>
          </>
        )}
      </Button>

      {/* Razorpay SDK Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </motion.div>
  );
};

export default Payment;