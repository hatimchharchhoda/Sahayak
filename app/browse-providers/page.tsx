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

  // Group providers by specialization
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
    <section className="py-16 md:py-24 px-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Service Providers
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find trusted and top-rated professionals in your area. Browse by
            service type to find exactly what you need.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search provider by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-500"
              />
            </div>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-1/2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <Users className="inline h-4 w-4 mr-1" />
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading providers...</p>
          </div>
        ) : Object.keys(groupedProviders).length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No providers found
              </h3>
              <p className="text-gray-500">
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
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Service Type Header */}
                  <div className="bg-blue-600 text-white px-8 py-6">
                    <h2 className="text-2xl font-bold">
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
                            className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md"
                          >
                            {/* Provider Name */}
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 mb-2">
                              {provider.name}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-gray-600 mb-3">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">
                                {provider.city}, {provider.district}
                              </span>
                            </div>

                            {/* Address */}
                            {provider.address && (
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {provider.address}
                              </p>
                            )}

                            {/* Phone */}
                            <div className="flex items-center text-gray-600 mb-4">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm font-medium">
                                {provider.phone}
                              </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                <span className="text-sm font-medium text-gray-900">
                                  {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                                </span>
                                {provider.ratings.length > 0 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({provider.ratings.length} review
                                    {provider.ratings.length !== 1 ? "s" : ""})
                                  </span>
                                )}
                              </div>
                              <div className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
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
