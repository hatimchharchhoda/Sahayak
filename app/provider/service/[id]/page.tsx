// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
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
  PENDING: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20",
  ACCEPTED: "bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20 hover:bg-[#14B8A6]/20",
  COMPLETED: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20",
  CANCELLED: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/20",
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
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
        `}</style>
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] flex items-center justify-center">
          <div className="text-lg text-[#374151] font-poppins">Service not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="w-full shadow-md bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-inter font-semibold text-[#111827]">Service Details</h1>
                  <Badge className={`px-3 py-1 text-sm sm:text-base font-inter font-medium rounded-lg border ${statusColors[serviceDetails.status]}`}>
                    {serviceDetails.status}
                  </Badge>
                </div>

                {/* Service Info */}
                {serviceDetails.Service && (
                  <Card className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl mb-4 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-inter font-semibold mb-2 text-[#111827]">Service Information</h2>
                      <p className="text-[#374151] font-poppins">{serviceDetails.Service.description}</p>
                      {serviceDetails.Service.ServiceCategory && (
                        <Badge className="mt-2 text-xs sm:text-sm border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#2563EB]">
                          {serviceDetails.Service.ServiceCategory.name}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <Card className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center p-4">
                      <Calendar className="w-6 h-6 text-[#2563EB] mr-3" />
                      <div>
                        <p className="text-xs text-[#9CA3AF] font-poppins">Date</p>
                        <p className="text-sm sm:text-lg font-semibold text-[#111827] font-inter">{new Date(serviceDetails.date).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center p-4">
                      <Clock className="w-6 h-6 text-[#2563EB] mr-3" />
                      <div>
                        <p className="text-xs text-[#9CA3AF] font-poppins">Time</p>
                        <p className="text-sm sm:text-lg font-semibold text-[#111827] font-inter">{new Date(serviceDetails.date).toLocaleTimeString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Client Info */}
                <Card className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl hover:shadow-md transition-shadow mb-4">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                      <h2 className="text-lg sm:text-xl font-inter font-semibold text-[#111827]">Client Information</h2>
                      {serviceDetails.status !== "PENDING" && (
                        <Link href={`/chat/${serviceDetails.userId}`}>
                          <Button className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] text-white shadow-sm text-sm sm:text-base flex items-center gap-2 rounded-lg font-inter font-medium transition-transform duration-300">
                            <MessageCircle className="w-4 h-4" /> Chat
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-[#2563EB]" />
                        <p className="text-sm sm:text-base font-medium text-[#111827] font-poppins">{serviceDetails.User?.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#2563EB]" />
                        <p className="text-sm sm:text-base font-medium text-[#111827] font-poppins">{serviceDetails.User?.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#2563EB]" />
                        <p className="text-sm sm:text-base font-medium text-[#111827] font-poppins">{serviceDetails.User?.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Price & Actions */}
                <Card className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl hover:shadow-md transition-shadow mb-4">
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-6 h-6 text-[#10B981]" />
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-24 border-[#E5E7EB] focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20" />
                          <Button onClick={handleUpdatePrice} size="sm" className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:scale-[1.02] text-white font-inter">Save</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)} size="sm" className="border-[#E5E7EB] hover:bg-[#F8FAFC] font-inter">Cancel</Button>
                        </div>
                      ) : (
                        <p className="text-xl sm:text-2xl font-bold text-[#111827] font-inter">₹{serviceDetails.basePrice?.toFixed(2) || "N/A"}</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {serviceDetails.status === "PENDING" && (
                        <Button onClick={handleAccept} className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:scale-[1.02] text-white flex items-center gap-2 rounded-lg font-inter font-medium transition-transform duration-300">
                          <CheckCircle className="w-4 h-4" /> Accept
                        </Button>
                      )}
                      {serviceDetails.status === "ACCEPTED" && (
                        <>
                          <Button onClick={() => setIsEditing(true)} variant="outline" disabled={isEditing} className="flex items-center gap-2 border-[#E5E7EB] hover:bg-[#F8FAFC] font-inter">
                            <Edit className="w-4 h-4" /> Edit Price
                          </Button>
                          <Button onClick={handleCompleteService} className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:scale-[1.02] text-white flex items-center gap-2 rounded-lg font-inter font-medium transition-transform duration-300">
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
    </>
  );
}