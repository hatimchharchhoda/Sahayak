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
    if (formData.customerMobile) data.append("customerMobile", formData.customerMobile);
    if (formData.customerAddress) data.append("customerAddress", formData.customerAddress);
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
    <div className="min-h-screen bg-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Create Ticket (Provider)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Submit a ticket on behalf of your customer. Customer details are optional.
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                Ticket submitted successfully!
              </p>
            </div>
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">
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
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Subject */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
                Subject<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                required
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                Message<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                rows={6}
                required
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
              />
            </div>

            {/* Optional Customer Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-purple-600" />
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-purple-600" />
                  Customer Mobile (Optional)
                </label>
                <input
                  type="text"
                  name="customerMobile"
                  value={formData.customerMobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                  Customer Address (Optional)
                </label>
                <input
                  type="text"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 mr-2 text-indigo-600" />
                Upload Image (Optional)
              </label>
              {!image ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-purple-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center"
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
      </div>
    </div>
  );
};

export default ProviderTicketPage;