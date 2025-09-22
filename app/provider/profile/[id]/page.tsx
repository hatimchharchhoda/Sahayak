/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Briefcase, Calendar, User, Mail, Phone, MapPin } from "lucide-react";

export default function ProviderProfile() {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/provider/me"); // ✅ Get provider details
        setProvider(res.data);
      } catch (err) {
        console.error("Error fetching provider profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const services = provider?.services || [];
  const bookings = provider?.bookings || [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Provider Profile</h1>

      {/* 👤 Provider Info View Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{provider?.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>{provider?.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>{provider?.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>
                {provider?.address}, {provider?.city}, {provider?.district}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📌 Tabs for Services and Bookings */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Services Offered
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Bookings
          </TabsTrigger>
        </TabsList>

        {/* 🛠 Services Offered */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <p className="text-muted-foreground">No services added yet.</p>
              ) : (
                <ul className="list-disc pl-6 space-y-1">
                  {services.map((s: any) => (
                    <li key={s.id}>
                      {s.Service?.name || "Unnamed Service"} – ₹
                      {s.customPrice ?? s.Service?.basePrice}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 📅 Bookings */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {bookings.map((b: any) => (
                    <li key={b.id} className="py-2">
                      <span className="font-medium">
                        {b.Service?.name || "Service"}
                      </span>{" "}
                      - {new Date(b.date).toLocaleDateString()} ({b.status})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}