// components/custom/ServiceDetails.tsx
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
  Calendar as CalendarIcon,
  IndianRupee,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

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
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
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

    const bookingData: any = {
      serviceId: serviceId,
      date: new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`),
      basePrice: service?.basePrice ?? 0,
    };

    if (providerId) {
      bookingData.providerId = providerId; // ✅ Include only if available
    }

    try {
      setisloading(true);
      const response = await axios.post("/api/bookService", bookingData);
      toast.success("Service Booked");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Booking failed");
    } finally {
      setisloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-6xl px-4 pt-24">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    // 🔁 Put your full JSX here exactly as it was — no need to change it
    // Just replace `serviceId` from params with the prop
    // No routing logic inside here
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {service.name}
          </h1>
          <div className="flex items-center text-gray-600 gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {service.categoryName}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" /> 4.8 (120+ reviews)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      Starting from ₹{service.basePrice}
                    </p>
                    <p className="text-sm text-gray-600">
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
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      title: "Book",
                      desc: "Select your preferred date and time",
                    },
                    {
                      title: "Confirm",
                      desc: "We'll assign the best professional",
                    },
                    {
                      title: "Service",
                      desc: "Get your service done hassle-free",
                    },
                    {
                      title: "Payment",
                      desc: "Pay only after service completion",
                    },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Service</CardTitle>
                <CardDescription>
                  Select your preferred date and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Time Slot</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {isloading ? (
                  <Button
                    onClick={handleBookService}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!selectedDate || !selectedTime}
                  >
                    <Loader2 className="animate-spin" /> Loading
                  </Button>
                ) : (
                  <Button
                    onClick={handleBookService}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Book Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
