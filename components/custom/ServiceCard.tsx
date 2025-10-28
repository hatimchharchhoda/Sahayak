// components/custom/ServiceCard.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { MapPin, Star, Clock, ArrowRight, IndianRupee } from "lucide-react";
import { Service } from "@/app/services/[categoryName]/page";

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <>
      <style jsx>{`
        .font-inter {
          font-family: "Inter", sans-serif;
        }

        .font-poppins {
          font-family: "Poppins", sans-serif;
        }

        .font-nunito {
          font-family: "Nunito Sans", sans-serif;
        }

        .card-hover:hover {
          transform: scale(1.02) translateY(-4px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
        }

        @keyframes slideRight {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }

        .card-hover:hover .arrow-slide {
          animation: slideRight 0.6s ease-in-out infinite;
        }
      `}</style>

      <Card className="h-full rounded-2xl shadow-md transition-all duration-300 card-hover border border-[#E5E7EB] hover:border-[#14B8A6]/30 bg-white cursor-pointer group">
        <CardHeader className="space-y-4 p-5">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-inter font-semibold text-[#111827] leading-snug transition-colors duration-200 group-hover:text-[#2563EB]">
              {service.name}
            </h2>
            <CardDescription className="line-clamp-2 text-sm md:text-base text-[#374151] font-poppins">
              {service.description}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-xs md:text-sm font-poppins text-[#374151] font-medium">
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              {service.categoryName}
            </span>
            <span className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1.5 rounded-lg text-xs md:text-sm font-poppins text-[#374151] font-medium">
              <Star className="w-4 h-4 text-[#F59E0B]" />
              {service.averageRating} ({service.totalReviews})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#111827] text-sm md:text-base font-poppins">
                  From ₹{service.basePrice}
                </p>
                <p className="text-xs md:text-sm text-[#10B981] font-nunito">
                  Best value
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[#14B8A6] font-poppins text-sm md:text-base font-medium group-hover:text-[#2563EB] transition-colors">
              Book now <ArrowRight className="arrow-slide w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-[#9CA3AF] mt-2 font-poppins">
            <Clock className="w-4 h-4 text-[#14B8A6]" />
            <span>Available today</span>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default ServiceCard;
