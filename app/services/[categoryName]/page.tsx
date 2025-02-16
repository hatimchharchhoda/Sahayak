"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { MapPin, Star, Clock, ArrowRight, IndianRupee } from "lucide-react";
import Link from "next/link";

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  basePrice: number;
}

const ServiceListPage = () => {
  const { categoryName } = useParams();
  console.log(categoryName);
  console.log(categoryName);
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
        <div className="container mx-auto max-w-6xl px-4 pt-24">
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">
              No Services Found
            </h2>
            <CardDescription>
              There are currently no services available in this category.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Available Services
        </h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {services.map((service) => (
            <Link
              href={`/services/${categoryName}/${service.id}`}
              key={service.id}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h2>
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center text-gray-600 gap-4">
                    <span className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">
                        {service.categoryName}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-700">
                        4.8 (120+ reviews)
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-700">
                          Starting from ${service.basePrice}
                        </p>
                        <p className="text-sm text-green-600">Best value</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                      Book now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Available today</span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceListPage;
