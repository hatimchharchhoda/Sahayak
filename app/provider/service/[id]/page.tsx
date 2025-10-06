// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  IndianRupee,
  CheckCircle,
  Edit,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/userContext";
import { Input } from "@/components/ui/input";
import Loading from "@/components/custom/loading";
import ReviewSection from "@/components/custom/ReviewSection";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-300 hover:text-amber-600",
  ACCEPTED: "bg-green-100 text-green-800 hover:bg-green-300 hover:text-green-600",
  COMPLETED: "bg-green-200 text-green-900 hover:bg-green-400 hover:text-green-700",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-300 hover:text-red-500",
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const socket = useSocket();
  const [serviceDetails, setServiceDetails] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.post(`/api/provider/service`, { id });
        setServiceDetails(response.data);
        setNewPrice(response.data.basePrice?.toString() || "");
      } catch {
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id]);

  const handleAccept = async () => {
    try {
      await axios.post(`/api/provider/service/accept`, { id: user?.id, bookingId: id });
      toast.success("Service accepted successfully");
      setServiceDetails((prev) => prev && { ...prev, status: "ACCEPTED" });
    } catch {
      toast.error("Failed to accept service");
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await axios.post(`/api/provider/service/update-price`, {
        basePrice: parseFloat(newPrice),
        bookingId: id,
      });
      if (response.status !== 200) return;
      setServiceDetails((prev) => prev && { ...prev, basePrice: parseFloat(newPrice) });
      setIsEditing(false);
      toast.success("Price updated successfully");
    } catch {
      toast.error("Failed to update price");
    }
  };

  const handleCompleteService = async () => {
    try {
      await axios.post(`/api/provider/service/complete`, { bookingId: id });
      setServiceDetails((prev) => prev && { ...prev, status: "COMPLETED" });
      toast.success("Service marked as completed");
    } catch {
      toast.error("Failed to complete service");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("payment", ({ service }) => setServiceDetails(service));
  }, [socket]);

  if (loading) return <Loading />;

  if (!serviceDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-[#80DEEA] flex items-center justify-center">
        <div className="text-lg text-[#616161]">Service not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] to-[#DCEDC8] py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-full shadow-2xl bg-white/80 backdrop-blur-md rounded-2xl">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-poppins font-semibold text-[#212121]">Service Details</h1>
                <Badge className={`px-3 py-1 text-sm sm:text-base font-semibold rounded-full ${statusColors[serviceDetails.status]}`}>
                  {serviceDetails.status}
                </Badge>
              </div>

              {/* Service Info */}
              {serviceDetails.Service && (
                <Card className="bg-white shadow-sm rounded-xl mb-4 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-poppins font-semibold mb-2 text-[#212121]">Service Information</h2>
                    <p className="text-[#616161]">{serviceDetails.Service.description}</p>
                    {serviceDetails.Service.ServiceCategory && (
                      <Badge className="mt-2 text-xs sm:text-sm border border-blue-300 text-blue-700">{serviceDetails.Service.ServiceCategory.name}</Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                <Card className="bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center p-4">
                    <CalendarIcon className="w-6 h-6 text-[#00C853] mr-3" />
                    <div>
                      <p className="text-xs text-[#616161]">Date</p>
                      <p className="text-sm sm:text-lg font-semibold text-[#212121]">{new Date(serviceDetails.date).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center p-4">
                    <ClockIcon className="w-6 h-6 text-[#00C853] mr-3" />
                    <div>
                      <p className="text-xs text-[#616161]">Time</p>
                      <p className="text-sm sm:text-lg font-semibold text-[#212121]">{new Date(serviceDetails.date).toLocaleTimeString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Info */}
              <Card className="bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow mb-4">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-poppins font-semibold text-[#212121]">Client Information</h2>
                    {serviceDetails.status !== "PENDING" && (
                      <Link href={`/chat/${serviceDetails.userId}`}>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white shadow-md text-sm sm:text-base flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" /> Chat
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-[#00C853]" />
                      <p className="text-sm sm:text-lg font-semibold text-[#212121]">{serviceDetails.User?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-[#00C853]" />
                      <p className="text-sm sm:text-lg font-semibold text-[#212121]">{serviceDetails.User?.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-[#00C853]" />
                      <p className="text-sm sm:text-lg font-semibold text-[#212121]">{serviceDetails.User?.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price & Actions */}
              <Card className="bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow mb-4">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="w-6 h-6 text-[#00C853]" />
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-24" />
                        <Button onClick={handleUpdatePrice} size="sm">Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                      </div>
                    ) : (
                      <p className="text-xl sm:text-2xl font-bold text-[#212121]">₹{serviceDetails.basePrice?.toFixed(2) || "N/A"}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {serviceDetails.status === "PENDING" && (
                      <Button onClick={handleAccept} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Accept
                      </Button>
                    )}
                    {serviceDetails.status === "ACCEPTED" && (
                      <>
                        <Button onClick={() => setIsEditing(true)} variant="outline" disabled={isEditing} className="flex items-center gap-2">
                          <Edit className="w-4 h-4" /> Edit Price
                        </Button>
                        <Button onClick={handleCompleteService} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Complete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <div className="mt-6">
                <ReviewSection serviceDetails={serviceDetails} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}