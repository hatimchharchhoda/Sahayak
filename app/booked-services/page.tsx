// @ts-nocheck
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { User, MapPin, Phone, Mail, Search } from "lucide-react";
import Loading from "@/components/custom/loading";
import ServiceBookingCard from "@/components/custom/ServiceBookingCard";
import { useAuthUser } from "@/hooks/useAuth";

const Page = () => {
  const { user } = useAuthUser();
  console.log(user);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

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
    if (searchTerm.trim() === "") {
      setFilteredServices(services);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = services.filter((service: any) => {
        return (
          service.status.toLowerCase().includes(lowerCaseSearch) ||
          (service.Service?.name &&
            service.Service.name.toLowerCase().includes(lowerCaseSearch)) ||
          (service.ServiceProvider?.name &&
            service.ServiceProvider.name
              .toLowerCase()
              .includes(lowerCaseSearch))
        );
      });
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">Your Service Bookings</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.address}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by status, service or provider name..."
            className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredServices.map((service) => (
            <ServiceBookingCard
              key={service?.id}
              booking={service}
              onCancelSuccess={fetchUserServices}
              onReviewSuccess={fetchUserServices}
            />
          ))}
          {filteredServices.length === 0 && (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500">
                No services found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
