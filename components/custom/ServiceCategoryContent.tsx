"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="shadow">
          <CardContent className="p-4">
            {/* Show category name with its id once */}
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              {category.name}
              <span className="text-sm text-gray-500">({category.id})</span>
            </h2>

            <ul className="space-y-1">
              {category.services.length > 0 ? (
                category.services.map((service) => (
                  <li
                    key={service.id}
                    className="text-sm text-gray-700 border-b pb-1"
                  >
                    <span className="font-medium">{service.name}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No services found</li>
              )}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceCategoryContent;
