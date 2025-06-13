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

export default ReviewDialog;
