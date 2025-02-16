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
import { Textarea } from "@/components/ui/textarea";
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
    role: string;
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
    role: provider.role,
  });

  useEffect(() => {
    setFormData({
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      specialization: provider.specialization,
      role: provider.role,
    });
  }, [provider]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/updateProvider/${provider.id}`, formData);
      onProviderUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update provider:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Provider</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Update Provider
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProviderDiaload;
