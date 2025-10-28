"use client";

import ServiceDetails from "@/components/custom/ServiceDetails";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

const BookServicePage = () => {
  const params = useParams();
  const providerId = params.providerId as string;
  const serviceId = params.serviceId as string;

  useEffect(() => {
    console.log("Provider ID:", providerId);
    console.log("Service ID:", serviceId);
  }, [providerId, serviceId]);

  if (!serviceId) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] pt-20 px-4">
        {/* Decorative Background Elements - Very Subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#2563EB] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-24 right-20 w-96 h-96 bg-[#14B8A6] rounded-full blur-[120px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="container mx-auto max-w-5xl relative z-10"
        >
          {/* Card Wrapper */}
          <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-6 md:p-8 transition-all duration-500 hover:shadow-lg">
            <ServiceDetails serviceId={serviceId} providerId={providerId} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default BookServicePage;