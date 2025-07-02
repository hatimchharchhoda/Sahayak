import axios from "axios";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Edit,
  IndianRupee,
  Mail,
  Phone,
  Star,
  User,
  XCircle,
  MessageCircle,
  Hash,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import ConfirmDialog from "./ConfirmDialog";
import ReviewDialog from "./ReviewDialog";
import Link from "next/link";
import Payment from "./Payment";

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
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
    default:
      return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
  }
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {booking.Service?.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-1 line-clamp-2">
                {booking.Service?.description}
              </p>
            </div>
            <div
              className={`px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(
                booking.status
              )} flex-shrink-0 self-start`}
            >
              {getStatusIcon(booking.status)}
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Date and Price Grid - Responsive */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">{date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">₹{booking.basePrice}</span>
            </div>
          </div>

          {/* Service Provider Section */}
          {booking.ServiceProvider && (
            <div className="mt-4 sm:mt-6 border-t pt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  Service Provider
                </h4>
                {booking.status !== "PENDING" && !booking.isPaid && (
                  <Link href={`/chat/${booking.ServiceProvider.id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm px-3 py-2 text-sm w-full sm:w-auto">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </Link>
                )}
              </div>

              {/* Provider Info Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 min-w-0">
                  <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {booking.ServiceProvider.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {booking.ServiceProvider.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2 min-w-0 sm:col-span-1">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {booking.ServiceProvider.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Hash className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    ID: {booking.ServiceProvider.id}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="mt-4 sm:mt-6 pt-4 border-t flex flex-col space-y-3">
            {canCancel && (
              <Button
                variant={"destructive"}
                onClick={() => setIsConfirmOpen(true)}
                disabled={isCancelling}
                className="w-full px-4 py-2 sm:py-3 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isCancelling ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span>{isCancelling ? "Cancelling..." : "Cancel Service"}</span>
              </Button>
            )}

            {canReview && !hasReviewed && (
              <Button
                onClick={() => setIsReviewOpen(true)}
                className="w-full px-4 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  className="w-full px-4 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Edit Review</span>
                </Button>
              </>
            )}

            {booking.isPaid && (
              <div className="text-center text-sm text-green-600 flex items-center justify-center mb-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Payment Successful</span>
              </div>
            )}

            {booking.status === "COMPLETED" && !booking.isPaid && (
              <div className="w-full">
                <Payment amount={booking.basePrice} bookingId={booking.id} />
              </div>
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

export default ServiceBookingCard;
