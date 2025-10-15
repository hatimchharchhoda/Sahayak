/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LogOut,
  Calendar,
  CheckCircle,
  Clock,
  IndianRupee,
  Loader2,
  Star,
  CalendarDays,
  List,
  User,
  Ticket,
  MessageCircle,
} from "lucide-react";

import BookedServicesList from "@/components/custom/BookedServicesList";
import ProviderServicesCalendar from "@/components/custom/ProviderServicesCalendar";
import IncomeAnalysisChart from "@/components/custom/IncomeAnalysisChart";
import Loading from "@/components/custom/loading";
import { useAuth } from "@/context/userContext";
import { useSocket } from "@/hooks/useSocket";

function ProviderDashboard() {
  const { user, isLoading } = useAuth();
  const socket = useSocket();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [allServices, setAllServices] = useState<[]>([]);
  const [availableServicesLoading, setAvailableServicesLoading] =
    useState(false);
  const [allServicesLoading, setAllServicesLoading] = useState(false);

  // Separate services
  const availableServices = useMemo(
    () => allServices?.filter((service) => service.status === "PENDING") || [],
    [allServices]
  );

  const acceptedServices = useMemo(
    () => allServices?.filter((service) => service.status === "ACCEPTED") || [],
    [allServices]
  );

  const completedServices = useMemo(
    () =>
      allServices?.filter((service) => service.status === "COMPLETED") || [],
    [allServices]
  );

  // Fetch services
  const fetchAllServices = async () => {
    if (user?.id) {
      setAllServicesLoading(true);
      try {
        const response = await axios.post("/api/providerAllServices", {
          id: user.id,
        });
        setAllServices(response?.data?.allServices || []);
      } catch (error) {
        console.error("Error fetching all services:", error);
        toast.error("Failed to fetch services");
      } finally {
        setAllServicesLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) fetchAllServices();
  }, [user]);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/provider/auth/logout");
      if (response.status === 200) {
        router.push("/auth");
        toast.success("Logged out successfully!");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error(error.message);
    }
  };

  const handleCalendarEventClick = (service) => {
    router.push(`/provider/service/${service.id}`);
  };

  // Realtime socket updates
  useEffect(() => {
    if (!socket) return;

    const handleServices = ({ service }) => {
      setAllServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    };

    const handleCancelService = ({ service }) => {
      setAllServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    };

    const handleNewService = ({ service }) => {
      setAllServices((prev) => [...prev, service]);
    };

    socket.on("payment", handleServices);
    socket.on("new-booking", handleNewService);
    socket.on("modify-service", handleCancelService);
  }, [socket]);

  // update the new messages of the chat every 30sec.
  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadMessages = async () => {
      try {
        const res = await axios.get(`/api/getUnreadMessages?userId=${user.id}`);
        const totalUnread = res.data.unreadMessages?.reduce(
          (sum: number, item: any) => sum + item.unreadCount,
          0
        );
        setUnreadCount(totalUnread || 0);
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };

    fetchUnreadMessages();

    // Optional: fetch every 30 seconds to update
    const interval = setInterval(fetchUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (isLoading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-[#80DEEA] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <Card className="w-full shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-poppins font-semibold mb-2 bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-transparent bg-clip-text">
                  Welcome, {user?.name}!
                </h1>
                <p className="text-lg font-nunito text-[#212121]">
                  Role: <span className="font-semibold">{user?.role}</span> |
                  Specialization:{" "}
                  <span className="font-semibold">{user?.specialization}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Button
                  onClick={() => router.push("/chat/unread")}
                  className="relative bg-gradient-to-r from-teal-400 to-lime-400 text-white font-poppins font-bold uppercase px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {[
                  {
                    icon: <User className="mr-2 h-4 w-4" />,
                    label: "Profile",
                    path: `/provider/profile/${user?.id}`,
                  },
                  {
                    icon: <Ticket className="mr-2 h-4 w-4" />,
                    label: "Raise Ticket",
                    path: `/provider/raise-ticket`,
                  },
                  {
                    icon: <Star className="mr-2 h-4 w-4" />,
                    label: "Reviews",
                    path: `/provider/reviews/${user?.id}`,
                  },
                ].map((btn) => (
                  <Button
                    key={btn.label}
                    onClick={() => router.push(btn.path)}
                    className="bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-white font-poppins font-bold uppercase px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
                  >
                    {btn.icon} {btn.label}
                  </Button>
                ))}
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-poppins font-bold uppercase px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Clock className="h-8 w-8 text-[#FBC02D]" />}
                title="Available Services"
                value={availableServices.length.toString()}
                color="bg-[#FFFDE7]"
                loading={availableServicesLoading}
              />
              <StatCard
                icon={<Calendar className="h-8 w-8 text-[#2979FF]" />}
                title="Accepted Services"
                value={acceptedServices.length.toString()}
                color="bg-[#E3F2FD]"
                loading={allServicesLoading}
              />
              <StatCard
                icon={<CheckCircle className="h-8 w-8 text-[#43A047]" />}
                title="Completed Services"
                value={completedServices?.length?.toString() || "0"}
                color="bg-[#E8F5E9]"
                loading={allServicesLoading}
              />
              <StatCard
                icon={<IndianRupee className="h-8 w-8 text-[#43A047]" />}
                title="Total Earnings"
                value={`₹${completedServices
                  ?.filter((service: any) => service.isPaid)
                  .reduce(
                    (sum: number, service: any) =>
                      sum + (service.basePrice || 0),
                    0
                  )
                  .toFixed(2)}`}
                color="bg-[#E8F5E9]"
                loading={allServicesLoading}
              />
            </div>

            {/* Income Chart */}
            {allServicesLoading ? (
              <div className="mb-8">
                <Skeleton className="h-64 w-full bg-gradient-to-r from-[#00C853] to-[#AEEA00] shimmer" />
              </div>
            ) : (
              <div className="mb-8">
                <IncomeAnalysisChart
                  completedServices={completedServices}
                  providerName={user?.name}
                />
              </div>
            )}

            {/* Tabs for Calendar and List View */}
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 border-b-2 border-green-500">
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2 font-semibold text-[#212121] hover:text-[#00C853] data-[state=active]:text-[#00C853]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Calendar View
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-2 font-semibold text-[#212121] hover:text-[#00C853] data-[state=active]:text-[#00C853]"
                >
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>

              {/* Calendar View */}
              <TabsContent value="calendar">
                {availableServicesLoading || allServicesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 text-[#00C853] animate-spin mb-4" />
                    <p className="text-[#616161] font-medium">
                      Loading calendar...
                    </p>
                  </div>
                ) : (
                  <ProviderServicesCalendar
                    services={allServices}
                    onEventClick={handleCalendarEventClick}
                  />
                )}
              </TabsContent>

              {/* List View */}
              <TabsContent value="list">
                <div className="space-y-8">
                  <BookedServicesList
                    services={availableServices}
                    title="Available Services"
                    emptyMessage="No available services at the moment."
                  />
                  <BookedServicesList
                    services={acceptedServices}
                    title="Accepted Services"
                    emptyMessage="No accepted services at the moment."
                  />
                  <BookedServicesList
                    services={completedServices}
                    title="Completed Services"
                    emptyMessage="No completed services yet."
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, title, value, color, loading = false }) {
  return (
    <Card
      className={`rounded-xl ${
        loading ? "bg-gray-100 border-none" : `${color} border-none`
      } hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1`}
    >
      <CardContent className="flex items-center p-6">
        {loading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>
          </>
        ) : (
          <>
            <div className="mr-4">{icon}</div>
            <div>
              <h2 className="text-lg font-poppins font-semibold text-[#212121]">
                {title}
              </h2>
              <p className="text-2xl font-poppins font-bold text-[#212121]">
                {value}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ProviderDashboard;
