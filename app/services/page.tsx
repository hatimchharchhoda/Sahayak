// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ServicesCard from "@/components/custom/ServicesCard";
import Loading from "@/components/custom/loading";
import { MapPin, Sparkles } from "lucide-react";

const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
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

      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] pt-20 relative overflow-hidden">
        {/* Decorative Background Elements - Very Subtle */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#2563EB] blur-3xl floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#14B8A6] blur-3xl floating" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-[#3B82F6] blur-2xl floating" style={{animationDelay: '0.5s'}}></div>
        </div>

        <section className="py-16 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            {/* Page Heading */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-[#E5E7EB]">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Explore Services</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-inter font-semibold text-[#111827] mb-4">
                Our <span className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">Services</span>
              </h1>
              
              <p className="text-base md:text-lg text-[#374151] font-poppins max-w-2xl mx-auto">
                Choose from a wide range of professional services tailored to your lifestyle needs
              </p>
            </motion.div>

            {/* Services Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {categories.map((category: unknown, index: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServicesCard key={category.id} category={category} />
                </motion.div>
              ))}
            </motion.div>

            {/* Call-to-Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 flex justify-center"
            >
              <Link href="/browse-providers">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-8 py-4 rounded-lg text-white font-inter font-medium text-lg
                             gradient-blue shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300
                             uppercase tracking-wide inline-flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Find Services Near You
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;