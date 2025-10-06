// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Edit,
  Search,
  User,
  Calendar,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import {
  Badge,
} from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Neon badge classes
const neonBadgeClasses = {
  OPEN: "bg-red-600 text-white shadow-[0_0_8px_rgba(255,0,0,0.7)] animate-pulse",
  PENDING: "bg-yellow-500 text-black shadow-[0_0_8px_rgba(255,255,0,0.7)] animate-pulse",
  RESOLVED: "bg-green-500 text-white shadow-[0_0_8px_rgba(0,255,0,0.7)] animate-pulse",
};

export interface IProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
}

export interface ITicket {
  id: string;
  userId: string;
  bookingId?: string | null;
  imageUrl: string;
  subject: string;
  message: string;
  status: "OPEN" | "PENDING" | "RESOLVED";
  createdAt: Date;
  updatedAt: Date;
  provider?: IProvider;
  user?: { name?: string; email?: string };
}

const TicketsContent = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedTicketStatus, setUpdatedTicketStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/get-tickets");
      setTickets(response.data.tickets);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTicketId) return;

    try {
      const response = await axios.post("/api/update-ticket", {
        updatedTicketStatus,
        id: currentTicketId,
      });
      const updatedTicket = response.data.ticket;
      setTickets((prev) =>
        prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      setOpen(false);
      setUpdatedTicketStatus("");
      setCurrentTicketId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/delete-ticket", { id });
      setTickets((prev) => prev.filter((t) => t.id !== response.data.deletedTicket.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) =>
    [
      ticket.subject,
      ticket.message,
      ticket.status,
      ticket.id,
      ticket.user?.name,
      ticket.user?.email,
      ticket.provider?.name,
      ticket.provider?.email,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatStatus = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "PENDING":
        return "Pending";
      case "RESOLVED":
        return "Resolved";
      default:
        return status;
    }
  };

  const formatDate = (dateString: Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength = 100) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            Ticket Management
            <Badge variant="outline" className="text-sm font-semibold px-2.5 py-1 rounded-md border border-teal-400 text-teal-400 bg-teal-400/10 transition-all hover:bg-teal-400 hover:text-white hover:shadow-md hover:scale-105">
              {filteredTickets.length} tickets
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
            />
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-teal-400 transition duration-300"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="text-center text-red-500 py-8">
            {error}
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="text-center py-8 text-gray-400">
            No tickets found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow rounded-lg"
            >
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white truncate" title={ticket.subject}>
                      {truncateText(ticket.subject, 50)}
                    </h3>
                    <p className="text-gray-400 text-xs">ID: #{ticket.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${neonBadgeClasses[ticket.status]}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </div>

                {/* Message */}
                <p className="text-gray-300 text-sm">{truncateText(ticket.message, 120)}</p>

                {/* Image */}
                {ticket.imageUrl && (
                  <div className="relative">
                    <img
                      src={ticket.imageUrl}
                      alt="Ticket attachment"
                      className="w-full h-32 object-cover rounded-md border border-gray-700"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                {/* User / Provider */}
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <User className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">
                      {ticket.user?.name || ticket.provider?.name || "Unknown"}
                    </p>
                    <p className="truncate text-gray-400">
                      {ticket.user?.email || ticket.provider?.email || "No email"}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {ticket.user ? "User Ticket" : "Provider Ticket"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {formatDate(ticket.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                      onClick={(e) => handleDelete(ticket.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Edit Dialog */}
                    <Dialog
                      open={open}
                      onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        if (!isOpen) {
                          setUpdatedTicketStatus("");
                          setCurrentTicketId(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white transition duration-300"
                          onClick={() => {
                            setCurrentTicketId(ticket.id);
                            setUpdatedTicketStatus(ticket.status);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="bg-gray-900 text-white border-gray-700 rounded-lg p-4">
                        <DialogHeader>
                          <DialogTitle>Update Ticket Status</DialogTitle>
                          <DialogDescription>
                            Updating ticket #{currentTicketId}
                          </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleUpdateTicket} className="space-y-4">
                          <div className="flex flex-col space-y-1">
                            <label htmlFor="status" className="text-sm font-medium">
                              Status
                            </label>
                            <Select
                              value={updatedTicketStatus}
                              onValueChange={(val) => setUpdatedTicketStatus(val)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end">
                            <Button className="bg-teal-500 hover:bg-teal-600 text-white shadow-[0_0_10px_rgba(0,245,212,0.7)] hover:shadow-[0_0_20px_rgba(0,245,212,1)] transition-all duration-300">
                              Update
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsContent;