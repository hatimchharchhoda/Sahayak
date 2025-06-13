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
      return <CheckCircle className="h-5 w-5" />;
    case "CANCELLED":
      return <XCircle className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
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
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Service Provider
                </h4>
                {/* Chat Button - Positioned in Service Provider header */}
                <Link href={`/chat/${booking.ServiceProvider.id}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm px-3 py-2">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </Link>
              </div>
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

            {booking.isPaid && (
              <div className="text-center text-sm text-green-600 flex items-center justify-center mb-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Payment Successful</span>
              </div>
            )}

            {booking.status === "COMPLETED" && !booking.isPaid && (
              <Payment amount={booking.basePrice} bookingId={booking.id} />
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
