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
import { Search, MapPin, Phone, Star, Users } from "lucide-react";

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
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] min-h-screen font-lato">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-nunito font-bold text-[#212121] mb-4">
            Service Providers
          </h1>
          <p className="text-lg md:text-xl text-[#757575] max-w-2xl mx-auto">
            Find trusted and top-rated professionals in your area. Browse by
            service type to find exactly what you need.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#FFE0B2] p-6 mb-12 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDBDBD] h-5 w-5" />
              <Input
                type="text"
                placeholder="Search provider by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-b-2 border-transparent focus:border-[#FF7043] focus:ring-0 placeholder-gray-400 transition-all duration-300"
              />
            </div>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-1/2 h-12 border border-[#26A69A] rounded-lg focus:border-[#26A69A] focus:ring-1 focus:ring-[#26A69A]">
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
          <div className="mt-4 pt-4 border-t border-[#FFE0B2]">
            <p className="text-sm text-[#757575] flex items-center gap-1">
              <Users className="h-4 w-4" />
              {filteredProviders.length} provider
              {filteredProviders.length !== 1 ? "s" : ""} found
              {selectedCategory && selectedCategory !== "all" && (
                <span> in {getCategoryName(selectedCategory)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-pulse rounded-full h-12 w-12 bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7]"></div>
            <p className="mt-4 text-[#757575]">Loading providers...</p>
          </div>
        ) : Object.keys(groupedProviders).length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg border border-[#FFE0B2] p-12">
              <Search className="h-16 w-16 text-[#BDBDBD] mx-auto mb-4" />
              <h3 className="text-xl font-nunito font-bold text-[#212121] mb-2">
                No providers found
              </h3>
              <p className="text-[#757575]">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          /* Providers by Service Type */
          <div className="space-y-12">
            {Object.entries(groupedProviders).map(
              ([specialization, serviceProviders]) => (
                <div
                  key={specialization}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#FFE0B2]"
                >
                  {/* Service Type Header */}
                  <div className="bg-gradient-to-r from-[#FFAB91] to-[#E1BEE7] text-white px-8 py-6">
                    <h2 className="text-2xl font-nunito font-bold">
                      {getCategoryName(specialization)}
                    </h2>
                  </div>

                  {/* Providers Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceProviders.map((provider) => {
                        const avgRating = calculateAverageRating(
                          provider.ratings
                        );
                        return (
                          <Link
                            href={`/book-services/${provider.id}`}
                            key={provider.id}
                            className="group block bg-gradient-to-br from-[#FFF0E5] to-[#FFE0B2] hover:from-[#FFAB91] hover:to-[#FF7043] border border-transparent rounded-xl p-6 transition-all duration-300 shadow-md hover:shadow-xl"
                          >
                            {/* Provider Name */}
                            <h3 className="text-xl font-poppins font-semibold text-[#212121] group-hover:text-white mb-2">
                              {provider.name}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-[#757575] mb-3">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">
                                {provider.city}, {provider.district}
                              </span>
                            </div>

                            {/* Address */}
                            {provider.address && (
                              <p className="text-sm text-[#BDBDBD] mb-3 line-clamp-2">
                                {provider.address}
                              </p>
                            )}

                            {/* Phone */}
                            <div className="flex items-center text-[#757575] mb-4">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm font-medium">
                                {provider.phone}
                              </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-[#FFD54F] fill-current mr-1" />
                                <span className="text-sm font-medium text-[#212121]">
                                  {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                                </span>
                                {provider.ratings.length > 0 && (
                                  <span className="text-xs text-[#757575] ml-1">
                                    ({provider.ratings.length} review
                                    {provider.ratings.length !== 1 ? "s" : ""})
                                  </span>
                                )}
                              </div>
                              <div className="bg-gradient-to-r from-[#FF7043] to-[#FFAB91] text-white px-3 py-1 rounded-md text-sm font-poppins font-semibold group-hover:scale-105 transform transition-all">
                                Book Now →
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
  );
};

export default BrowseProvidersPage;