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
    if (booking.status === "COMPLETED") checkReviewStatus();
  }, [booking.id, booking.status]);

  const handleCancelService = async () => {
    setIsCancelling(true);
    try {
      await axios.post("/api/user/cancelService", { serviceId: booking.id });
      toast.success("Service cancelled successfully");
      setIsConfirmOpen(false);
      onCancelSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel service");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (stars: number, review: string) => {
    try {
      if (existingReview) {
        await axios.put("/api/review", {
          bookingId: booking.id,
          stars,
          review: review || null,
        });
        toast.success("Review updated successfully");
      } else {
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

      const response = await axios.get(`/api/review/check?bookingId=${booking.id}`);
      if (response.data.review) setExistingReview(response.data.review);
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
      <div className="bg-gradient-to-br from-[#FFF0E5] via-[#FFD6C4] to-[#FFBCB3] rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] hover:shadow-2xl">
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold font-nunito truncate text-[#212121]">
                {booking.Service?.name}
              </h3>
              <p className="text-sm sm:text-base font-lato text-[#757575] mt-1 line-clamp-2">
                {booking.Service?.description}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full flex items-center space-x-2 ${getStatusColor(
                booking.status
              )} flex-shrink-0 self-start font-poppins font-semibold text-xs sm:text-sm`}
            >
              {getStatusIcon(booking.status)}
              <span>{booking.status}</span>
            </div>
          </div>

          {/* Date & Price */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-[#757575]">
              <Calendar className="h-5 w-5 text-[#26A69A]" />
              <span className="font-lato text-sm sm:text-base">{date}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#757575]">
              <IndianRupee className="h-5 w-5 text-[#81C784]" />
              <span className="font-lato text-sm sm:text-base">₹{booking.basePrice}</span>
            </div>
          </div>

          {/* Provider Info */}
          {booking.ServiceProvider && (
            <div className="mt-5 border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-[#212121] font-nunito">
                  Service Provider
                </h4>
                {booking.status !== "PENDING" && !booking.isPaid && (
                  <Link href={`/chat/${booking.ServiceProvider.id}`}>
                    <Button className="bg-gradient-to-r from-[#FF7043] to-[#FF8A65] hover:scale-105 text-white px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-transform text-sm sm:text-base">
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat</span>
                    </Button>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 min-w-0">
                  <User className="h-4 w-4 text-[#757575]" />
                  <span className="text-sm truncate">{booking.ServiceProvider.name}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Phone className="h-4 w-4 text-[#757575]" />
                  <span className="text-sm truncate">{booking.ServiceProvider.phone}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Mail className="h-4 w-4 text-[#757575]" />
                  <span className="text-sm truncate">{booking.ServiceProvider.email}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Hash className="h-4 w-4 text-[#757575]" />
                  <span className="text-sm truncate">ID: {booking.ServiceProvider.id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 border-t pt-4 flex flex-col space-y-3">
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => setIsConfirmOpen(true)}
                disabled={isCancelling}
                className="w-full bg-[#E57373] hover:bg-[#EF5350] text-white font-poppins rounded-lg px-4 py-2 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02]"
              >
                {isCancelling ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>{isCancelling ? "Cancelling..." : "Cancel Service"}</span>
              </Button>
            )}

            {canReview && !hasReviewed && (
              <Button
                onClick={() => setIsReviewOpen(true)}
                className="w-full bg-gradient-to-r from-[#FFD54F] to-[#FFCA28] hover:scale-105 text-[#212121] font-poppins rounded-lg px-4 py-2 flex items-center justify-center space-x-2 transition-transform"
              >
                <Star className="h-4 w-4" />
                <span>Write a Review</span>
              </Button>
            )}

            {hasReviewed && (
              <>
                <Button
                  onClick={() => setIsReviewOpen(true)}
                  className="w-full bg-gradient-to-r from-[#26A69A] to-[#4DB6AC] hover:scale-105 text-white font-poppins rounded-lg px-4 py-2 flex items-center justify-center space-x-2 transition-transform"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Review</span>
                </Button>
              </>
            )}

            {booking.isPaid && (
              <div className="text-center text-sm text-[#81C784] flex items-center justify-center mb-2">
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