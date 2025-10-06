// @ts-nocheck
import Link from "next/link";
import React, { JSX } from "react";
import { Card, CardContent } from "../ui/card";
import { ArrowRight, Home, Paintbrush, Scissors, Wifi, Wrench } from "lucide-react";

interface Category {
  name: string;
  id: string;
}

interface ServicesCardProps {
  category: Category;
}

const ServicesCard: React.FC<ServicesCardProps> = ({ category }) => {
  const categoryIcons: Record<string, JSX.Element> = {
    cleaning: <Home className="w-6 h-6 md:w-7 md:h-7 text-[#FF7043]" />,
    repair: <Wrench className="w-6 h-6 md:w-7 md:h-7 text-[#FF7043]" />,
    painting: <Paintbrush className="w-6 h-6 md:w-7 md:h-7 text-[#FF7043]" />,
    plumbing: <Wrench className="w-6 h-6 md:w-7 md:h-7 text-[#FF7043]" />,
    electrical: <Wifi className="w-6 h-6 md:w-7 md:h-7 text-[#FF7043]" />,
    beauty: <Scissors className="w-6 h-6 md:w-7 md:h-7 text-[#FF7043]" />,
  };

  return (
    <div>
      <Link href={`/services/${category.name}`}>
        <Card className="hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 rounded-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            {/* Icon with gradient background */}
            <div className="bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] p-5 rounded-full shadow-md flex items-center justify-center">
              {categoryIcons[category.name.toLowerCase()] || (
                <Wrench className="w-8 h-8 md:w-10 md:h-10 text-[#FF7043]" />
              )}
            </div>

            {/* Category name */}
            <div>
              <h3 className="font-nunito font-bold text-lg md:text-xl text-[#212121]">
                {category.name}
              </h3>
              <p className="text-sm md:text-base text-[#757575] mt-1">Book Now</p>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-[#FF7043] mt-1 animate-bounce" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ServicesCard;