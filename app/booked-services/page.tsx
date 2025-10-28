/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  Sparkles,
  Calendar,
} from "lucide-react";
import Loading from "@/components/custom/loading";
import ServiceBookingCard from "@/components/custom/ServiceBookingCard";
import { useAuth } from "@/context/userContext";
import { useSocket } from "@/hooks/useSocket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const Page = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchUserServices = async () => {
    if (user.id) {
      try {
        const response = await axios.post("api/user/getUserServices", {
          userId: user.id,
        });
        setServices(response.data.userServices);
        setFilteredServices(response.data.userServices);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserServices();
  }, [user.id]);

  useEffect(() => {
    if (
      searchTerm.trim() === "" &&
      (selectedStatus === "" || selectedStatus === "all")
    ) {
      setFilteredServices(services);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = services.filter((service: any) => {
        const matchesSearch =
          searchTerm.trim() === "" ||
          service.status.toLowerCase().includes(lowerCaseSearch) ||
          (service.Service?.name &&
            service.Service.name.toLowerCase().includes(lowerCaseSearch)) ||
          (service.ServiceProvider?.name &&
            service.ServiceProvider.name
              .toLowerCase()
              .includes(lowerCaseSearch));

        const matchesStatus =
          selectedStatus === "" ||
          selectedStatus === "all" ||
          service.status === selectedStatus;

        return matchesSearch && matchesStatus;
      });
      setFilteredServices(filtered);
    }
  }, [searchTerm, services, selectedStatus]);

  useEffect(() => {
    if (!socket) return;

    function handleModifyedService({ service }) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    }

    socket.on("modify-service", handleModifyedService);
  }, [socket]);

  const groupServicesByStatus = (services: any[]) => {
    const statusOrder = ["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"];
    const grouped = services.reduce((acc, service) => {
      const status = service.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(service);
      return acc;
    }, {});

    const sortedGrouped = {};
    statusOrder.forEach((status) => {
      if (grouped[status]) sortedGrouped[status] = grouped[status];
    });

    return sortedGrouped;
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending Approval";
      case "ACCEPTED":
        return "Accepted";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-gradient-to-r from-[#F59E0B] to-[#D97706]";
      case "ACCEPTED":
        return "bg-gradient-to-r from-[#14B8A6] to-[#0D9488]";
      case "COMPLETED":
        return "bg-gradient-to-r from-[#10B981] to-[#059669]";
      case "CANCELLED":
        return "bg-gradient-to-r from-[#EF4444] to-[#DC2626]";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "ACCEPTED":
        return "✓";
      case "COMPLETED":
        return "✓";
      case "CANCELLED":
        return "✕";
      default:
        return "•";
    }
  };

  if (loading) return <Loading />;

  const groupedServices = groupServicesByStatus(filteredServices);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
      `}</style>

      <div className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] relative overflow-hidden">
        {/* Decorative Background Elements - Very Subtle */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#14B8A6] opacity-[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#2563EB] opacity-[0.03] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#F59E0B] opacity-[0.03] rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Title Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border border-[#E5E7EB]">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              <span className="font-inter text-sm font-medium text-[#111827] uppercase tracking-wide">
                My Bookings
              </span>
              <Sparkles className="w-5 h-5 text-[#14B8A6]" />
            </div>
          </motion.div>

          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-[#E5E7EB] transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-24 w-24 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-sm"
              >
                <User className="h-12 w-12 text-white" />
              </motion.div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h1 className="text-3xl sm:text-4xl font-semibold font-inter text-[#111827] truncate">
                  {user.name}
                </h1>
                <p className="text-sm sm:text-base text-[#9CA3AF] mt-2 font-poppins">
                  Your Service Bookings Dashboard
                </p>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[#14B8A6]" />
                </div>
                <span className="text-sm sm:text-base text-[#374151] truncate font-poppins">
                  {user.email}
                </span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#14B8A6]" />
                </div>
                <span className="text-sm sm:text-base text-[#374151] truncate font-poppins">
                  {user.phone}
                </span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-all duration-300 sm:col-span-2"
              >
                <div className="h-10 w-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#14B8A6]" />
                </div>
                <span className="text-sm sm:text-base text-[#374151] truncate font-poppins">
                  {user.address}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Search & Filter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-[#E5E7EB] transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              {/* Search Input */}
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#9CA3AF] group-focus-within:text-[#14B8A6] transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search by status, service or provider..."
                  className="border border-[#E5E7EB] focus:border-[#14B8A6] pl-12 pr-4 py-3 w-full rounded-lg text-sm sm:text-base font-poppins focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 placeholder:text-[#9CA3AF] transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-64 xl:w-80">
                <Select onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full h-full border border-[#E5E7EB] rounded-lg py-3 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all duration-300">
                    <div className="flex items-center">
                      <Filter className="h-5 w-5 mr-2 text-[#14B8A6]" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-lg border border-[#E5E7EB]">
                    <SelectItem value="all" className="font-poppins">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="PENDING" className="font-poppins">
                      Pending Approval
                    </SelectItem>
                    <SelectItem value="ACCEPTED" className="font-poppins">
                      Accepted
                    </SelectItem>
                    <SelectItem value="COMPLETED" className="font-poppins">
                      Completed
                    </SelectItem>
                    <SelectItem value="CANCELLED" className="font-poppins">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-sm text-[#374151] flex items-center font-poppins">
                  <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mr-2">
                    <Calendar className="h-4 w-4 text-[#2563EB]" />
                  </div>
                  <span className="font-medium text-[#111827]">
                    {filteredServices.length}
                  </span>
                  <span className="ml-1">
                    booking{filteredServices.length !== 1 ? "s" : ""} found
                  </span>
                  {selectedStatus && selectedStatus !== "all" && (
                    <span className="hidden sm:inline ml-1">
                      with status:{" "}
                      <span className="font-medium text-[#111827]">
                        {getStatusDisplayName(selectedStatus)}
                      </span>
                    </span>
                  )}
                </div>
                {selectedStatus && selectedStatus !== "all" && (
                  <button
                    onClick={() => setSelectedStatus("")}
                    className="text-xs font-inter uppercase tracking-wide text-[#14B8A6] hover:text-[#2563EB] transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-[#F8FAFC]"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Services Sections */}
          {Object.keys(groupedServices).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-white rounded-2xl shadow-md border border-[#E5E7EB] transition-all duration-300"
            >
              <div className="max-w-md mx-auto px-4">
                <div className="h-24 w-24 rounded-xl bg-[#F8FAFC] flex items-center justify-center mx-auto mb-6 border border-[#E5E7EB]">
                  <Calendar className="h-12 w-12 text-[#9CA3AF]" />
                </div>
                <h3 className="text-xl font-inter font-semibold text-[#111827] mb-3">
                  No Bookings Found
                </h3>
                <p className="text-base text-[#9CA3AF] font-poppins">
                  No services found matching your search criteria.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8 pb-6">
              {Object.entries(groupedServices).map(
                ([status, statusServices], index) => (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#E5E7EB] transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Status Header */}
                    <div
                      className={`${getStatusColor(
                        status
                      )} px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white`}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {getStatusIcon(status)}
                          </span>
                          <h2 className="text-2xl font-bold font-inter">
                            {getStatusDisplayName(status)}
                          </h2>
                        </div>
                        <p className="text-white/90 text-sm font-poppins">
                          {statusServices.length} service
                          {statusServices.length !== 1 ? "s" : ""} in this
                          category
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm">
                          <span className="text-3xl font-bold font-inter">
                            {statusServices.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Services Grid */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {statusServices.map((service, serviceIndex) => (
                        <motion.div
                          key={service?.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: serviceIndex * 0.05,
                          }}
                          className="w-full"
                        >
                          <ServiceBookingCard
                            booking={service}
                            onCancelSuccess={fetchUserServices}
                            onReviewSuccess={fetchUserServices}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
