"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Search, MapPin, Phone, Star, Users, Sparkles, ArrowRight } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  district: string;
  specialization: string;
  ratings: { value: number }[];
}

interface Category {
  id: string;
  name: string;
}

interface GroupedProviders {
  [key: string]: Provider[];
}

const BrowseProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/browse-provider");
      setProviders(res.data.providers);
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || selectedCategory === ""
        ? true
        : provider.specialization === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedProviders: GroupedProviders = filteredProviders.reduce(
    (acc, provider) => {
      if (!acc[provider.specialization]) {
        acc[provider.specialization] = [];
      }
      acc[provider.specialization].push(provider);
      return acc;
    },
    {} as GroupedProviders
  );

  const calculateAverageRating = (ratings: { value: number }[]) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
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
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, #F8FAFC 0%, #E5E7EB 50%, #F8FAFC 100%);
          background-size: 1000px 100%;
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        
        .card-hover:hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
        }
        
        .gradient-blue {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        }
      `}</style>

      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] min-h-screen font-poppins relative overflow-hidden">
        {/* Decorative Background Elements - Very Subtle */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#2563EB] blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#14B8A6] blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-[#E5E7EB]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">Browse Providers</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-inter font-semibold text-[#111827] mb-4">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#3B82F6] bg-clip-text text-transparent">
                Service Provider
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#374151] max-w-2xl mx-auto font-poppins">
              Find trusted and top-rated professionals in your area. Browse by
              service type to find exactly what you need.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-6 mb-12 transition-all duration-300 animate-fade-slide-up hover:shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search provider by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border border-[#E5E7EB] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 rounded-lg placeholder-[#9CA3AF] transition-all duration-300 font-poppins"
                />
              </div>
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-1/2 h-12 border border-[#E5E7EB] rounded-lg focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 font-poppins">
                  <SelectValue placeholder="Filter by service category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#374151] flex items-center gap-2 font-poppins">
                <Users className="h-4 w-4 text-[#14B8A6]" />
                <span className="font-inter font-medium text-[#2563EB]">{filteredProviders.length}</span>
                provider{filteredProviders.length !== 1 ? "s" : ""} found
                {selectedCategory && selectedCategory !== "all" && (
                  <span> in <span className="font-medium">{getCategoryName(selectedCategory)}</span></span>
                )}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-shimmer rounded-full h-16 w-16 mb-4"></div>
              <p className="text-[#374151] font-poppins">Loading providers...</p>
            </div>
          ) : Object.keys(groupedProviders).length === 0 ? (
            <div className="text-center py-12 animate-fade-slide-up">
              <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-12">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-[#E5E7EB] flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-[#9CA3AF]" />
                </div>
                <h3 className="text-xl font-inter font-semibold text-[#111827] mb-2">
                  No providers found
                </h3>
                <p className="text-[#374151] font-poppins">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            /* Providers by Service Type */
            <div className="space-y-8">
              {Object.entries(groupedProviders).map(
                ([specialization, serviceProviders], groupIndex) => (
                  <div
                    key={specialization}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#E5E7EB] animate-fade-slide-up hover:shadow-lg transition-all duration-300"
                    style={{animationDelay: `${groupIndex * 0.1}s`}}
                  >
                    {/* Service Type Header */}
                    <div className="gradient-blue text-white px-8 py-6">
                      <h2 className="text-2xl font-inter font-semibold flex items-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        {getCategoryName(specialization)}
                      </h2>
                    </div>

                    {/* Providers Grid */}
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {serviceProviders.map((provider, index) => {
                          const avgRating = calculateAverageRating(
                            provider.ratings
                          );
                          return (
                            <Link
                              href={`/book-services/${provider.id}`}
                              key={provider.id}
                              className="group block bg-white border border-[#E5E7EB] hover:border-[#14B8A6] rounded-2xl p-6 transition-all duration-300 shadow-sm card-hover"
                              style={{animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s`}}
                            >
                              {/* Provider Name */}
                              <h3 className="text-xl font-inter font-semibold text-[#111827] group-hover:text-[#2563EB] mb-3 transition-colors">
                                {provider.name}
                              </h3>

                              {/* Location */}
                              <div className="flex items-center text-[#374151] mb-3">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-[#14B8A6]" />
                                <span className="text-sm font-poppins">
                                  {provider.city}, {provider.district}
                                </span>
                              </div>

                              {/* Address */}
                              {provider.address && (
                                <p className="text-sm text-[#9CA3AF] mb-3 line-clamp-2 font-nunito">
                                  {provider.address}
                                </p>
                              )}

                              {/* Phone */}
                              <div className="flex items-center text-[#374151] mb-4">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-[#14B8A6]" />
                                <span className="text-sm font-medium font-poppins">
                                  {provider.phone}
                                </span>
                              </div>

                              {/* Rating */}
                              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-[#F59E0B] fill-current mr-1" />
                                  <span className="text-sm font-medium text-[#111827] font-poppins">
                                    {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                                  </span>
                                  {provider.ratings.length > 0 && (
                                    <span className="text-xs text-[#9CA3AF] ml-1 font-nunito">
                                      ({provider.ratings.length})
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 gradient-blue text-white px-3 py-1.5 rounded-lg text-xs font-inter font-medium uppercase tracking-wide group-hover:scale-105 transform transition-all shadow-sm">
                                  Book <ArrowRight className="w-3 h-3" />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BrowseProvidersPage;