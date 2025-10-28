/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/userContext";
import Loading from "@/components/custom/loading";

const ProviderProfile = () => {
  const { user, setUser, isLoading } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-10 px-4 font-[Poppins]">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-[Inter] font-semibold">Provider Profile</h2>
                <p className="opacity-90 font-[Nunito_Sans] mt-1">
                  Manage your provider information
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Edit Mode Header */}
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-[Inter] font-semibold text-gray-900">
                    Edit Provider Name
                  </h3>
                  <p className="text-sm text-gray-500 font-[Nunito_Sans] mt-1">
                    Update your display name
                  </p>
                </div>

                {/* Input */}
                <div className="relative">
                  <label className="block text-sm font-[Inter] font-medium text-gray-700 mb-2">
                    Provider Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-xl 
                                 focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                                 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Enter provider name"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 
                               hover:from-blue-700 hover:to-blue-600 text-white px-4 py-3 
                               rounded-xl font-[Inter] font-semibold flex items-center 
                               justify-center space-x-2 transition-all duration-300 
                               shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-white border-2 border-gray-200 
                               hover:border-gray-300 hover:bg-gray-50 text-gray-700 
                               px-4 py-3 rounded-xl font-[Inter] font-semibold 
                               flex items-center justify-center space-x-2 
                               transition-all duration-300"
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                {/* Profile Info Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Provider Name */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl 
                                  flex items-center space-x-3 border border-gray-100 
                                  hover:shadow-md transition-all duration-300">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-[Nunito_Sans] uppercase tracking-wide">
                        Provider Name
                      </p>
                      <p className="font-[Inter] font-medium text-gray-900 mt-0.5">
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 bg-white rounded-xl flex items-center space-x-3 
                                  border border-gray-200 hover:border-blue-200 
                                  hover:shadow-md transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-2 rounded-lg shadow-sm">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-[Nunito_Sans] uppercase tracking-wide">
                        Email
                      </p>
                      <p className="font-[Inter] font-medium text-gray-900 mt-0.5 break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-white rounded-xl flex items-center space-x-3 
                                  border border-gray-200 hover:border-teal-200 
                                  hover:shadow-md transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-2 rounded-lg shadow-sm">
                      <Phone className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-[Nunito_Sans] uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="font-[Inter] font-medium text-gray-900 mt-0.5">
                        {user?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="p-4 bg-white rounded-xl flex items-center space-x-3 
                                  border border-gray-200 hover:border-blue-200 
                                  hover:shadow-md transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-2 rounded-lg shadow-sm">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-[Nunito_Sans] uppercase tracking-wide">
                        Specialization ID
                      </p>
                      <p className="font-[Inter] font-medium text-gray-900 mt-0.5 font-mono">
                        {user?.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="col-span-1 bg-gradient-to-br from-slate-50 to-gray-50 
                                  rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="h-5 w-5 text-teal-600" />
                      <h4 className="text-sm font-[Inter] font-semibold text-gray-900 uppercase tracking-wide">
                        Location Details
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      {/* District */}
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg 
                                      border border-gray-100">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-[Nunito_Sans]">
                            District
                          </p>
                          <p className="font-[Inter] font-medium text-gray-900 text-sm mt-0.5">
                            {user?.district}
                          </p>
                        </div>
                      </div>

                      {/* City */}
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg 
                                      border border-gray-100">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-[Nunito_Sans]">
                            City
                          </p>
                          <p className="font-[Inter] font-medium text-gray-900 text-sm mt-0.5">
                            {user?.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 
                               hover:from-blue-700 hover:to-blue-600 text-white px-4 py-3 
                               rounded-xl font-[Inter] font-semibold flex items-center 
                               justify-center space-x-2 transition-all duration-300 
                               shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100"
                  >
                    <Edit2 className="h-5 w-5" />
                    <span>Edit Name</span>
                  </button>
                </div>

                {/* Info Note */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-700 font-[Nunito_Sans] text-center">
                    Contact support to update email, phone, or location details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;