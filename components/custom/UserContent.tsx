// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
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
import { Search } from "lucide-react";
import EditUserDiaload from "./EditUserDiaload";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
}

const UsersContent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/user");
      setUsers(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  return (
    <Card className="bg-[#0D1B2A] border border-indigo-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white font-bold text-xl tracking-wide">
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              className="w-64 bg-[#1B263B] border-teal-400 text-white placeholder:text-slate-400 focus:border-teal-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outline"
              className="border-teal-400 hover:text-teal-400 bg-teal-500/20 text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400 animate-pulse" />
            <Skeleton className="h-8 w-full bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400 animate-pulse" />
            <Skeleton className="h-8 w-full bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400 animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="rounded-md border border-indigo-900 overflow-hidden">
            <Table className="bg-[#1B263B] text-white">
              <TableHeader>
                <TableRow className="bg-[#3A0CA3] text-white">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <TableRow
                      key={user.id}
                      className={`${
                        idx % 2 === 0 ? "bg-[#1B263B]" : "bg-[#252F44]"
                      } hover:bg-[#00F5D4]/20 transition-all duration-200`}
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-purple-500 text-purple-400"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
  <Button
    size="sm"
    className={`px-4 py-1 rounded-full font-semibold transition-all duration-200
      ${
        user.status === "BLOCKED"
          ? "bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.7)] hover:shadow-[0_0_20px_rgba(255,0,0,1)] hover:bg-red-700"
          : "bg-teal-500 text-white shadow-[0_0_10px_rgba(0,245,212,0.7)] hover:shadow-[0_0_20px_rgba(0,245,212,1)] hover:bg-teal-600"
      }`}
    onClick={async () => {
      await axios.patch("/api/admin/block/provider", {
        providerId: provider.id,
        status:
          provider.status === "BLOCKED" ? "ACTIVE" : "BLOCKED",
      });
      fetchAllProviders();
    }}
  >
    {user.status === "BLOCKED" ? "Unblock" : "Block"}
  </Button>
</TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedUser && (
          <EditUserDiaload
            isOpen={isEditUserOpen}
            onClose={() => {
              setIsEditUserOpen(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onUserUpdated={fetchAllUsers}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UsersContent;
