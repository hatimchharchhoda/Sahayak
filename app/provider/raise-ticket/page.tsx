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
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] to-[#DCEDC8] py-20 px-4 sm:px-6 lg:px-8 font-[Nunito_Sans]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8F5E9] rounded-full mb-4 shadow-md">
            <FileText className="w-8 h-8 text-[#00C853]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-[Poppins] font-semibold text-[#212121] mb-2">
            Create Ticket (Provider)
          </h1>
          <p className="text-lg text-[#424242] max-w-2xl mx-auto">
            Submit a ticket on behalf of your customer. Customer details are
            optional.
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-[#43A047] mr-2" />
              <p className="text-[#2E7D32] font-medium">
                Ticket submitted successfully!
              </p>
            </div>
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-[#E53935] mr-2" />
              <p className="text-[#C62828] font-medium">
                Failed to submit ticket. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 rounded-2xl shadow-xl border border-[#00C853]/20 overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-[#AEEA00]/40">
            <h2 className="text-xl font-semibold text-[#212121] font-[Poppins]">
              Ticket Details
            </h2>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Subject */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#424242] mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-[#00C853]" />
                Subject<span className="text-[#E53935] ml-1">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                required
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#BDBDBD] rounded-xl focus:ring-2 focus:ring-[#AEEA00] focus:outline-none"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#424242] mb-2">
                <FileText className="w-4 h-4 mr-2 text-[#00C853]" />
                Message<span className="text-[#E53935] ml-1">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                rows={6}
                required
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#BDBDBD] rounded-xl resize-none focus:ring-2 focus:ring-[#AEEA00] focus:outline-none"
              />
            </div>

            {/* Optional Customer Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[#424242] mb-2">
                  <User className="w-4 h-4 mr-2 text-[#00C853]" />
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#BDBDBD] rounded-xl focus:ring-2 focus:ring-[#AEEA00] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[#424242] mb-2">
                  <Phone className="w-4 h-4 mr-2 text-[#00C853]" />
                  Customer Mobile (Optional)
                </label>
                <input
                  type="text"
                  name="customerMobile"
                  value={formData.customerMobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#BDBDBD] rounded-xl focus:ring-2 focus:ring-[#AEEA00] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[#424242] mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-[#00C853]" />
                  Customer Address (Optional)
                </label>
                <input
                  type="text"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#BDBDBD] rounded-xl focus:ring-2 focus:ring-[#AEEA00] focus:outline-none"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-[#424242] mb-2">
                <Image className="w-4 h-4 mr-2 text-[#00C853]" />
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
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#BDBDBD] rounded-xl cursor-pointer hover:border-[#AEEA00] hover:bg-[#F1F8E9] transition-all duration-200">
                    <Upload className="w-8 h-8 text-[#9E9E9E] mb-2" />
                    <p className="text-sm text-[#616161]">
                      <span className="font-medium text-[#00C853]">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-[#FAFAFA] rounded-xl p-4 border border-[#C8E6C9]">
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
                        <p className="text-sm font-medium text-[#212121]">
                          {image.name}
                        </p>
                        <p className="text-xs text-[#757575]">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-1 hover:bg-[#E0E0E0] rounded-full"
                    >
                      <X className="w-4 h-4 text-[#616161]" />
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
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 disabled:bg-[#A5D6A7] text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
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