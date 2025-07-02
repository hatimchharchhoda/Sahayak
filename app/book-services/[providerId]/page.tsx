"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ServiceCard from "@/components/custom/ServiceCard";
import { Service } from "@/app/services/[categoryName]/page";

const ProviderServicesPage = () => {
  const { providerId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderServices = async () => {
      try {
        const res = await axios.post("/api/provider-services", {
          providerId,
        });
        setServices(res.data.services.map((item: any) => item.Service));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderServices();
    }
  }, [providerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Services Offered by Provider
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">
            No services found for this provider.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/book-services/${providerId}/${service.id}`}
              >
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderServicesPage;
