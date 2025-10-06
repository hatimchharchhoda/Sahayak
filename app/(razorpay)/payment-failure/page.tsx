import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-[#FFEBEE] to-[#FFCDD2] 
      text-[#E53935] px-4 animate-fadeInSlide">

      {/* Error Icon */}
      <XCircle className="w-20 h-20 text-[#E53935] mb-6 animate-shake" />

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-semibold font-[Poppins] text-[#212121] mb-3">
        Payment Failed
      </h1>

      {/* Subtext */}
      <p className="text-[#616161] text-center font-[Nunito Sans] mb-8 max-w-md">
        Oops! Something went wrong while verifying your payment. Please try again.
      </p>

      {/* CTA Button */}
      <Link href="/">
        <Button
          className="px-8 py-3 rounded-xl font-[Poppins] font-bold uppercase
          border-2 border-[#FF7043] text-[#FF7043] bg-transparent
          hover:bg-[#FF7043] hover:text-white
          shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Try Again
        </Button>
      </Link>
    </div>
  );
};

export default page;