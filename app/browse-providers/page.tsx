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

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Service Providers in Your City
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            Browse trusted and top-rated professionals near you.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search provider by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2"
          />
          <Select onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-1/2">
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

        {/* Providers */}
        {loading ? (
          <p className="text-center text-gray-500">Loading providers...</p>
        ) : filteredProviders.length === 0 ? (
          <p className="text-center text-gray-500">No providers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Link
                href={`/book-services/${provider.id}`}
                key={provider.id}
                className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-indigo-800">
                  {provider.name}
                </h3>
                <p className="text-gray-700 mt-1">{provider.specialization}</p>
                <p className="text-gray-600 mt-2 text-sm">
                  {provider.city}, {provider.district}
                </p>
                {provider.address && (
                  <p className="text-gray-500 text-sm">{provider.address}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  📞 {provider.phone}
                </p>

                <div className="mt-3 text-sm text-yellow-600 font-medium">
                  ⭐{" "}
                  {provider.ratings.length > 0
                    ? (
                        provider.ratings.reduce((acc, r) => acc + r.value, 0) /
                        provider.ratings.length
                      ).toFixed(1)
                    : "No ratings yet"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseProvidersPage;
