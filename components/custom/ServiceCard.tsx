// components/custom/ServiceCard.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { MapPin, Star, Clock, ArrowRight, IndianRupee } from "lucide-react";
import { Service } from "@/app/services/[categoryName]/page";

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Card className="h-full rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border-0 bg-white cursor-pointer">
      <CardHeader className="space-y-4 p-5">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-nunito font-bold text-[#212121] leading-snug transition-colors duration-200 hover:text-[#FF7043]">
            {service.name}
          </h2>
          <CardDescription className="line-clamp-2 text-sm md:text-base text-[#757575] font-lato">
            {service.description}
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="flex items-center gap-1 bg-[#FFE0B2] px-3 py-1.5 rounded-full text-xs md:text-sm font-poppins text-[#FF7043]">
            <MapPin className="w-4 h-4 text-[#FF7043]" />
            {service.categoryName}
          </span>
          <span className="flex items-center gap-1 bg-[#FFF3E0] px-3 py-1.5 rounded-full text-xs md:text-sm font-poppins text-[#FFD54F]">
            <Star className="w-4 h-4 text-[#FFD54F]" />
            4.8 (120+)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#81C784]" />
            <div>
              <p className="font-semibold text-[#212121] text-sm md:text-base">
                Starting from ₹{service.basePrice}
              </p>
              <p className="text-xs md:text-sm text-[#81C784] font-lato">Best value</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[#FF7043] font-poppins text-sm md:text-base">
            Book now <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm text-[#757575] mt-2">
          <Clock className="w-4 h-4 text-[#FFAB91]" />
          <span>Available today</span>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ServiceCard;