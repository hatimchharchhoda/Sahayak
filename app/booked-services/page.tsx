// @ts-nocheck
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { User, MapPin, Phone, Mail, Search, Filter } from "lucide-react";
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
        return "bg-[#FFD54F]/80 text-[#212121]";
      case "ACCEPTED":
        return "bg-teal-400 text-white";
      case "COMPLETED":
        return "bg-[#81C784] text-white";
      case "CANCELLED":
        return "bg-[#E57373] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (loading) return <Loading />;

  const groupedServices = groupServicesByStatus(filteredServices);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-transparent hover:border-[#FF7043]/40 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#FFAB91]/20 flex items-center justify-center">
              <User className="h-8 w-8 text-[#FF7043]" />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212121] truncate font-[Nunito_Sans]">
                {user.name}
              </h1>
              <p className="text-sm sm:text-base text-[#757575]">
                Your Service Bookings
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-4 bg-[#FFE0B2]/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-[#757575]" />
              <span className="text-sm sm:text-base text-[#212121] truncate font-[Lato]">
                {user.email}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-[#757575]" />
              <span className="text-sm sm:text-base text-[#212121] truncate font-[Lato]">
                {user.phone}
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:col-span-2">
              <MapPin className="h-5 w-5 text-[#757575]" />
              <span className="text-sm sm:text-base text-[#212121] truncate font-[Lato]">
                {user.address}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-transparent hover:border-[#FF7043]/40 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#757575]" />
              </div>
              <input
                type="text"
                placeholder="Search by status, service or provider..."
                className="border border-gray-300 focus:border-[#FF7043] pl-10 pr-4 py-3 w-full rounded-xl text-sm sm:text-base font-[Lato] focus:outline-none focus:ring-2 focus:ring-[#FF7043] placeholder:text-[#BDBDBD] transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full lg:w-64 xl:w-80">
              <Select onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full border border-gray-300 rounded-xl py-3 focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-[#757575]" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending Approval</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 border-t border-[#FFE0B2]/50 pt-3">
            <p className="text-sm text-[#757575] flex items-center font-[Lato]">
              <User className="h-4 w-4 mr-1" />
              {filteredServices.length} booking
              {filteredServices.length !== 1 ? "s" : ""} found
              {selectedStatus && selectedStatus !== "all" && (
                <span className="hidden sm:inline">
                  {" "}
                  with status: {getStatusDisplayName(selectedStatus)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Services */}
        {Object.keys(groupedServices).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <div className="max-w-md mx-auto px-4">
              <User className="h-16 w-16 text-[#BDBDBD] mx-auto mb-4" />
              <p className="text-base text-[#757575] font-[Lato]">
                No services found matching your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedServices).map(([status, statusServices]) => (
              <div
                key={status}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-transparent hover:border-[#FF7043]/40 transition-all duration-300"
              >
                {/* Status Header */}
                <div className={`${getStatusColor(status)} px-6 py-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold font-[Nunito_Sans]">
                        {getStatusDisplayName(status)}
                      </h2>
                      <p className="text-white/80 mt-1 text-sm">
                        {statusServices.length} service
                        {statusServices.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {statusServices.map((service) => (
                    <div key={service?.id} className="w-full animate-fadeInUp">
                      <ServiceBookingCard
                        booking={service}
                        onCancelSuccess={fetchUserServices}
                        onReviewSuccess={fetchUserServices}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
