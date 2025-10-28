// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    cleaning: <Home className="w-6 h-6 md:w-7 md:h-7 text-white" />,
    repair: <Wrench className="w-6 h-6 md:w-7 md:h-7 text-white" />,
    painting: <Paintbrush className="w-6 h-6 md:w-7 md:h-7 text-white" />,
    plumbing: <Wrench className="w-6 h-6 md:w-7 md:h-7 text-white" />,
    electrical: <Wifi className="w-6 h-6 md:w-7 md:h-7 text-white" />,
    beauty: <Scissors className="w-6 h-6 md:w-7 md:h-7 text-white" />,
  };

  return (
    <>
      <style jsx>{`
        .card-hover:hover {
          transform: scale(1.02) translateY(-4px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
        }
        
        .gradient-blue {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
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

      <div>
        <Link href={`/services/${category.name}`}>
          <Card className="card-hover transition-all duration-300 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#14B8A6]/30 group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              {/* Icon with gradient background */}
              <div className="gradient-blue p-5 rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                {categoryIcons[category.name.toLowerCase()] || (
                  <Wrench className="w-8 h-8 md:w-10 md:h-10 text-white" />
                )}
              </div>

              {/* Category name */}
              <div>
                <h3 className="font-inter font-semibold text-lg md:text-xl text-[#111827] group-hover:text-[#2563EB] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base text-[#9CA3AF] mt-1 font-poppins uppercase text-xs tracking-wide">
                  Book Now
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="arrow-slide w-5 h-5 md:w-6 md:h-6 text-[#14B8A6] mt-1 group-hover:text-[#2563EB] transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default ServicesCard;