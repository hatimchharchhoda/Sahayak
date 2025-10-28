/* eslint-disable @typescript-eslint/no-explicit-any */
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
      return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
    case "ACCEPTED":
      return "bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20";
    case "PENDING":
      return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
    case "CANCELLED":
      return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getStatusIcon = (status: any) => {
  switch (status) {
    case "COMPLETED":
    case "ACCEPTED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const ServiceBookingCard = ({ booking, onCancelSuccess, onReviewSuccess }: any) => {
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
        const response = await axios.get(`/api/review/check?bookingId=${booking.id}`);
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
        await axios.put("/api/review", { bookingId: booking.id, stars, review: review || null });
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
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
      `}</style>

      <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] transform transition-all hover:shadow-lg hover:scale-[1.02] p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-inter font-semibold text-[#111827] truncate">
              {booking.Service?.name}
            </h3>
            <p className="text-sm sm:text-base font-poppins text-[#374151] mt-1 line-clamp-2">
              {booking.Service?.description}
            </p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 font-poppins font-medium text-xs sm:text-sm border ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusIcon(booking.status)}
            <span>{booking.status}</span>
          </div>
        </div>

        {/* Date & Price */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-[#374151] bg-[#F8FAFC] px-3 py-2 rounded-lg">
            <Calendar className="h-5 w-5 text-[#14B8A6]" />
            <span className="font-poppins text-sm sm:text-base">{date}</span>
          </div>
          <div className="flex items-center space-x-2 text-[#374151] bg-[#F8FAFC] px-3 py-2 rounded-lg">
            <IndianRupee className="h-5 w-5 text-[#2563EB]" />
            <span className="font-poppins text-sm sm:text-base">₹{booking.basePrice}</span>
          </div>
        </div>

        {/* Provider Info */}
        {booking.ServiceProvider && (
          <div className="mt-5 border-t border-[#E5E7EB] pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-inter font-semibold text-[#111827]">
                Service Provider
              </h4>
              {booking.status !== "PENDING" && !booking.isPaid && (
                <Link href={`/chat/${booking.ServiceProvider.id}`}>
                  <Button className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:scale-105 text-white px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-transform text-xs sm:text-sm font-inter">
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 min-w-0 text-[#374151]">
                <User className="h-4 w-4 text-[#9CA3AF]" />
                <span className="text-sm truncate font-poppins">{booking.ServiceProvider.name}</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0 text-[#374151]">
                <Phone className="h-4 w-4 text-[#9CA3AF]" />
                <span className="text-sm truncate font-poppins">{booking.ServiceProvider.phone}</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0 text-[#374151]">
                <Mail className="h-4 w-4 text-[#9CA3AF]" />
                <span className="text-sm truncate font-poppins">{booking.ServiceProvider.email}</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0 text-[#374151]">
                <Hash className="h-4 w-4 text-[#9CA3AF]" />
                <span className="text-sm truncate font-poppins">ID: {booking.ServiceProvider.id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 border-t border-[#E5E7EB] pt-4 flex flex-col space-y-3">
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isCancelling}
              className="w-full bg-[#EF4444] hover:bg-[#DC2626] hover:scale-[1.02] text-white font-inter font-medium uppercase rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 transition-all text-sm tracking-wide"
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
              className="w-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] text-white font-inter font-medium uppercase rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 transition-all text-sm tracking-wide"
            >
              <Star className="h-4 w-4" />
              <span>Write a Review</span>
            </Button>
          )}

          {hasReviewed && (
            <Button
              onClick={() => setIsReviewOpen(true)}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:scale-[1.02] text-white font-inter font-medium uppercase rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 transition-all text-sm tracking-wide"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Review</span>
            </Button>
          )}

          {booking.isPaid && (
            <div className="text-center text-sm text-[#10B981] flex items-center justify-center font-poppins">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Payment Successful</span>
            </div>
          )}

          {booking.status === "COMPLETED" && !booking.isPaid && (
            <Payment amount={booking.basePrice} bookingId={booking.id} />
          )}
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
