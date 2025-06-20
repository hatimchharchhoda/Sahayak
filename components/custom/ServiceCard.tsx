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
              <span className="text-blue-700">{service.categoryName}</span>
            </span>
            <span className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-700">4.8 (120+ reviews)</span>
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
    </div>
  );
};

export default ServiceCard;
