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
  const [cities, setCities] = useState([]);
  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
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
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
    }
  };

  const handleCityChange = (value: string) => setSelectedCity(value);
  const handleDistrictChange = (value: string) => setSelectedDistrict(value);

  const fetchCities = async () => {
    const districtToUse = selectedDistrict || user.district;
    if (!districtToUse) return;
    try {
      const response = await axios.post("/api/getCity", { district: districtToUse });
      setCities(response.data.cities);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDistrict = async () => {
    try {
      const response = await axios.get("/api/getDistrict");
      setDistrict(response.data.allDistrict);
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
    if (isEditing) fetchCities();
  }, [selectedDistrict, isEditing]);

  if (isLoading) return <Loading />;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] py-12 px-4 font-lato">
      <div className="max-w-xl mx-auto pt-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Profile Header */}
          <div className="p-8 bg-gradient-to-r from-[#FF7043] to-[#FF8A65] text-white shadow-inner rounded-t-3xl flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-[#FF7043]" />
            </div>
            <div>
              <h2 className="text-2xl font-nunito font-bold">User Profile</h2>
              <p className="text-sm text-white/80">Manage your personal information</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { icon: User, name: "name", placeholder: "Name" },
                  { icon: Mail, name: "email", placeholder: "Email", disabled: true },
                  { icon: Phone, name: "phone", placeholder: "Phone", disabled: true },
                  { icon: MapPin, name: "address", placeholder: "Address" },
                ].map((field) => (
                  <div className="relative" key={field.name}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={field.name === "email" ? "email" : "text"}
                      name={field.name}
                      value={editUserData[field.name]}
                      disabled={field.disabled || false}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7043] focus:outline-none transition-all"
                    />
                  </div>
                ))}

                <div className="flex justify-between gap-4">
                  <Select onValueChange={handleDistrictChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={user.district} />
                    </SelectTrigger>
                    <SelectContent>
                      {district.length
                        ? district.map((d, i) => <SelectItem key={i} value={d}>{d}</SelectItem>)
                        : <SelectItem value="null">Loading...</SelectItem>}
                    </SelectContent>
                  </Select>

                  <Select onValueChange={handleCityChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={user.city} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.length
                        ? cities.map((c, i) => <SelectItem key={i} value={c}>{c}</SelectItem>)
                        : <SelectItem value="null">Select District First</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#FF7043] to-[#FF8A65] text-white px-4 py-3 rounded-xl font-poppins font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105"
                  >
                    <Save className="h-5 w-5" /> <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-poppins font-semibold flex items-center justify-center space-x-2 transition-all hover:bg-gray-300"
                  >
                    <X className="h-5 w-5" /> <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {[
                  { icon: User, label: "Name", value: user.name },
                  { icon: Mail, label: "Email", value: user.email },
                  { icon: Phone, label: "Phone", value: user.phone },
                  { icon: MapPin, label: "Address", value: user.address },
                  { icon: MapPin, label: "City", value: user.city },
                  { icon: MapPin, label: "District", value: user.district },
                ].map((item) => (
                  <div key={item.label} className="p-4 flex items-center space-x-3 bg-white rounded-xl shadow-sm">
                    <item.icon className="h-5 w-5 text-[#FF7043]" />
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-4 bg-gradient-to-r from-[#FF7043] to-[#FF8A65] text-white px-4 py-3 rounded-xl font-poppins font-semibold flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                >
                  <Edit2 className="h-5 w-5" /> <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default UserProfile;