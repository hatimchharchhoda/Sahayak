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
import { useAuth } from "@/context/userContext";
import { Input } from "@/components/ui/input";
import Loading from "@/components/custom/loading";
import ReviewSection from "@/components/custom/ReviewSection";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";

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
  isPaid?: boolean;
  orderId?: string;
  paymentId?: string;
  paymentSignature?: string;
  paymentVerifiedAt?: string;

  Service?: Service;
  User?: User;
  rating?: Rating;
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const socket = useSocket();
  const [serviceDetails, setServiceDetails] = useState<Booking | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");

  console.log(serviceDetails);

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

  const handleAccept = async () => {
    try {
      await axios.post(`/api/provider/service/accept`, {
        id: user?.id,
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

  useEffect(() => {
    if (!socket) return;

    const handleServices = ({ service }) => {
      console.log(service);
      setServiceDetails(service);
    };

    socket.on("payment", handleServices);
  }, [socket]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Header Section - Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Service Details
                </h1>
                <Badge
                  className={`${
                    statusColors[
                      serviceDetails.status as keyof typeof statusColors
                    ]
                  } text-sm sm:text-base px-3 py-1 self-start sm:self-auto`}
                >
                  {serviceDetails.status}
                </Badge>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {/* Service Information */}
                {serviceDetails.Service && (
                  <Card className="bg-indigo-50">
                    <CardContent className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                        Service Information
                      </h2>
                      <div className="space-y-2">
                        <p className="text-base sm:text-lg font-semibold text-gray-900">
                          {serviceDetails.Service.name}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          {serviceDetails.Service.description}
                        </p>
                        {serviceDetails.Service.ServiceCategory && (
                          <Badge
                            variant="outline"
                            className="mt-2 text-xs sm:text-sm"
                          >
                            {serviceDetails.Service.ServiceCategory.name}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Date and Time Cards - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="bg-blue-50">
                    <CardContent className="flex items-center p-4">
                      <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Date</p>
                        <p className="text-sm sm:text-lg font-semibold truncate">
                          {new Date(serviceDetails.date).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50">
                    <CardContent className="flex items-center p-4">
                      <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Time</p>
                        <p className="text-sm sm:text-lg font-semibold truncate">
                          {new Date(serviceDetails.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Client Information - Responsive */}
                <Card className="bg-green-50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Client Information
                      </h2>
                      {/* Chat Button - Responsive positioning */}
                      {serviceDetails.status !== "PENDING" && (
                        <Link
                          href={`/chat/${serviceDetails.userId}`}
                          className="w-full sm:w-auto"
                        >
                          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md text-sm sm:text-base">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat with Client
                          </Button>
                        </Link>
                      )}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start">
                        <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">
                            Name
                          </p>
                          <p className="text-sm sm:text-lg font-semibold break-words">
                            {serviceDetails.User?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">
                            Address
                          </p>
                          <p className="text-sm sm:text-lg font-semibold break-words">
                            {serviceDetails.User?.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">
                            Phone
                          </p>
                          <p className="text-sm sm:text-lg font-semibold break-all">
                            {serviceDetails.User?.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Section - Highly Responsive */}
                <Card className="bg-purple-50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Price Display Section */}
                      <div className="flex items-start lg:items-center">
                        <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-purple-600 flex-shrink-0 mt-1 lg:mt-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            Price
                          </p>
                          {isEditing ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <Input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-full sm:w-32 text-sm"
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                              />
                              <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                  onClick={handleUpdatePrice}
                                  size="sm"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                                >
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
                                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                                  ₹
                                  {serviceDetails.basePrice?.toFixed(2) ||
                                    "N/A"}
                                </p>
                                {serviceDetails.isPaid && (
                                  <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-700 rounded-full border border-green-200 shadow-sm self-start">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="text-xs sm:text-sm font-semibold">
                                      Payment Successful
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Responsive Stack */}
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                        {serviceDetails.status === "PENDING" && (
                          <Button
                            onClick={handleAccept}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Accept Service
                          </Button>
                        )}
                        {serviceDetails.status === "ACCEPTED" && (
                          <>
                            <Button
                              onClick={() => setIsEditing(true)}
                              variant="outline"
                              className="w-full sm:w-auto gap-2 text-sm sm:text-base"
                              disabled={isEditing}
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              Edit Price
                            </Button>
                            <Button
                              onClick={handleCompleteService}
                              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 gap-2 text-sm sm:text-base"
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              Complete Service
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review Section */}
              <div className="mt-6">
                <ReviewSection serviceDetails={serviceDetails} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
