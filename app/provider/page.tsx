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
} from "lucide-react";

import type { User as UserType } from "@/lib/types";
import BookedServicesList from "@/components/custom/BookedServicesList";
import ProviderServicesCalendar from "@/components/custom/ProviderServicesCalendar";

import IncomeAnalysisChart from "@/components/custom/IncomeAnalysisChart";
import Loading from "@/components/custom/loading";
import { useAuth } from "@/context/userContext";

function ProviderDashboard() {
  const { user, setUser, isLoading } = useAuth();
  const [availableServices, setAvailableServices] = useState<[]>([]);
  const [allServices, setAllServices] = useState<[]>([]);

  const [availableServicesLoading, setAvailableServicesLoading] =
    useState(false);
  const [allServicesLoading, setAllServicesLoading] = useState(false);
  const router = useRouter();

  // Context

  // Separate services using useMemo
  const acceptedServices = useMemo(
    () => allServices?.filter((service) => service.status === "ACCEPTED") || [],
    [allServices]
  );

  const completedServices = useMemo(
    () =>
      allServices?.filter((service) => service.status === "COMPLETED") || [],
    [allServices]
  );

  // Combine all services for calendar view
  const allCombinedServices = useMemo(
    () => [...availableServices, ...allServices],
    [availableServices, allServices]
  );

  const fetchAvailableServices = async () => {
    if (user?.specialization) {
      setAvailableServicesLoading(true);
      try {
        const response = await axios.post("/api/providerAvailableServices", {
          specialization: user.specialization,
        });
        setAvailableServices(response.data.bookedServices || []);
      } catch (error) {
        console.error("Error fetching pending services:", error);
        toast.error("Failed to fetch pending services");
      } finally {
        setAvailableServicesLoading(false);
      }
    }
  };

  const fetchAllServices = async () => {
    if (user?.id) {
      setAllServicesLoading(true);
      try {
        console.log("first");
        const response = await axios.post("/api/providerAllServices", {
          id: user.id,
        });
        setAllServices(response?.data?.allServices || []);
      } catch (error) {
        console.error("Error fetching all services:", error);
        toast.error("Failed to fetch all services");
      } finally {
        setAllServicesLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchAvailableServices();
      fetchAllServices();
    }
  }, [user]);

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
    // Navigate to service details or show more info
    router.push(`/provider/service/${service.id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    Welcome, {user?.name}!
                  </h1>
                  <p className="text-lg text-gray-600">
                    Role: {user?.role} | Specialization: {user?.specialization}
                  </p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <Button
                    onClick={() => router.push(`/provider/reviews/${user?.id}`)}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Star className="mr-2 h-4 w-4" /> View Reviews
                  </Button>
                  <Button onClick={handleLogout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<Clock className="h-8 w-8 text-yellow-500" />}
                  title="Pending Services"
                  value={availableServices.length.toString()}
                  color="bg-yellow-100"
                  loading={availableServicesLoading}
                />
                <StatCard
                  icon={<Calendar className="h-8 w-8 text-blue-500" />}
                  title="Accepted Services"
                  value={acceptedServices.length.toString()}
                  color="bg-blue-100"
                  loading={allServicesLoading}
                />
                <StatCard
                  icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                  title="Completed Services"
                  value={completedServices?.length?.toString() || "0"}
                  color="bg-green-100"
                  loading={allServicesLoading}
                />
                <StatCard
                  icon={<IndianRupee className="h-8 w-8 text-green-500" />}
                  title="Total Earnings"
                  value={`₹${completedServices
                    ?.filter((service: any) => service.isPaid) // ✅ Only paid services
                    .reduce(
                      (sum: number, service: any) =>
                        sum + (service.basePrice || 0),
                      0
                    )
                    .toFixed(2)}`}
                  color="bg-green-100"
                  loading={allServicesLoading}
                />
              </div>

              {/* Income Chart */}
              {allServicesLoading ? (
                <div className="mb-8">
                  <Skeleton className="h-64 w-full" />
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
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="calendar"
                    className="flex items-center gap-2"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Calendar View
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    List View
                  </TabsTrigger>
                </TabsList>

                {/* Calendar View */}
                <TabsContent value="calendar">
                  {availableServicesLoading || allServicesLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-700 font-medium">
                        Loading calendar...
                      </p>
                    </div>
                  ) : (
                    <ProviderServicesCalendar
                      services={allCombinedServices}
                      onEventClick={handleCalendarEventClick}
                    />
                  )}
                </TabsContent>

                {/* List View */}
                <TabsContent value="list">
                  <div className="space-y-8">
                    {/* Available Services */}
                    <div className="relative">
                      {availableServicesLoading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                          <p className="text-gray-700 font-medium">
                            Loading available services...
                          </p>
                        </div>
                      )}
                      <BookedServicesList
                        services={availableServices}
                        title="Available Services"
                        emptyMessage="No available services at the moment."
                      />
                    </div>

                    {/* Accepted Services */}
                    <div className="relative">
                      {allServicesLoading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                          <p className="text-gray-700 font-medium">
                            Loading accepted services...
                          </p>
                        </div>
                      )}
                      <BookedServicesList
                        services={acceptedServices}
                        title="Accepted Services"
                        emptyMessage="No accepted services at the moment."
                      />
                    </div>
                    {/* Completed Services */}
                    <div className="relative">
                      {allServicesLoading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                          <p className="text-gray-700 font-medium">
                            Loading completed services...
                          </p>
                        </div>
                      )}
                      <BookedServicesList
                        services={completedServices}
                        title="Completed Services"
                        emptyMessage="No completed services yet."
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
  loading = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card
      className={loading ? "border-none bg-gray-100" : `${color} border-none`}
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
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ProviderDashboard;
