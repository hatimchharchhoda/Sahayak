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
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl"
          >
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-[Poppins] font-semibold text-[#212121] mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-[#616161] font-[Nunito Sans] mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#616161] rounded-lg font-[Poppins] font-bold transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>

              <Button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg font-[Poppins] font-bold uppercase
                  bg-gradient-to-r from-[#00C853] to-[#64DD17] 
                  text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
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