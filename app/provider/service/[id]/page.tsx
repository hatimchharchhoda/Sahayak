// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  IndianRupee,
  CheckCircle,
  Edit,
  Star,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@/context/userContext";
import { Input } from "@/components/ui/input";
import Loading from "@/components/custom/loading";
import ReviewSection from "@/components/custom/ReviewSection";
import Link from "next/link";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  ServiceCategory?: ServiceCategory;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  role?: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  providerId: string;
  userId: string;
  serviceId: string;
  stars: number;
  review: string;
  User: User;
}

export interface Booking {
  id: string;
  providerId: string;
  userId: string;
  serviceId: string;
  serviceCategoryId?: string;
  date: string;
  basePrice: number;
  status: string;
  Service?: Service;
  User?: User;
  rating?: Rating;
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [serviceDetails, setServiceDetails] = useState<Booking | null>(null);
  const { userFromContext, setUserFromContext } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.post(`/api/provider/service`, { id });
        setServiceDetails(response.data);
        setNewPrice(response.data.basePrice?.toString() || "");
      } catch (error) {
        console.error("Error fetching service details:", error);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserFromContext(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  const handleAccept = async () => {
    try {
      await axios.post(`/api/provider/service/accept`, {
        id: userFromContext?.id,
        bookingId: id,
      });
      toast.success("Service accepted successfully");
      setServiceDetails((prev) =>
        prev ? { ...prev, status: "ACCEPTED" } : null
      );
    } catch (error) {
      console.error("Error accepting service:", error);
      toast.error("Failed to accept service");
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await axios.post(`/api/provider/service/update-price`, {
        basePrice: parseFloat(newPrice),
        bookingId: id,
      });
      if (response.status !== 200) return;

      setServiceDetails((prev) =>
        prev ? { ...prev, basePrice: parseFloat(newPrice) } : null
      );
      setIsEditing(false);
      toast.success("Price updated successfully");
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price");
    }
  };

  const handleCompleteService = async () => {
    try {
      await axios.post(`/api/provider/service/complete`, {
        bookingId: id,
      });
      setServiceDetails((prev) =>
        prev ? { ...prev, status: "COMPLETED" } : null
      );
      toast.success("Service marked as completed");
    } catch (error) {
      console.error("Error completing service:", error);
      toast.error("Failed to complete service");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!serviceDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Service not found</div>
      </div>
    );
  }

  console.log(`/chat/${serviceDetails.userId}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Service Details
                </h1>
                <Badge
                  className={
                    statusColors[
                      serviceDetails.status as keyof typeof statusColors
                    ]
                  }
                >
                  {serviceDetails.status}
                </Badge>
              </div>

              <div className="grid gap-6">
                {/* Service Information */}
                {serviceDetails.Service && (
                  <Card className="bg-indigo-50">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Service Information
                      </h2>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-900">
                          {serviceDetails.Service.name}
                        </p>
                        <p className="text-gray-600">
                          {serviceDetails.Service.description}
                        </p>
                        {serviceDetails.Service.ServiceCategory && (
                          <Badge variant="outline" className="mt-2">
                            {serviceDetails.Service.ServiceCategory.name}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50">
                    <CardContent className="flex items-center p-4">
                      <CalendarIcon className="w-8 h-8 mr-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(serviceDetails.date).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50">
                    <CardContent className="flex items-center p-4">
                      <ClockIcon className="w-8 h-8 mr-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="text-lg font-semibold">
                          {new Date(serviceDetails.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Button - Navigates to separate chat page */}
                <div className="flex justify-center">
                  <Link href={`/chat/${serviceDetails.userId}`}>Chat</Link>
                </div>

                <Card className="bg-green-50">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Client Information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <UserIcon className="w-6 h-6 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="text-lg font-semibold">
                            {serviceDetails.User?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="w-6 h-6 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-lg font-semibold">
                            {serviceDetails.User?.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="w-6 h-6 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-lg font-semibold">
                            {serviceDetails.User?.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IndianRupee className="w-8 h-8 mr-3 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-32"
                                min="0"
                                step="0.01"
                              />
                              <Button onClick={handleUpdatePrice} size="sm">
                                Save
                              </Button>
                              <Button
                                onClick={() => {
                                  setIsEditing(false);
                                  setNewPrice(
                                    serviceDetails.basePrice?.toString() || ""
                                  );
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold text-gray-800">
                              ₹{serviceDetails.basePrice?.toFixed(2) || "N/A"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {serviceDetails.status === "PENDING" && (
                          <Button
                            onClick={handleAccept}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Accept Service
                          </Button>
                        )}
                        {serviceDetails.status === "ACCEPTED" && (
                          <>
                            <Button
                              onClick={() => setIsEditing(true)}
                              variant="outline"
                              className="gap-2"
                              disabled={isEditing}
                            >
                              <Edit className="w-4 h-4" />
                              Edit Price
                            </Button>
                            <Button
                              onClick={handleCompleteService}
                              className="bg-blue-600 hover:bg-blue-700 gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete Service
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <ReviewSection serviceDetails={serviceDetails} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
