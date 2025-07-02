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
  COMPLETED_PAID: "#3b82f6", // blue (paid)
  COMPLETED_UNPAID: "#a855f7", // purple (unpaid)
  CANCELLED: "#ef4444", // red
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

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarInstance = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: isMobile ? "dayGridMonth" : "dayGridMonth",
        headerToolbar: isMobile
          ? {
              left: "prev,next",
              center: "title",
              right: "today",
            }
          : {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            },
        // Make calendar responsive
        height: "auto",
        aspectRatio: isMobile ? 1.0 : 1.35,
        handleWindowResize: true,
        eventClick: handleEventClick,
        events: formatServicesForCalendar(services),
        eventDisplay: "block",
        dayMaxEvents: isMobile ? 2 : 3,
        moreLinkClick: "popover",
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        },
        // Custom button for mobile view switching
        customButtons: isMobile
          ? {
              viewSwitcher: {
                text: "View",
                click: function () {
                  const currentView = calendarInstance.view.type;
                  if (currentView === "dayGridMonth") {
                    calendarInstance.changeView("timeGridWeek");
                  } else if (currentView === "timeGridWeek") {
                    calendarInstance.changeView("timeGridDay");
                  } else {
                    calendarInstance.changeView("dayGridMonth");
                  }
                },
              },
            }
          : {},
        eventDidMount: (info) => {
          info.el.style.cursor = "pointer";
          // Adjust event text size for mobile
          if (isMobile) {
            info.el.style.fontSize = "11px";
            info.el.style.padding = "1px 2px";
          }
        },
        // Mobile-specific configurations
        dayHeaderFormat: isMobile
          ? { weekday: "short" }
          : { weekday: "short", month: "numeric", day: "numeric" },
        titleFormat: isMobile
          ? { month: "short", year: "numeric" }
          : { month: "long", year: "numeric" },
      });

      calendarInstance.render();
      setCalendar(calendarInstance);

      return () => {
        calendarInstance.destroy();
      };
    }
  }, [isMobile]);

  // Update events when services change
  useEffect(() => {
    if (calendar) {
      calendar.removeAllEvents();
      calendar.addEventSource(formatServicesForCalendar(services));
    }
  }, [services, calendar]);

  // Update calendar configuration when mobile state changes
  useEffect(() => {
    if (calendar) {
      calendar.setOption(
        "headerToolbar",
        isMobile
          ? {
              left: "prev,next",
              center: "title",
              right: "viewSwitcher",
            }
          : {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }
      );

      calendar.setOption("aspectRatio", isMobile ? 1.0 : 1.35);
      calendar.setOption("dayMaxEvents", isMobile ? 2 : 3);
    }
  }, [isMobile, calendar]);

  const formatServicesForCalendar = (services) => {
    return services.map((service) => {
      let statusKey = service.status;

      if (service.status === "COMPLETED") {
        statusKey = service.isPaid ? "COMPLETED_PAID" : "COMPLETED_UNPAID";
      }

      return {
        id: service.id,
        title: service.Service?.name || "Service",
        start: service.date,
        backgroundColor: statusColors[statusKey] || "#6b7280",
        borderColor: statusColors[statusKey] || "#6b7280",
        textColor: "#ffffff",
        extendedProps: {
          service,
          status: statusKey,
          basePrice: service.basePrice,
          description: service.Service?.description,
          userId: service.userId,
          isPaid: service.isPaid,
        },
      };
    });
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
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Services Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          {/* Add responsive wrapper with overflow handling */}
          <div className="w-full overflow-hidden">
            <div
              ref={calendarRef}
              className="w-full min-w-0"
              style={{
                fontSize: isMobile ? "12px" : "14px",
              }}
            />
          </div>

          {/* Mobile view switcher buttons */}
          {isMobile && (
            <div className="flex gap-2 mt-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendar?.changeView("dayGridMonth")}
                className="text-xs"
              >
                Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendar?.changeView("timeGridWeek")}
                className="text-xs"
              >
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => calendar?.changeView("timeGridDay")}
                className="text-xs"
              >
                Day
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal/Card */}
      {selectedEvent && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Service Details
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeEventDetails}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedEvent.extendedProps.description ||
                    "No description available"}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">
                      {new Date(selectedEvent.start).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      ₹
                      {selectedEvent.extendedProps.basePrice?.toFixed(2) ||
                        "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm break-all">
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
                      className="text-xs"
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
                    className="w-full text-sm"
                    size="sm"
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
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1 sm:gap-2">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs sm:text-sm">
                  {statusDisplayNames[status]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add responsive CSS styles */}
      <style jsx global>{`
        /* Mobile responsive styles for FullCalendar */
        @media (max-width: 767px) {
          .fc-header-toolbar {
            flex-direction: column;
            gap: 8px;
          }

          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .fc-button-group .fc-button {
            font-size: 11px;
            padding: 4px 8px;
          }

          .fc-daygrid-event {
            font-size: 10px !important;
            margin: 1px 0;
          }

          .fc-event-title {
            font-size: 10px;
          }

          .fc-col-header-cell {
            font-size: 11px;
          }

          .fc-daygrid-day-number {
            font-size: 12px;
          }

          /* Hide toolbar on very small screens if needed */
          @media (max-width: 480px) {
            .fc-toolbar-title {
              font-size: 16px;
            }
          }
        }

        /* Ensure calendar container doesn't overflow */
        .fc {
          width: 100%;
          overflow-x: auto;
        }

        .fc-view-harness {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default ProviderServicesCalendar;
