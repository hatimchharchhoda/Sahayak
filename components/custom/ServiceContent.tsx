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
import { PlusCircle, Edit, Trash2, Search, IndianRupee } from "lucide-react";
import ServiceDialog from "./ServiceDialog";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const fetchSevices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  useEffect(() => {
    fetchSevices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search services..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsAddServiceOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Category</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services && services.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.categoryName}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {service.basePrice}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
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
