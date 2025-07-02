// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

import {
  Star,
  User,
  Calendar,
  IndianRupee,
  CheckCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/custom/loading";
import { Review } from "@/lib/types";

export default function ProviderReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null);
  const params = useParams();

  useEffect(() => {
    if (params?.providerId) {
      setProviderId(params.providerId as string);
    }
  }, [params]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!providerId) return;
      try {
        const response = await axios.post(
          `/api/providerReviews/${providerId}`,
          {
            providerId,
          }
        );
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [providerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="container mx-auto p-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800">
                    My Reviews
                  </h1>
                  <p className="text-gray-600 mt-2">
                    View all reviews for your services
                  </p>
                </div>

                {reviews.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-500">
                        Reviews will appear here once customers rate your
                        services.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review.id} className="duration-300">
                        <CardContent className="p-6">
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {review.User.name}
                                </h3>
                                <div className="flex items-center mt-1">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${
                                        index < review.stars
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    {review.stars} out of 5 stars
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Booking Status */}
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                review.Booking.status
                              )}`}
                            >
                              <CheckCircle className="inline h-3 w-3 mr-1" />
                              {review.Booking.status}
                            </div>
                          </div>

                          {/* Service Information */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-3">
                                <Package className="h-5 w-5 text-indigo-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {review.Service.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {review.Service.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <IndianRupee className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {review.Booking.basePrice}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Service Price
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Service Date
                                </p>
                                <p className="text-sm font-medium">
                                  {formatDate(review.Booking.date)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Payment Status
                                </p>
                                <p className="text-sm font-medium">
                                  {review.Booking.isPaid ? "Paid" : "Pending"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Order ID
                                </p>
                                <p className="text-sm font-medium font-mono">
                                  {review.Booking.orderId?.slice(-8) || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Review Text */}
                          {review.review && (
                            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                              <p className="text-sm text-gray-700 italic">
                                "{review.review}"
                              </p>
                            </div>
                          )}

                          {/* Payment Verification Date */}
                          {review.Booking.paymentVerifiedAt && (
                            <div className="mt-4 text-xs text-gray-500">
                              Payment verified on{" "}
                              {formatDate(review.Booking.paymentVerifiedAt)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
