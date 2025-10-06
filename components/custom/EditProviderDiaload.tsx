// @ts-nocheck
"use client";
import React, { useState, useEffect, FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";

interface EditProviderDialoadProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
  };
  onProviderUpdated: () => void;
}

const EditProviderDiaload: FC<EditProviderDialoadProps> = ({
  isOpen,
  onClose,
  provider,
  onProviderUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: provider.name,
    email: provider.email,
    phone: provider.phone,
    specialization: provider.specialization,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      specialization: provider.specialization,
    });
  }, [provider]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/updateProvider/${provider.id}`, formData);
      onProviderUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update provider:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 animate-fadeIn">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Edit Provider
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-white font-medium">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-200"
              placeholder="Enter provider name"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-white font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-200"
              placeholder="Enter provider email"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-white font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-200"
              placeholder="Enter provider phone"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="specialization" className="text-white font-medium">
              Specialization
            </Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-200"
              placeholder="Enter specialization"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 rounded-lg
              bg-teal-500 text-white shadow-[0_0_10px_rgba(0,245,212,0.7)]
              hover:shadow-[0_0_20px_rgba(0,245,212,1)] hover:bg-teal-600
              transition-all duration-300 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Updating..." : "Update Provider"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProviderDiaload;