import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
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
              className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl border border-[#E5E7EB]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-inter font-semibold text-[#111827] mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-[#374151] font-poppins mb-6">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg font-inter font-medium hover:bg-[#F8FAFC] hover:border-[#14B8A6] transition-all duration-200"
                >
                  Cancel
                </button>

                <Button
                  onClick={onConfirm}
                  className="px-4 py-2.5 rounded-lg font-inter font-medium
                    bg-[#EF4444] hover:bg-[#DC2626]
                    text-white hover:scale-[1.02] transition-all duration-200"
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConfirmDialog;
