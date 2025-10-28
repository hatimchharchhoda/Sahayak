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
  ImageIcon,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-8 font-poppins">
      {/* Import fonts globally */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm mb-6 border border-[#E5E7EB]"
          >
            <HelpCircle className="w-5 h-5 text-[#2563EB]" />
            <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">
              Support Center
            </span>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </motion.div>

          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl shadow-md mb-6"
          >
            <FileText className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-5xl font-inter font-semibold text-[#111827] mb-4"
          >
            Create a Support Ticket
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-[#9CA3AF] max-w-2xl mx-auto font-nunito"
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
            className="mb-6 p-5 bg-[#10B981]/5 border border-[#10B981] rounded-lg flex items-center space-x-3"
          >
            <div className="h-10 w-10 rounded-lg bg-[#10B981] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#111827] font-poppins flex-1">
              <span className="font-inter font-semibold block">Success!</span>
              <span className="text-sm text-[#374151]">Ticket submitted successfully. We&apos;ll get back to you soon.</span>
            </p>
          </motion.div>
        )}
        
        {submitStatus === "error" && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6 p-5 bg-[#EF4444]/5 border border-[#EF4444] rounded-lg flex items-center space-x-3"
          >
            <div className="h-10 w-10 rounded-lg bg-[#EF4444] flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-[#111827] font-poppins flex-1">
              <span className="font-inter font-semibold block">Error!</span>
              <span className="text-sm text-[#374151]">Failed to submit ticket. Please try again.</span>
            </p>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] overflow-hidden transition-all duration-500 hover:shadow-lg"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] p-8 text-center border-b border-[#E5E7EB]">
            <h2 className="text-2xl font-inter font-semibold text-[#111827] mb-2">
              Ticket Details
            </h2>
            <p className="text-sm text-[#9CA3AF] font-nunito">
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
              <label className="flex items-center text-sm font-inter font-medium text-[#111827]">
                <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mr-2">
                  <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                </div>
                Subject 
                <span className="text-[#EF4444] ml-1">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                required
                onChange={handleChange}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 border border-[#E5E7EB] focus:border-[#14B8A6] rounded-lg placeholder-[#9CA3AF] text-[#374151] transition-all duration-300 bg-white outline-none focus:ring-2 focus:ring-[#14B8A6]/20 font-poppins"
              />
            </motion.div>

            {/* Service ID Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-inter font-medium text-[#111827]">
                <div className="h-8 w-8 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center mr-2">
                  <Hash className="w-4 h-4 text-[#14B8A6]" />
                </div>
                Service ID 
                <span className="text-[#EF4444] ml-1">*</span>
              </label>
              <input
                type="text"
                name="serviceId"
                value={formData.serviceId}
                required
                onChange={handleChange}
                placeholder="Enter related service ID"
                className="w-full px-4 py-3 border border-[#E5E7EB] focus:border-[#14B8A6] rounded-lg placeholder-[#9CA3AF] text-[#374151] transition-all duration-300 bg-white outline-none focus:ring-2 focus:ring-[#14B8A6]/20 font-poppins"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-inter font-medium text-[#111827]">
                <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mr-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                </div>
                Message 
                <span className="text-[#EF4444] ml-1">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                required
                rows={6}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-3 border border-[#E5E7EB] focus:border-[#14B8A6] rounded-lg placeholder-[#9CA3AF] text-[#374151] transition-all duration-300 bg-white resize-none outline-none focus:ring-2 focus:ring-[#14B8A6]/20 font-poppins"
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="flex items-center text-sm font-inter font-medium text-[#111827]">
                <div className="h-8 w-8 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center mr-2">
                  <ImageIcon className="w-4 h-4 text-[#14B8A6]" />
                </div>
                Upload Image 
                <span className="text-[#9CA3AF] ml-2 text-xs font-nunito normal-case">(Optional)</span>
              </label>

              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#14B8A6] hover:bg-[#F8FAFC] transition-all duration-300 group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="h-14 w-14 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-7 h-7 text-[#14B8A6]" />
                  </div>
                  <p className="text-sm text-[#374151] font-poppins">
                    <span className="font-inter font-semibold text-[#2563EB]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-1 font-nunito">PNG, JPG, GIF up to 10MB</p>
                </label>
              ) : (
                <div className="relative bg-[#F8FAFC] rounded-lg p-5 border border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg border border-[#E5E7EB]" 
                      />
                    )}
                    <div>
                      <p className="text-sm font-poppins font-medium text-[#111827] mb-1">{image.name}</p>
                      <p className="text-xs text-[#9CA3AF] font-nunito">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={removeImage} 
                    className="p-2 hover:bg-[#EF4444]/10 rounded-lg transition-colors duration-300 group"
                  >
                    <X className="w-5 h-5 text-[#EF4444] group-hover:scale-110 transition-transform" />
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
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-inter font-medium py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-sm hover:shadow-lg uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Ticket</span>
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
          className="text-center mt-8 text-sm text-[#9CA3AF] font-nunito"
        >
          Our support team typically responds within 24 hours
        </motion.p>
      </div>
    </div>
  );
};

export default Page;