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

const statusColors = {
  PENDING: "#FBC02D", // amber
  ACCEPTED: "#43A047", // bright green
  COMPLETED_PAID: "#00C853", // gradient green → lime
  COMPLETED_UNPAID: "#E53935", // coral red
  CANCELLED: "#E53935", // coral red
};

const statusDisplayNames = {
  PENDING: "Available",
  ACCEPTED: "Accepted",
  COMPLETED_PAID: "Completed (Paid)",
  COMPLETED_UNPAID: "Completed (Unpaid)",
  CANCELLED: "Cancelled",
};

const ProviderServicesCalendar = ({ services = [], onEventClick }) => {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize FullCalendar
  useEffect(() => {
    if (!calendarRef.current) return;

    const calendarInstance = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: isMobile
        ? { left: "prev,next", center: "title", right: "viewSwitcher" }
        : { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" },
      height: "auto",
      aspectRatio: isMobile ? 1 : 1.35,
      handleWindowResize: true,
      eventClick: handleEventClick,
      events: formatServicesForCalendar(services),
      eventDisplay: "block",
      dayMaxEvents: isMobile ? 2 : 3,
      moreLinkClick: "popover",
      eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: true },
      customButtons: isMobile
        ? {
            viewSwitcher: {
              text: "View",
              click: function () {
                const currentView = calendarInstance.view.type;
                const nextView = currentView === "dayGridMonth" ? "timeGridWeek" : currentView === "timeGridWeek" ? "timeGridDay" : "dayGridMonth";
                calendarInstance.changeView(nextView);
              },
            },
          }
        : {},
      eventDidMount: (info) => {
        info.el.style.cursor = "pointer";
        info.el.style.borderRadius = "8px";
        info.el.style.padding = "4px 6px";
        info.el.style.transition = "transform 0.2s, box-shadow 0.2s";
        info.el.addEventListener("mouseenter", () => {
          info.el.style.transform = "translateY(-2px)";
          info.el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        });
        info.el.addEventListener("mouseleave", () => {
          info.el.style.transform = "translateY(0)";
          info.el.style.boxShadow = "none";
        });
        if (isMobile) info.el.style.fontSize = "11px";
      },
      dayHeaderFormat: isMobile ? { weekday: "short" } : { weekday: "short", month: "numeric", day: "numeric" },
      titleFormat: isMobile ? { month: "short", year: "numeric" } : { month: "long", year: "numeric" },
    });

    calendarInstance.render();
    setCalendar(calendarInstance);

    return () => calendarInstance.destroy();
  }, [isMobile]);

  useEffect(() => {
    if (calendar) {
      calendar.removeAllEvents();
      calendar.addEventSource(formatServicesForCalendar(services));
    }
  }, [services, calendar]);

  const formatServicesForCalendar = (services) =>
    services.map((service) => {
      let statusKey = service.status;
      if (service.status === "COMPLETED") statusKey = service.isPaid ? "COMPLETED_PAID" : "COMPLETED_UNPAID";
      return {
        id: service.id,
        title: service.Service?.name || "Service",
        start: service.date,
        backgroundColor: statusColors[statusKey] || "#9E9E9E",
        borderColor: statusColors[statusKey] || "#9E9E9E",
        textColor: "#ffffff",
        extendedProps: { service, status: statusKey, basePrice: service.basePrice, description: service.Service?.description, userId: service.userId, isPaid: service.isPaid },
      };
    });

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    onEventClick?.(info.event.extendedProps.service);
  };

  const closeEventDetails = () => setSelectedEvent(null);

  return (
    <div className="space-y-6 font-sans" style={{ fontFamily: "Nunito Sans, sans-serif", background: "linear-gradient(#F1F8E9, #DCEDC8)", padding: "1rem" }}>
      
      {/* Calendar Card */}
      <Card className="shadow-xl rounded-2xl hover:shadow-2xl transform transition-all duration-300 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-poppins font-semibold text-[#212121]">
            <CalendarIcon className="h-5 w-5 text-[#00C853]" /> Services Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="w-full overflow-x-auto rounded-lg">
            <div ref={calendarRef} className="w-full min-w-0" style={{ fontSize: isMobile ? "12px" : "14px" }} />
          </div>
          {isMobile && (
            <div className="flex gap-2 mt-4 justify-center">
              {["dayGridMonth", "timeGridWeek", "timeGridDay"].map((view, i) => (
                <Button
                  key={i}
                  className="text-xs font-bold uppercase bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-white hover:scale-105 transition-transform duration-200"
                  onClick={() => calendar?.changeView(view)}
                >
                  {view === "dayGridMonth" ? "Month" : view === "timeGridWeek" ? "Week" : "Day"}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details */}
      {selectedEvent && (
        <Card className="shadow-xl rounded-2xl border-l-4 border-[#2979FF] transform transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3 flex justify-between items-center">
            <CardTitle className="text-lg font-poppins font-semibold flex items-center gap-2 text-[#212121]">
              <CalendarIcon className="h-5 w-5 text-[#00C853]" /> Service Details
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={closeEventDetails}>✕</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h3 className="font-poppins font-semibold text-lg">{selectedEvent.title}</h3>
              <p className="text-[#616161] text-sm mb-3">{selectedEvent.extendedProps.description || "No description available"}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#616161]" /> <span className="text-sm">{new Date(selectedEvent.start).toLocaleString()}</span></div>
                <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-[#616161]" /> <span className="text-sm font-medium">₹{selectedEvent.extendedProps.basePrice?.toFixed(2) || "N/A"}</span></div>
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-[#616161]" /> <span className="text-sm break-all">User ID: {selectedEvent.extendedProps.userId}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[#616161]">Status</label>
                <div className="mt-1">
                  <Badge style={{ backgroundColor: selectedEvent.backgroundColor, color: "white" }} className="text-xs font-bold">{statusDisplayNames[selectedEvent.extendedProps.status]}</Badge>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = `/provider/service/${selectedEvent.id}`}
                className="w-full font-poppins font-bold uppercase bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-white hover:scale-105 transition-transform duration-200"
              >
                View Full Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Legend */}
      <Card className="shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-poppins font-semibold text-[#212121]">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-nunito text-[#616161]">{statusDisplayNames[status]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderServicesCalendar;