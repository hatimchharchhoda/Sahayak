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
} from "lucide-react";
import axios from "axios";

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
    <div className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] py-16 px-4 font-lato">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF7043] to-pink-400 rounded-full shadow-lg mb-4 animate-bounce">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-nunito font-bold text-[#212121] mb-2">
            Create a Support Ticket
          </h1>
          <p className="text-lg text-[#757575] max-w-2xl mx-auto">
            Need help? Submit a support ticket and our friendly team will assist you quickly.
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="mb-6 p-5 bg-[#81C78433] border border-[#81C784] rounded-2xl flex items-center space-x-3 animate-fadeIn">
            <CheckCircle className="w-6 h-6 text-[#81C784]" />
            <p className="text-[#212121] font-poppins font-semibold">
              Ticket submitted successfully! We'll get back to you soon.
            </p>
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-5 bg-[#E5737333] border border-[#E57373] rounded-2xl flex items-center space-x-3 animate-fadeIn">
            <AlertCircle className="w-6 h-6 text-[#E57373]" />
            <p className="text-[#212121] font-poppins font-semibold">
              Failed to submit ticket. Please try again.
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-[#FFAB91] overflow-hidden p-8 space-y-6"
        >
          {/* Ticket Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-nunito font-bold text-[#212121] mb-1">
              Ticket Details
            </h2>
            <p className="text-sm text-[#757575]">
              Provide as much detail as possible to help us assist you better.
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-poppins font-semibold text-[#212121]">
              <MessageSquare className="w-5 h-5 mr-2 text-[#FF7043]" /> Subject 
              <span className="text-[#E57373] ml-1">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              required
              onChange={handleChange}
              placeholder="Brief description of your issue"
              className="w-full px-5 py-3 border-b-2 border-gray-300 focus:border-[#FF7043] rounded-md placeholder-gray-400 text-[#212121] transition-all duration-300 bg-white focus:bg-[#FFF3EE]"
            />
          </div>

          {/* Service ID */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-poppins font-semibold text-[#212121]">
              <Hash className="w-5 h-5 mr-2 text-[#26A69A]" /> Service ID 
              <span className="text-[#E57373] ml-1">*</span>
            </label>
            <input
              type="text"
              name="serviceId"
              value={formData.serviceId}
              required
              onChange={handleChange}
              placeholder="Enter related service ID"
              className="w-full px-5 py-3 border-b-2 border-gray-300 focus:border-[#FF7043] rounded-md placeholder-gray-400 text-[#212121] transition-all duration-300 bg-white focus:bg-[#FFF3EE]"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-poppins font-semibold text-[#212121]">
              <FileText className="w-5 h-5 mr-2 text-[#FF7043]" /> Message 
              <span className="text-[#E57373] ml-1">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              required
              rows={6}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
              className="w-full px-5 py-3 border-b-2 border-gray-300 focus:border-[#FF7043] rounded-md placeholder-gray-400 text-[#212121] transition-all duration-300 bg-white focus:bg-[#FFF3EE] resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-poppins font-semibold text-[#212121]">
              <Upload className="w-5 h-5 mr-2 text-[#26A69A]" /> Upload Image 
              <span className="text-[#757575] ml-2 text-xs">(Optional)</span>
            </label>

            {!image ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#FF7043] rounded-2xl cursor-pointer hover:border-pink-400 hover:bg-[#FFF3EE] transition-all duration-300">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Upload className="w-10 h-10 text-[#FF7043] mb-2" />
                <p className="text-sm text-[#757575]"><span className="font-poppins font-semibold text-[#FF7043]">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-[#BDBDBD] mt-1">PNG, JPG, GIF up to 10MB</p>
              </label>
            ) : (
              <div className="relative bg-[#FFF3EE] rounded-2xl p-4 border border-[#FFAB91] flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  {previewUrl && <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />}
                  <div>
                    <p className="text-sm font-poppins font-semibold text-[#212121]">{image.name}</p>
                    <p className="text-xs text-[#757575]">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button type="button" onClick={removeImage} className="p-2 hover:bg-[#FFAB91]/50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-[#E57373]" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FF7043] to-pink-400 hover:scale-105 transform text-white font-poppins font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
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
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
