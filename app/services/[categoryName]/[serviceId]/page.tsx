"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ServiceDetails from "@/components/custom/ServiceDetails";

const ServiceDetailsPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  if (!serviceId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl"
      >
        <ServiceDetails serviceId={serviceId} />
      </motion.div>
    </div>
  );
};

export default ServiceDetailsPage;