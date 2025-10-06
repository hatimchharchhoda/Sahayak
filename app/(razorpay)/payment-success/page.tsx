import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-[#E0F7FA] to-[#80DEEA] 
      text-[#212121] px-4 animate-fadeInSlide">
      
      {/* Success Icon */}
      <CheckCircle className="w-20 h-20 text-[#43A047] mb-6 animate-bounce-slow" />

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-semibold font-[Poppins] text-[#212121] mb-3">
        Payment Successful!
      </h1>

      {/* Subtext */}
      <p className="text-[#616161] text-center font-[Nunito Sans] mb-8 max-w-md">
        Thank you for your payment. Your transaction has been completed successfully.
      </p>

      {/* CTA Button */}
      <Link href="/">
        <Button
          className="px-8 py-3 rounded-xl font-[Poppins] font-bold uppercase
          bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-white
          shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          Go to Home
        </Button>
      </Link>
    </div>
  );
}

export default page;