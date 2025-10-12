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
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .font-lato {
          font-family: 'Lato', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .card-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 20px 40px rgba(255, 111, 97, 0.2);
        }
        
        @keyframes slideRight {
          0%, 100% {
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

      <Card className="h-full rounded-2xl shadow-lg transition-all duration-300 card-hover border border-[#F8BBD0]/20 bg-white/90 backdrop-blur-sm cursor-pointer group">
        <CardHeader className="space-y-4 p-5">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-montserrat font-semibold text-[#212121] leading-snug transition-colors duration-200 group-hover:text-[#FF6F61]">
              {service.name}
            </h2>
            <CardDescription className="line-clamp-2 text-sm md:text-base text-[#424242] font-lato">
              {service.description}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className="flex items-center gap-1 bg-gradient-to-r from-[#EDE7F6] to-[#F8BBD0] px-3 py-1.5 rounded-full text-xs md:text-sm font-poppins text-[#FF6F61] font-medium">
              <MapPin className="w-4 h-4 text-[#FF6F61]" />
              {service.categoryName}
            </span>
            <span className="flex items-center gap-1 bg-gradient-to-r from-[#FFF9C4] to-[#FFF59D] px-3 py-1.5 rounded-full text-xs md:text-sm font-poppins text-[#F57C00] font-medium">
              <Star className="w-4 h-4 text-[#FFCA28]" />
              4.8 (120+)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#66BB6A] to-[#81C784] flex items-center justify-center shadow-md">
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#212121] text-sm md:text-base font-poppins">
                  From ₹{service.basePrice}
                </p>
                <p className="text-xs md:text-sm text-[#66BB6A] font-lato">Best value</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[#26C6DA] font-poppins text-sm md:text-base font-medium group-hover:text-[#FF6F61] transition-colors">
              Book now <ArrowRight className="arrow-slide w-4 h-4" />
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-[#9E9E9E] mt-2 font-lato">
            <Clock className="w-4 h-4 text-[#FF8A65]" />
            <span>Available today</span>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default ServiceCard;