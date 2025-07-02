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
      console.log(service);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? service : s))
      );
    }

    socket.on("modify-service", handleModifyedService);
  }, [socket]);

  // Group services by status
  const groupServicesByStatus = (services: any[]) => {
    const statusOrder = ["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"];
    const grouped = services.reduce((acc, service) => {
      const status = service.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(service);
      return acc;
    }, {});

    // Sort the grouped object by status order
    const sortedGrouped = {};
    statusOrder.forEach((status) => {
      if (grouped[status]) {
        sortedGrouped[status] = grouped[status];
      }
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
        return "bg-yellow-600";
      case "ACCEPTED":
        return "bg-blue-600";
      case "COMPLETED":
        return "bg-green-600";
      case "CANCELLED":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading) {
    return <Loading />;
  }

  const groupedServices = groupServicesByStatus(filteredServices);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {user.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                Your Service Bookings
              </p>
            </div>
          </div>

          {/* User Info Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 p-3 sm:px-4 sm:py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 min-w-0">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 truncate">
                {user.email}
              </span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 truncate">
                {user.phone}
              </span>
            </div>
            <div className="flex items-center space-x-2 min-w-0 sm:col-span-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 truncate">
                {user.address}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 lg:flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by status, service or provider..."
                className="pl-8 sm:pl-10 pr-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="w-full lg:w-64 xl:w-80">
              <Select onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-2 sm:py-3">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
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

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-600 flex items-center">
              <User className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span>
                {filteredServices.length} booking
                {filteredServices.length !== 1 ? "s" : ""} found
                {selectedStatus && selectedStatus !== "all" && (
                  <span className="hidden sm:inline">
                    {" "}
                    with status: {getStatusDisplayName(selectedStatus)}
                  </span>
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Services Content */}
        {Object.keys(groupedServices).length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl shadow-md">
            <div className="max-w-md mx-auto px-4">
              <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-500">
                No services found matching your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
            {Object.entries(groupedServices).map(([status, statusServices]) => (
              <div
                key={status}
                className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden"
              >
                {/* Status Header */}
                <div
                  className={`${getStatusColor(
                    status
                  )} text-white px-4 sm:px-6 py-3 sm:py-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">
                        {getStatusDisplayName(status)}
                      </h2>
                      <p className="text-white/80 mt-1 text-sm sm:text-base">
                        {statusServices.length} service
                        {statusServices.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {statusServices.map((service) => (
                      <div key={service?.id} className="w-full">
                        <ServiceBookingCard
                          booking={service}
                          onCancelSuccess={fetchUserServices}
                          onReviewSuccess={fetchUserServices}
                        />
                      </div>
                    ))}
                  </div>
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
