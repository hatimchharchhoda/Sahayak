/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ServiceCard from "@/components/custom/ServiceCard";
import { Service } from "@/app/services/[categoryName]/page";
import { Sparkles, Package } from "lucide-react";

const ProviderServicesPage = () => {
  const { providerId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviderServicesWithRatings = async () => {
      if (!providerId) return;

      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Fetch provider services
        const servicesRes = await axios.post("/api/provider-services", { 
          providerId 
        });
        const providerServices = servicesRes.data.services.map((item: any) => item.Service);

        if (providerServices.length === 0) {
          setServices([]);
          return;
        }

        // 2️⃣ Fetch provider-specific ratings
        const ratingsRes = await axios.post("/api/getProviderServiceRatings", { 
          providerId 
        });
        const ratingsData: { 
          serviceId: string; 
          averageRating: string; 
          totalReviews: number 
        }[] = ratingsRes.data;

        // 3️⃣ Merge ratings into services
        const servicesWithRatings = providerServices.map((service: any) => {
          const review = ratingsData.find((r) => r.serviceId === service.id);
          return {
            ...service,
            averageRating: review ? review.averageRating : "0.0",
            totalReviews: review ? review.totalReviews : 0,
          };
        });

        setServices(servicesWithRatings);
      } catch (error) {
        console.error("Error fetching services with ratings:", error);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderServicesWithRatings();
  }, [providerId]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, #F8FAFC 0%, #E5E7EB 50%, #F8FAFC 100%);
          background-size: 1000px 100%;
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
      `}</style>

      <section className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] font-poppins relative overflow-hidden">
        {/* Decorative Background Elements - Very Subtle */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#2563EB] blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#14B8A6] blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16 relative z-10">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-[#E5E7EB]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Provider Services</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-inter font-semibold text-[#111827] mb-4">
              Services Offered by
              <br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">
                This Provider
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#374151] font-poppins max-w-2xl mx-auto">
              Browse available services and book directly with this professional
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-6 mb-8 animate-fade-slide-up">
              <p className="text-[#EF4444] text-center font-poppins">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-6"
                >
                  <div className="w-16 h-16 rounded-lg animate-shimmer mb-4"></div>
                  <div className="h-6 animate-shimmer rounded mb-2"></div>
                  <div className="h-4 animate-shimmer rounded w-3/4 mb-4"></div>
                  <div className="h-10 animate-shimmer rounded"></div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center py-12 bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-12 animate-fade-slide-up">
              <div className="w-20 h-20 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-[#9CA3AF]" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-[#111827] mb-2">
                No Services Available
              </h3>
              <p className="text-[#374151] text-base font-poppins text-center max-w-md">
                This provider hasn&apos;t added any services yet. Please check back later or explore other providers.
              </p>
            </div>
          ) : (
            <>
              {/* Service Count Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#E5E7EB]">
                  <span className="font-inter font-medium text-[#2563EB]">{services.length}</span>
                  <span className="text-sm text-[#374151] font-poppins">
                    {services.length === 1 ? 'Service' : 'Services'} Available
                  </span>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="animate-fade-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      href={`/book-services/${providerId}/${service.id}`}
                      className="block h-full"
                    >
                      <ServiceCard service={service} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ProviderServicesPage;