// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import ServiceCard from "@/components/custom/ServiceCard";
import Link from "next/link";

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
              <ServiceCard service={service} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceListPage;
