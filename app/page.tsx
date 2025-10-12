// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, ArrowRight, X, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import type React from "react";
import axios from "axios";
import OurServices from "@/components/custom/OurServices";
import { Category } from "@/lib/types";
import BookAPerticularProvider from "@/components/custom/BookAPerticularProvider";

interface SearchResult {
  id: string;
  name: string;
  description?: string;
}

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const filteredResults = categories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, #EDE7F6 0%, #F8BBD0 50%, #EDE7F6 100%);
          background-size: 1000px 100%;
        }
        
        .btn-bounce:hover {
          animation: bounce 0.6s ease-in-out;
        }
        
        .card-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 20px 40px rgba(255, 111, 97, 0.2);
        }
        
        .gradient-coral {
          background: linear-gradient(135deg, #FF6F61 0%, #FF8A65 100%);
        }
        
        .gradient-teal {
          background: linear-gradient(135deg, #26C6DA 0%, #00ACC1 100%);
        }
        
        .wave-divider {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        
        .wave-divider svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 60px;
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
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
        
        .font-nunito {
          font-family: 'Nunito Sans', sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6]">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EDE7F6]/30 via-[#F8BBD0]/30 to-[#EDE7F6]/30"></div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#F8BBD0]/40 to-[#EDE7F6]/40 blur-2xl floating"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#EDE7F6]/40 to-[#F8BBD0]/40 blur-3xl floating" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8A65]/30 to-[#F8BBD0]/30 blur-xl floating" style={{animationDelay: '0.5s'}}></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 md:space-y-8 mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
                <Sparkles className="w-4 h-4 text-[#FF6F61]" />
                <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Your Trusted Service Partner</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-semibold text-[#212121] leading-tight">
                Lifestyle Services,
                <br />
                <span className="bg-gradient-to-r from-[#FF6F61] via-[#FF8A65] to-[#FF6F61] bg-clip-text text-transparent">
                  Delivered with Care
                </span>
              </h1>
              
              <p className="text-lg md:text-2xl text-[#424242] max-w-xl md:max-w-2xl mx-auto font-lato font-light">
                Connect with professional service providers for all your lifestyle needs
              </p>

              <div className="max-w-xl md:max-w-2xl mx-auto relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9E9E9E] pointer-events-none">
                      <Search className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <Input
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search for services (Cleaning, Plumbing...)"
                      className="h-12 md:h-14 text-base md:text-lg rounded-full pl-14 pr-12 md:pr-14 placeholder-[#9E9E9E] focus:border-[#26C6DA] focus:ring-[#26C6DA] shadow-lg bg-white border-2 border-transparent font-lato transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#424242] z-40 transition-colors"
                      >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="h-12 md:h-14 px-6 md:px-8 rounded-full gradient-coral text-white hover:shadow-xl transition-all duration-300 btn-bounce font-poppins font-medium uppercase tracking-wide"
                  >
                    <Search className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </form>

                {/* Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#F8BBD0] overflow-hidden z-50"
                    >
                      <div className="max-h-48 md:max-h-64 overflow-y-auto">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/services/${result.name}`}
                            className="flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-[#EDE7F6] hover:to-[#F8BBD0] transition-all duration-200 border-b border-[#F8BBD0]/30 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-full gradient-coral flex items-center justify-center mr-3 shadow-md">
                              <Search className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-poppins font-semibold text-[#212121] text-base">
                                {result.name}
                              </p>
                              <p className="text-sm text-[#9E9E9E] font-nunito">
                                {result.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="wave-divider">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff" opacity="0.5"></path>
            </svg>
          </div>
        </section>

        {/* Services Redirect Section */}
        <section className="py-16 md:py-24 px-4 bg-white relative">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
            >
              <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EDE7F6] to-[#F8BBD0] rounded-full mb-2">
                  <Zap className="w-4 h-4 text-[#FF8A65]" />
                  <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Premium Services</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-montserrat font-semibold text-[#212121]">
                  Discover Our Services
                </h2>
                <p className="text-base md:text-lg text-[#424242] leading-relaxed font-lato">
                  From home repairs to beauty services, we connect you with verified professionals for a seamless experience.
                </p>

                <Link href="/services">
                  <Button className="mt-5 group gradient-coral text-white px-8 py-4 rounded-full font-poppins font-semibold transition-all duration-300 hover:shadow-xl btn-bounce uppercase tracking-wide">
                    Explore Services
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:flex w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative w-full h-80 md:h-96 bg-gradient-to-br from-[#EDE7F6]/50 to-[#F8BBD0]/50 rounded-2xl overflow-hidden shadow-2xl border border-[#F8BBD0]/30"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {categories.slice(0, 4).map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          className="bg-white/90 p-4 rounded-xl shadow-lg backdrop-blur-md card-hover transition-all duration-300 border border-[#F8BBD0]/20"
                        >
                          <div className="w-10 h-10 rounded-full gradient-coral flex items-center justify-center mb-2 shadow-md">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-sm font-poppins font-semibold text-[#212121]">
                            {category.name}
                          </h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Listing */}
        <OurServices categories={categories} loading={loading} />

        {/* Book Specific Provider */}
        <BookAPerticularProvider />
      </div>
    </>
  );
};

export default HomePage;