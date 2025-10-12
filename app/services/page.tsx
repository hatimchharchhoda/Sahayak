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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
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
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] pt-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#FF6F61] blur-3xl floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#26C6DA] blur-3xl floating" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-[#FF8A65] blur-2xl floating" style={{animationDelay: '0.5s'}}></div>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
                <Sparkles className="w-4 h-4 text-[#FF6F61]" />
                <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Explore Services</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-montserrat font-semibold text-[#212121] mb-4">
                Our <span className="bg-gradient-to-r from-[#FF6F61] via-[#FF8A65] to-[#FF6F61] bg-clip-text text-transparent">Services</span>
              </h1>
              
              <p className="text-base md:text-lg text-[#424242] font-lato max-w-2xl mx-auto">
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
              {categories.map((category: any, index: number) => (
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 rounded-full text-white font-poppins font-semibold text-lg
                             gradient-coral shadow-lg overflow-hidden transition-all duration-300 btn-bounce
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