// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";
import ServicesCard from "./ServicesCard";
import { Category } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface OurServicesProps {
  categories: Category[];
  loading: boolean;
}

const OurServices: React.FC<OurServicesProps> = ({ categories, loading }) => {
  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, #EDE7F6 0%, #F8BBD0 50%, #EDE7F6 100%);
          background-size: 1000px 100%;
        }
        
        .card-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 20px 40px rgba(255, 111, 97, 0.2);
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .font-lato {
          font-family: 'Lato', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <section className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] relative">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#FF6F61] blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-[#26C6DA] blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
              <Sparkles className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Popular Services</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-semibold text-[#212121] mb-2 md:mb-4">
              Our Services
            </h2>
            <p className="text-base md:text-lg text-[#424242] font-lato max-w-2xl mx-auto">
              Explore verified professionals for your home, lifestyle, and wellness needs.
            </p>
          </motion.div>

          {loading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-[#F8BBD0]/20"
                >
                  <div className="w-full h-32 md:h-40 lg:h-48 animate-shimmer rounded-xl mb-3 md:mb-4"></div>
                  <div className="h-4 md:h-5 lg:h-6 animate-shimmer rounded mb-2 md:mb-3"></div>
                  <div className="h-3 md:h-4 animate-shimmer rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Services Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {categories.map((category: Category, index: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServicesCard
                    category={category}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 card-hover transition-all duration-300 border border-[#F8BBD0]/20"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default OurServices;