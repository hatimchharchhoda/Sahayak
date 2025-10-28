import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReviewDialog = ({ isOpen, onClose, onSubmit, booking, existingReview }: any) => {
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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4 w-full shadow-xl border border-[#E5E7EB]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h3 className="text-2xl font-inter font-semibold text-[#111827] mb-2 text-center">
                {existingReview ? "Edit Your Review" : "Rate Your Experience"}
              </h3>

              {/* Message */}
              <p className="text-[#374151] mb-6 text-center font-poppins text-sm">
                How was your experience with{" "}
                <span className="font-semibold text-[#111827]">{booking.ServiceProvider?.name}</span> for{" "}
                <span className="font-semibold text-[#111827]">{booking.Service?.name}</span>?
              </p>

              {/* Star Rating */}
              <div className="mb-6 text-center">
                <label className="block text-sm font-inter font-medium text-[#111827] mb-3">
                  Rating
                </label>
                <div className="flex justify-center space-x-2">
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
                            ? "text-[#F59E0B] fill-[#F59E0B]"
                            : "text-[#E5E7EB]"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label
                  htmlFor="review"
                  className="block text-sm font-inter font-medium text-[#111827] mb-2"
                >
                  Your Review (Optional)
                </label>
                <textarea
                  id="review"
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] placeholder-[#9CA3AF] transition-all bg-white resize-none font-poppins text-sm"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg font-inter font-medium hover:bg-[#F8FAFC] hover:border-[#14B8A6] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] transform text-white font-inter font-medium rounded-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReviewDialog;
