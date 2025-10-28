/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  ArrowRight,
  MapPin,
  Star,
  IndianRupee,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Service {
  name: string;
  description: string;
  basePrice: number;
  categoryName: string;
}

interface Props {
  serviceId: string;
  providerId?: string;
}

const ServiceDetails: React.FC<Props> = ({ serviceId, providerId }) => {
  const [isloading, setisloading] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [rating, setRating] = useState<{ averageRating: string; totalReviews: number }>({
    averageRating: "0.0",
    totalReviews: 0,
  });

  const timeSlots: string[] = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  ];

  // 🟢 Fetch Service Details
  const fetchService = async () => {
    try {
      const response = await axios.post("/api/getOneService", { serviceId });
      setService(response.data.service || null);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch Ratings Dynamically
  const fetchRatings = async () => {
    if (!providerId) return;
    try {
      const res = await axios.post("/api/getProviderServiceRatings", { providerId });
      const allRatings = res.data;
      const thisServiceRating = allRatings.find(
        (r: any) => r.serviceId === serviceId
      );

      if (thisServiceRating) {
        setRating({
          averageRating: thisServiceRating.averageRating,
          totalReviews: thisServiceRating.totalReviews,
        });
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  useEffect(() => {
    fetchService();
    fetchRatings();
  }, [serviceId, providerId]);

  const convertTo24Hour = (time: string) => {
    const [hours, minutesPart] = time.split(":");
    const [minutes, period] = minutesPart.split(" ");
    let hours24 = parseInt(hours);
    if (period === "PM" && hours24 !== 12) hours24 += 12;
    if (period === "AM" && hours24 === 12) hours24 = 0;
    return `${hours24.toString().padStart(2, "0")}:${minutes}:00`;
  };

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const bookingData: any = {
      serviceId,
      date: new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`),
      basePrice: service?.basePrice ?? 0,
    };
    if (providerId) bookingData.providerId = providerId;

    try {
      setisloading(true);
      await axios.post("/api/bookService", bookingData);
      toast.success("Service Booked!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Booking failed");
    } finally {
      setisloading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!service) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        .gradient-blue {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        }
      `}</style>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4 border border-[#E5E7EB]">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span className="text-sm font-inter font-medium text-[#111827] uppercase tracking-wide">
              Service Overview
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold font-inter text-[#111827] mb-4">
            {service.name}
          </h1>
          <div className="flex items-center text-[#374151] gap-4 font-poppins">
            <span className="flex items-center gap-1">
              <MapPin className="w-5 h-5 text-[#2563EB]" /> {service.categoryName}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5 text-[#F59E0B]" />{" "}
              {rating.averageRating} ({rating.totalReviews}+ reviews)
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="shadow-md rounded-2xl bg-white border border-[#E5E7EB] transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="font-inter text-[#111827]">
                  Service Details
                </CardTitle>
                <CardDescription className="text-[#374151] font-poppins">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] font-poppins">
                      Starting from ₹{service.basePrice}
                    </p>
                    <p className="text-sm text-[#9CA3AF] font-nunito">
                      Final price may vary based on your requirements
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  {[
                    "Professional and verified service providers",
                    "100% satisfaction guaranteed",
                    "Flexible scheduling options",
                    "Transparent pricing",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#10B981]" />
                      <span className="text-[#374151] font-poppins">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="font-inter text-[#111827]">
                  Book Your Service
                </CardTitle>
                <CardDescription className="text-[#374151] font-poppins">
                  Select your preferred date & time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="font-inter text-[#111827] font-medium"
                  >
                    Select Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg font-poppins"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-inter text-[#111827] font-medium">
                    Select Time Slot
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full font-poppins rounded-lg transition-all duration-300 ${
                          selectedTime === time
                            ? "gradient-blue text-white shadow-sm hover:shadow-md"
                            : "border border-[#E5E7EB] text-[#374151] hover:bg-[#F8FAFC] hover:border-[#14B8A6]"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleBookService}
                  className="w-full font-inter rounded-lg gradient-blue text-white hover:shadow-lg transition-all duration-300 uppercase tracking-wide py-6 text-base font-medium hover:scale-[1.02]"
                  disabled={!selectedDate || !selectedTime || isloading}
                >
                  {isloading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <>
                      Book Now <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;

// 🧩 Loading Skeleton (Unchanged)
const LoadingSkeleton: React.FC = () => (
  <>
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
        background: linear-gradient(to right, #F8FAFC 0%, #E5E7EB 50%, #F8FAFC 100%);
        background-size: 1000px 100%;
      }
    `}</style>

    <div className="space-y-8">
      <div className="h-8 animate-shimmer rounded-lg w-1/3"></div>
      <div className="h-4 animate-shimmer rounded-lg w-1/2"></div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-96 bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-6">
          <div className="h-6 animate-shimmer rounded mb-4"></div>
          <div className="h-4 animate-shimmer rounded w-3/4 mb-4"></div>
          <div className="h-20 animate-shimmer rounded"></div>
        </div>
        <div className="space-y-4 bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-6">
          <div className="h-8 animate-shimmer rounded"></div>
          <div className="h-4 animate-shimmer rounded w-3/4"></div>
          <div className="h-4 animate-shimmer rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </>
);