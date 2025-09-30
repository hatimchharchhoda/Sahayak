// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Edit,
  Search,
  Eye,
  User,
  Calendar,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import axios from "axios";
import { Booking, User as IUser } from "@/app/provider/service/[id]/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface IProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  specialization?: string; // 👈 you had specialization for provider profile
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
  
  // Optional nested objects if you're including them in queries
  user?: IUser;
  booking?: Booking;
}

const TicketsContent = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedTicketStatus, setUpdatedTicketStatus] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null); // Add this

  // Function to fetch all tickets
  async function fetchAllTickets() {
    try {
      setLoading(true);
      const response = await axios.get("/api/get-tickets");
      console.log(response);
      setTickets(response.data.tickets);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTicket(e: React.FormEvent) {
    e.preventDefault();

    if (!currentTicketId) {
      console.error("No ticket ID selected");
      return;
    }

    console.log({ updatedTicketStatus, id: currentTicketId });

    try {
      const response = await axios.post("/api/update-ticket", {
        updatedTicketStatus,
        id: currentTicketId,
      });
      console.log(response);
      const updatedTicket = response.data.ticket;

      if (!updatedTicket?.id) {
        console.warn("No ID found on returned ticket");
        return;
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );

      // Reset all states
      setOpen(false);
      setUpdatedTicketStatus("");
      setCurrentTicketId(null);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleDelete(data) {
    const { id, e } = data;
    e.preventDefault();

    try {
      const response = await axios.post("/api/delete-ticket", { id });
      console.log(response);
      const deletedTicket = response.data.deletedTicket;
      setTickets((prev) => prev.filter((t) => t.id !== deletedTicket.id));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllTickets();
  }, []);
  console.log(tickets);

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||   // 👈 added provider name
    ticket.provider?.email?.toLowerCase().includes(searchTerm.toLowerCase())     // 👈 added provider email
  );

  // Function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "OPEN":
        return "destructive";
      case "IN_PROGRESS":
        return "default";
      case "RESOLVED":
        return "secondary";
      case "CLOSED":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  // Function to format date
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

  // Function to truncate text
  const truncateText = (text: string, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ticket Management</span>
            <Badge variant="outline" className="text-sm">
              {filteredTickets.length} tickets
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search tickets..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
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
        <Card>
          <CardContent className="text-center text-red-500 py-8">
            {error}
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">No tickets found</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Header with ID and Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className="font-semibold text-lg truncate"
                        title={ticket.subject}
                      >
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-gray-500">ID: #{ticket.id}</p>
                      <p className="text-sm text-gray-500">
                        ServiceId: #{ticket.bookingId}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(ticket.status)}>
                      {formatStatus(ticket.status)}
                    </Badge>
                  </div>

                  {/* Message Preview */}
                  <div className="text-sm text-gray-600">
                    <p className="leading-relaxed">
                      {truncateText(ticket.message, 120)}
                    </p>
                  </div>

                  {/* Image Preview */}
                  {ticket.imageUrl && (
                    <div className="relative">
                      <img
                        src={ticket.imageUrl}
                        alt="Ticket attachment"
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                        <ImageIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {ticket.user?.name || ticket.provider?.name || "Unknown User"}
                      </p>
                      <p className="text-gray-500 truncate">
                        {ticket.user?.email || ticket.provider?.email || "No email"}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {ticket.user ? "User Ticket" : "Provider Ticket"}
                    </Badge>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(ticket.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={(e) => handleDelete({ e, id: ticket.id })}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>

                      <Dialog
                        open={open}
                        onOpenChange={(isOpen) => {
                          setOpen(isOpen);
                          if (!isOpen) {
                            // Reset states when dialog closes
                            setUpdatedTicketStatus("");
                            setCurrentTicketId(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentTicketId(ticket.id);
                              setUpdatedTicketStatus(ticket.status); // Pre-fill with current status
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Ticket Status</DialogTitle>
                            <DialogDescription>
                              Updating ticket #{currentTicketId}
                            </DialogDescription>
                          </DialogHeader>

                          <form
                            onSubmit={handleUpdateTicket}
                            className="space-y-4"
                          >
                            <div className="flex flex-col space-y-1">
                              <label
                                htmlFor="status"
                                className="text-sm font-medium"
                              >
                                Status
                              </label>
                              <Select
                                value={updatedTicketStatus}
                                onValueChange={(val) =>
                                  setUpdatedTicketStatus(val)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OPEN">Open</SelectItem>
                                  <SelectItem value="PENDING">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="RESOLVED">
                                    Resolved
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end">
                              <Button type="submit">Update</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
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
