"use client";

import ServiceDetails from "@/components/custom/ServiceDetails";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const BookServicePage = () => {
  const params = useParams();
  const providerId = params.providerId as string;
  const serviceId = params.serviceId as string;

  useEffect(() => {
    console.log("Provider ID:", providerId);
    console.log("Service ID:", serviceId);
  }, [providerId, serviceId]);

  if (!serviceId) return;

  return <ServiceDetails serviceId={serviceId} providerId={providerId} />;
};

export default BookServicePage;
