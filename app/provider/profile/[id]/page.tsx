/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Building,
  Save,
  X,
  Edit2,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/userContext";
import Loading from "@/components/custom/loading";

const ProviderProfile = () => {
  const { user, setUser, isLoading } = useAuth(); // provider info comes from context
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleCancel = () => {
    setIsEditing(false);
    setName(user?.name || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/provider/updateName", {
        id: user.id,
        name,
      });
      setUser(response.data.updatedProvider);
      localStorage.setItem("user", JSON.stringify(response.data.updatedProvider));
      setIsEditing(false);
      toast.success("Name updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Error updating name");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 py-10 px-4">
      <div className="max-w-xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Provider Profile</h2>
                <p className="opacity-90">Manage your provider information</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-green-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full p-3 bg-gray-50 border border-green-200 rounded-lg 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Provider Name"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition hover:opacity-90"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition hover:opacity-90"
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Provider Name */}
                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 border border-green-100">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Provider Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 border border-green-100">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 border border-green-100">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user?.phone}</p>
                  </div>
                </div>

                {/* Specialization */}
                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 border border-green-100">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Specialization Id</p>
                    <p className="font-medium text-gray-900">{user?.specialization}</p>
                  </div>
                </div>

                {/* District */}
                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 border border-green-100">
                  <Building className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">District</p>
                    <p className="font-medium text-gray-900">{user?.district}</p>
                  </div>
                </div>

                {/* City */}
                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 border border-green-100">
                  <Building className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-900">{user?.city}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition hover:opacity-90"
                >
                  <Edit2 className="h-5 w-5" />
                  <span>Edit Name</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;