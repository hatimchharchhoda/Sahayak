// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Star, MapPin } from "lucide-react";

const BookAPerticularProvider = () => {
  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
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
        
        .font-nunito {
          font-family: 'Nunito Sans', sans-serif;
        }
      `}</style>

      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] relative overflow-hidden">
        {/* Decorative Background Elements - Very Subtle */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#2563EB] blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#14B8A6] blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16"
          >
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E5E7EB] mb-2 shadow-sm">
                <Users className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Direct Booking</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-inter font-semibold text-[#111827]">
                Choose Your
                <br />
                <span className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">
                  Trusted Provider
                </span>
              </h2>

              <p className="text-sm md:text-base lg:text-lg text-[#374151] leading-relaxed font-poppins">
                Find and book top-rated service providers available in your city.
                Whether it&apos;s cleaning, plumbing, or salon services — choose who
                you trust, when you need it.
              </p>

              <p className="text-xs md:text-sm lg:text-base text-[#9CA3AF] leading-relaxed font-nunito">
                Take control of your service experience by selecting a
                professional based on location, ratings, and reviews.
              </p>

              <Link href="/browse-providers">
                <Button className="mt-4 md:mt-6 group gradient-blue text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6 rounded-lg text-sm md:text-base lg:text-lg font-inter font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] uppercase tracking-wide">
                  Browse Providers
                  <ArrowRight className="ml-2 w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Right Content - Visual Card */}
            <div className="hidden md:flex w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#E5E7EB]"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10 text-center space-y-3 md:space-y-4 lg:space-y-6">
                  <div className="flex justify-center items-center gap-3 text-4xl md:text-5xl lg:text-6xl floating">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl gradient-blue flex items-center justify-center shadow-sm">
                      <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl lg:text-2xl font-inter font-semibold text-[#111827]">
                    City-Based Experts,
                    <br />
                    Handpicked for You
                  </h3>

                  <p className="text-xs md:text-sm lg:text-base text-[#374151] leading-relaxed font-poppins">
                    No more random assignments. Choose the provider you want —
                    trusted, rated, and local.
                  </p>

                  {/* Feature Icons */}
                  <div className="flex justify-center gap-4 pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                        <Star className="w-5 h-5 text-[#F59E0B]" />
                      </div>
                      <span className="text-xs font-poppins text-[#374151]">Top Rated</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-[#2563EB]" />
                      </div>
                      <span className="text-xs font-poppins text-[#374151]">Local</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                        <Users className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <span className="text-xs font-poppins text-[#374151]">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements - Very Subtle */}
                <div className="absolute -top-4 -right-4 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 bg-[#2563EB]/5 rounded-full pulse-glow"></div>
                <div className="absolute -bottom-4 -left-4 w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 bg-[#14B8A6]/5 rounded-full pulse-glow" style={{animationDelay: '1s'}}></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BookAPerticularProvider;