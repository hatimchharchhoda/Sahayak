"use client";

import Link from "next/link";
import React from "react";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { MapPin, Star, Clock, ArrowRight, IndianRupee } from "lucide-react";
import { Service } from "@/app/services/[categoryName]/page";
import { useParams } from "next/navigation";

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <div>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 shadow-md">
        <CardHeader className="space-y-3 md:space-y-4 p-4 md:p-6">
          {/* Service Title and Description */}
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
              {service.name}
            </h2>
            <CardDescription className="line-clamp-2 text-sm md:text-base text-gray-600 leading-relaxed">
              {service.description}
            </CardDescription>
          </div>

          {/* Category and Rating Badges */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center text-gray-600 gap-2 md:gap-3">
            <span className="flex items-center gap-1 bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm">
              <MapPin className="w-3 md:w-4 h-3 md:h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">
                {service.categoryName}
              </span>
            </span>
            <span className="flex items-center gap-1 bg-yellow-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm">
              <Star className="w-3 md:w-4 h-3 md:h-4 text-yellow-500" />
              <span className="text-yellow-700 font-medium">4.8 (120+)</span>
            </span>
          </div>

          {/* Pricing Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 gap-3 sm:gap-2">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 md:w-5 h-4 md:h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-700 text-sm md:text-base">
                  Starting from ₹{service.basePrice}
                </p>
                <p className="text-xs md:text-sm text-green-600">Best value</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-blue-600 font-medium text-sm md:text-base self-start sm:self-center">
              Book now
              <ArrowRight className="w-3 md:w-4 h-3 md:h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <Clock className="w-3 md:w-4 h-3 md:h-4" />
            <span>Available today</span>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ServiceCard;
