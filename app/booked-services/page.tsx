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
        return "bg-gradient-to-r from-[#ccae53] to-[#e6bf4d]";
      case "ACCEPTED":
        return "bg-gradient-to-r from-[#26C6DA] to-[#4DD0E1]";
      case "COMPLETED":
        return "bg-gradient-to-r from-[#66BB6A] to-[#81C784]";
      case "CANCELLED":
        return "bg-gradient-to-r from-[#E57373] to-[#EF5350]";
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
    <div className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#FCE4EC] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#26C6DA] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FF6F61] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#e6bf4d] opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Title Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Calendar className="w-5 h-5 text-[#FF6F61]" />
            <span className="font-poppins text-sm font-medium text-[#212121] uppercase tracking-wide">
              My Bookings
            </span>
            <Sparkles className="w-5 h-5 text-[#26C6DA]" />
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-transparent hover:border-[#FF6F61]/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,111,97,0.15)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-24 w-24 rounded-full bg-gradient-to-br from-[#FF6F61] to-[#FF8A65] flex items-center justify-center shadow-xl ring-4 ring-[#FF6F61]/10"
            >
              <User className="h-12 w-12 text-white" />
            </motion.div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-3xl sm:text-4xl font-semibold font-montserrat text-[#212121] truncate">
                {user.name}
              </h1>
              <p className="text-sm sm:text-base text-[#9E9E9E] mt-2 font-nunito">
                Your Service Bookings Dashboard
              </p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-inner border border-gray-100">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#26C6DA]/10 to-[#26C6DA]/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#26C6DA]" />
              </div>
              <span className="text-sm sm:text-base text-[#424242] truncate font-lato">
                {user.email}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#26C6DA]/10 to-[#26C6DA]/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-[#26C6DA]" />
              </div>
              <span className="text-sm sm:text-base text-[#424242] truncate font-lato">
                {user.phone}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white transition-all duration-300 sm:col-span-2"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#26C6DA]/10 to-[#26C6DA]/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#26C6DA]" />
              </div>
              <span className="text-sm sm:text-base text-[#424242] truncate font-lato">
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
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-transparent hover:border-[#26C6DA]/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(38,198,218,0.15)]"
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#9E9E9E] group-focus-within:text-[#26C6DA] transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Search by status, service or provider..."
                className="border-2 border-gray-100 focus:border-[#26C6DA] pl-12 pr-4 py-4 w-full rounded-2xl text-sm sm:text-base font-lato focus:outline-none focus:ring-2 focus:ring-[#26C6DA]/20 placeholder:text-[#9E9E9E] transition-all duration-300 hover:border-gray-200 hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-64 xl:w-80">
              <Select onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full h-full border-2 border-gray-100 rounded-2xl py-4 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-[#26C6DA]" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl border-2">
                  <SelectItem
                    value="all"
                    className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer"
                  >
                    All Statuses
                  </SelectItem>
                  <SelectItem
                    value="PENDING"
                    className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer"
                  >
                    Pending Approval
                  </SelectItem>
                  <SelectItem
                    value="ACCEPTED"
                    className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer"
                  >
                    Accepted
                  </SelectItem>
                  <SelectItem
                    value="COMPLETED"
                    className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer"
                  >
                    Completed
                  </SelectItem>
                  <SelectItem
                    value="CANCELLED"
                    className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer"
                  >
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-5 border-t-2 border-dashed border-[#FF6F61]/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm text-[#9E9E9E] flex items-center font-lato">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF6F61]/10 to-[#FF8A65]/10 flex items-center justify-center mr-2">
                  <Calendar className="h-4 w-4 text-[#FF6F61]" />
                </div>
                <span className="font-medium text-[#424242]">
                  {filteredServices.length}
                </span>
                <span className="ml-1">
                  booking{filteredServices.length !== 1 ? "s" : ""} found
                </span>
                {selectedStatus && selectedStatus !== "all" && (
                  <span className="hidden sm:inline ml-1">
                    with status:{" "}
                    <span className="font-medium text-[#424242]">
                      {getStatusDisplayName(selectedStatus)}
                    </span>
                  </span>
                )}
              </div>
              {selectedStatus && selectedStatus !== "all" && (
                <button
                  onClick={() => setSelectedStatus("")}
                  className="text-xs font-poppins uppercase tracking-wide text-[#26C6DA] hover:text-[#FF6F61] transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-gray-50"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-3xl shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500"
          >
            <div className="max-w-md mx-auto px-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Calendar className="h-12 w-12 text-[#9E9E9E]" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold text-[#424242] mb-3">
                No Bookings Found
              </h3>
              <p className="text-base text-[#9E9E9E] font-lato">
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
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-transparent hover:border-[#FF6F61]/20 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
                >
                  {/* Status Header */}
                  <div
                    className={`${getStatusColor(
                      status
                    )} px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white shadow-lg relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {getStatusIcon(status)}
                        </span>
                        <h2 className="text-2xl font-bold font-montserrat">
                          {getStatusDisplayName(status)}
                        </h2>
                      </div>
                      <p className="text-white/90 text-sm font-nunito">
                        {statusServices.length} service
                        {statusServices.length !== 1 ? "s" : ""} in this
                        category
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 relative z-10">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                        <span className="text-3xl font-bold font-montserrat">
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
  );
};

export default Page;
