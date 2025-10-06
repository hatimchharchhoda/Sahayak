// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";
import ServicesCard from "./ServicesCard";
import { Category } from "@/lib/types";

interface OurServicesProps {
  categories: Category[];
  loading: boolean;
}

const OurServices: React.FC<OurServicesProps> = ({ categories, loading }) => {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-br from-[#FFE0B2]/20 via-[#FFAB91]/20 to-[#E1BEE7]/20">
      <div className="container mx-auto max-w-6xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-nunito font-bold text-[#212121] mb-2 md:mb-4">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-[#757575] font-lato">
            Explore verified professionals for your home, lifestyle, and wellness needs.
          </p>
        </motion.div>

        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white/80 p-4 md:p-6 rounded-2xl shadow-lg animate-pulse"
              >
                <div className="w-full h-32 md:h-40 lg:h-48 bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] rounded-xl mb-3 md:mb-4"></div>
                <div className="h-4 md:h-5 lg:h-6 bg-[#BDBDBD] rounded mb-2 md:mb-3"></div>
                <div className="h-3 md:h-4 bg-[#BDBDBD] rounded w-3/4"></div>
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
                  className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurServices;