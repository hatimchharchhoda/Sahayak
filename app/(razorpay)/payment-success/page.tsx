import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-700 px-4">
      <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="mb-6 text-center">
        Thank you for your payment. Your transaction has been completed.
      </p>
      <Link href="/">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}

export default page;
