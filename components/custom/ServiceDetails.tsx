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

  const timeSlots: string[] = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  ];

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

  useEffect(() => {
    fetchService();
  }, [serviceId]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] font-lato">
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold font-nunito text-[#212121] mb-4">
            {service.name}
          </h1>
          <div className="flex items-center text-[#757575] gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-5 h-5 text-[#FF7043]" /> {service.categoryName}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5 text-[#FFD54F]" /> 4.8 (120+ reviews)
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <Card className="shadow-lg rounded-2xl bg-white">
              <CardHeader>
                <CardTitle className="font-nunito text-[#212121]">Service Details</CardTitle>
                <CardDescription className="text-[#757575]">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#FFE0B2] rounded-lg">
                  <IndianRupee className="w-5 h-5 text-[#FF7043]" />
                  <div>
                    <p className="font-semibold text-[#212121]">
                      Starting from ₹{service.basePrice}
                    </p>
                    <p className="text-sm text-[#757575]">
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
                      <CheckCircle className="w-5 h-5 text-[#81C784]" />
                      <span className="text-[#757575] font-lato">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sticky top-24 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 bg-white">
              <CardHeader>
                <CardTitle className="font-nunito text-[#212121]">Book Your Service</CardTitle>
                <CardDescription className="text-[#757575]">Select your preferred date & time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-poppins text-[#212121]">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full focus:border-[#FF7043] placeholder:text-[#BDBDBD]"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-poppins text-[#212121]">Select Time Slot</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full font-poppins rounded-lg ${
                          selectedTime === time
                            ? "bg-gradient-to-r from-[#FF7043] to-pink-400 text-white shadow-lg hover:scale-105 transition-transform"
                            : "border-[#26A69A] text-[#26A69A] hover:bg-[#26A69A] hover:text-white transition-colors"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleBookService}
                  className="w-full font-poppins rounded-lg bg-gradient-to-r from-[#FF7043] to-pink-400 text-white hover:scale-105 transition-transform shadow-lg"
                  disabled={!selectedDate || !selectedTime || isloading}
                >
                  {isloading ? <Loader2 className="animate-spin mx-auto" /> : (
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
    </div>
  );
};

export default ServiceDetails;

// Loading Skeleton
const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] animate-pulse">
    <div className="container mx-auto max-w-6xl px-4 pt-24 space-y-8">
      <div className="h-8 bg-[#BDBDBD] rounded w-1/3"></div>
      <div className="h-4 bg-[#BDBDBD] rounded w-1/2"></div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-96 bg-[#FFE0B2] rounded-lg shadow-inner"></div>
        <div className="space-y-4">
          <div className="h-8 bg-[#FFE0B2] rounded"></div>
          <div className="h-4 bg-[#FFE0B2] rounded w-3/4"></div>
          <div className="h-4 bg-[#FFE0B2] rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);