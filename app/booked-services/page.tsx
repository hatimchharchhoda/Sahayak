// @ts-nocheck
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupee,
  Search,
  Star,
  Edit,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Loading from "@/components/custom/loading";

const getStatusColor = (status: any) => {
  switch (status) {
    case "COMPLETED":
    case "ACCEPTED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: any) => {
  switch (status) {
    case "COMPLETED":
    case "ACCEPTED":
      return <CheckCircle className="h-5 w-5" />;
    case "CANCELLED":
      return <XCircle className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={onConfirm}
            variant={"destructive"}
            className="px-4 py-2 text-white rounded-lg transition-colors"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReviewDialog = ({
  isOpen,
  onClose,
  onSubmit,
  booking,
  existingReview,
}: any) => {
  const [stars, setStars] = useState(existingReview?.stars || 5);
  const [review, setReview] = useState(existingReview?.review || "");
  const [submitting, setSubmitting] = useState(false);

  // Update state when existingReview changes
  useEffect(() => {
    if (existingReview) {
      setStars(existingReview.stars);
      setReview(existingReview.review || "");
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(stars, review);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {existingReview ? "Edit your review" : "Rate your experience"}
        </h3>
        <p className="text-gray-600 mb-4">
          How was your experience with {booking.ServiceProvider?.name} for{" "}
          {booking.Service?.name}?
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setStars(rating)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    stars >= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Review (Optional)
          </label>
          <textarea
            id="review"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your experience..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            <span>
              {submitting
                ? "Submitting..."
                : `${existingReview ? "Update" : "Submit"} Review`}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ServiceBookingCard = ({
  booking,
  onCancelSuccess,
  onReviewSuccess,
}: any) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const date = new Date(booking.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    // Check if the booking has been reviewed
    const checkReviewStatus = async () => {
      try {
        const response = await axios.get(
          `/api/review/check?bookingId=${booking.id}`
        );
        setHasReviewed(response.data.hasReviewed);
        if (response.data.hasReviewed && response.data.review) {
          setExistingReview(response.data.review);
        }
      } catch (error) {
        console.error("Error checking review status:", error);
      }
    };

    if (booking.status === "COMPLETED") {
      checkReviewStatus();
    }
  }, [booking.id, booking.status]);

  const handleCancelService = async () => {
    setIsCancelling(true);
    try {
      await axios.post("/api/user/cancelService", {
        serviceId: booking.id,
      });

      toast.success("Service cancelled successfully");
      setIsConfirmOpen(false);
      onCancelSuccess(); // Refresh the services list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel service");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (stars: number, review: string) => {
    try {
      if (existingReview) {
        // Update existing review
        await axios.put("/api/review", {
          bookingId: booking.id,
          stars,
          review: review || null,
        });
        toast.success("Review updated successfully");
      } else {
        // Create new review
        await axios.post("/api/review", {
          bookingId: booking.id,
          userId: booking.userId,
          providerId: booking.ServiceProvider.id,
          serviceId: booking.Service.id,
          stars,
          review: review || null,
        });
        toast.success("Review submitted successfully");
      }

      setHasReviewed(true);

      // Refresh the existing review data
      const response = await axios.get(
        `/api/review/check?bookingId=${booking.id}`
      );
      if (response.data.review) {
        setExistingReview(response.data.review);
      }

      if (onReviewSuccess) onReviewSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
      throw error;
    }
  };

  const canCancel = booking.status === "PENDING";
  const canReview = booking.status === "COMPLETED";

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {booking.Service?.name}
              </h3>
              <p className="text-gray-500 mt-1">
                {booking.Service?.description}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              <span className="text-sm font-medium">{booking.status}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <IndianRupee className="h-5 w-5 text-green-500" />
              <span>₹{booking.basePrice}</span>
            </div>
          </div>

          {booking.ServiceProvider && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Service Provider
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {booking.ServiceProvider.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {booking.ServiceProvider.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {booking.ServiceProvider.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t flex flex-col space-y-3">
            {canCancel && (
              <Button
                variant={"destructive"}
                onClick={() => setIsConfirmOpen(true)}
                disabled={isCancelling}
                className="w-full px-4 py-2 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isCancelling ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{isCancelling ? "Cancelling..." : "Cancel Service"}</span>
              </Button>
            )}

            {canReview && !hasReviewed && (
              <Button
                onClick={() => setIsReviewOpen(true)}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>Write a Review</span>
              </Button>
            )}

            {hasReviewed && (
              <>
                <div className="text-center text-sm text-green-600 flex items-center justify-center mb-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>You&apos;ve reviewed this service</span>
                </div>
                <Button
                  onClick={() => setIsReviewOpen(true)}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="h-5 w-5" />
                  <span>Edit Review</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCancelService}
        title="Cancel Service"
        message="Are you sure you want to cancel this service? This action cannot be undone."
      />

      <ReviewDialog
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleSubmitReview}
        booking={booking}
        existingReview={existingReview}
      />
    </>
  );
};

const Page = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

  const fetchUserServices = async () => {
    if (user.id) {
      try {
        const response = await axios.post("api/user/getUserServices", {
          userId: user.id,
        });
        setServices(response.data.userServices);
        setFilteredServices(response.data.userServices);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    fetchUserServices();
  }, [user.id]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredServices(services);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = services.filter((service: any) => {
        return (
          service.status.toLowerCase().includes(lowerCaseSearch) ||
          (service.Service?.name &&
            service.Service.name.toLowerCase().includes(lowerCaseSearch)) ||
          (service.ServiceProvider?.name &&
            service.ServiceProvider.name
              .toLowerCase()
              .includes(lowerCaseSearch))
        );
      });
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">Your Service Bookings</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.address}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by status, service or provider name..."
            className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredServices.map((service) => (
            <ServiceBookingCard
              key={service?.id}
              booking={service}
              onCancelSuccess={fetchUserServices}
              onReviewSuccess={fetchUserServices}
            />
          ))}
          {filteredServices.length === 0 && (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500">
                No services found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
