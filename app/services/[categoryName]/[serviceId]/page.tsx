"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ServiceDetails from "@/components/custom/ServiceDetails";

const ServiceDetailsPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  if (!serviceId) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');

        body {
          font-family: 'Poppins', sans-serif;
          color: #374151;
          background: linear-gradient(135deg, #F8FAFC, #FFFFFF);
        }

        h1, h2, h3, h4 {
          font-family: 'Inter', sans-serif;
          color: #111827;
        }
      `}</style>

      <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] relative overflow-hidden">
        {/* Background with decorative blobs - Very Subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#2563EB] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-24 right-20 w-96 h-96 bg-[#14B8A6] rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B82F6] rounded-full blur-[200px]"></div>
        </div>

        {/* Page Transition Animation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="container mx-auto max-w-5xl relative z-10"
        >
          {/* Card Wrapper for Detail Section */}
          <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-8 md:p-12 transition-all duration-500 hover:shadow-lg">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-semibold font-inter text-[#111827]"
              >
                Service Details
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#9CA3AF] font-nunito mt-2"
              >
                Everything you need to know about this service — clear, detailed, and transparent.
              </motion.p>
            </div>

            {/* Service Details Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ServiceDetails serviceId={serviceId} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ServiceDetailsPage;