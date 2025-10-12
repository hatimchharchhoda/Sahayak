"use client";

import React, { useState } from "react";
import {
  Upload,
  Send,
  FileText,
  MessageSquare,
  Hash,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

interface ITickat {
  subject: string;
  message: string;
  serviceId: string;
}

const Page = () => {
  const [formData, setFormData] = useState<ITickat>({
    subject: "",
    message: "",
    serviceId: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const data = new FormData();
    data.append("subject", formData.subject);
    data.append("message", formData.message);
    data.append("serviceId", formData.serviceId);
    if (image) data.append("image", image);

    try {
      await axios.post("/api/generate-ticket", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({ subject: "", message: "", serviceId: "" });
        removeImage();
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#FCE4EC] py-16 px-4 sm:px-6 lg:px-8 font-lato relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-[#FF6F61] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-[#26C6DA] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-[#FFCA28] opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6"
          >
            <HelpCircle className="w-5 h-5 text-[#FF6F61]" />
            <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">
              Support Center
            </span>
            <Sparkles className="w-5 h-5 text-[#26C6DA]" />
          </motion.div>

          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#FF6F61] to-[#FF8A65] rounded-3xl shadow-2xl mb-6 ring-4 ring-[#FF6F61]/10"
          >
            <FileText className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-5xl font-montserrat font-bold text-[#212121] mb-4"
          >
            Create a Support Ticket
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-[#9E9E9E] max-w-2xl mx-auto font-nunito"
          >
            Need help? Submit a support ticket and our friendly team will assist you quickly.
          </motion.p>
        </motion.div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6 p-5 bg-gradient-to-r from-[#66BB6A]/10 to-[#81C784]/10 border-2 border-[#66BB6A] rounded-2xl flex items-center space-x-3 backdrop-blur-sm shadow-lg"
          >
            <div className="h-10 w-10 rounded-xl bg-[#66BB6A] flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#212121] font-lato font-medium flex-1">
              <span className="font-poppins font-bold block">Success!</span>
              Ticket submitted successfully. We'll get back to you soon.
            </p>
          </motion.div>
        )}
        
        {submitStatus === "error" && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6 p-5 bg-gradient-to-r from-[#E57373]/10 to-[#EF5350]/10 border-2 border-[#E57373] rounded-2xl flex items-center space-x-3 backdrop-blur-sm shadow-lg"
          >
            <div className="h-10 w-10 rounded-xl bg-[#E57373] flex items-center justify-center shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#212121] font-lato font-medium flex-1">
              <span className="font-poppins font-bold block">Error!</span>
              Failed to submit ticket. Please try again.
            </p>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl border-2 border-transparent hover:border-[#FF6F61]/20 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_rgba(255,111,97,0.15)]"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#EDE7F6] to-[#F8BBD0] p-8 text-center border-b-2 border-[#F8BBD0]/30">
            <h2 className="text-2xl font-montserrat font-semibold text-[#212121] mb-2">
              Ticket Details
            </h2>
            <p className="text-sm text-[#9E9E9E] font-nunito">
              Provide as much detail as possible to help us assist you better.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Subject Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-poppins font-semibold text-[#212121] uppercase tracking-wide">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF6F61]/10 to-[#FF8A65]/10 flex items-center justify-center mr-2">
                  <MessageSquare className="w-4 h-4 text-[#FF6F61]" />
                </div>
                Subject 
                <span className="text-[#E57373] ml-1">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                required
                onChange={handleChange}
                placeholder="Brief description of your issue"
                className="w-full px-5 py-4 border-2 border-gray-100 focus:border-[#26C6DA] rounded-2xl placeholder-[#9E9E9E] text-[#424242] transition-all duration-300 bg-white focus:bg-gradient-to-r focus:from-[#EDE7F6]/10 focus:to-[#F8BBD0]/10 outline-none focus:ring-2 focus:ring-[#26C6DA]/20 font-lato shadow-sm hover:shadow-md hover:border-gray-200"
              />
            </motion.div>

            {/* Service ID Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-poppins font-semibold text-[#212121] uppercase tracking-wide">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#26C6DA]/10 to-[#4DD0E1]/10 flex items-center justify-center mr-2">
                  <Hash className="w-4 h-4 text-[#26C6DA]" />
                </div>
                Service ID 
                <span className="text-[#E57373] ml-1">*</span>
              </label>
              <input
                type="text"
                name="serviceId"
                value={formData.serviceId}
                required
                onChange={handleChange}
                placeholder="Enter related service ID"
                className="w-full px-5 py-4 border-2 border-gray-100 focus:border-[#26C6DA] rounded-2xl placeholder-[#9E9E9E] text-[#424242] transition-all duration-300 bg-white focus:bg-gradient-to-r focus:from-[#EDE7F6]/10 focus:to-[#F8BBD0]/10 outline-none focus:ring-2 focus:ring-[#26C6DA]/20 font-lato shadow-sm hover:shadow-md hover:border-gray-200"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-poppins font-semibold text-[#212121] uppercase tracking-wide">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF6F61]/10 to-[#FF8A65]/10 flex items-center justify-center mr-2">
                  <FileText className="w-4 h-4 text-[#FF6F61]" />
                </div>
                Message 
                <span className="text-[#E57373] ml-1">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                required
                rows={6}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                className="w-full px-5 py-4 border-2 border-gray-100 focus:border-[#26C6DA] rounded-2xl placeholder-[#9E9E9E] text-[#424242] transition-all duration-300 bg-white focus:bg-gradient-to-r focus:from-[#EDE7F6]/10 focus:to-[#F8BBD0]/10 resize-none outline-none focus:ring-2 focus:ring-[#26C6DA]/20 font-lato shadow-sm hover:shadow-md hover:border-gray-200"
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-poppins font-semibold text-[#212121] uppercase tracking-wide">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#26C6DA]/10 to-[#4DD0E1]/10 flex items-center justify-center mr-2">
                  <ImageIcon className="w-4 h-4 text-[#26C6DA]" />
                </div>
                Upload Image 
                <span className="text-[#9E9E9E] ml-2 text-xs font-nunito normal-case">(Optional)</span>
              </label>

              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#26C6DA]/40 rounded-2xl cursor-pointer hover:border-[#FF6F61] hover:bg-gradient-to-r hover:from-[#EDE7F6]/20 hover:to-[#F8BBD0]/20 transition-all duration-300 shadow-sm hover:shadow-lg group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#26C6DA]/10 to-[#4DD0E1]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-7 h-7 text-[#26C6DA]" />
                  </div>
                  <p className="text-sm text-[#424242] font-lato">
                    <span className="font-poppins font-semibold text-[#FF6F61]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#9E9E9E] mt-1 font-nunito">PNG, JPG, GIF up to 10MB</p>
                </label>
              ) : (
                <div className="relative bg-gradient-to-r from-[#EDE7F6]/30 to-[#F8BBD0]/30 rounded-2xl p-5 border-2 border-[#26C6DA]/30 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    {previewUrl && (
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-lg" 
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-poppins font-semibold text-[#212121] mb-1">{image.name}</p>
                      <p className="text-xs text-[#9E9E9E] font-nunito">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={removeImage} 
                    className="p-2 hover:bg-[#E57373]/20 rounded-xl transition-colors duration-300 group"
                  >
                    <X className="w-5 h-5 text-[#E57373] group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#FF6F61] to-[#FF8A65] text-white font-poppins font-semibold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-[0_15px_35px_rgba(255,111,97,0.4)] uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              {isSubmitting ? (
                <div className="flex items-center space-x-2 relative z-10">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Submit Ticket</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Help Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center mt-8 text-sm text-[#9E9E9E] font-nunito"
        >
          Our support team typically responds within 24 hours ✨
        </motion.p>
      </div>
    </div>
  );
};

export default Page;