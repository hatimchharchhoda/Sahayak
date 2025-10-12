"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ServiceDetails from "@/components/custom/ServiceDetails";

const ServiceDetailsPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  if (!serviceId) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');

        body {
          font-family: 'Lato', sans-serif;
          color: #424242;
          background: linear-gradient(135deg, #EDE7F6, #F8BBD0);
        }

        h1, h2, h3, h4 {
          font-family: 'Montserrat', sans-serif;
          color: #212121;
        }
      `}</style>

      <div className="min-h-screen pt-24 px-4 relative overflow-hidden">
        {/* 🌈 Background with decorative lifestyle blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF6F61] rounded-full blur-[100px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-24 right-20 w-96 h-96 bg-[#26C6DA] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF8A65] rounded-full blur-[200px] opacity-10"></div>
        </div>

        {/* ✨ Page Transition Animation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="container mx-auto max-w-5xl relative z-10"
        >
          {/* 🪄 Glass Card Wrapper for Detail Section */}
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/40 p-8 md:p-12 animate-fadeInUp">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-semibold font-[Montserrat] text-[#212121]"
              >
                Explore Service Details
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#616161] font-[Nunito Sans] mt-2"
              >
                Your personalized service experience — clear, friendly, and easy to explore.
              </motion.p>
            </div>

            {/* 🔍 Service Details Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ServiceDetails serviceId={serviceId} />
            </motion.div>
          </div>
        </motion.div>

        {/* 🌊 Subtle Wave Divider at Bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="w-full h-32"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#waveGradient)"
              d="M0,192L48,165.3C96,139,192,85,288,69.3C384,53,480,75,576,96C672,117,768,139,864,149.3C960,160,1056,160,1152,160C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF6F61" />
                <stop offset="1" stopColor="#FF8A65" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeInUp {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ServiceDetailsPage;