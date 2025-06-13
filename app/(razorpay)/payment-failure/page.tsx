import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 px-4">
      <XCircle className="w-16 h-16 text-red-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
      <p className="mb-6 text-center">
        Oops! Something went wrong while verifying your payment.
      </p>
      <Link href="/">
        <Button className="bg-red-600 hover:bg-red-700 text-white px-6">
          Try Again
        </Button>
      </Link>
    </div>
  );
};

export default page;
