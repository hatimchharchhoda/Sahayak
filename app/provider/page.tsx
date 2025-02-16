"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";

import type { User as UserType } from "@/lib/types";
import BookedServicesList from "@/components/custom/BookedServicesList";
import { useUser } from "@/context/userContext";
import IncomeAnalysisChart from "@/components/custom/IncomeAnalysisChart";
import Loading from "@/components/custom/loading";

function ProviderDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [availableServices, setAvailableServices] = useState<[]>([]);
  const [acceptedServices, setAcceptedServices] = useState<[]>([]);
  const [completedServices, setCompletedServices] = useState<[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  const [availableServicesLoading, setAvailableServicesLoading] =
    useState(false);
  const [acceptedServicesLoading, setAcceptedServicesLoading] = useState(false);
  const [completedServicesLoading, setCompletedServicesLoading] =
    useState(false);
  const router = useRouter();
  const [mergedServices, setMergedServices] = useState<[]>([]);

  // Context
  const { setUserFromContext } = useUser();

  const checkUserSession = async () => {
    setUserLoading(true);
    try {
      const response = await fetch("/api/provider/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserFromContext(data.user);
      } else {
        router.push("/auth");
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      router.push("/auth");
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, [router]);

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

  const fetchAcceptedServices = async () => {
    if (user?.id) {
      setAcceptedServicesLoading(true);
      try {
        const response = await axios.post("/api/providerAcceptedServices", {
          id: user.id,
        });
        setAcceptedServices(response.data.acceptedServices || []);
      } catch (error) {
        console.error("Error fetching accepted services:", error);
        toast.error("Failed to fetch accepted services");
      } finally {
        setAcceptedServicesLoading(false);
      }
    }
  };

  const fetchCompletedServices = async () => {
    if (user?.id) {
      setCompletedServicesLoading(true);
      try {
        const response = await axios.post("/api/providerCompletedServices", {
          id: user.id,
        });
        setCompletedServices(response?.data?.completedServices || []);
      } catch (error) {
        console.error("Error fetching completed services:", error);
        toast.error("Failed to fetch completed services");
      } finally {
        setCompletedServicesLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchAvailableServices();
      fetchAcceptedServices();
      fetchCompletedServices();
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

  useEffect(() => {
    setMergedServices([
      ...availableServices,
      ...acceptedServices,
      ...completedServices,
    ]);
  }, [availableServices, acceptedServices, completedServices]);

  if (
    userLoading ||
    availableServicesLoading ||
    completedServicesLoading ||
    acceptedServicesLoading
  ) {
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
                  loading={acceptedServicesLoading}
                />
                <StatCard
                  icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                  title="Completed Services"
                  value={completedServices?.length?.toString() || "0"}
                  color="bg-green-100"
                  loading={completedServicesLoading}
                />
                <StatCard
                  icon={<IndianRupee className="h-8 w-8 text-green-500" />}
                  title="Total Earnings"
                  value={`₹${completedServices
                    ?.reduce(
                      (sum, service: any) => sum + (service.basePrice || 0),
                      0
                    )
                    .toFixed(2)}`}
                  color="bg-green-100"
                  loading={completedServicesLoading}
                />
              </div>
              {completedServicesLoading ? (
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
              <div className="relative">
                {(availableServicesLoading ||
                  acceptedServicesLoading ||
                  completedServicesLoading) && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-700 font-medium">
                      Loading services...
                    </p>
                  </div>
                )}
                <BookedServicesList bookedServices={mergedServices} />
              </div>
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
