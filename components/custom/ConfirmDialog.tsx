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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gradient-to-tr from-[#EDE7F6] to-[#F8BBD0] rounded-3xl p-6 max-w-sm mx-4 shadow-2xl"
          >
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-montserrat font-semibold text-[#212121] mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-[#424242] font-lato mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-[#26C6DA] text-[#26C6DA] rounded-xl font-poppins font-medium uppercase hover:bg-gradient-to-r hover:from-[#26C6DA]/20 hover:to-[#26C6DA]/30 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Cancel
              </button>

              <Button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl font-poppins font-medium uppercase
                  bg-gradient-to-r from-[#FF6F61] to-[#FF8A65] 
                  text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
