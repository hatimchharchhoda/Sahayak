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
    <section className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] font-lato">
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <h1 className="text-4xl md:text-5xl font-nunito font-bold text-[#212121] mb-12 text-center">
          Services Offered by Provider
        </h1>

        {loading ? (
          <div className="flex flex-col items-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full animate-pulse bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7]" />
            <p className="text-[#757575]">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center py-12 bg-white rounded-2xl shadow-lg border border-[#FFE0B2] p-12">
            <p className="text-[#757575] text-lg">
              No services found for this provider.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/book-services/${providerId}/${service.id}`}
                className="group transform transition-all hover:scale-105"
              >
                <div className="bg-gradient-to-br from-[#FFF0E5] to-[#FFE0B2] rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300">
                  <ServiceCard service={service} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProviderServicesPage;