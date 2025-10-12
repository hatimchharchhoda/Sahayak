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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
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
          background: linear-gradient(to right, #EDE7F6 0%, #F8BBD0 50%, #EDE7F6 100%);
          background-size: 1000px 100%;
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        
        .card-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 20px 40px rgba(255, 111, 97, 0.2);
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
        
        .font-nunito {
          font-family: 'Nunito Sans', sans-serif;
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

      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] min-h-screen font-lato relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#FF6F61] blur-3xl floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#26C6DA] blur-3xl floating" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
              <Sparkles className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Browse Providers</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-montserrat font-semibold text-[#212121] mb-4">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-[#FF6F61] via-[#FF8A65] to-[#FF6F61] bg-clip-text text-transparent">
                Service Provider
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#424242] max-w-2xl mx-auto font-lato">
              Find trusted and top-rated professionals in your area. Browse by
              service type to find exactly what you need.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#F8BBD0]/30 p-6 mb-12 transition-all duration-300 animate-fade-slide-up">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search provider by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 rounded-xl placeholder-[#9E9E9E] transition-all duration-300 font-lato shadow-sm"
                />
              </div>
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-1/2 h-12 border-2 border-[#26C6DA] rounded-xl focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 font-lato shadow-sm">
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
            <div className="mt-4 pt-4 border-t border-[#F8BBD0]/30">
              <p className="text-sm text-[#424242] flex items-center gap-2 font-lato">
                <Users className="h-4 w-4 text-[#26C6DA]" />
                <span className="font-poppins font-medium text-[#FF6F61]">{filteredProviders.length}</span>
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
              <p className="text-[#424242] font-lato">Loading providers...</p>
            </div>
          ) : Object.keys(groupedProviders).length === 0 ? (
            <div className="text-center py-12 animate-fade-slide-up">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#F8BBD0]/30 p-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EDE7F6] to-[#F8BBD0] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="h-10 w-10 text-[#9E9E9E]" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-[#212121] mb-2">
                  No providers found
                </h3>
                <p className="text-[#424242] font-lato">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            /* Providers by Service Type */
            <div className="space-y-12">
              {Object.entries(groupedProviders).map(
                ([specialization, serviceProviders], groupIndex) => (
                  <div
                    key={specialization}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-[#F8BBD0]/30 animate-fade-slide-up"
                    style={{animationDelay: `${groupIndex * 0.1}s`}}
                  >
                    {/* Service Type Header */}
                    <div className="gradient-coral text-white px-8 py-6">
                      <h2 className="text-2xl font-montserrat font-semibold flex items-center gap-2">
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
                              className="group block bg-white border-2 border-[#F8BBD0]/30 hover:border-[#FF6F61] rounded-2xl p-6 transition-all duration-300 shadow-md card-hover"
                              style={{animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s`}}
                            >
                              {/* Provider Name */}
                              <h3 className="text-xl font-montserrat font-semibold text-[#212121] group-hover:text-[#FF6F61] mb-3 transition-colors">
                                {provider.name}
                              </h3>

                              {/* Location */}
                              <div className="flex items-center text-[#424242] mb-3">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-[#26C6DA]" />
                                <span className="text-sm font-lato">
                                  {provider.city}, {provider.district}
                                </span>
                              </div>

                              {/* Address */}
                              {provider.address && (
                                <p className="text-sm text-[#9E9E9E] mb-3 line-clamp-2 font-nunito">
                                  {provider.address}
                                </p>
                              )}

                              {/* Phone */}
                              <div className="flex items-center text-[#424242] mb-4">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-[#26C6DA]" />
                                <span className="text-sm font-medium font-lato">
                                  {provider.phone}
                                </span>
                              </div>

                              {/* Rating */}
                              <div className="flex items-center justify-between pt-4 border-t border-[#F8BBD0]/30">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-[#FFCA28] fill-current mr-1" />
                                  <span className="text-sm font-medium text-[#212121] font-poppins">
                                    {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                                  </span>
                                  {provider.ratings.length > 0 && (
                                    <span className="text-xs text-[#9E9E9E] ml-1 font-nunito">
                                      ({provider.ratings.length})
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 gradient-coral text-white px-3 py-1.5 rounded-lg text-xs font-poppins font-medium uppercase tracking-wide group-hover:scale-105 transform transition-all shadow-md">
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