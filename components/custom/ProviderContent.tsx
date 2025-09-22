// @ts-nocheck
"use client";
import React, { useState, FC, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit } from "lucide-react";
import EditProviderDiaload from "./EditProviderDiaload";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  role: string;
  status: string;
}

const ProvidersContent: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isEditProviderOpen, setIsEditProviderOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/provider/getAll");
      console.log(response);
      setProviders(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch providers");
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProviders();
  }, []); //Fixed: Added empty dependency array to useEffect

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      provider.phone.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search providers..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No providers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>{provider.name}</TableCell>
                      <TableCell>{provider.email}</TableCell>
                      <TableCell>{provider.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {provider.specialization}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{provider.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={provider.status === "BLOCKED" ? "destructive" : "outline"}
                          size="sm"
                          onClick={async () => {
                            await axios.patch("/api/admin/block/provider", {
                              providerId: provider.id,
                              status: provider.status === "BLOCKED" ? "ACTIVE" : "BLOCKED",
                            });
                            fetchAllProviders(); // refresh
                          }}
                        >
                          {provider.status === "BLOCKED" ? "Unblock" : "Block"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setIsEditProviderOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedProvider && (
          <EditProviderDiaload
            isOpen={isEditProviderOpen}
            onClose={() => {
              setIsEditProviderOpen(false);
              setSelectedProvider(null);
            }}
            provider={selectedProvider}
            onProviderUpdated={fetchAllProviders}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProvidersContent;
