"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceCategory {
  id: string;
  name: string;
  services: { id: string; name: string; categoryId: string }[];
}

const ServiceCategoryContent = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/admin/serviceCategories");
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-4 animate-pulse"
          >
            <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded"></CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <CardHeader className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              {category.name}
              <Badge
                variant="outline"
                className="ml-2 text-xs px-2 py-1 bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-100"
              >
                {category.services.length} services
              </Badge>
            </CardTitle>
            <span className="text-sm text-gray-400 dark:text-gray-300 font-mono">
              {category.id}
            </span>
          </CardHeader>

          <CardContent className="p-4 space-y-2">
            {category.services.length > 0 ? (
              category.services.map((service) => (
                <div
                  key={service.id}
                  className="text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1 flex justify-between items-center hover:text-teal-600 dark:hover:text-teal-300 transition-colors duration-200"
                >
                  <span className="font-medium truncate">{service.name}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No services found
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceCategoryContent;