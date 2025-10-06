import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

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
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] rounded-3xl p-6 max-w-md mx-4 w-full shadow-2xl border border-[#FF7043]">
        <h3 className="text-2xl font-nunito font-bold text-[#212121] mb-2 text-center">
          {existingReview ? "Edit your Review" : "Rate your Experience"}
        </h3>
        <p className="text-gray-700 mb-4 text-center">
          How was your experience with{" "}
          <span className="font-semibold">{booking.ServiceProvider?.name}</span> for{" "}
          <span className="font-semibold">{booking.Service?.name}</span>?
        </p>

        {/* Star Rating */}
        <div className="mb-4 text-center">
          <label className="block text-sm font-poppins font-semibold text-[#212121] mb-2">
            Rating
          </label>
          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setStars(rating)}
                className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    stars >= rating
                      ? "text-yellow-500 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label
            htmlFor="review"
            className="block text-sm font-poppins font-semibold text-[#212121] mb-1"
          >
            Your Review (Optional)
          </label>
          <textarea
            id="review"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF7043] placeholder-gray-500 transition-all bg-white resize-none shadow-sm"
            placeholder="Tell us about your experience..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-[#212121] rounded-2xl font-poppins font-semibold transition-colors shadow-sm"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-gradient-to-r from-[#FF7043] to-pink-400 hover:scale-105 transform text-white font-poppins font-semibold rounded-2xl transition-all flex items-center space-x-2 shadow-lg"
          >
            {submitting && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>
              {submitting
                ? "Submitting..."
                : existingReview
                ? "Update Review"
                : "Submit Review"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDialog;
