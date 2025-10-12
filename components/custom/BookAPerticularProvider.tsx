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
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .btn-bounce:hover {
          animation: bounce 0.6s ease-in-out;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        .gradient-coral {
          background: linear-gradient(135deg, #FF6F61 0%, #FF8A65 100%);
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

      <section className="py-12 md:py-20 px-4 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#FF6F61] blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#26C6DA] blur-3xl"></div>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EDE7F6] to-[#F8BBD0] rounded-full mb-2">
                <Users className="w-4 h-4 text-[#FF6F61]" />
                <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Direct Booking</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-semibold text-[#212121]">
                Choose Your
                <br />
                <span className="bg-gradient-to-r from-[#FF6F61] via-[#FF8A65] to-[#FF6F61] bg-clip-text text-transparent">
                  Trusted Provider
                </span>
              </h2>

              <p className="text-sm md:text-base lg:text-lg text-[#424242] leading-relaxed font-lato">
                Find and book top-rated service providers available in your city.
                Whether it's cleaning, plumbing, or salon services — choose who
                you trust, when you need it.
              </p>

              <p className="text-xs md:text-sm lg:text-base text-[#9E9E9E] leading-relaxed font-lato">
                Take control of your service experience by selecting a
                professional based on location, ratings, and reviews.
              </p>

              <Link href="/browse-providers">
                <Button className="mt-4 md:mt-6 group gradient-coral text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6 rounded-full text-sm md:text-base lg:text-lg font-poppins font-semibold transition-all duration-300 hover:shadow-xl btn-bounce uppercase tracking-wide">
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
                className="relative bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden border border-[#F8BBD0]/30"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10 text-center space-y-3 md:space-y-4 lg:space-y-6">
                  <div className="flex justify-center items-center gap-3 text-4xl md:text-5xl lg:text-6xl floating">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full gradient-coral flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl lg:text-2xl font-montserrat font-semibold text-[#212121]">
                    City-Based Experts,
                    <br />
                    Handpicked for You
                  </h3>

                  <p className="text-xs md:text-sm lg:text-base text-[#424242] leading-relaxed font-lato">
                    No more random assignments. Choose the provider you want —
                    trusted, rated, and local.
                  </p>

                  {/* Feature Icons */}
                  <div className="flex justify-center gap-4 pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                        <Star className="w-5 h-5 text-[#FFCA28]" />
                      </div>
                      <span className="text-xs font-poppins text-[#424242]">Top Rated</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                        <MapPin className="w-5 h-5 text-[#FF6F61]" />
                      </div>
                      <span className="text-xs font-poppins text-[#424242]">Local</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                        <Users className="w-5 h-5 text-[#26C6DA]" />
                      </div>
                      <span className="text-xs font-poppins text-[#424242]">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 bg-gradient-to-br from-[#F8BBD0] to-[#EDE7F6] rounded-full pulse-glow"></div>
                <div className="absolute -bottom-4 -left-4 w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 bg-gradient-to-br from-[#EDE7F6] to-[#F8BBD0] rounded-full pulse-glow" style={{animationDelay: '1s'}}></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BookAPerticularProvider;