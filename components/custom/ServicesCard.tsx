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
          transform: scale(1.03);
          box-shadow: 0 20px 40px rgba(255, 111, 97, 0.2);
        }
        
        .gradient-coral {
          background: linear-gradient(135deg, #FF6F61 0%, #FF8A65 100%);
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
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
          <Card className="card-hover transition-all duration-300 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#F8BBD0]/20 group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              {/* Icon with gradient background */}
              <div className="gradient-coral p-5 rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.name.toLowerCase()] || (
                  <Wrench className="w-8 h-8 md:w-10 md:h-10 text-white" />
                )}
              </div>

              {/* Category name */}
              <div>
                <h3 className="font-montserrat font-semibold text-lg md:text-xl text-[#212121] group-hover:text-[#FF6F61] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base text-[#9E9E9E] mt-1 font-poppins uppercase text-xs tracking-wide">
                  Book Now
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="arrow-slide w-5 h-5 md:w-6 md:h-6 text-[#26C6DA] mt-1 group-hover:text-[#FF6F61] transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default ServicesCard;