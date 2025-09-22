/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { useAuth } from "@/context/userContext";
import Loading from "@/components/custom/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserProfile = () => {
  const { user, setUser, isLoading } = useAuth();
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cities, setCities] = useState([]);
  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedCity(user.city);
    setSelectedDistrict(user.district);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData = {
      id: user.id,
      name: editUserData.name,
      email: editUserData.email,
      phone: editUserData.phone,
      address: editUserData.address,
      city: selectedCity,
      district: selectedDistrict,
    };
    try {
      const response = await axios.post("/api/auth/updateUser", updateData);
      setUser(response.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
      setIsEditing(false);
      setUser(response.data.updatedUser);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
    }
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    console.log("Selected city:", value);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    console.log("Selected district:", value);
  };

  const fetchCities = async () => {
    const districtToUse = selectedDistrict || user.district;
    if (!districtToUse) return;

    try {
      const response = await axios.post("/api/getCity", {
        district: districtToUse,
      });
      setCities(response.data.cities);
      console.log("Cities fetched:", response.data.cities);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDistrict = async () => {
    // if (!user.district) return;
    try {
      const response = await axios.get("/api/getDistrict");
      setDistrict(response.data.allDistrict);
      console.log(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchUserDistrict();
      setEditUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        district: user.district || "",
        city: user.city || "",
      });
    }
  }, [isEditing]);

  useEffect(() => {
    console.log(isEditing);
    if (isEditing) fetchCities();
  }, [selectedDistrict, isEditing]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 shadow-sm bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  User Profile
                </h2>
                <p className="text-gray-600">
                  Manage your personal information
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={editUserData.name}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Name"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={editUserData.email}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Email"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={editUserData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Phone"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={editUserData.address}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Address"
                  />
                </div>

                <div className="flex justify-center gap-5">
                  <Select onValueChange={handleCityChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={user.city} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities && cities.length > 0 ? (
                        cities.map((d, index) => (
                          <SelectItem value={d} key={index}>
                            {d}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="null">
                          Please Select District First
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <Select onValueChange={handleDistrictChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={user.district} />
                    </SelectTrigger>
                    <SelectContent>
                      {district &&
                        district.length > 0 &&
                        district.map((d, index) => (
                          <SelectItem value={d} key={index}>
                            {d}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <X className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user?.phone}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{user.address}</p>
                  </div>
                </div>

                <div className="flex w-full gap-5">
                  <div className="p-4 flex-1 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-900">{user.city}</p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium text-gray-900">
                        {user.district}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
