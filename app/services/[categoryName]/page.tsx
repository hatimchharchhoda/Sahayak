// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import ServiceCard from "@/components/custom/ServiceCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Package } from "lucide-react";

export interface Service {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  basePrice: number;
  averageRating: string;
  totalReviews: number;
}

const ServiceListPage = () => {
  const { categoryName } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      // 1️⃣ Fetch services
      const serviceResponse = await axios.post("/api/service", { categoryName });
      const fetchedServices: Service[] = serviceResponse.data;

      // 2️⃣ Fetch reviews from getRating API
      const reviewResponse = await axios.post("/api/getRating", { categoryName });
      const reviewData: { serviceId: string; averageRating: string; totalReviews: number }[] =
        reviewResponse.data;

      // 3️⃣ Merge review data into services
      const mergedServices = fetchedServices.map((service) => {
        const review = reviewData.find((r) => r.serviceId === service.id);
        return {
          ...service,
          averageRating: review ? review.averageRating : "0.0",
          totalReviews: review ? review.totalReviews : 0,
        };
      });

      setServices(mergedServices);
    } catch (error) {
      console.error("Error fetching services or reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [categoryName]);

  if (loading) {
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
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
            background: linear-gradient(to right, #F8FAFC 0%, #E5E7EB 50%, #F8FAFC 100%);
            background-size: 1000px 100%;
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF]">
          <div className="container mx-auto max-w-7xl px-4 pt-16 md:pt-20 lg:pt-24">
            {/* Loading Header */}
            <div className="mb-6 md:mb-8 lg:mb-12">
              <div className="h-6 md:h-8 lg:h-10 animate-shimmer rounded-lg w-48 md:w-64 lg:w-80 mb-2 md:mb-4"></div>
              <div className="h-4 md:h-5 animate-shimmer rounded-lg w-32 md:w-40 lg:w-48"></div>
            </div>

            {/* Loading Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <Card key={index} className="rounded-2xl shadow-md bg-white border border-[#E5E7EB]">
                  <CardHeader className="space-y-3 md:space-y-4 p-4 md:p-6">
                    <div className="h-5 md:h-6 lg:h-8 animate-shimmer rounded"></div>
                    <div className="h-3 md:h-4 animate-shimmer rounded w-1/2"></div>
                    <div className="h-12 md:h-16 lg:h-20 animate-shimmer rounded"></div>
                    <div className="h-8 md:h-10 animate-shimmer rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!services.length) {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
          
          .gradient-blue {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-sm md:max-w-md lg:max-w-lg mx-auto shadow-lg rounded-2xl bg-white border border-[#E5E7EB]">
              <CardHeader className="text-center p-6 md:p-8 lg:p-10 space-y-4">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-xl gradient-blue flex items-center justify-center shadow-sm mb-4">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold font-inter text-[#111827] mb-2 md:mb-4">
                  No Services Found
                </h2>
                <CardDescription className="text-sm md:text-base lg:text-lg text-[#374151] leading-relaxed font-poppins">
                  There are currently no services available in this category.
                  Please try browsing other categories or check back later.
                </CardDescription>
                <Link
                  href="/services"
                  className="inline-block mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 rounded-lg font-inter font-medium
                             gradient-blue text-white text-sm md:text-base hover:scale-[1.02] transition-all duration-300 shadow-sm uppercase tracking-wide"
                >
                  Browse All Services
                </Link>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF]">
        <div className="container mx-auto max-w-7xl px-4 pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-[#E5E7EB]">
              <Package className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Available Services</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold font-inter gradient-text mb-2 md:mb-4">
              Browse Services
            </h1>
            {categoryName && (
              <p className="text-sm md:text-base lg:text-lg text-[#374151] capitalize font-poppins">
                Category:{" "}
                <span className="font-semibold text-[#111827]">
                  {decodeURIComponent(categoryName as string)}
                </span>
              </p>
            )}
            <div className="inline-flex items-center gap-2 text-xs md:text-sm text-[#9CA3AF] mt-2 md:mt-3 px-3 py-1 bg-white rounded-full border border-[#E5E7EB] font-poppins">
              <span className="font-medium text-[#2563EB]">{services.length}</span>
              service{services.length !== 1 ? "s" : ""} found
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/services/${categoryName}/${service.id}`}
                  className="group block h-full"
                >
                  <ServiceCard service={service} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Back to Services Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8 md:mt-12 lg:mt-16"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm md:text-base text-[#2563EB] hover:text-[#14B8A6] font-medium transition-colors duration-300 font-poppins px-4 py-2 rounded-lg hover:bg-white/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Services
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ServiceListPage;