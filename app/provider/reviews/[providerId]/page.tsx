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
        const response = await axios.post(`/api/providerReviews/${providerId}`, {
          providerId,
        });
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
        return "text-[#43A047] bg-[#E8F5E9]"; // success
      case "PENDING":
        return "text-[#FBC02D] bg-[#FFF8E1]"; // warning
      case "CANCELLED":
        return "text-[#E53935] bg-[#FFEBEE]"; // error
      default:
        return "text-[#616161] bg-[#F5F5F5]"; // neutral
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] to-[#DCEDC8] py-12 px-4 sm:px-6 lg:px-8 font-[Nunito_Sans] text-[#212121]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="w-full shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl">
            <CardContent className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-[Poppins] font-semibold text-[#212121]">
                  My Reviews
                </h1>
                <p className="text-[#616161] mt-2">
                  View all reviews for your services
                </p>
              </div>

              {reviews.length === 0 ? (
                <Card className="text-center py-12 bg-white/80 shadow-md rounded-xl">
                  <CardContent>
                    <Star className="mx-auto h-12 w-12 text-[#9E9E9E] mb-4" />
                    <h3 className="text-lg font-semibold text-[#212121] mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-[#616161]">
                      Reviews will appear here once customers rate your services.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      whileHover={{
                        y: -4,
                        scale: 1.01,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card className="rounded-xl shadow-md border border-[#AEEA00]/40 bg-white/95">
                        <CardContent className="p-6">
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-[#E0F7FA] p-2 rounded-full shadow-sm">
                                <User className="h-5 w-5 text-[#00C853]" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-[#212121]">
                                  {review.User.name}
                                </h3>
                                <div className="flex items-center mt-1">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${
                                        index < review.stars
                                          ? "text-[#FBC02D] fill-current"
                                          : "text-[#E0E0E0]"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-[#616161]">
                                    {review.stars} out of 5
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

                          {/* Service Info */}
                          <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-3">
                                <Package className="h-5 w-5 text-[#00C853]" />
                                <div>
                                  <p className="text-sm font-medium text-[#212121]">
                                    {review.Service.name}
                                  </p>
                                  <p className="text-xs text-[#616161]">
                                    {review.Service.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <IndianRupee className="h-5 w-5 text-[#43A047]" />
                                <div>
                                  <p className="text-sm font-medium text-[#212121]">
                                    {review.Booking.basePrice}
                                  </p>
                                  <p className="text-xs text-[#616161]">
                                    Service Price
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-[#43A047]" />
                              <div>
                                <p className="text-xs text-[#9E9E9E]">
                                  Service Date
                                </p>
                                <p className="text-sm font-medium">
                                  {formatDate(review.Booking.date)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-[#43A047]" />
                              <div>
                                <p className="text-xs text-[#9E9E9E]">
                                  Payment Status
                                </p>
                                <p className="text-sm font-medium">
                                  {review.Booking.isPaid ? "Paid" : "Pending"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-[#00C853]" />
                              <div>
                                <p className="text-xs text-[#9E9E9E]">
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
                            <div className="border-l-4 border-[#00C853] pl-4 py-2 bg-[#E8F5E9] rounded-r-lg">
                              <p className="text-sm text-[#424242] italic">
                                "{review.review}"
                              </p>
                            </div>
                          )}

                          {/* Payment Verified Date */}
                          {review.Booking.paymentVerifiedAt && (
                            <div className="mt-4 text-xs text-[#616161]">
                              Payment verified on{" "}
                              {formatDate(review.Booking.paymentVerifiedAt)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}