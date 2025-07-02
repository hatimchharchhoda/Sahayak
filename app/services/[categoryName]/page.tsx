// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import ServiceCard from "@/components/custom/ServiceCard";
import Link from "next/link";
import { motion } from "framer-motion";

export interface Service {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  basePrice: number;
}

const ServiceListPage = () => {
  const { categoryName } = useParams();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await axios.post("/api/service", { categoryName });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-7xl px-4 pt-16 md:pt-20 lg:pt-24">
          {/* Loading Header */}
          <div className="mb-6 md:mb-8 lg:mb-12">
            <div className="h-6 md:h-8 lg:h-10 bg-gray-200 rounded w-48 md:w-64 lg:w-80 animate-pulse mb-2 md:mb-4"></div>
            <div className="h-4 md:h-5 bg-gray-200 rounded w-32 md:w-40 lg:w-48 animate-pulse"></div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="space-y-3 md:space-y-4 p-4 md:p-6">
                  <div className="h-5 md:h-6 lg:h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-12 md:h-16 lg:h-20 bg-gray-200 rounded"></div>
                  <div className="h-8 md:h-10 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-sm md:max-w-md lg:max-w-lg mx-auto shadow-xl">
            <CardHeader className="text-center p-6 md:p-8 lg:p-10">
              <div className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6">
                🔍
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                No Services Found
              </h2>
              <CardDescription className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                There are currently no services available in this category.
                Please try browsing other categories or check back later.
              </CardDescription>
              <Link
                href="/services"
                className="inline-block mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm md:text-base rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                Browse All Services
              </Link>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-7xl px-4 pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 lg:mb-12"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 md:mb-4">
            Available Services
          </h1>
          {categoryName && (
            <p className="text-sm md:text-base lg:text-lg text-gray-600 capitalize">
              Showing services in:{" "}
              <span className="font-semibold text-gray-800">
                {decodeURIComponent(categoryName as string)}
              </span>
            </p>
          )}
          <div className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
            {services.length} service{services.length !== 1 ? "s" : ""} found
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
            className="inline-flex items-center text-sm md:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
          >
            ← Back to All Services
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceListPage;
