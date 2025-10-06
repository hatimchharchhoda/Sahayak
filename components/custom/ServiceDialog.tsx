// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Category } from "@/lib/types";

interface ServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDialog = ({ isOpen, onClose }: ServiceDialogProps) => {
  const [activeTab, setActiveTab] = useState("service");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
  });

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error: any) {
      console.log(error);
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/services", {
        ...serviceForm,
        basePrice: Number.parseFloat(serviceForm.basePrice),
      });

      setSuccess("Service created successfully!");
      setServiceForm({
        name: "",
        description: "",
        basePrice: "",
        categoryId: "",
      });
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/categories", { name: categoryName });

      setSuccess("Category created successfully!");
      setCategoryName("");
      fetchCategories();
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#0D1B2A]/90 via-[#1B263B]/70 to-[#3A0CA3]/80 backdrop-blur-md border border-purple-700/30 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold">
            Add New Service or Category
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 border-b border-purple-500/50">
            <TabsTrigger
  value="service"
  className="bg-[#0D1B2A] text-white font-medium hover:text-teal-400 data-[state=active]:text-teal-400 data-[state=active]:border-b-2 data-[state=active]:border-teal-400 rounded-t-md"
>
  Add Service
</TabsTrigger>
<TabsTrigger
  value="category"
  className="bg-[#0D1B2A] text-white font-medium hover:text-purple-400 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-t-md"
>
  Add Category
</TabsTrigger>
          </TabsList>

          <TabsContent value="service" className="mt-4">
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-gray-300">
                  Service Name
                </Label>
                <Input
                  id="serviceName"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter service name"
                  className="bg-[#0D1B2A] text-white border-teal-500 focus:border-teal-400 placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDescription" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="serviceDescription"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter service description"
                  className="bg-[#0D1B2A] text-white border-teal-500 focus:border-teal-400 placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicePrice" className="text-gray-300">
                  Base Price
                </Label>
                <Input
                  id="servicePrice"
                  type="number"
                  step="0.01"
                  value={serviceForm.basePrice}
                  onChange={(e) =>
                    setServiceForm((prev) => ({ ...prev, basePrice: e.target.value }))
                  }
                  placeholder="Enter base price"
                  className="bg-[#0D1B2A] text-white border-teal-500 focus:border-teal-400 placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCategory" className="text-gray-300">
                  Category
                </Label>
                <Select
                  value={serviceForm.categoryId}
                  onValueChange={(value) =>
                    setServiceForm((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger
                    id="serviceCategory"
                    className="bg-[#0D1B2A] text-white border-teal-500 focus:border-teal-400"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D1B2A] text-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-white">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-aqua-400 text-black hover:shadow-lg hover:scale-105 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Service"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="category" className="mt-4">
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-gray-300">
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="bg-[#0D1B2A] text-white border-teal-500 focus:border-teal-400 placeholder-gray-400"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-aqua-400 text-black hover:shadow-lg hover:scale-105 transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4 bg-red-800 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 bg-green-700 text-hite">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
