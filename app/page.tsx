// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
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
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .card-hover:hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
        }
        
        .gradient-blue {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        }
        
        .gradient-teal {
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
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

      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF]">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC]/50 via-[#FFFFFF]/30 to-[#F8FAFC]/50"></div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#3B82F6]/5 blur-2xl floating"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#14B8A6]/5 blur-3xl floating" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#2563EB]/5 blur-xl floating" style={{animationDelay: '0.5s'}}></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 md:space-y-8 mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-gray-100">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Your Trusted Service Partner</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-inter font-semibold text-[#111827] leading-tight">
                Professional Services,
                <br />
                <span className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">
                  Delivered with Excellence
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#374151] max-w-xl md:max-w-2xl mx-auto font-poppins">
                Connect with verified service providers for all your needs — reliable, professional, and efficient
              </p>

              <div className="max-w-xl md:max-w-2xl mx-auto relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                      <Search className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <Input
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search for services (Cleaning, Plumbing...)"
                      className="h-12 md:h-14 text-base md:text-lg rounded-lg pl-14 pr-12 md:pr-14 placeholder-[#9CA3AF] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 shadow-sm bg-white border border-[#E5E7EB] font-poppins transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] z-40 transition-colors"
                      >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="h-12 md:h-14 px-6 md:px-8 rounded-lg gradient-blue text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-inter font-medium uppercase tracking-wide"
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
                      className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden z-50"
                    >
                      <div className="max-h-48 md:max-h-64 overflow-y-auto">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/services/${result.name}`}
                            className="flex items-center px-4 py-3 hover:bg-[#F8FAFC] transition-all duration-200 border-b border-[#E5E7EB] last:border-0"
                          >
                            <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center mr-3 shadow-sm">
                              <Search className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-poppins font-medium text-[#111827] text-base">
                                {result.name}
                              </p>
                              <p className="text-sm text-[#9CA3AF] font-nunito">
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
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F8FAFC] to-[#FFFFFF] rounded-full border border-[#E5E7EB] mb-2">
                  <Zap className="w-4 h-4 text-[#14B8A6]" />
                  <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Premium Services</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-inter font-semibold text-[#111827]">
                  Discover Our Services
                </h2>
                <p className="text-base md:text-lg text-[#374151] leading-relaxed font-poppins">
                  From home repairs to beauty services, we connect you with verified professionals for a seamless experience.
                </p>

                <Link href="/services">
                  <Button className="mt-5 group gradient-blue text-white px-8 py-3 rounded-lg font-inter font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] uppercase tracking-wide">
                    Explore Services
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:flex w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative w-full h-80 md:h-96 bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] rounded-2xl overflow-hidden shadow-md border border-[#E5E7EB]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {categories.slice(0, 4).map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md card-hover transition-all duration-300 border border-[#E5E7EB]"
                        >
                          <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center mb-2 shadow-sm">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-sm font-poppins font-medium text-[#111827]">
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