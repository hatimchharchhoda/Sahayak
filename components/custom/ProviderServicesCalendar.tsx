// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, IndianRupee, User } from "lucide-react";

// Status color mapping for events
const statusColors = {
  PENDING: "#f59e0b", // yellow
  ACCEPTED: "#10b981", // green
  COMPLETED: "#3b82f6", // blue
  CANCELLED: "#ef4444", // red
};

const statusDisplayNames = {
  PENDING: "Available",
  ACCEPTED: "Accepted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const ProviderServicesCalendar = ({ services = [], onEventClick }) => {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarInstance = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        height: "auto",
        eventClick: handleEventClick,
        events: formatServicesForCalendar(services),
        eventDisplay: "block",
        dayMaxEvents: 3,
        moreLinkClick: "popover",
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        },
      });

      calendarInstance.render();
      setCalendar(calendarInstance);

      return () => {
        calendarInstance.destroy();
      };
    }
  }, []);

  // Update events when services change
  useEffect(() => {
    if (calendar) {
      calendar.removeAllEvents();
      calendar.addEventSource(formatServicesForCalendar(services));
    }
  }, [services, calendar]);

  const formatServicesForCalendar = (services) => {
    return services.map((service) => ({
      id: service.id,
      title: service.Service?.name || "Service",
      start: service.date,
      backgroundColor: statusColors[service.status] || "#6b7280",
      borderColor: statusColors[service.status] || "#6b7280",
      textColor: "#ffffff",
      extendedProps: {
        service: service,
        status: service.status,
        basePrice: service.basePrice,
        description: service.Service?.description,
        userId: service.userId,
      },
    }));
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    if (onEventClick) {
      onEventClick(info.event.extendedProps.service);
    }
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Services Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={calendarRef} className="w-full" />
        </CardContent>
      </Card>

      {/* Event Details Modal/Card */}
      {selectedEvent && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Service Details
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeEventDetails}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedEvent.extendedProps.description ||
                    "No description available"}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(selectedEvent.start).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      ₹
                      {selectedEvent.extendedProps.basePrice?.toFixed(2) ||
                        "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      User ID: {selectedEvent.extendedProps.userId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      style={{
                        backgroundColor: selectedEvent.backgroundColor,
                        color: "white",
                      }}
                    >
                      {statusDisplayNames[selectedEvent.extendedProps.status]}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    onClick={() => {
                      window.location.href = `/provider/service/${selectedEvent.id}`;
                    }}
                    className="w-full"
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{statusDisplayNames[status]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderServicesCalendar;
