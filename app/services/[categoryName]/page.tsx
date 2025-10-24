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
        <style jsx>{`
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
            background: linear-gradient(to right, #EDE7F6 0%, #F8BBD0 50%, #EDE7F6 100%);
            background-size: 1000px 100%;
          }
          
          .font-montserrat {
            font-family: 'Montserrat', sans-serif;
          }
          
          .font-lato {
            font-family: 'Lato', sans-serif;
          }
          
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6]">
          <div className="container mx-auto max-w-7xl px-4 pt-16 md:pt-20 lg:pt-24">
            {/* Loading Header */}
            <div className="mb-6 md:mb-8 lg:mb-12">
              <div className="h-6 md:h-8 lg:h-10 animate-shimmer rounded-lg w-48 md:w-64 lg:w-80 mb-2 md:mb-4"></div>
              <div className="h-4 md:h-5 animate-shimmer rounded-lg w-32 md:w-40 lg:w-48"></div>
            </div>

            {/* Loading Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <Card key={index} className="rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border border-[#F8BBD0]/20">
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
        <style jsx>{`
          .font-montserrat {
            font-family: 'Montserrat', sans-serif;
          }
          
          .font-lato {
            font-family: 'Lato', sans-serif;
          }
          
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
          
          .gradient-coral {
            background: linear-gradient(135deg, #FF6F61 0%, #FF8A65 100%);
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-sm md:max-w-md lg:max-w-lg mx-auto shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm border border-[#F8BBD0]/30">
              <CardHeader className="text-center p-6 md:p-8 lg:p-10 space-y-4">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full gradient-coral flex items-center justify-center shadow-lg mb-4">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold font-montserrat text-[#212121] mb-2 md:mb-4">
                  No Services Found
                </h2>
                <CardDescription className="text-sm md:text-base lg:text-lg text-[#424242] leading-relaxed font-lato">
                  There are currently no services available in this category.
                  Please try browsing other categories or check back later.
                </CardDescription>
                <Link
                  href="/services"
                  className="inline-block mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 rounded-full font-poppins font-semibold
                             gradient-coral text-white text-sm md:text-base hover:scale-105 transition-all duration-300 shadow-lg uppercase tracking-wide"
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
      <style jsx>{`
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .font-lato {
          font-family: 'Lato', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FF6F61 0%, #FF8A65 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6]">
        <div className="container mx-auto max-w-7xl px-4 pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
              <Package className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Available Services</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold font-montserrat gradient-text mb-2 md:mb-4">
              Browse Services
            </h1>
            {categoryName && (
              <p className="text-sm md:text-base lg:text-lg text-[#424242] capitalize font-lato">
                Category:{" "}
                <span className="font-semibold text-[#212121]">
                  {decodeURIComponent(categoryName as string)}
                </span>
              </p>
            )}
            <div className="inline-flex items-center gap-2 text-xs md:text-sm text-[#9E9E9E] mt-2 md:mt-3 px-3 py-1 bg-white/50 rounded-full font-lato">
              <span className="font-medium text-[#FF6F61]">{services.length}</span>
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
              className="inline-flex items-center gap-2 text-sm md:text-base text-[#FF6F61] hover:text-[#FF8A65] font-medium transition-colors duration-300 font-poppins px-4 py-2 rounded-full hover:bg-white/50"
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