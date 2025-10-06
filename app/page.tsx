// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, ArrowRight, X } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 md:space-y-8 mb-12 md:mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-nunito font-bold text-[#212121] leading-tight">
              Your Trusted Service Partner
            </h1>
            <p className="text-lg md:text-2xl text-[#757575] max-w-xl md:max-w-2xl mx-auto font-lato font-light">
              Connect with professional service providers for all your lifestyle needs
            </p>
            <div className="max-w-xl md:max-w-2xl mx-auto relative">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for services (Cleaning, Plumbing...)"
                    className="h-12 md:h-14 text-base md:text-lg rounded-full px-6 md:px-8 pr-12 md:pr-14 placeholder-[#BDBDBD] focus:border-[#FF7043] shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121] z-40"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-12 md:h-14 px-6 md:px-8 rounded-full bg-gradient-to-r from-[#FF7043] to-pink-400 hover:scale-105 shadow-lg transition-transform duration-300"
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
                    className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border border-[#FFAB91] overflow-hidden z-50"
                  >
                    <div className="max-h-48 md:max-h-64 overflow-y-auto">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/services/${result.name}`}
                          className="flex items-center px-4 py-3 hover:bg-[#FFE0B2] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#FFAB91] flex items-center justify-center mr-3">
                            <Search className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-poppins font-semibold text-[#212121] text-base">
                              {result.name}
                            </p>
                            <p className="text-sm text-[#757575]">
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFE0B2]/20 via-[#FFAB91]/20 to-[#E1BEE7]/20"></div>
      </section>

      {/* Services Redirect Section */}
      <section className="py-16 md:py-24 px-4  bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
          >
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-nunito font-bold text-[#212121]">
                Discover Our Services
              </h2>
              <p className="text-base md:text-lg text-[#757575] leading-relaxed">
                From home repairs to beauty services, we connect you with verified professionals for a seamless experience.
              </p>

              <Link href="/services">
                <Button className="mt-5 group bg-gradient-to-r from-[#FF7043] to-pink-400 hover:from-pink-400 hover:to-[#FF7043] text-white px-8 py-4 rounded-full font-poppins font-semibold transition-transform duration-300 transform hover:scale-105 shadow-lg">
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
                className="relative w-full h-80 md:h-96 bg-gradient-to-br from-[#FFE0B2]/50 to-[#E1BEE7]/50 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {categories.slice(0, 4).map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="bg-white/80 p-4 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
                      >
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
  );
};

export default HomePage;