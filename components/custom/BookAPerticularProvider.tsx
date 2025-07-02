import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BookAPerticularProvider = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16"
        >
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              Choose Your Trusted Provider
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
              Find and book top-rated service providers available in your city.
              Whether it's cleaning, plumbing, or salon services — choose who
              you trust, when you need it.
            </p>
            <p className="text-xs md:text-sm lg:text-base text-gray-500 leading-relaxed">
              Take control of your service experience by selecting a
              professional based on location, ratings, and reviews.
            </p>

            <Link href="/providers">
              <Button className="mt-4 md:mt-6 group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6 rounded-full text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Browse Providers
                <ArrowRight className="ml-2 w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Visual Card */}
          <div className="hidden md:flex w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-3 md:space-y-4 lg:space-y-6">
                <div className="text-3xl md:text-4xl lg:text-5xl">💼✨</div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                  City-Based Experts, Handpicked for You
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed">
                  No more random assignments. Choose the provider you want —
                  trusted, rated, and local.
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-30"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookAPerticularProvider;
