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
    } catch (error) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); //Fixed useEffect dependency issue

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Service or Category</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service">Add Service</TabsTrigger>
            <TabsTrigger value="category">Add Category</TabsTrigger>
          </TabsList>

          <TabsContent value="service">
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Description</Label>
                <Textarea
                  id="serviceDescription"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter service description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicePrice">Base Price</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  step="0.01"
                  value={serviceForm.basePrice}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      basePrice: e.target.value,
                    }))
                  }
                  placeholder="Enter base price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCategory">Category</Label>
                <Select
                  value={serviceForm.categoryId}
                  onValueChange={(value) =>
                    setServiceForm((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger id="serviceCategory">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Service"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="category">
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
