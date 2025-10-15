// @ts-nocheck
"use client";
import { useState, type FC, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, Search, IndianRupee } from "lucide-react";
import ServiceDialog from "./ServiceDialog";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Service {
  id: string;
  categoryName: string;
  name: string;
  basePrice: number;
}

interface ServicesContentProps {
  setIsAddServiceOpen: (open: boolean) => void;
  onEditService: (service: Service) => void;
}

const ServicesContent: FC<ServicesContentProps> = ({ onEditService }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🧨 DELETE SERVICE FUNCTION
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`/api/admin/delete-service/${id}`);
      setServices((prev) => prev.filter((service) => service.id !== id));
      toast?.success?.("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast?.error?.("Failed to delete service!");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="backdrop-blur-md bg-white/5 border border-purple-500/50 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-teal-300 font-inter uppercase">
          Services Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* SEARCH + ADD BUTTON UI */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search services..."
              className="border-teal-400 text-teal-400 hover:bg-teal-500/20 hover:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outline"
              className="border-teal-400 text-teal-400 bg-teal-500/20"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => setIsAddServiceOpen(true)}
            className="bg-gradient-to-r from-teal-400 to-aqua-400 text-black hover:shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* SERVICES TABLE */}
        <div className="overflow-hidden rounded-2xl border border-teal-400/50 shadow-lg">
          <Table className="w-full">
            <TableHeader className="bg-white/5 backdrop-blur-md border-b border-purple-500/60">
              <TableRow>
                <TableHead className="text-teal-300 uppercase tracking-wide font-inter">
                  Service Category
                </TableHead>
                <TableHead className="text-teal-300 uppercase tracking-wide font-inter">
                  Service Name
                </TableHead>
                <TableHead className="text-teal-300 uppercase tracking-wide font-inter">
                  Price
                </TableHead>
                <TableHead className="text-teal-300 uppercase tracking-wide font-inter">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="px-6 py-4">
                      <Skeleton className="h-8 w-full rounded-lg bg-gradient-to-r from-teal-500/30 via-purple-500/40 to-indigo-500/30 animate-shimmer" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service, i) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`${
                      i % 2 === 0 ? "bg-navy-900/60" : "bg-indigo-900/40"
                    } hover:bg-purple-900/40 hover:shadow-[0_0_10px_rgba(138,43,226,0.7)] transition`}
                  >
                    <TableCell className="px-6 py-3 text-gray-200">
                      {service.categoryName}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-gray-200">
                      {service.name}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-gray-200 flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {service.basePrice}
                    </TableCell>
                    <TableCell className="px-6 py-3 w-28 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-600/20 w-full"
                        onClick={() => handleDelete(service.id)} // ✅ DELETE ACTION
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-400"
                  >
                    No services found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ServiceDialog
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
      />
    </Card>
  );
};

export default ServicesContent;