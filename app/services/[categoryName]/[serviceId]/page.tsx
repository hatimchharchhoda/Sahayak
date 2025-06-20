"use client";

import React from "react";
import { useParams } from "next/navigation";

import ServiceDetails from "@/components/custom/ServiceDetails";

const ServiceDetailsPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  if (!serviceId) return;

  return <ServiceDetails serviceId={serviceId} />;
};

export default ServiceDetailsPage;
