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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .font-lato {
          font-family: 'Lato', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .gradient-coral {
          background: linear-gradient(135deg, #FF6F61 0%, #FF8A65 100%);
        }
        
        .btn-bounce:hover {
          animation: bounce 0.6s ease-in-out;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] font-lato">
        <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
              <Sparkles className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Service Details</span>
            </div>

            <h1 className="text-4xl font-semibold font-montserrat text-[#212121] mb-4">
              {service.name}
            </h1>
            <div className="flex items-center text-[#424242] gap-4 font-lato">
              <span className="flex items-center gap-1">
                <MapPin className="w-5 h-5 text-[#FF6F61]" /> {service.categoryName}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5 text-[#FFCA28]" /> 4.8 (120+ reviews)
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
              <Card className="shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm border border-[#F8BBD0]/20">
                <CardHeader>
                  <CardTitle className="font-montserrat text-[#212121]">Service Details</CardTitle>
                  <CardDescription className="text-[#424242] font-lato">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#EDE7F6] to-[#F8BBD0] rounded-xl">
                    <div className="w-10 h-10 rounded-full gradient-coral flex items-center justify-center shadow-md">
                      <IndianRupee className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#212121] font-poppins">
                        Starting from ₹{service.basePrice}
                      </p>
                      <p className="text-sm text-[#9E9E9E] font-lato">
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
                        <CheckCircle className="w-5 h-5 text-[#66BB6A]" />
                        <span className="text-[#424242] font-lato">{benefit}</span>
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
              <Card className="sticky top-24 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-[#F8BBD0]/20">
                <CardHeader>
                  <CardTitle className="font-montserrat text-[#212121]">Book Your Service</CardTitle>
                  <CardDescription className="text-[#424242] font-lato">Select your preferred date & time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="font-poppins text-[#212121] font-medium">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full focus:border-[#26C6DA] focus:ring-[#26C6DA] placeholder:text-[#9E9E9E] border-2 rounded-xl font-lato"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-poppins text-[#212121] font-medium">Select Time Slot</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className={`w-full font-poppins rounded-xl transition-all duration-300 ${
                            selectedTime === time
                              ? "gradient-coral text-white shadow-lg hover:scale-105"
                              : "border-2 border-[#26C6DA] text-[#26C6DA] hover:bg-[#26C6DA] hover:text-white hover:scale-105"
                          }`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleBookService}
                    className="w-full font-poppins rounded-xl gradient-coral text-white hover:shadow-xl transition-all duration-300 btn-bounce uppercase tracking-wide py-6 text-base"
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
    </>
  );
};

export default ServiceDetails;

// Loading Skeleton
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
        background: linear-gradient(to right, #EDE7F6 0%, #F8BBD0 50%, #EDE7F6 100%);
        background-size: 1000px 100%;
      }
    `}</style>

    <div className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6]">
      <div className="container mx-auto max-w-6xl px-4 pt-24 space-y-8">
        <div className="h-8 animate-shimmer rounded-lg w-1/3"></div>
        <div className="h-4 animate-shimmer rounded-lg w-1/2"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 bg-white/90 rounded-2xl shadow-lg border border-[#F8BBD0]/20 p-6">
            <div className="h-6 animate-shimmer rounded mb-4"></div>
            <div className="h-4 animate-shimmer rounded w-3/4 mb-4"></div>
            <div className="h-20 animate-shimmer rounded"></div>
          </div>
          <div className="space-y-4 bg-white/90 rounded-2xl shadow-lg border border-[#F8BBD0]/20 p-6">
            <div className="h-8 animate-shimmer rounded"></div>
            <div className="h-4 animate-shimmer rounded w-3/4"></div>
            <div className="h-4 animate-shimmer rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </>
);