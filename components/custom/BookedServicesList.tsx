// @ts-nocheck
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-300 hover:text-amber-600",
  ACCEPTED: "bg-green-100 text-green-800 hover:bg-green-300 hover:text-green-600",
  COMPLETED: "bg-green-200 text-green-900 hover:bg-green-400 hover:text-green-700",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-300 hover:text-red-500",
};

const statusDisplayNames = {
  PENDING: "Available",
  ACCEPTED: "Accepted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const BookedServicesList = ({ services, title, emptyMessage }) => {
  if (!services || services.length === 0) {
    return (
      <div className="space-y-4 text-center py-12">
        <h2 className="text-3xl font-poppins font-semibold text-[#212121]">{title}</h2>
        <p className="text-[#616161] text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-poppins font-semibold text-[#212121]">
        {title} ({services.length})
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link href={`/provider/service/${service.id}`} key={service.id}>
            <Card
              className="hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-transparent bg-white"
              style={{ fontFamily: "Nunito Sans, sans-serif" }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-poppins font-semibold text-[#212121]">
                    {service.Service?.name || "Service Name"}
                  </h3>
                  <Badge
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      statusColors[service.status]
                    }`}
                  >
                    {statusDisplayNames[service.status]}
                  </Badge>
                </div>

                <p className="text-[#616161] text-sm mb-4 flex-grow">
                  {service.Service?.description || "No description available"}
                </p>

                <div className="space-y-2 text-sm text-[#616161]">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#00C853]" />
                    <span>{new Date(service.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-[#00C853]" />
                    <span>{new Date(service.date).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold text-[#212121]">
                    ₹{service.basePrice?.toFixed(2) || "N/A"}
                  </p>
                  <Button
                    className="bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-white font-poppins font-bold uppercase text-sm px-4 py-2 rounded-lg shadow hover:scale-105 transform transition-transform duration-200"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookedServicesList;