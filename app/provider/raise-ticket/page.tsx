"use client";

import React, { useState } from "react";
import {
  Upload,
  Send,
  FileText,
  MessageSquare,
  Image,
  User,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import axios from "axios";

interface ITicket {
  subject: string;
  message: string;
  customerName?: string;
  customerMobile?: string;
  customerAddress?: string;
}

const ProviderTicketPage = () => {
  const [formData, setFormData] = useState<ITicket>({
    subject: "",
    message: "",
    customerName: "",
    customerMobile: "",
    customerAddress: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function removeImage() {
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const data = new FormData();
    data.append("subject", formData.subject);
    data.append("message", formData.message);
    if (formData.customerName) data.append("customerName", formData.customerName);
    if (formData.customerMobile)
      data.append("customerMobile", formData.customerMobile);
    if (formData.customerAddress)
      data.append("customerAddress", formData.customerAddress);
    if (image) data.append("image", image);

    try {
      const response = await axios.post("/api/generate-ticket-provider", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      setSubmitStatus("success");

      setTimeout(() => {
        setFormData({
          subject: "",
          message: "",
          customerName: "",
          customerMobile: "",
          customerAddress: "",
        });
        removeImage();
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.log(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8 font-[Poppins]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full mb-4 shadow-md">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-[Inter] font-semibold text-gray-900 mb-2">
            Create Ticket (Provider)
          </h1>
          <p className="text-lg text-gray-600 font-[Nunito_Sans] max-w-2xl mx-auto">
            Submit a ticket on behalf of your customer. Customer details are
            optional.
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
              <p className="text-emerald-700 font-[Inter] font-medium">
                Ticket submitted successfully!
              </p>
            </div>
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 font-[Inter] font-medium">
                Failed to submit ticket. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-[Inter] font-semibold text-gray-900">
              Ticket Details
            </h2>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Subject */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-[Inter] font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Subject<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                required
                onChange={handleChange}
                placeholder="Enter ticket subject"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-[Inter] font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Message<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                rows={6}
                required
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Optional Customer Fields Section */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100 space-y-6">
              <h3 className="text-sm font-[Inter] font-semibold text-gray-900 uppercase tracking-wide">
                Customer Information (Optional)
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-[Inter] font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-teal-600" />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-[Inter] font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-teal-600" />
                    Customer Mobile
                  </label>
                  <input
                    type="text"
                    name="customerMobile"
                    value={formData.customerMobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-[Inter] font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                    Customer Address
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    placeholder="Enter customer address"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-[Inter] font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 mr-2 text-blue-600" />
                Upload Image (Optional)
              </label>
              {!image ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-teal-50 transition-all duration-300 group">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-teal-600 mb-2 transition-colors duration-300" />
                    <p className="text-sm text-gray-600">
                      <span className="font-[Inter] font-medium text-blue-600 group-hover:text-teal-600 transition-colors duration-300">
                        Click to upload
                      </span>{" "}
                      <span className="font-[Nunito_Sans]">or drag and drop</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-[Nunito_Sans]">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                      )}
                      <div>
                        <p className="text-sm font-[Inter] font-medium text-gray-900">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500 font-[Nunito_Sans] mt-0.5">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200 group"
                    >
                      <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-[Inter] font-semibold py-4 px-8 rounded-xl shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 font-[Nunito_Sans]">
            Our support team will review your ticket and respond within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderTicketPage;