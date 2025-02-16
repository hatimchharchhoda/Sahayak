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
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@/context/userContext";
import { Input } from "@/components/ui/input";
import { Review, ServiceDetails } from "@/lib/types";
import Loading from "@/components/custom/loading";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");
  const [review, setReview] = useState<Review | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const router = useRouter();

  const { userFromContext } = useUser();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.post(`/api/provider/service`, { id });
        console.log(response);
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
    const fetchReview = async () => {
      if (serviceDetails?.status === "COMPLETED") {
        setReviewLoading(true);
        console.log(serviceDetails);
        console.log(id);
        try {
          const response = await axios.post(`/api/serviceReviews`, {
            id: serviceDetails.serviceId,
          });
          setReview(response.data.review);
        } catch (error) {
          console.error("Error fetching review:", error);
          toast.error("Failed to load review");
        } finally {
          setReviewLoading(false);
        }
      }
    };

    fetchReview();
  }, [id, serviceDetails?.status]);

  const handleAccept = async () => {
    try {
      await axios.post(`/api/provider/service/${id}/accept`, {
        id: userFromContext?.id,
      });
      toast.success("Service accepted successfully");
      router.push("/provider");
    } catch (error) {
      console.error("Error accepting service:", error);
      toast.error("Failed to accept service");
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await axios.post(
        `/api/provider/service/${id}/update-price`,
        {
          basePrice: parseFloat(newPrice),
        }
      );
      if (response.status !== 200) return null;
      setServiceDetails((prev) =>
        prev
          ? {
              ...prev,
              basePrice: parseFloat(newPrice),
            }
          : null
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
      await axios.post(`/api/provider/service/${id}/complete`);
      setServiceDetails((prev) =>
        prev
          ? {
              ...prev,
              status: "COMPLETED",
            }
          : null
      );
      toast.success("Service marked as completed");
      router.push("/provider");
    } catch (error) {
      console.error("Error completing service:", error);
      toast.error("Failed to complete service");
    }
  };

  const ReviewSection = () => {
    if (!serviceDetails?.status === "COMPLETED") return null;

    if (reviewLoading) {
      return (
        <Card className="bg-yellow-50 mt-6">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-yellow-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-yellow-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!review) {
      return (
        <Card className="bg-yellow-50 mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Review</h2>
            <p className="text-gray-600">No review available yet.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-yellow-50 mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Client Review
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-yellow-600" />
                <span className="font-medium text-gray-700">
                  {review.User.name}
                </span>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < review.stars
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.review && (
              <p className="text-gray-700 bg-white/50 p-4 rounded-lg">
                "{review.review}"
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
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
                            {serviceDetails.User.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="w-6 h-6 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-lg font-semibold">
                            {serviceDetails.User.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="w-6 h-6 mr-3 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-lg font-semibold">
                            {serviceDetails.User.phone}
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
                              />
                              <Button onClick={handleUpdatePrice} size="sm">
                                Save
                              </Button>
                              <Button
                                onClick={() => setIsEditing(false)}
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
              <ReviewSection />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
