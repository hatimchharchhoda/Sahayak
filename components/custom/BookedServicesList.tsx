// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  PENDING: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20",
  ACCEPTED: "bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20 hover:bg-[#14B8A6]/20",
  COMPLETED: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20",
  CANCELLED: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/20",
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
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
        `}</style>

        <div className="space-y-4 text-center py-12">
          <h2 className="text-3xl font-inter font-semibold text-[#111827]">{title}</h2>
          <p className="text-[#374151] text-base font-poppins">{emptyMessage}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
      `}</style>

      <div className="space-y-6">
        <h2 className="text-2xl font-inter font-semibold text-[#111827]">
          {title} ({services.length})
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link href={`/provider/service/${service.id}`} key={service.id}>
              <Card className="hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-[#E5E7EB] bg-white">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-inter font-semibold text-[#111827]">
                      {service.Service?.name || "Service Name"}
                    </h3>
                    <Badge
                      className={`px-2 py-1 text-xs font-inter font-medium rounded-lg border ${
                        statusColors[service.status]
                      }`}
                    >
                      {statusDisplayNames[service.status]}
                    </Badge>
                  </div>

                  <p className="text-[#374151] text-sm mb-4 flex-grow font-poppins line-clamp-2">
                    {service.Service?.description || "No description available"}
                  </p>

                  <div className="space-y-2 text-sm text-[#374151] font-poppins">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>{new Date(service.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span>{new Date(service.date).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-semibold text-[#111827] font-inter">
                      ₹{service.basePrice?.toFixed(2) || "N/A"}
                    </p>
                    <Button className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-inter font-medium text-sm px-4 py-2 rounded-lg hover:scale-[1.02] transform transition-all duration-200">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookedServicesList;