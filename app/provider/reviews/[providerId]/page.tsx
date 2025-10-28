// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "CANCELLED":
        return "text-red-500 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="w-full shadow-lg bg-white backdrop-blur-sm rounded-2xl border border-gray-100">
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-[Inter] font-semibold text-gray-900">
                  My Reviews
                </h1>
                <p className="text-gray-600 mt-2 font-[Nunito_Sans]">
                  View all reviews for your services
                </p>
              </div>

              {reviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="text-center py-16 bg-white shadow-md rounded-2xl border border-gray-100">
                    <CardContent>
                      <div className="bg-gradient-to-br from-blue-50 to-teal-50 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Star className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-[Inter] font-semibold text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-500 font-[Nunito_Sans]">
                        Reviews will appear here once customers rate your services.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{
                        y: -6,
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Card className="rounded-2xl shadow-md hover:shadow-xl border border-gray-100 bg-white transition-all duration-300">
                        <CardContent className="p-6">
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <motion.div 
                                className="bg-gradient-to-br from-blue-100 to-teal-100 p-3 rounded-xl shadow-sm"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <User className="h-6 w-6 text-blue-600" />
                              </motion.div>
                              <div>
                                <h3 className="font-[Inter] font-semibold text-lg text-gray-900">
                                  {review.User.name}
                                </h3>
                                <div className="flex items-center mt-1.5">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${
                                        index < review.stars
                                          ? "text-amber-500 fill-amber-500"
                                          : "text-gray-300 fill-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-500 font-[Nunito_Sans]">
                                    {review.stars} out of 5
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Booking Status */}
                            <div
                              className={`px-4 py-1.5 rounded-full text-xs font-[Inter] font-medium border ${getStatusColor(
                                review.Booking.status
                              )} flex items-center gap-1.5`}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              {review.Booking.status}
                            </div>
                          </div>

                          {/* Service Info */}
                          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="flex items-start space-x-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                  <Package className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-[Inter] font-medium text-gray-900">
                                    {review.Service.name}
                                  </p>
                                  <p className="text-xs text-gray-500 font-[Nunito_Sans] mt-0.5">
                                    {review.Service.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                  <IndianRupee className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-[Inter] font-medium text-gray-900">
                                    ₹{review.Booking.basePrice}
                                  </p>
                                  <p className="text-xs text-gray-500 font-[Nunito_Sans] mt-0.5">
                                    Service Price
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-500 font-[Nunito_Sans]">
                                  Service Date
                                </p>
                                <p className="text-sm font-[Inter] font-medium text-gray-900 mt-0.5">
                                  {formatDate(review.Booking.date)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <CheckCircle className="h-5 w-5 text-emerald-600" />
                              <div>
                                <p className="text-xs text-gray-500 font-[Nunito_Sans]">
                                  Payment Status
                                </p>
                                <p className="text-sm font-[Inter] font-medium text-gray-900 mt-0.5">
                                  {review.Booking.isPaid ? "Paid" : "Pending"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <Package className="h-5 w-5 text-teal-600" />
                              <div>
                                <p className="text-xs text-gray-500 font-[Nunito_Sans]">
                                  Order ID
                                </p>
                                <p className="text-sm font-[Inter] font-medium text-gray-900 font-mono mt-0.5">
                                  {review.Booking.orderId?.slice(-8) || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Review Text */}
                          {review.review && (
                            <div className="border-l-4 border-blue-600 pl-5 py-3 bg-gradient-to-r from-blue-50 to-transparent rounded-r-xl">
                              <p className="text-sm text-gray-700 font-[Poppins] italic">
                                &quot;{review.review}&quot;
                              </p>
                            </div>
                          )}

                          {/* Payment Verified Date */}
                          {review.Booking.paymentVerifiedAt && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-xs text-gray-500 font-[Nunito_Sans]">
                                Payment verified on{" "}
                                <span className="font-medium text-gray-700">
                                  {formatDate(review.Booking.paymentVerifiedAt)}
                                </span>
                              </p>
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